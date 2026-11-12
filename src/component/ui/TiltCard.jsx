import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Subtle 3D tilt that follows the pointer. Also exposes --x/--y CSS vars
 * so children can use the `.spotlight` glow effect.
 */
const TiltCard = ({ children, className, max = 8, as = "div", style, ...props }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 160, damping: 18, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);

  const onMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    el.style.setProperty("--x", `${nx * 100}%`);
    el.style.setProperty("--y", `${ny * 100}%`);
    if (reduce || e.pointerType !== "mouse") return;
    px.set(nx);
    py.set(ny);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const Comp = motion[as];
  return (
    <Comp
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1100, ...style }}
      className={cn("[transform-style:preserve-3d] will-change-transform", className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default TiltCard;
