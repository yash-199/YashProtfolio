import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Award, Briefcase, GraduationCap } from "lucide-react";
import { useContent } from "../cms/context";
import { periodOf } from "../data/selectors";
import SectionHeading from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";
import { trackSpotlight } from "@/lib/spotlight";

const TimelineItem = ({ item }) => (
  <li className="relative pl-10 sm:pl-14">
    {/* Node */}
    <span aria-hidden="true" className="absolute left-0 top-2 flex h-[1.4rem] w-[1.4rem] items-center justify-center sm:left-[0.15rem]">
      {item.current && <span className="absolute inset-0 animate-pulseRing rounded-full bg-ember/60" />}
      <span className={`relative h-3 w-3 rounded-full ring-4 ring-ink ${item.current ? "bg-ember" : "bg-paper/60"}`} />
    </span>

    <Reveal delay={0.05}>
      <div
        onPointerMove={trackSpotlight}
        className="spotlight group rounded-3xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors duration-500 hover:bg-white/[0.035] sm:p-8"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ember-soft">{periodOf(item)}</span>
          {item.current && (
            <span className="rounded-full bg-[#34d399]/10 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-[#34d399]">
              Current
            </span>
          )}
        </div>

        <h3 className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">{item.role}</h3>
        <p className="mt-1 text-paper/70">
          {item.company} {item.location && <span className="text-muted">· {item.location}</span>}
        </p>
        {item.summary && <p className="mt-4 leading-relaxed text-muted">{item.summary}</p>}

        <ul className="mt-6 space-y-3" aria-label="Responsibilities and contributions">
          {item.points.filter(Boolean).map((p, i) => (
            <li key={`${p}-${i}`} className="flex gap-3 text-[0.95rem] leading-relaxed text-paper/85">
              <span aria-hidden="true" className="mt-[0.6rem] h-1 w-3 shrink-0 rounded-full bg-gradient-to-r from-ember to-iris" />
              {p}
            </li>
          ))}
        </ul>

        {(item.projects.length > 0 || item.tech.length > 0) && (
          <div className="mt-7 grid gap-5 border-t border-white/[0.06] pt-6 sm:grid-cols-2">
            {item.projects.length > 0 && (
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">Major projects</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {item.projects.map((p, i) => (
                    <li key={`${p}-${i}`} className="rounded-full bg-ember/10 px-3 py-1 text-xs text-ember-soft ring-1 ring-ember/20">{p}</li>
                  ))}
                </ul>
              </div>
            )}
            {item.tech.length > 0 && (
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">Tech</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {item.tech.map((t, i) => (
                    <li key={`${t}-${i}`} className="chip">{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Reveal>
  </li>
);

const Experience = () => {
  const { journey } = useContent();
  const { experience, milestones, certifications } = journey;
  const lineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="journey" aria-labelledby="journey-title" className="section-pad relative overflow-x-clip">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 -z-10 h-[36rem] w-[36rem] rounded-full bg-ember/[0.07] blur-[140px]" />
      <div className="container-x grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        {/* ---------- Left: heading + milestones (sticky on desktop) ---------- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="journey-title"
            index="04"
            eyebrow={journey.eyebrow}
            title={journey.title}
            accent={journey.accent}
            lead={journey.lead}
          />

          {milestones.length > 0 && <Reveal delay={0.1} className="mt-12">
            <h3 className="eyebrow mb-4"><GraduationCap className="h-3.5 w-3.5" aria-hidden="true" /> Education milestones</h3>
            <ul className="space-y-3">
              {milestones.map((m, i) => (
                <li key={m.id ?? i} className="flex flex-col gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:flex-row sm:items-baseline sm:gap-4">
                  <span className="shrink-0 font-mono text-xs text-ember-soft">{m.year}</span>
                  <span className="text-paper/85">{m.title}</span>
                </li>
              ))}
            </ul>
          </Reveal>}

          {certifications.length > 0 && <Reveal delay={0.15} className="mt-8">
            <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-paper/85">
                <span className="eyebrow"><Award className="h-3.5 w-3.5" aria-hidden="true" /> Certifications ({certifications.length})</span>
                <span aria-hidden="true" className="text-xl leading-none text-muted transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <ul className="mt-4 space-y-2 text-sm text-muted">
                {certifications.filter(Boolean).map((c, i) => (
                  <li key={`${c}-${i}`} className="flex gap-2"><span className="text-ember">—</span>{c}</li>
                ))}
              </ul>
            </details>
          </Reveal>}
        </div>

        {/* ---------- Right: animated timeline ---------- */}
        <div ref={lineRef} className="relative">
          <div aria-hidden="true" className="absolute bottom-2 left-[0.68rem] top-2 w-px bg-white/[0.08] sm:left-[0.83rem]">
            <motion.div style={{ scaleY: progress }} className="h-full w-full origin-top bg-gradient-to-b from-ember via-ember-soft to-iris" />
          </div>
          <p className="eyebrow mb-8 pl-10 sm:pl-14"><Briefcase className="h-3.5 w-3.5" aria-hidden="true" /> Professional experience</p>
          <ol className="space-y-8">
            {experience.map((item, i) => (
              <TimelineItem key={item.id ?? i} item={item} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Experience;
