import { useContent } from "../cms/context";
import { brandIcons, getIcon, lineIcons } from "../data/registry";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";
import { Reveal } from "./ui/Reveal";
import { cn } from "@/lib/utils";

const initials = (name = "") =>
  name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "•";

const SkillCard = ({ skill, index }) => {
  const Icon = brandIcons[skill.icon]?.Icon;
  const color = skill.color || "#ff5a1f";
  return (
    <Reveal delay={(index % 4) * 0.07} className="h-full">
      <TiltCard
        max={skill.wide ? 4 : 7}
        style={{ "--glow": color }}
        className="spotlight group relative flex h-full min-h-[13rem] flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-900/60 p-6 sm:p-7"
      >
        {/* Brand-tinted corner glow */}
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
          style={{ background: color }}
        />

        <div className="flex items-start justify-between gap-3">
          {/* Icon with a conic ring that spins on hover */}
          <div className="relative h-14 w-14 shrink-0 [transform:translateZ(30px)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-2xl opacity-60 transition-opacity duration-500 group-hover:animate-[spin-slow_4s_linear_infinite] group-hover:opacity-100"
              style={{ background: `conic-gradient(from 0deg, ${color}, transparent 40%, ${color} 70%, transparent)` }}
            />
            <div className="absolute inset-[1.5px] flex items-center justify-center rounded-[0.9rem] bg-ink-900">
              {Icon ? (
                <Icon className="h-6 w-6 transition-transform duration-500 group-hover:scale-110" style={{ color }} aria-hidden="true" />
              ) : (
                <span className="font-mono text-sm font-medium" style={{ color }} aria-hidden="true">{initials(skill.name)}</span>
              )}
            </div>
          </div>
          {skill.detail && <span className="chip">{skill.detail}</span>}
        </div>

        <div className="mt-8 [transform:translateZ(20px)]">
          <h3 className={cn("font-medium tracking-tight", skill.wide ? "text-3xl sm:text-4xl" : "text-2xl")}>{skill.name}</h3>
          {skill.note && <p className="mt-2 text-sm leading-relaxed text-muted">{skill.note}</p>}
        </div>

        {/* Indicator line that draws on hover */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />
      </TiltCard>
    </Reveal>
  );
};

const Skill = () => {
  const { skills } = useContent();
  return (
    <section id="skills" aria-labelledby="skills-title" className="section-pad relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-40 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-iris/[0.08] blur-[140px]" />

      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="skills-title" index="02" eyebrow={skills.eyebrow} title={skills.title} accent={skills.accent} />
          {skills.lead && (
            <Reveal delay={0.2} className="max-w-sm text-muted lg:pb-3 lg:text-right">
              <p>{skills.lead}</p>
            </Reveal>
          )}
        </div>

        {/* ---------- Core skills bento ---------- */}
        <Reveal className="eyebrow mb-6 mt-16 lg:mt-20">
          <span className="h-1.5 w-1.5 rounded-full bg-ember" aria-hidden="true" /> Core skills
        </Reveal>
        <ul className="grid grid-flow-dense grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {skills.core.map((skill, i) => (
            <li key={skill.id ?? i} className={cn("h-full", skill.wide && "lg:col-span-2")}>
              <SkillCard skill={skill} index={i} />
            </li>
          ))}
          {skills.toolkit.length > 0 && (
            <li className="min-[480px]:col-span-2">
              <Reveal className="h-full">
                <div className="glass relative flex h-full min-h-[13rem] flex-col justify-between overflow-hidden rounded-3xl p-6 sm:p-7">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{skills.toolkitTitle}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {skills.toolkit.map((t, i) => (
                      <li key={`${t}-${i}`} className="chip transition-colors duration-300 hover:border-ember/50 hover:text-paper">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          )}
        </ul>

        {/* ---------- Additional skills ---------- */}
        {skills.additional.length > 0 && (
          <>
            <Reveal className="eyebrow mb-6 mt-16">
              <span className="h-1.5 w-1.5 rounded-full bg-iris" aria-hidden="true" /> Additional skills
            </Reveal>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {skills.additional.map((s, i) => {
                const Icon = getIcon(lineIcons, s.icon);
                return (
                  <Reveal as="li" key={s.id ?? i} delay={(i % 4) * 0.06}>
                    <div className="group flex h-full items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-iris/40 hover:bg-iris/[0.06] sm:p-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-muted transition-colors duration-300 group-hover:bg-iris/15 group-hover:text-iris-soft">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 break-words text-sm font-medium leading-tight text-paper/90 sm:text-base">{s.name}</span>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </section>
  );
};

export default Skill;
