import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, Briefcase, ChevronRight, CloudUpload, Contact, FolderGit2, Maximize2, Minimize2,
  Pencil, Redo2, Sparkles, Undo2, UserRound, X, Layers, CircleAlert, CircleCheck, LoaderCircle,
} from "lucide-react";
import { useCms } from "../context";
import { useScrollTo } from "../../hooks/useScrollTo";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { AboutPanel, ContactPanel, JourneyPanel, ProfilePanel, ProjectsPanel, SkillsPanel } from "./panels";
import PublishPanel from "./PublishPanel";
import { iconBtn } from "./styles";
import { cn } from "@/lib/utils";
import { EASE } from "@/lib/motion";

const SECTIONS = [
  { id: "experience", label: "Work experience", Icon: Briefcase, anchor: "journey", Panel: JourneyPanel, count: (c) => `${c.journey.experience.length} jobs · education · certifications` },
  { id: "projects", label: "Projects", Icon: FolderGit2, anchor: "work", Panel: ProjectsPanel, count: (c) => `${c.projects.items.length} projects` },
  { id: "skills", label: "Skills", Icon: Layers, anchor: "skills", Panel: SkillsPanel, count: (c) => `${c.skills.core.length} core · ${c.skills.additional.length} additional` },
  { id: "profile", label: "Hero & profile", Icon: Sparkles, anchor: "top", Panel: ProfilePanel, count: () => "Headline, intro, photo, resume" },
  { id: "about", label: "About me", Icon: UserRound, anchor: "about", Panel: AboutPanel, count: () => "Intro, numbers, philosophy" },
  { id: "contact", label: "Contact & footer", Icon: Contact, anchor: "contact", Panel: ContactPanel, count: (c) => `${c.contact.socials.length} social links` },
];

const SaveStatus = () => {
  const { saveState } = useCms();
  if (saveState.status === "error")
    return <span className="flex items-center gap-1 text-xs text-red-300"><CircleAlert className="h-3.5 w-3.5" /> Not saved — storage full</span>;
  if (saveState.status === "saving")
    return <span className="flex items-center gap-1 text-xs text-muted"><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Saving…</span>;
  if (saveState.status === "saved")
    return <span className="flex items-center gap-1 truncate text-xs text-emerald-300/90"><CircleCheck className="h-3.5 w-3.5 shrink-0" /> Saved on this device</span>;
  return <span className="block truncate text-xs text-muted">Auto-saves as you type</span>;
};

const Notice = () => {
  const { notice, dismissNotice } = useCms();
  if (!notice) return null;
  const text =
    notice === "conflict"
      ? "The live site's content changed since you started editing. Your unpublished edits are kept here — publishing will replace the live version."
      : "Published! The live site updates after your host finishes redeploying. Your edits stay visible here meanwhile.";
  return (
    <div className="mb-4 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 text-sm text-paper/85">
      <span className="flex-1">{text}</span>
      <button type="button" onClick={dismissNotice} className={cn(iconBtn, "-m-2")} aria-label="Dismiss"><X className="h-4 w-4" /></button>
    </div>
  );
};

const Editor = () => {
  const { editMode, content, undo, redo, canUndo, canRedo, hasUnpublished } = useCms();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("home");
  const [full, setFull] = useState(false);
  const desktop = useMediaQuery("(min-width: 1024px)");
  const scrollTo = useScrollTo();

  // On desktop, make room for the docked panel so the live preview reflows beside it.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("cms-docked", open && desktop);
    return () => root.classList.remove("cms-docked");
  }, [open, desktop]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!editMode) return null;

  const section = SECTIONS.find((s) => s.id === view);
  const openSection = (s) => {
    setView(s.id);
    // Bring the matching part of the page into view as the live preview.
    requestAnimationFrame(() => scrollTo(s.anchor));
  };

  const title = view === "home" ? "Edit portfolio" : view === "publish" ? "Publish" : section?.label;

  return (
    <>
      {/* Floating edit button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-5 left-5 z-[80] inline-flex h-14 items-center gap-2 rounded-full bg-paper pl-5 pr-6 font-medium text-ink shadow-[0_12px_40px_-8px_rgba(0,0,0,0.8)] sm:bottom-8 sm:left-8"
            aria-label="Open content editor"
          >
            <Pencil className="h-5 w-5" /> Edit
            {hasUnpublished && <span className="absolute right-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-paper bg-ember" aria-label="Unpublished changes" />}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.aside
            key="cms-panel"
            role="dialog"
            aria-label="Content editor"
            initial={desktop ? { x: "100%" } : { y: "100%" }}
            animate={desktop ? { x: 0 } : { y: 0 }}
            exit={desktop ? { x: "100%" } : { y: "100%" }}
            transition={{ duration: 0.45, ease: EASE }}
            className={cn(
              "fixed z-[85] flex flex-col border-white/10 bg-ink-900/95 text-paper shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.9)] backdrop-blur-xl",
              desktop
                ? "bottom-0 right-0 top-0 w-[440px] border-l"
                : cn("inset-x-0 bottom-0 rounded-t-[1.75rem] border-t transition-[height] duration-300", full ? "h-[94dvh]" : "h-[60dvh]")
            )}
          >
            {/* Drag handle / size toggle (mobile) */}
            {!desktop && (
              <button type="button" onClick={() => setFull((f) => !f)} className="flex h-6 w-full shrink-0 items-center justify-center" aria-label={full ? "Shrink editor to see the page" : "Expand editor"}>
                <span className="h-1.5 w-12 rounded-full bg-white/25" />
              </button>
            )}

            {/* Header */}
            <header className={cn("flex shrink-0 items-center gap-1 border-b border-white/[0.07] px-2 pb-2", desktop && "pt-3")}>
              {view !== "home" ? (
                <button type="button" onClick={() => setView("home")} className={iconBtn} aria-label="Back to sections">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              ) : (
                <span className="w-2" />
              )}
              <div className="min-w-0 flex-1 px-1">
                <h2 className="truncate text-base font-medium">{title}</h2>
                <SaveStatus />
              </div>
              <button type="button" onClick={undo} disabled={!canUndo} className={iconBtn} aria-label="Undo"><Undo2 className="h-5 w-5" /></button>
              <button type="button" onClick={redo} disabled={!canRedo} className={iconBtn} aria-label="Redo"><Redo2 className="h-5 w-5" /></button>
              {!desktop && (
                <button type="button" onClick={() => setFull((f) => !f)} className={iconBtn} aria-label={full ? "Show more of the page" : "Expand editor"}>
                  {full ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className={iconBtn} aria-label="Close editor"><X className="h-5 w-5" /></button>
            </header>

            {/* Body */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-4">
              {view === "home" && (
                <>
                  <Notice />
                  <nav aria-label="Sections to edit" className="space-y-2">
                    {SECTIONS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => openSection(s)}
                        className="flex min-h-[4rem] w-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 text-left transition-colors active:bg-white/[0.06]"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ember/10 text-ember-soft">
                          <s.Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{s.label}</span>
                          <span className="block truncate text-xs text-muted">{s.count(content)}</span>
                        </span>
                        <ChevronRight className="h-5 w-5 text-muted" />
                      </button>
                    ))}
                  </nav>
                  <button
                    type="button"
                    onClick={() => setView("publish")}
                    className={cn(
                      "mt-4 flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-2xl font-medium",
                      hasUnpublished ? "bg-ember text-ink" : "border border-white/15 text-paper"
                    )}
                  >
                    <CloudUpload className="h-5 w-5" />
                    {hasUnpublished ? "Publish changes" : "Publish & settings"}
                  </button>
                  <p className="mt-3 text-center text-xs text-muted">Tip: tap the handle at the top to shrink the editor and see the page update live.</p>
                </>
              )}
              {view === "publish" && <PublishPanel />}
              {section && <section.Panel />}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Editor;
