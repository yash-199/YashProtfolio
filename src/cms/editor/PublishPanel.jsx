import { useRef, useState } from "react";
import { CircleAlert, CircleCheck, CloudUpload, Download, ExternalLink, KeyRound, LoaderCircle, LogOut, RotateCcw, Upload } from "lucide-react";
import { useCms } from "../context";
import { publishToGitHub, testConnection } from "../github";
import { readGithubSettings, writeGithubSettings } from "../storage";
import { Group, Label, Row } from "./fields";
import { inputBase } from "./styles";
import { cn } from "@/lib/utils";

const Btn = ({ className, children, ...props }) => (
  <button
    type="button"
    className={cn("inline-flex min-h-[3rem] items-center justify-center gap-2 rounded-xl px-4 text-[0.95rem] font-medium transition-colors disabled:opacity-50", className)}
    {...props}
  >
    {children}
  </button>
);

const Message = ({ tone, children }) => (
  <p className={cn("flex items-start gap-2 rounded-xl p-3 text-sm", tone === "error" ? "bg-red-500/10 text-red-300" : "bg-emerald-500/10 text-emerald-300")}>
    {tone === "error" ? <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" /> : <CircleCheck className="mt-0.5 h-4 w-4 shrink-0" />}
    <span>{children}</span>
  </p>
);

const PublishPanel = () => {
  const { content, hasUnpublished, markPublished, replaceContent, resetToPublished, setEditMode } = useCms();
  const [settings, setSettings] = useState(readGithubSettings);
  const [showSettings, setShowSettings] = useState(() => !readGithubSettings().token);
  const [message, setMessage] = useState("Update portfolio content");
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("");
  const [result, setResult] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef(null);

  const setSetting = (key) => (e) => {
    const next = { ...settings, [key]: e.target.value };
    setSettings(next);
    writeGithubSettings(next);
  };

  const publish = async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await publishToGitHub({ settings, content, message: message.trim() || "Update portfolio content", onStep: setStep });
      markPublished(res.content);
      setResult({
        tone: "ok",
        text: `Published${res.uploads ? ` with ${res.uploads} file${res.uploads > 1 ? "s" : ""}` : ""}. Your site will update once its host finishes redeploying (usually 1–3 minutes).`,
        url: res.commitUrl,
      });
    } catch (err) {
      setResult({ tone: "error", text: err.message });
    } finally {
      setBusy(false);
      setStep("");
    }
  };

  const test = async () => {
    setBusy(true);
    setResult(null);
    try {
      setResult({ tone: "ok", text: await testConnection(settings) });
    } catch (err) {
      setResult({ tone: "error", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: `portfolio-content-${new Date().toISOString().slice(0, 10)}.json` });
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data?.schemaVersion !== content.schemaVersion || !data.profile || !data.journey) throw new Error();
      replaceContent(data);
      setResult({ tone: "ok", text: "Backup restored. Use Undo if this wasn't what you wanted." });
    } catch {
      setResult({ tone: "error", text: "That file isn't a valid portfolio backup." });
    }
  };

  return (
    <div className="space-y-4">
      <Group title="Publish to your live site" description="Your edits are saved on this device automatically. Publishing sends them to GitHub so everyone sees them.">
        <div className={cn("rounded-xl p-3 text-sm", hasUnpublished ? "bg-ember/10 text-ember-soft" : "bg-white/[0.04] text-muted")}>
          {hasUnpublished ? "You have changes that aren't live yet." : "Everything is published."}
        </div>
        <div>
          <Label htmlFor="cms-commit">Note (optional)</Label>
          <input id="cms-commit" value={message} onChange={(e) => setMessage(e.target.value)} className={inputBase} />
        </div>
        <Btn onClick={publish} disabled={busy || !settings.token} className="w-full bg-ember text-ink">
          {busy && step ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <CloudUpload className="h-5 w-5" />}
          {busy && step ? step : "Publish changes"}
        </Btn>
        {!settings.token && <p className="text-sm text-muted">Add a GitHub token below to enable publishing.</p>}
        {result && (
          <Message tone={result.tone}>
            {result.text}{" "}
            {result.url && (
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4">
                View commit <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </Message>
        )}
      </Group>

      <Group>
        <button type="button" onClick={() => setShowSettings((s) => !s)} aria-expanded={showSettings} className="flex min-h-[2.75rem] w-full items-center justify-between text-left">
          <span className="flex items-center gap-2 text-base font-medium"><KeyRound className="h-4 w-4 text-ember-soft" /> GitHub connection</span>
          <span className="text-sm text-muted">{showSettings ? "Hide" : settings.token ? "Connected · edit" : "Set up"}</span>
        </button>
        {showSettings && (
          <div className="space-y-4">
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-muted">
              <li>
                Open{" "}
                <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer" className="text-paper underline underline-offset-4">
                  GitHub → New fine-grained token
                </a>
                .
              </li>
              <li>Repository access: <b className="text-paper">Only select repositories</b> → {settings.repo}.</li>
              <li>Permissions → Repository → <b className="text-paper">Contents: Read and write</b>.</li>
              <li>Generate, copy and paste it here. It's stored only on this device.</li>
            </ol>
            <div>
              <Label htmlFor="cms-token">Token</Label>
              <input id="cms-token" type="password" autoComplete="off" value={settings.token} onChange={setSetting("token")} placeholder="github_pat_…" className={inputBase} />
            </div>
            <Row>
              <div>
                <Label htmlFor="cms-owner">Owner</Label>
                <input id="cms-owner" value={settings.owner} onChange={setSetting("owner")} className={inputBase} autoCapitalize="off" />
              </div>
              <div>
                <Label htmlFor="cms-repo">Repository</Label>
                <input id="cms-repo" value={settings.repo} onChange={setSetting("repo")} className={inputBase} autoCapitalize="off" />
              </div>
            </Row>
            <Row>
              <div>
                <Label htmlFor="cms-branch">Branch</Label>
                <input id="cms-branch" value={settings.branch} onChange={setSetting("branch")} className={inputBase} autoCapitalize="off" />
              </div>
              <div>
                <Label htmlFor="cms-path">Content file</Label>
                <input id="cms-path" value={settings.path} onChange={setSetting("path")} className={inputBase} autoCapitalize="off" />
              </div>
            </Row>
            <Btn onClick={test} disabled={busy || !settings.token} className="w-full border border-white/15 text-paper">
              Test connection
            </Btn>
          </div>
        )}
      </Group>

      <Group title="Backup" description="Download all content as a file, or restore one.">
        <Row>
          <Btn onClick={exportJson} className="border border-white/15 text-paper"><Download className="h-4 w-4" /> Download</Btn>
          <Btn onClick={() => fileRef.current?.click()} className="border border-white/15 text-paper"><Upload className="h-4 w-4" /> Restore</Btn>
        </Row>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={importJson} className="hidden" />
      </Group>

      <Group title="This device">
        {confirmReset ? (
          <div className="space-y-2 rounded-xl bg-red-500/10 p-3">
            <p className="text-sm text-red-200">Throw away all unpublished changes on this device and show the live content?</p>
            <Row>
              <Btn onClick={() => { resetToPublished(); setConfirmReset(false); }} className="bg-red-500 text-white">Discard changes</Btn>
              <Btn onClick={() => setConfirmReset(false)} className="border border-white/15 text-paper">Cancel</Btn>
            </Row>
          </div>
        ) : (
          <Btn onClick={() => setConfirmReset(true)} className="w-full border border-white/15 text-paper"><RotateCcw className="h-4 w-4" /> Discard unpublished changes</Btn>
        )}
        <Btn onClick={() => setEditMode(false)} className="w-full text-muted"><LogOut className="h-4 w-4" /> Leave edit mode</Btn>
        <p className="text-xs text-muted">To edit again later, open your site with <span className="font-mono text-paper">#edit</span> at the end of the address.</p>
      </Group>
    </div>
  );
};

export default PublishPanel;
