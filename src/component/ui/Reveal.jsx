import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

/** Fade + rise into view once, when scrolled into the viewport. */
export const Reveal = ({ children, delay = 0, y = 32, className, as = "div", ...props }) => {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      {...props}
    >
      {children}
    </Comp>
  );
};

/**
 * Word-by-word masked reveal for headings. Keeps the full text available
 * to screen readers via aria-label.
 */
export const RevealText = ({ text, className, delay = 0, as = "span", stagger = 0.06 }) => {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  const words = text.split(" ");
  return (
    <Comp
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            variants={{
              hidden: reduce ? { y: 0 } : { y: "110%" },
              show: { y: 0, transition: { duration: 0.9, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
};
