import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useContent } from "../cms/context";
import { getIcon, lineIcons, resolveAsset } from "../data/registry";
import SectionHeading from "./ui/SectionHeading";
import TiltCard from "./ui/TiltCard";
import Counter from "./ui/Counter";
import { Reveal } from "./ui/Reveal";
import { trackSpotlight } from "@/lib/spotlight";

const Portrait = ({ profile, current }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-30, 30]);
  const src = resolveAsset(profile.portrait);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-md lg:mx-0">
      <TiltCard max={6} className="spotlight relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-ink-700 to-ink-900">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,90,31,0.35),transparent_60%)]" />
        <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-40" />
        {src ? (
          <motion.img
            src={src}
            alt={`Portrait of ${profile.fullName}`}
            width="900"
            height="1078"
            loading="lazy"
            decoding="async"
            style={{ y: imgY }}
            className="relative z-10 aspect-[900/1078] w-full scale-110 object-cover object-top"
          />
        ) : (
          <div className="relative z-10 flex aspect-[900/1078] items-center justify-center font-serif text-8xl italic text-paper/80">
            {profile.firstName?.[0]}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink via-ink/80 to-transparent p-6 pt-24">
          <p className="font-serif text-3xl italic text-paper">{profile.fullName}</p>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {profile.role} · {profile.location.split(",")[0]}
          </p>
        </div>
      </TiltCard>

      {current && (
        <div className="glass absolute -right-2 top-8 z-30 max-w-[16rem] animate-float rounded-2xl px-4 py-3 shadow-2xl sm:-right-8">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">Currently</p>
          <p className="mt-0.5 text-sm text-paper">
            {current.role} @ <span className="text-ember-soft">{current.company}</span>
          </p>
        </div>
      )}
    </div>
  );
};

const AboutUs = () => {
  const { about, profile, journey } = useContent();
  const current = journey.experience.find((e) => e.current);

  return (
    <section id="about" aria-labelledby="about-title" className="section-pad relative">
      <div className="container-x">
        <SectionHeading id="about-title" index="01" eyebrow={about.eyebrow} title={about.title} accent={about.accent} />

        {/* ---------- Intro + portrait (asymmetric) ---------- */}
        <div className="mt-16 grid items-start gap-14 lg:mt-24 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <Portrait profile={profile} current={current} />
          </Reveal>

          <div className="lg:pt-6">
            {about.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <p className={i === 0 ? "text-2xl leading-snug text-paper sm:text-[1.7rem]" : "mt-6 text-lg leading-relaxed text-muted"}>
                  {p}
                </p>
              </Reveal>
            ))}

            {about.stats.length > 0 && (
              <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08]">
                {about.stats.map((s, i) => (
                  <Reveal key={s.id ?? i} delay={i * 0.08} className="flex flex-col-reverse bg-ink p-5 sm:p-7">
                    <dt className="mt-2 text-sm text-muted">{s.label}</dt>
                    <dd>
                      <Counter value={Number(s.value) || 0} suffix={s.suffix} className="block text-4xl font-medium tracking-tightest text-paper sm:text-6xl" />
                    </dd>
                  </Reveal>
                ))}
              </dl>
            )}
          </div>
        </div>

        {/* ---------- Philosophy ---------- */}
        {about.philosophy.length > 0 && (
          <div className="mt-28 lg:mt-36">
            <Reveal className="eyebrow mb-8">Development philosophy</Reveal>
            <div className="grid gap-4 md:grid-cols-3">
              {about.philosophy.map((item, i) => {
                const Icon = getIcon(lineIcons, item.icon);
                return (
                  <Reveal key={item.id ?? i} delay={(i % 3) * 0.1}>
                    <TiltCard max={5} className="spotlight glass group h-full rounded-3xl p-7 sm:p-8">
                      <div className="flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember/10 text-ember ring-1 ring-ember/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <h3 className="mt-10 text-2xl font-medium tracking-tight">{item.title}</h3>
                      <p className="mt-3 leading-relaxed text-muted">{item.text}</p>
                    </TiltCard>
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------- What I build + Approach ---------- */}
        <div className="mt-28 grid gap-16 lg:mt-36 lg:grid-cols-2 lg:gap-12">
          <div>
            <Reveal className="eyebrow mb-8">What I enjoy building</Reveal>
            <ul className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {about.builds.map((b, i) => {
                const Icon = getIcon(lineIcons, b.icon);
                return (
                  <Reveal as="li" key={b.id ?? i} delay={i * 0.06}>
                    <div className="group flex items-start gap-5 py-6 transition-colors duration-300">
                      <Icon className="mt-1 h-5 w-5 shrink-0 text-muted transition-colors duration-300 group-hover:text-ember" aria-hidden="true" />
                      <div className="transition-transform duration-500 group-hover:translate-x-2">
                        <h3 className="text-xl font-medium">{b.title}</h3>
                        <p className="mt-1 text-muted">{b.text}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          <div>
            <Reveal className="eyebrow mb-8">How I solve complex frontend problems</Reveal>
            <ol className="relative space-y-3">
              {about.approach.map((a, i) => (
                <Reveal as="li" key={a.id ?? i} delay={i * 0.08}>
                  <div
                    onPointerMove={trackSpotlight}
                    className="spotlight group relative flex gap-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-colors duration-300 hover:bg-white/[0.04] sm:p-6"
                  >
                    <span className="font-serif text-4xl italic leading-none text-ember/80">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-lg font-medium">{a.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted sm:text-base">{a.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
