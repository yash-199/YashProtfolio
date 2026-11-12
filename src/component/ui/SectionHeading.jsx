import { Reveal, RevealText } from "./Reveal";
import { cn } from "@/lib/utils";

/**
 * Consistent section header: numbered eyebrow, large title with an
 * optional serif-italic accent word, and an optional lead paragraph.
 */
const SectionHeading = ({ index, eyebrow, title, accent, lead, align = "left", className, id }) => (
  <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
    <Reveal className={cn("eyebrow mb-6", align === "center" && "justify-center")}>
      <span className="text-ember">{index}</span>
      <span className="h-px w-8 bg-white/20" aria-hidden="true" />
      {eyebrow}
    </Reveal>
    <h2 id={id} className="text-[2.6rem] font-medium leading-[0.98] tracking-tightest sm:text-6xl lg:text-7xl">
      <RevealText text={title} />
      {accent && (
        <>
          {" "}
          <RevealText
            text={accent}
            delay={0.15}
            className="font-serif font-normal italic tracking-normal text-gradient"
          />
        </>
      )}
    </h2>
    {lead && (
      <Reveal delay={0.2} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        <p>{lead}</p>
      </Reveal>
    )}
  </div>
);

export default SectionHeading;
