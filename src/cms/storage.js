// Device-local persistence for the CMS: the working draft, edit-mode flag
// and GitHub publish settings. All access is wrapped — storage can be
// unavailable (private mode) or full.

const DRAFT_KEY = "yash-cms-draft-v1";
const EDIT_KEY = "yash-cms-edit-mode";
const GITHUB_KEY = "yash-cms-github";

export const hashContent = (content) => {
  const str = JSON.stringify(content);
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return `${(h >>> 0).toString(36)}-${str.length.toString(36)}`;
};

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/* ---------------- Edit mode ---------------- */

/** Edit mode turns on via #edit / ?edit in the URL and is remembered on this device. */
export const readEditMode = () => {
  const url = new URL(window.location.href);
  if (url.hash === "#edit" || url.searchParams.has("edit")) {
    write(EDIT_KEY, true);
    url.hash = url.hash === "#edit" ? "" : url.hash;
    url.searchParams.delete("edit");
    history.replaceState(null, "", url.pathname + url.search + url.hash);
    return true;
  }
  return read(EDIT_KEY) === true;
};

export const writeEditMode = (on) => {
  try {
    if (on) localStorage.setItem(EDIT_KEY, "true");
    else localStorage.removeItem(EDIT_KEY);
  } catch {
    /* ignore */
  }
};

/* ---------------- Draft ---------------- */

/**
 * Decide what content to show on load.
 * - publishedHash: hash of the last content known to be on GitHub.
 * - baseHash: hash of the bundled (deployed) content when the draft was saved.
 */
export const loadInitialState = (bundled, editMode) => {
  const bundledHash = hashContent(bundled);
  const fresh = { content: bundled, publishedHash: bundledHash, notice: null };
  if (!editMode) return fresh;

  const draft = read(DRAFT_KEY);
  if (!draft?.content || draft.content.schemaVersion !== bundled.schemaVersion) return fresh;

  const draftHash = hashContent(draft.content);
  const hasUnpublished = draftHash !== draft.publishedHash;

  // Deployed site matches what we last published (or never diverged).
  if (draft.publishedHash === bundledHash) {
    return { content: draft.content, publishedHash: bundledHash, notice: null };
  }
  // We published, but the new deploy hasn't landed yet.
  if (draft.baseHash === bundledHash) {
    return {
      content: draft.content,
      publishedHash: draft.publishedHash,
      notice: hasUnpublished ? null : "deploy-pending",
    };
  }
  // The deployed content changed from somewhere else.
  if (hasUnpublished) return { content: draft.content, publishedHash: bundledHash, notice: "conflict" };
  return fresh;
};

export const saveDraft = (content, publishedHash, bundledHash) =>
  write(DRAFT_KEY, { content, publishedHash, baseHash: bundledHash, savedAt: Date.now() });

export const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
};

/* ---------------- GitHub settings ---------------- */

export const defaultGithubSettings = {
  owner: "yash-199",
  repo: "YashProtfolio",
  branch: "main",
  path: "src/data/content.json",
  token: "",
};

export const readGithubSettings = () => ({ ...defaultGithubSettings, ...(read(GITHUB_KEY) ?? {}) });
export const writeGithubSettings = (settings) => write(GITHUB_KEY, settings);
