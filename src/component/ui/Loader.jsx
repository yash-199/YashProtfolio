import { useEffect } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useContent } from "../../cms/context";

const DURATION = 1.5;
const COUNT_EASE = [0.65, 0, 0.35, 1];

/**
 * Intro loader: a counter + tagline, then (on unmount via AnimatePresence)
 * a curtain wipe that reveals the page. Calls onDone when the count ends so
 * the hero entrance plays while the curtain lifts.
 */
const Loader = ({ onDone }) => {
  const { profile, hero } = useContent();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));

  useEffect(() => {
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const controls = animate(count, 100, { duration: DURATION, ease: COUNT_EASE, onComplete: onDone });
    return () => {
      controls.stop();
      root.style.overflow = "";
    };
  }, [count, onDone]);

  return (
    <motion.div
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink px-6 py-8 sm:px-10"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 1, ease: EASE } }}
    >
      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.25em] text-muted">
        <span>{profile.fullName}</span>
        <span>{profile.role}</span>
      </div>

      <div className="overflow-hidden">
        <motion.p
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="font-serif text-4xl italic text-paper/90 sm:text-6xl"
        >
          {hero.loaderText}<span className="text-ember">.</span>
        </motion.p>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="h-px flex-1 overflow-hidden bg-white/10">
          <motion.div
            className="h-full origin-left bg-ember"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: DURATION, ease: COUNT_EASE }}
          />
        </div>
        <motion.span className="font-mono text-6xl font-light tabular-nums leading-none text-paper sm:text-8xl">
          {rounded}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default Loader;
