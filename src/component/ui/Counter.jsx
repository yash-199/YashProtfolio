import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Counts up from 0 to `value` the first time it scrolls into view. */
const Counter = ({ value, suffix = "", className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView) return;
    const el = ref.current;
    if (reduce) {
      el.textContent = `${value}${suffix}`;
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value, suffix, reduce]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden="true">0{suffix}</span>
      <span className="sr-only">{`${value}${suffix}`}</span>
    </span>
  );
};

export default Counter;
