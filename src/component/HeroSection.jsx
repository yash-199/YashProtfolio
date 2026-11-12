import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight, MapPin } from "lucide-react";
import { SiNextdotjs, SiReact, SiRedux, SiTypescript } from "react-icons/si";
import { useContent } from "../cms/context";
import { useScrollTo } from "../hooks/useScrollTo";
import MagneticButton from "./ui/MagneticButton";
import { EASE } from "@/lib/motion";

/* ------------------------------------------------------------------ */
/* Rotating expertise words                                            */
/* ------------------------------------------------------------------ */
const RotatingWords = ({ words, run }) => {
  const [n, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!run || reduce || words.length < 2) return;
    const t = setInterval(() => setI((x) => x + 1), 2600);
    return () => clearInterval(t);
  }, [run, reduce, words.length]);

  if (!words.length) return null;
  const i = n % words.length;
  return (
    <span className="relative inline-flex h-[1.35em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="whitespace-nowrap font-serif italic text-gradient"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Interactive code window                                             */
/* ------------------------------------------------------------------ */
const K = ({ c }) => <span className="text-iris-soft">{c}</span>;
const S = ({ c }) => <span className="text-[#9be39b]">{c}</span>;
const P = ({ c }) => <span className="text-[#7dd3fc]">{c}</span>;
const B = ({ c }) => <span className="text-ember-soft">{c}</span>;

const buildCodeLines = (profile, hero) => [
  <><K c="const" /> engineer <span className="text-muted">=</span> {"{"}</>,
  <>&nbsp;&nbsp;<P c="name" />: <S c={`"${profile.fullName}"`} />,</>,
  <>&nbsp;&nbsp;<P c="role" />: <S c={`"${profile.role}"`} />,</>,
  <>
    &nbsp;&nbsp;<P c="stack" />: [
    {hero.codeStack.map((s, i) => (
      <span key={`${s}-${i}`}>
        <S c={`"${s}"`} />
        {i < hero.codeStack.length - 1 && ", "}
      </span>
    ))}
    ],
  </>,
  <>&nbsp;&nbsp;<P c="state" />: <S c={`"${hero.codeState}"`} />,</>,
  <>&nbsp;&nbsp;<P c="obsessedWith" />: <S c={`"${hero.codeFocus}"`} />,</>,
  <>&nbsp;&nbsp;<P c="openToWork" />: <B c={String(profile.available)} />,</>,
  <>{"};"}</>,
  <>&nbsp;</>,
  <><K c="export default" /> <span className="text-paper">ship</span>(engineer);</>,
];

const floatingChips = [
  { Icon: SiReact, label: "React", color: "#61dafb", pos: "-left-6 top-10 sm:-left-12", depth: 40 },
  { Icon: SiTypescript, label: "TypeScript", color: "#3178c6", pos: "-right-4 top-1/3 sm:-right-10 lg:-right-3 xl:-right-10", depth: 70 },
  { Icon: SiNextdotjs, label: "Next.js", color: "#ffffff", pos: "-left-4 bottom-16 sm:-left-14", depth: 60 },
  { Icon: SiRedux, label: "Redux", color: "#a37ff0", pos: "right-10 -bottom-14", depth: 30 },
];

const CodeWindow = ({ mx, my, ready, profile, hero }) => {
  const codeLines = buildCodeLines(profile, hero);
  const rotateY = useTransform(mx, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(my, [-0.5, 0.5], [10, -10]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.94 }}
      animate={ready ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
      className="relative mx-auto w-full max-w-[34rem] [perspective:1200px]"
    >
      <motion.div style={{ rotateX, rotateY }} className="relative [transform-style:preserve-3d]">
        {/* Glow behind the window */}
        <div aria-hidden="true" className="absolute -inset-8 -z-10 rounded-[2rem] bg-gradient-to-br from-ember/30 via-iris/20 to-transparent blur-3xl" />

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-900/80 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 font-mono text-[0.7rem] text-muted">yash.config.ts</span>
            <span className="ml-auto font-mono text-[0.65rem] text-muted/70">TSX</span>
          </div>

          <pre className="overflow-hidden px-4 py-5 font-mono text-[0.72rem] leading-[1.9] text-paper/90 sm:px-5 sm:text-[0.8rem]">
            <code>
              {codeLines.map((line, i) => (
                <motion.span
                  key={i}
                  className="flex"
                  initial={{ opacity: 0, x: -10 }}
                  animate={ready ? { opacity: 1, x: 0 } : undefined}
                  transition={{ duration: 0.5, delay: 1 + i * 0.08, ease: EASE }}
                >
                  <span className="mr-4 w-4 select-none text-right text-white/20">{i + 1}</span>
                  <span className="min-w-0 break-words">{line}</span>
                  {i === codeLines.length - 1 && (
                    <span className="ml-0.5 inline-block w-2 animate-blink bg-ember/90" aria-hidden="true">&nbsp;</span>
                  )}
                </motion.span>
              ))}
            </code>
          </pre>

          <div className="flex items-center gap-2 border-t border-white/[0.06] bg-white/[0.02] px-4 py-2.5 font-mono text-[0.68rem] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
            ready to ship
            <span className="ml-auto">UTF-8 · Prettier</span>
          </div>
        </div>

        {floatingChips.map(({ Icon, label, color, pos, depth }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={ready ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.8, delay: 1.4 + i * 0.12, ease: EASE }}
            style={{ translateZ: depth }}
            className={`absolute ${pos} hidden sm:block`}
          >
            <div className="glass flex animate-float items-center gap-2 rounded-xl px-3 py-2 text-xs text-paper/90 shadow-xl" style={{ animationDelay: `${i * 0.7}s` }}>
              <Icon style={{ color }} className="h-4 w-4" aria-hidden="true" />
              {label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */
/** One masked line of the headline that slides up into view. */
const Line = ({ delay, ready, className, children }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={ready ? { y: 0 } : undefined}
      transition={{ duration: 1.1, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  </span>
);

/** Fade-up props for supporting hero content, gated on the loader finishing. */
const fadeUp = (ready, delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: ready ? { opacity: 1, y: 0 } : undefined,
  transition: { duration: 0.9, delay, ease: EASE },
});

const HeroSection = ({ ready }) => {
  const { profile, hero } = useContent();
  const ref = useRef(null);
  const scrollTo = useScrollTo();
  const reduce = useReducedMotion();
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 60, damping: 20 });
  const my = useSpring(myRaw, { stiffness: 60, damping: 20 });

  // Background glow follows the cursor; content gently drifts on scroll.
  const glowX = useTransform(mx, [-0.5, 0.5], ["-8%", "8%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["-8%", "8%"]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const onPointerMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = ref.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    mxRaw.set(nx - 0.5);
    myRaw.set(ny - 0.5);
    ref.current.style.setProperty("--mx", `${nx * 100}%`);
    ref.current.style.setProperty("--my", `${ny * 100}%`);
  };

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 lg:pt-24"
    >
      {/* ---------- Animated background ---------- */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="bg-grid mask-fade-y absolute inset-0 opacity-60" />
        <motion.div style={{ x: glowX, y: glowY }} className="absolute inset-0">
          <div className="absolute left-[8%] top-[12%] h-[38rem] w-[38rem] animate-aurora rounded-full bg-ember/[0.18] blur-[120px]" />
          <div className="absolute right-[2%] top-[30%] h-[34rem] w-[34rem] animate-aurora-slow rounded-full bg-iris/[0.18] blur-[120px]" />
        </motion.div>
        <div
          className="absolute inset-0 hidden opacity-70 lg:block"
          style={{ background: "radial-gradient(500px circle at var(--mx) var(--my), rgba(255,138,92,0.09), transparent 60%)" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
      </div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-x grid items-center gap-16 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
        {/* ---------- Copy ---------- */}
        <div>
          {profile.available && (
            <motion.div
              {...fadeUp(ready, 0)}
              className="glass mb-8 inline-flex items-center gap-3 rounded-full py-1.5 pl-2 pr-4 text-sm text-paper/85"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inset-0 animate-pulseRing rounded-full bg-[#34d399]" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[#34d399]" />
              </span>
              {profile.availabilityText}
            </motion.div>
          )}

          <h1 id="hero-title" className="font-medium leading-[0.92] tracking-tightest">
            <Line ready={ready} delay={0.1} className="pb-2 text-[clamp(1.25rem,2.4vw,1.75rem)] font-light tracking-normal text-muted">
              {hero.greeting.replace(/\.$/, "")}
              {hero.greeting.endsWith(".") && <span className="text-ember">.</span>}
            </Line>
            <Line ready={ready} delay={0.2} className="break-words pb-[0.08em] text-[clamp(3.5rem,14vw,9.25rem)] lg:text-[clamp(3.5rem,10vw,9.25rem)]">
              {hero.line1}
            </Line>
            <Line ready={ready} delay={0.32} className="break-words pb-[0.12em] text-[clamp(3.5rem,14vw,9.25rem)] lg:text-[clamp(3.5rem,10vw,9.25rem)]">
              <span className="font-serif font-normal italic tracking-normal text-gradient">{hero.line2}</span>
              <span aria-hidden="true" className="text-outline ml-3 hidden align-middle font-mono text-[0.35em] tracking-normal sm:inline">{"</>"}</span>
            </Line>
          </h1>

          <motion.div {...fadeUp(ready, 0.55)} className="mt-8 max-w-xl">
            <p className="text-xl leading-snug text-paper sm:text-2xl">{hero.tagline}</p>
            {hero.rotatingWords.length > 0 && (
              <p className="mt-3 text-lg text-paper/80 sm:text-xl">
                {hero.craftPrefix} <RotatingWords words={hero.rotatingWords} run={ready} />
              </p>
            )}
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">{hero.intro}</p>
          </motion.div>

          <motion.div {...fadeUp(ready, 0.7)} className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <MagneticButton href="#contact" onClick={(e) => scrollTo("contact", e)} variant="primary">
              Let&apos;s Talk
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </MagneticButton>
            <MagneticButton href="#work" onClick={(e) => scrollTo("work", e)} variant="ghost">
              Explore My Work
              <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </MagneticButton>
          </motion.div>

          <motion.div
            {...fadeUp(ready, 0.9)}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.18em] text-muted"
          >
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-ember" aria-hidden="true" /> {profile.location}
            </span>
            <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden="true" />
            {profile.experienceLabel && <span>{profile.experienceLabel}</span>}
          </motion.div>
        </div>

        {/* ---------- Visual ---------- */}
        <CodeWindow mx={mx} my={my} ready={ready} profile={profile} hero={hero} />
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        onClick={(e) => scrollTo("about", e)}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted md:flex"
        aria-label="Scroll to About section"
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-ember"
            animate={reduce ? undefined : { y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
};

export default HeroSection;
