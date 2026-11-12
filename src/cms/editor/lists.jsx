import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Copy, Plus, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useField } from "../context";
import { insertAt, move, removeAt, uid } from "../path";
import { PlainInput, Label } from "./fields";
import { iconBtn, inputBase } from "./styles";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Inline delete confirmation                                          */
/* ------------------------------------------------------------------ */
const DeleteButton = ({ onConfirm, label }) => {
  const [confirming, setConfirming] = useState(false);
  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 3500);
    return () => clearTimeout(t);
  }, [confirming]);
  return confirming ? (
    <button
      type="button"
      onClick={onConfirm}
      className="inline-flex h-11 shrink-0 items-center rounded-xl bg-red-500/90 px-3 text-sm font-medium text-white"
    >
      Delete?
    </button>
  ) : (
    <button type="button" onClick={() => setConfirming(true)} className={cn(iconBtn, "hover:text-red-400")} aria-label={`Delete ${label}`}>
      <Trash2 className="h-[1.1rem] w-[1.1rem]" />
    </button>
  );
};

/* ------------------------------------------------------------------ */
/* List of objects (experience, projects, skills…)                     */
/* ------------------------------------------------------------------ */
/**
 * @param path          content path to the array
 * @param title         (item) => string shown on the collapsed card
 * @param subtitle      (item) => string (optional)
 * @param create        () => new item (an `id` is added automatically)
 * @param children      (itemPath, item, index) => form fields for one item
 * @param addPosition   "start" | "end" — where new items go
 */
export const ItemList = ({ path, title, subtitle, create, children, addLabel = "Add item", addPosition = "end", noun = "item", compact = false }) => {
  const [items = [], setItems] = useField(path);
  const [openIds, setOpenIds] = useState(() => new Set());
  const scrollTo = useRef(null);

  useEffect(() => {
    if (!scrollTo.current) return;
    document.getElementById(`cms-item-${scrollTo.current}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    scrollTo.current = null;
  });

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const add = () => {
    const item = { ...create(), id: uid(noun) };
    setItems((list = []) => (addPosition === "start" ? [item, ...list] : [...list, item]));
    setOpenIds((prev) => new Set(prev).add(item.id));
    scrollTo.current = item.id;
  };

  const duplicate = (index) => {
    const copy = { ...structuredClone(items[index]), id: uid(noun) };
    setItems((list) => insertAt(list, index + 1, copy));
    setOpenIds((prev) => new Set(prev).add(copy.id));
    scrollTo.current = copy.id;
  };

  const AddButton = (
    <button
      type="button"
      onClick={add}
      className="flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-ember/40 bg-ember/[0.06] text-[0.95rem] font-medium text-ember-soft transition-colors active:bg-ember/15"
    >
      <Plus className="h-5 w-5" /> {addLabel}
    </button>
  );

  return (
    <div className="space-y-3">
      {addPosition === "start" && AddButton}
      {items.length === 0 && <p className="rounded-xl border border-white/[0.06] p-4 text-center text-sm text-muted">Nothing here yet.</p>}
      {items.map((item, index) => {
        const id = item.id ?? String(index);
        const open = openIds.has(id);
        return (
          <article
            key={id}
            id={`cms-item-${id}`}
            className={cn("scroll-mt-4 overflow-hidden rounded-2xl border bg-white/[0.025] transition-colors", open ? "border-ember/30" : "border-white/[0.08]")}
          >
            <div className="flex items-center gap-1 p-1.5 pl-1">
              <button
                type="button"
                onClick={() => toggle(id)}
                aria-expanded={open}
                className="flex min-h-[2.75rem] min-w-0 flex-1 items-center gap-2 rounded-xl px-2.5 text-left active:bg-white/[0.04]"
              >
                <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted transition-transform", open && "rotate-180")} />
                <span className="min-w-0">
                  <span className="block truncate text-[0.95rem] font-medium text-paper">{title(item) || `Untitled ${noun}`}</span>
                  {subtitle && !compact && <span className="block truncate text-xs text-muted">{subtitle(item)}</span>}
                </span>
              </button>
              <button type="button" onClick={() => setItems((l) => move(l, index, index - 1))} disabled={index === 0} className={iconBtn} aria-label="Move up">
                <ArrowUp className="h-[1.1rem] w-[1.1rem]" />
              </button>
              <button type="button" onClick={() => setItems((l) => move(l, index, index + 1))} disabled={index === items.length - 1} className={iconBtn} aria-label="Move down">
                <ArrowDown className="h-[1.1rem] w-[1.1rem]" />
              </button>
              <DeleteButton label={title(item) || noun} onConfirm={() => setItems((l) => removeAt(l, index))} />
            </div>
            {open && (
              <div className="space-y-4 border-t border-white/[0.06] p-4">
                {children([...path, index], item, index)}
                <button type="button" onClick={() => duplicate(index)} className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-xl px-2 text-sm text-muted active:bg-white/[0.05]">
                  <Copy className="h-4 w-4" /> Duplicate this {noun}
                </button>
              </div>
            )}
          </article>
        );
      })}
      {addPosition === "end" && AddButton}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* List of strings (bullet points, paragraphs…)                        */
/* ------------------------------------------------------------------ */
export const StringList = ({ path, label, addLabel = "Add line", placeholder = "", multiline = true }) => {
  const [items = [], setItems] = useField(path);
  const focusIndex = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (focusIndex.current == null) return;
    listRef.current?.querySelectorAll("textarea, input")[focusIndex.current]?.focus();
    focusIndex.current = null;
  });

  return (
    <div>
      {label && <Label>{label}</Label>}
      <ol ref={listRef} className="space-y-2">
        {items.map((text, i) => (
          <li key={i} className="flex items-start gap-1">
            <span className="mt-3.5 w-5 shrink-0 text-right font-mono text-[0.7rem] text-muted">{i + 1}.</span>
            <PlainInput
              multiline={multiline}
              value={text}
              placeholder={placeholder}
              onChange={(v) => setItems((l) => l.map((x, j) => (j === i ? v : x)))}
              className="flex-1 py-2.5"
              aria-label={`${label || "Item"} ${i + 1}`}
            />
            <div className="flex flex-col">
              <button type="button" onClick={() => setItems((l) => move(l, i, i - 1))} disabled={i === 0} className={cn(iconBtn, "h-9 w-10")} aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => setItems((l) => move(l, i, i + 1))} disabled={i === items.length - 1} className={cn(iconBtn, "h-9 w-10")} aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
            <button type="button" onClick={() => setItems((l) => removeAt(l, i))} className={cn(iconBtn, "mt-0.5 hover:text-red-400")} aria-label={`Remove ${label || "item"} ${i + 1}`}>
              <X className="h-[1.1rem] w-[1.1rem]" />
            </button>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={() => {
          focusIndex.current = items.length;
          setItems((l = []) => [...l, ""]);
        }}
        className="mt-2 inline-flex min-h-[2.75rem] items-center gap-2 rounded-xl px-2 text-sm font-medium text-ember-soft active:bg-ember/10"
      >
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Tag chips (technologies, toolkit…)                                  */
/* ------------------------------------------------------------------ */
export const TagEditor = ({ path, label, placeholder = "Add a tag…" }) => {
  const [tags = [], setTags] = useField(path);
  const [draft, setDraft] = useState("");
  const [selected, setSelected] = useState(null);

  const add = () => {
    const parts = draft.split(",").map((t) => t.trim()).filter(Boolean);
    if (!parts.length) return;
    setTags((l = []) => [...l, ...parts.filter((p) => !l.includes(p))]);
    setDraft("");
  };

  const sel = selected != null && selected < tags.length ? selected : null;

  return (
    <div>
      {label && <Label hint="tap a tag to move or remove">{label}</Label>}
      <div className="rounded-xl border border-white/10 bg-ink/50 p-2">
        <ul className="flex flex-wrap gap-1.5">
          {tags.map((tag, i) => (
            <li key={`${tag}-${i}`}>
              <button
                type="button"
                onClick={() => setSelected(sel === i ? null : i)}
                aria-pressed={sel === i}
                className={cn(
                  "min-h-[2.25rem] rounded-full border px-3 font-mono text-[0.75rem] transition-colors",
                  sel === i ? "border-ember bg-ember/20 text-paper" : "border-white/10 bg-white/[0.04] text-paper/80"
                )}
              >
                {tag}
              </button>
            </li>
          ))}
          {tags.length === 0 && <li className="px-2 py-1.5 text-sm text-muted">No tags yet</li>}
        </ul>

        {sel != null && (
          <div className="mt-2 flex items-center gap-1 rounded-lg bg-white/[0.04] p-1">
            <span className="flex-1 truncate px-2 text-sm text-paper">“{tags[sel]}”</span>
            <button type="button" onClick={() => { setTags((l) => move(l, sel, sel - 1)); setSelected(Math.max(0, sel - 1)); }} disabled={sel === 0} className={iconBtn} aria-label="Move left">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => { setTags((l) => move(l, sel, sel + 1)); setSelected(Math.min(tags.length - 1, sel + 1)); }} disabled={sel === tags.length - 1} className={iconBtn} aria-label="Move right">
              <ChevronRight className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => { setTags((l) => removeAt(l, sel)); setSelected(null); }} className={cn(iconBtn, "hover:text-red-400")} aria-label="Remove tag">
              <Trash2 className="h-[1.1rem] w-[1.1rem]" />
            </button>
          </div>
        )}

        <div className="mt-2 flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                add();
              }
            }}
            enterKeyHint="done"
            placeholder={placeholder}
            className={cn(inputBase, "py-2.5")}
            aria-label={`New ${label || "tag"}`}
          />
          <button type="button" onClick={add} disabled={!draft.trim()} className="inline-flex min-h-[2.75rem] shrink-0 items-center gap-1 rounded-xl bg-ember px-4 text-sm font-medium text-ink disabled:opacity-40">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};
