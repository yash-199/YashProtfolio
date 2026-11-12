import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Desktop-only cursor: a precise dot plus a trailing ring that grows over
 * interactive elements. Elements can opt into a text label with
 * data-cursor="label" data-cursor-label="View".
 * Mounted only on fine pointers by the parent (see App.jsx).
 */
const CustomCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 420, damping: 34, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 420, damping: 34, mass: 0.6 });
  const [state, setState] = useState({ mode: "default", label: "" });
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    // Only re-render when the cursor mode actually changes.
    const update = (mode, label = "") =>
      setState((s) => (s.mode === mode && s.label === label ? s : { mode, label }));

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = e.target.closest?.("[data-cursor], a, button, input, textarea, select, label");
      if (!el) return update("default");
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return update("text");
      const label = el.dataset.cursorLabel ?? "";
      update(label ? "label" : "hover", label);
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [x, y]);

  const ringSize = { default: 36, hover: 64, label: 92, text: 4 }[state.mode];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-paper/40 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: state.mode === "text" ? 28 : ringSize,
          backgroundColor: state.mode === "label" ? "rgba(244,242,238,1)" : state.mode === "hover" ? "rgba(244,242,238,0.95)" : "rgba(244,242,238,0)",
          scale: pressed ? 0.85 : 1,
          borderRadius: state.mode === "text" ? 2 : 999,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
      >
        <AnimatePresence>
          {state.mode === "label" && (
            <motion.span
              key={state.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="font-mono text-[0.65rem] font-medium uppercase tracking-widest text-ink"
            >
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-ember"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: state.mode === "default" ? 1 : 0 }}
      />
    </div>
  );
};

export default CustomCursor;
