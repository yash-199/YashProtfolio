import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import logo from "../assets/logo.webp";
import { navLinks } from "../data/selectors";
import { resolveAsset } from "../data/registry";
import { useContent } from "../cms/context";
import { useScrollTo } from "../hooks/useScrollTo";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Track which section is currently in view for the active nav indicator. */
function useActiveSection(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

const ids = navLinks.map((l) => l.id);

const Navbar = ({ ready }) => {
  const { profile, contact } = useContent();
  const resume = resolveAsset(profile.resume);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(ids);
  const scrollTo = useScrollTo();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 300 && !open);
  });

  // Lock scroll + close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (id) => (e) => {
    setOpen(false);
    // Let the menu close (and scroll unlock) before scrolling.
    requestAnimationFrame(() => scrollTo(id, e));
    e.preventDefault();
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={ready ? { y: hidden ? -110 : 0, opacity: 1 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
        className="dock-aware fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex max-w-[84rem] items-center justify-between rounded-full py-2 pl-3 pr-2 transition-[background-color,border-color,box-shadow] duration-500 sm:pl-4",
            scrolled || open
              ? "border border-white/[0.08] bg-ink/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl"
              : "border border-transparent"
          )}
        >
          <a href="#top" onClick={go("top")} className="flex items-center gap-3" aria-label={`${profile.fullName} — back to top`}>
            <img src={logo} alt="" width="40" height="40" className="h-9 w-9 sm:h-10 sm:w-10" />
            <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-paper/80 sm:block">
              {profile.firstName}<span className="text-ember">.</span>dev
            </span>
          </a>

          <ul className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={go(link.id)}
                  aria-current={active === link.id ? "true" : undefined}
                  className={cn(
                    "relative block rounded-full px-4 py-2 text-sm transition-colors duration-300",
                    active === link.id ? "text-ink" : "text-paper/70 hover:text-paper"
                  )}
                >
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-paper"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {resume && <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="label"
              data-cursor-label="Open"
              className="group hidden items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-paper transition-colors hover:border-ember hover:text-ember sm:inline-flex"
            >
              Resume
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink md:hidden"
            >
              <span className="sr-only">Menu</span>
              <motion.span
                className="absolute h-[1.5px] w-5 bg-ink"
                animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                transition={{ duration: 0.35, ease: EASE }}
              />
              <motion.span
                className="absolute h-[1.5px] w-5 bg-ink"
                animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                transition={{ duration: 0.35, ease: EASE }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-ink px-6 pb-10 pt-28 md:hidden"
            initial={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-ember/20 blur-3xl" />
            <ul className="relative space-y-1">
              {navLinks.map((link, i) => (
                <li key={link.id} className="overflow-hidden">
                  <motion.a
                    href={`#${link.id}`}
                    onClick={go(link.id)}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: EASE }}
                    className="flex items-baseline gap-4 py-1 text-5xl font-medium tracking-tightest text-paper"
                  >
                    <span className="font-mono text-xs text-ember">0{i + 1}</span>
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative mt-12 space-y-6"
            >
              {resume && (
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 font-medium text-ink"
                >
                  View Resume <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-widest text-muted">
                {contact.socials.map((s) => (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                    {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
