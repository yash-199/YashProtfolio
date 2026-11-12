import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-paper text-ink hover:shadow-[0_0_40px_-6px_rgba(255,90,31,0.7)]",
  ghost:
    "border border-white/15 bg-white/[0.03] text-paper backdrop-blur-md hover:border-white/30 hover:bg-white/[0.07]",
  ember:
    "bg-ember text-ink hover:shadow-[0_0_44px_-6px_rgba(255,90,31,0.9)]",
};

/**
 * A button/link that is gently pulled toward the cursor.
 * Renders an <a> when `href` is provided, otherwise a <button>.
 */
const MagneticButton = ({
  href,
  children,
  variant = "primary",
  strength = 0.35,
  className,
  external = false,
  cursorLabel,
  ...props
}) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const Tag = href ? motion.a : motion.button;
  const linkProps = href
    ? { href, ...(external && { target: "_blank", rel: "noopener noreferrer" }) }
    : { type: props.type ?? "button" };

  return (
    <Tag
      ref={ref}
      {...linkProps}
      {...props}
      data-cursor={cursorLabel ? "label" : "hover"}
      data-cursor-label={cursorLabel}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x, y }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "group relative inline-flex select-none items-center whitespace-nowrap justify-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-[0.95rem] font-medium transition-[box-shadow,background-color,border-color] duration-300 sm:px-7",
        VARIANTS[variant],
        className
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Tag>
  );
};

export default MagneticButton;
