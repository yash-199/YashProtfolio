import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Link2, Trash2, Upload, FileText } from "lucide-react";
import { useField } from "../context";
import { fileToDataUrl, imageFileToDataUrl, isDataUrl } from "../media";
import { resolveAsset } from "../../data/registry";
import { cn } from "@/lib/utils";
import { inputBase } from "./styles";

export const Label = ({ htmlFor, children, hint }) => (
  <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline justify-between gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-muted">
    <span>{children}</span>
    {hint && <span className="normal-case tracking-normal text-muted/70">{hint}</span>}
  </label>
);

/** Auto-growing textarea. */
const AutoTextarea = ({ value, className, minRows = 2, ...props }) => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [value]);
  return <textarea ref={ref} rows={minRows} value={value} className={cn(inputBase, "resize-none leading-relaxed", className)} {...props} />;
};

/** Text input/textarea bound directly to a content path. */
export const TextField = ({ path, label, multiline = false, placeholder, hint, type = "text", inputMode, rows }) => {
  const id = useId();
  const [value, set] = useField(path);
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      {multiline ? (
        <AutoTextarea id={id} value={value ?? ""} onChange={(e) => set(e.target.value)} placeholder={placeholder} minRows={rows} />
      ) : (
        <input id={id} type={type} inputMode={inputMode} value={value ?? ""} onChange={(e) => set(e.target.value)} placeholder={placeholder} className={inputBase} />
      )}
    </div>
  );
};

/** Unbound text input (for list rows that manage their own value). */
export const PlainInput = ({ value, onChange, multiline, className, ...props }) =>
  multiline ? (
    <AutoTextarea value={value} onChange={(e) => onChange(e.target.value)} className={className} minRows={1} {...props} />
  ) : (
    <input value={value} onChange={(e) => onChange(e.target.value)} className={cn(inputBase, className)} {...props} />
  );

export const NumberField = ({ path, label }) => {
  const id = useId();
  const [value, set] = useField(path);
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        value={value ?? 0}
        onChange={(e) => set(e.target.value === "" ? 0 : Number(e.target.value))}
        className={inputBase}
      />
    </div>
  );
};

export const ToggleField = ({ path, label, description }) => {
  const [value, set] = useField(path);
  return (
    <button
      type="button"
      role="switch"
      aria-checked={Boolean(value)}
      onClick={() => set(!value)}
      className="flex min-h-[3rem] w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-ink/50 px-4 py-3 text-left"
    >
      <span>
        <span className="block text-[0.95rem] text-paper">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      <span className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", value ? "bg-ember" : "bg-white/15")}>
        <span className={cn("absolute top-1 h-5 w-5 rounded-full bg-paper shadow transition-transform", value ? "translate-x-6" : "translate-x-1")} />
      </span>
    </button>
  );
};

const PRESET_COLORS = ["#ff5a1f", "#7c5cff", "#6366f1", "#38bdf8", "#22c55e", "#f7df1e", "#e34f26", "#ec4899", "#ffffff"];

export const ColorField = ({ path, label }) => {
  const id = useId();
  const [value, set] = useField(path);
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        <input id={id} type="color" value={value || "#ff5a1f"} onChange={(e) => set(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent p-1" />
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => set(c)}
            aria-label={`Use colour ${c}`}
            className={cn("h-9 w-9 rounded-full border-2 transition-transform active:scale-90", value === c ? "border-paper" : "border-white/10")}
            style={{ background: c }}
          />
        ))}
      </div>
    </div>
  );
};

/** Grid icon picker for any registry ({ key: { label, Icon } }). */
export const IconPicker = ({ path, label, registry, allowNone = false }) => {
  const [value, set] = useField(path);
  const [open, setOpen] = useState(false);
  const Current = registry[value]?.Icon;
  return (
    <div>
      <Label>{label}</Label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex min-h-[3rem] w-full items-center gap-3 rounded-xl border border-white/10 bg-ink/50 px-4 py-2.5 text-left"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06]">
          {Current ? <Current className="h-4 w-4" /> : <span className="font-mono text-[0.6rem] text-muted">Aa</span>}
        </span>
        <span className="flex-1 text-[0.95rem]">{registry[value]?.label ?? "Initials"}</span>
        <span className="text-xs text-muted">{open ? "Close" : "Change"}</span>
      </button>
      {open && (
        <div className="mt-2 grid grid-cols-4 gap-1.5 rounded-xl border border-white/10 bg-ink/60 p-2 min-[400px]:grid-cols-5">
          {allowNone && (
            <button type="button" onClick={() => { set(""); setOpen(false); }} className={cn("flex min-h-[3.5rem] flex-col items-center justify-center gap-1 rounded-lg p-1 text-[0.6rem] text-muted", !value && "bg-ember/20 text-paper")}>
              <span className="font-mono text-xs">Aa</span>Initials
            </button>
          )}
          {Object.entries(registry).map(([key, { label: l, Icon }]) => (
            <button
              key={key}
              type="button"
              onClick={() => { set(key); setOpen(false); }}
              aria-label={l}
              aria-pressed={value === key}
              className={cn("flex min-h-[3.5rem] flex-col items-center justify-center gap-1 rounded-lg p-1 text-[0.6rem] leading-tight text-muted transition-colors hover:bg-white/[0.06]", value === key && "bg-ember/20 text-paper")}
            >
              <Icon className="h-5 w-5" />
              <span className="line-clamp-1">{l}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/** Image chooser: upload from phone (resized), paste a URL, or remove. */
export const ImageField = ({ path, label, hint, emptyText = "No image" }) => {
  const [value, set] = useField(path);
  const [mode, setMode] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const src = resolveAsset(value);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      set(await imageFileToDataUrl(file));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="overflow-hidden rounded-xl border border-white/10 bg-ink/50">
        <div className="flex aspect-[16/9] items-center justify-center bg-black/30">
          {src ? <img src={src} alt="" className="h-full w-full object-cover" /> : <span className="text-sm text-muted">{busy ? "Processing…" : emptyText}</span>}
        </div>
        <div className="grid grid-cols-3 gap-px bg-white/10 text-sm">
          <button type="button" onClick={() => fileRef.current?.click()} className="flex min-h-[3rem] items-center justify-center gap-1.5 bg-ink-900 text-paper active:bg-ink-700">
            <ImagePlus className="h-4 w-4" /> Upload
          </button>
          <button type="button" onClick={() => setMode(mode === "url" ? null : "url")} className="flex min-h-[3rem] items-center justify-center gap-1.5 bg-ink-900 text-paper active:bg-ink-700">
            <Link2 className="h-4 w-4" /> URL
          </button>
          <button type="button" onClick={() => set("")} disabled={!value} className="flex min-h-[3rem] items-center justify-center gap-1.5 bg-ink-900 text-paper disabled:text-muted/40 active:bg-ink-700">
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
      {mode === "url" && (
        <input
          type="url"
          inputMode="url"
          placeholder="https://…/screenshot.png"
          defaultValue={value && !isDataUrl(value) && !value.startsWith("asset:") ? value : ""}
          onBlur={(e) => e.target.value && set(e.target.value.trim())}
          onKeyDown={(e) => e.key === "Enter" && (set(e.currentTarget.value.trim()), setMode(null))}
          className={cn(inputBase, "mt-2")}
        />
      )}
      {isDataUrl(value) && <p className="mt-1.5 text-xs text-muted">New upload — saved on this device; it goes live when you publish.</p>}
      {error && <p className="mt-1.5 text-sm text-ember-soft">{error}</p>}
    </div>
  );
};

/** Generic file (PDF resume): upload or link. */
export const FileField = ({ path, label, accept = "application/pdf" }) => {
  const [value, set] = useField(path);
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const id = useId();
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    try {
      set(await fileToDataUrl(file));
    } catch (err) {
      setError(err.message);
    }
  };
  const status = !value ? "None" : value.startsWith("asset:") ? "Original file" : isDataUrl(value) ? "New upload (publish to go live)" : "Link";
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink/50 p-3">
        <FileText className="h-5 w-5 shrink-0 text-ember-soft" />
        <span className="flex-1 text-sm text-paper/85">{status}</span>
        {value && (
          <a href={resolveAsset(value)} target="_blank" rel="noopener noreferrer" className="text-sm text-muted underline underline-offset-4">View</a>
        )}
        <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 text-sm">
          <Upload className="h-4 w-4" /> Replace
        </button>
      </div>
      <input ref={fileRef} id={id} type="file" accept={accept} onChange={onFile} className="hidden" />
      <input
        type="url"
        inputMode="url"
        placeholder="…or paste a link (e.g. Google Drive)"
        defaultValue={value && !isDataUrl(value) && !value.startsWith("asset:") ? value : ""}
        onBlur={(e) => e.target.value && set(e.target.value.trim())}
        className={cn(inputBase, "mt-2")}
      />
      {error && <p className="mt-1.5 text-sm text-ember-soft">{error}</p>}
    </div>
  );
};

/** Two fields side by side on wider sheets, stacked on phones. */
export const Row = ({ children }) => <div className="grid gap-4 min-[420px]:grid-cols-2">{children}</div>;

export const Group = ({ title, description, children }) => (
  <section className="space-y-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
    {(title || description) && (
      <header>
        {title && <h3 className="text-base font-medium text-paper">{title}</h3>}
        {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
      </header>
    )}
    {children}
  </section>
);
