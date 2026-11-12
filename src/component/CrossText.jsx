import { useContent } from "../cms/context";

const Star = () => (
  <svg aria-hidden="true" className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1C12 1 12 8 10 10C8 12 1 12 1 12C1 12 8 12 10 14C12 16 12 23 12 23C12 23 12 16 14 14C16 12 23 12 23 12C23 12 16 12 14 10C12 8 12 1 12 1Z" />
  </svg>
);

const Track = ({ hidden, marqueeWords }) => (
  <div aria-hidden={hidden} className="flex shrink-0 animate-marquee items-center gap-8 pr-8 group-hover:[animation-play-state:paused]">
    {[...marqueeWords, ...marqueeWords].map((word, i) => (
      <span key={`${word}-${i}`} className="inline-flex items-center gap-8">
        <span className={i % 2 ? "font-serif text-2xl italic sm:text-4xl" : "text-2xl font-medium uppercase tracking-tight sm:text-4xl"}>
          {word}
        </span>
        <Star />
      </span>
    ))}
  </div>
);

/** Crossed marquee bands — a nod to the previous design, refined. */
const CrossText = () => {
  const { marqueeWords } = useContent();
  if (!marqueeWords.length) return null;
  return (
    <div className="relative overflow-hidden py-16 sm:py-24" role="img" aria-label={marqueeWords.join(", ")}>
      <div aria-hidden="true" className="absolute inset-x-[-5%] top-1/2 h-14 -translate-y-1/2 rotate-[4deg] bg-gradient-to-r from-iris/40 via-iris/25 to-ember/30 sm:h-20" />
      <div className="group relative -rotate-2 bg-ember py-4 text-ink [--duration:45s] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] sm:py-5">
        <div className="flex w-max">
          <Track hidden marqueeWords={marqueeWords} />
          <Track hidden marqueeWords={marqueeWords} />
        </div>
      </div>
    </div>
  );
};

export default CrossText;
