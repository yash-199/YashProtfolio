import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { IoLogoGithub } from "react-icons/io";
import { useContent } from "../cms/context";
import { resolveAsset } from "../data/registry";
import { findSocial } from "../data/selectors";
import { GenericPreview, ReactWindPreview, TomatoPreview } from "./ProjectPreviews";
import SectionHeading from "./ui/SectionHeading";
import MagneticButton from "./ui/MagneticButton";
import TiltCard from "./ui/TiltCard";
import { Reveal } from "./ui/Reveal";

const previews = { tomato: TomatoPreview, reactwind: ReactWindPreview };

const ProjectCard = ({ project, index, total }) => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  // As the next card slides over, this one recedes slightly (desktop stack).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 0.92]);
  const dim = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 0.5]);
  const Preview = previews[project.preview];
  const image = resolveAsset(project.image);
  const number = String(index + 1).padStart(2, "0");
  const href = project.liveUrl || project.githubUrl;
  const PreviewTag = href ? "a" : "div";
  const previewLinkProps = href
    ? {
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        "data-cursor": "label",
        "data-cursor-label": project.liveUrl ? "Visit" : "Code",
        "aria-label": `${project.name} — ${project.liveUrl ? "open live demo" : "view source on GitHub"}`,
      }
    : {};

  return (
    <li ref={ref} className="lg:sticky lg:h-[min(42rem,calc(100vh-9rem))]" style={{ top: `calc(6.5rem + ${index * 1.5}rem)` }}>
      <motion.article
        style={{ scale }}
        aria-labelledby={`project-${project.id}`}
        className="relative h-full origin-top overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-900 shadow-[0_-20px_80px_-30px_rgba(0,0,0,0.9)]"
      >
        <div className="grid h-full lg:grid-cols-[1.25fr_1fr]">
          {/* ---------- Preview ---------- */}
          <PreviewTag {...previewLinkProps} className="group relative block aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full">
            <TiltCard max={4} className="h-full w-full">
              <div className="h-full w-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]">
                {image ? (
                  <img
                    src={image}
                    alt={project.imageAlt || `${project.name} preview`}
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: project.imagePosition || "center top" }}
                    className="h-full w-full object-cover"
                  />
                ) : Preview ? (
                  <Preview />
                ) : (
                  <GenericPreview name={project.name} accent={project.accent} />
                )}
              </div>
            </TiltCard>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-ink-900/60" />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover:opacity-100"
              style={{ background: `radial-gradient(circle at 50% 50%, ${project.accent}, transparent 70%)` }}
            />
            <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-xs text-paper/90 backdrop-blur-md sm:left-6 sm:top-6">
              {number} / {String(total).padStart(2, "0")}
            </span>
          </PreviewTag>

          {/* ---------- Details ---------- */}
          <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em]" style={{ color: project.accent }}>
                {project.kind}
              </p>
              <h3 id={`project-${project.id}`} className="mt-3 text-4xl font-medium tracking-tightest sm:text-5xl">
                {project.name}
              </h3>
              <p className="mt-4 leading-relaxed text-muted">{project.description}</p>

              <ul className="mt-6 space-y-2.5" aria-label="Key features">
                {project.features.filter(Boolean).map((f, i) => (
                  <li key={`${f}-${i}`} className="flex items-start gap-3 text-sm text-paper/85 sm:text-base">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: project.accent }} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <ul className="flex flex-wrap gap-2" aria-label="Technologies used">
                {project.tech.map((t, i) => (
                  <li key={`${t}-${i}`} className="chip">{t}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <MagneticButton href={project.liveUrl} external variant="primary" className="py-3 text-sm">
                    Live Demo <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </MagneticButton>
                )}
                {project.githubUrl && (
                  <MagneticButton href={project.githubUrl} external variant={project.liveUrl ? "ghost" : "primary"} className="py-3 text-sm">
                    <IoLogoGithub className="h-4 w-4" aria-hidden="true" />
                    {project.githubLabel || "View Code"}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </MagneticButton>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dimming overlay as the card recedes */}
        <motion.div aria-hidden="true" style={{ opacity: dim }} className="pointer-events-none absolute inset-0 hidden bg-ink lg:block" />
      </motion.article>
    </li>
  );
};

const Projects = () => {
  const { projects, contact } = useContent();
  const github = findSocial(contact, "github");
  const items = projects.items;
  return (
    <section id="work" aria-labelledby="work-title" className="section-pad relative">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading id="work-title" index="03" eyebrow={projects.eyebrow} title={projects.title} accent={projects.accent} />
          {github?.url && (
            <Reveal delay={0.2} className="lg:pb-3">
              <MagneticButton href={github.url} external variant="ghost">
                <IoLogoGithub className="h-4 w-4" aria-hidden="true" /> {projects.allReposLabel}
              </MagneticButton>
            </Reveal>
          )}
        </div>

        <ol className="mt-16 space-y-6 lg:mt-20 lg:space-y-[12vh]">
          {items.map((p, i) => (
            <ProjectCard key={p.id ?? i} project={p} index={i} total={items.length} />
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Projects;
