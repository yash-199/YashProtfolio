// Publish the portfolio content to GitHub as a single commit using the
// Git Data API. Uploaded media (data: URLs in the draft) are committed to
// public/uploads/ and replaced with their public paths in content.json.
// If the site is deployed from this repo (Vercel/Netlify/GitHub Pages
// workflow), the commit triggers a redeploy.

import { dataUrlInfo, isDataUrl } from "./media";
import { hashContent } from "./storage";

const API = "https://api.github.com";

class PublishError extends Error {}

const explain = (status, body) => {
  if (status === 401) return "GitHub rejected the token — it may be wrong or expired.";
  if (status === 403) return "The token doesn't have permission to write to this repository (needs Contents: Read and write).";
  if (status === 404) return "Repository or branch not found — check the owner, repo and branch, and that the token can access this repo.";
  if (status === 409 || status === 422) return "The branch changed while publishing. Please try again.";
  return body?.message ? `GitHub error: ${body.message}` : `GitHub error (${status}).`;
};

const request = async (settings, method, path, body) => {
  let res;
  try {
    res = await fetch(`${API}/repos/${settings.owner}/${settings.repo}${path}`, {
      method,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${settings.token.trim()}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(body && { "Content-Type": "application/json" }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new PublishError("Network error — check your connection and try again.");
  }
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new PublishError(explain(res.status, json));
    err.status = res.status;
    throw err;
  }
  return json;
};

/** Replace every data: URL in the content with an /uploads path, collecting files. */
const extractUploads = (content) => {
  const files = [];
  const walk = (value, trail) => {
    if (isDataUrl(value)) {
      const { ext, base64 } = dataUrlInfo(value);
      const name = `${trail.filter((p) => typeof p === "string").slice(-2).join("-") || "file"}-${hashContent(base64).split("-")[0]}.${ext}`
        .toLowerCase()
        .replace(/[^a-z0-9.-]/g, "-");
      files.push({ path: `public/uploads/${name}`, base64 });
      return `/uploads/${name}`;
    }
    if (Array.isArray(value)) return value.map((v, i) => walk(v, [...trail, i]));
    if (value && typeof value === "object") {
      const id = typeof value.id === "string" ? value.id : null;
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v, id ? [...trail, id, k] : [...trail, k])]));
    }
    return value;
  };
  return { content: walk(content, []), files };
};

/**
 * @returns {Promise<{ content: object, commitUrl: string, uploads: number }>}
 */
export const publishToGitHub = async ({ settings, content, message, onStep = () => {} }) => {
  if (!settings.token?.trim()) throw new PublishError("Add your GitHub token in Publish settings first.");
  const { content: publishable, files } = extractUploads(content);
  const json = `${JSON.stringify(publishable, null, 2)}\n`;

  const attempt = async () => {
    onStep("Reading branch…");
    const ref = await request(settings, "GET", `/git/ref/heads/${encodeURIComponent(settings.branch)}`);
    const parentSha = ref.object.sha;
    const parent = await request(settings, "GET", `/git/commits/${parentSha}`);

    onStep(files.length ? `Uploading ${files.length} file${files.length > 1 ? "s" : ""}…` : "Preparing commit…");
    const tree = [];
    for (const file of files) {
      const blob = await request(settings, "POST", "/git/blobs", { content: file.base64, encoding: "base64" });
      tree.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
    }
    const contentBlob = await request(settings, "POST", "/git/blobs", { content: json, encoding: "utf-8" });
    tree.push({ path: settings.path, mode: "100644", type: "blob", sha: contentBlob.sha });

    onStep("Creating commit…");
    const newTree = await request(settings, "POST", "/git/trees", { base_tree: parent.tree.sha, tree });
    const commit = await request(settings, "POST", "/git/commits", {
      message,
      tree: newTree.sha,
      parents: [parentSha],
    });

    onStep("Updating branch…");
    await request(settings, "PATCH", `/git/refs/heads/${encodeURIComponent(settings.branch)}`, { sha: commit.sha, force: false });
    return commit.html_url;
  };

  let commitUrl;
  try {
    commitUrl = await attempt();
  } catch (err) {
    // Someone pushed in between: retry once on top of the new head.
    if (err.status === 422 || err.status === 409) commitUrl = await attempt();
    else throw err;
  }
  return { content: publishable, commitUrl, uploads: files.length };
};

/** Check the token can see the repo and branch. */
export const testConnection = async (settings) => {
  if (!settings.token?.trim()) throw new PublishError("Enter a token first.");
  const repo = await request(settings, "GET", "");
  if (!repo.permissions?.push) throw new PublishError("Token can read this repo but can't write to it.");
  await request(settings, "GET", `/git/ref/heads/${encodeURIComponent(settings.branch)}`);
  return `Connected to ${repo.full_name} (${settings.branch}).`;
};
