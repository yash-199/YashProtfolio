/**
 * Illustrative previews for projects that don't have a screenshot yet.
 * They depict each project's described features as abstract UI — no
 * invented data. Swap for a real screenshot by adding `image` in data.
 */

const Bar = ({ w = "100%", className = "" }) => (
  <span className={`block h-2 rounded-full bg-white/10 ${className}`} style={{ width: w }} />
);

export const TomatoPreview = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#ff5a3c33,transparent_55%),linear-gradient(160deg,#1a0f0d,#0b0b11)] p-6 sm:p-10">
    <div className="grid w-full max-w-lg grid-cols-5 gap-3 sm:gap-4">
      {/* Cart */}
      <div className="col-span-3 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#ff8a72]">Cart</p>
        {[0.7, 0.55, 0.8].map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-[#ff5a3c] to-[#ff9d5c] opacity-80" />
            <div className="flex-1 space-y-1.5">
              <Bar w={`${w * 100}%`} />
              <Bar w="35%" className="bg-white/5" />
            </div>
            <span className="flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 font-mono text-[0.6rem] text-paper/60">
              − 1 +
            </span>
          </div>
        ))}
      </div>
      {/* Summary + checkout */}
      <div className="col-span-2 flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
        <div className="space-y-2.5">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#ff8a72]">Order summary</p>
          <Bar w="90%" />
          <Bar w="70%" />
          <Bar w="80%" />
          <span className="block h-px bg-white/10" />
          <Bar w="60%" className="bg-white/20" />
        </div>
        <span className="mt-4 block rounded-xl bg-[#635bff] py-2 text-center text-[0.65rem] font-medium text-white shadow-lg shadow-[#635bff]/30">
          Checkout · Stripe
        </span>
      </div>
    </div>
  </div>
);

/** Fallback for new projects without a screenshot: the name, set large. */
export const GenericPreview = ({ name = "", accent = "#7c5cff" }) => (
  <div
    className="relative flex h-full w-full items-center justify-center overflow-hidden p-8"
    style={{ background: `radial-gradient(circle at 30% 25%, ${accent}40, transparent 55%), linear-gradient(160deg, #111119, #0b0b11)` }}
  >
    <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-40" />
    <span className="relative text-center font-serif text-5xl italic leading-none text-paper/90 sm:text-7xl">{name || "New project"}</span>
  </div>
);

export const ReactWindPreview = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_70%_20%,#38bdf833,transparent_55%),linear-gradient(160deg,#0a1520,#0b0b11)] p-6 sm:p-10">
    <div className="grid w-full max-w-lg grid-cols-2 gap-3 sm:gap-4">
      {/* Tabs */}
      <div className="col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
        <div className="flex gap-1 rounded-xl bg-black/30 p-1 font-mono text-[0.6rem]">
          <span className="flex-1 rounded-lg bg-[#38bdf8] py-1.5 text-center font-medium text-ink">Tabs</span>
          <span className="flex-1 py-1.5 text-center text-paper/50">Accordion</span>
          <span className="flex-1 py-1.5 text-center text-paper/50">Forms</span>
        </div>
        <div className="mt-3 space-y-2">
          <Bar w="85%" />
          <Bar w="60%" className="bg-white/5" />
        </div>
      </div>
      {/* Accordion */}
      <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
        {["open", "closed", "closed"].map((s, i) => (
          <div key={i} className="rounded-lg border border-white/10 p-2">
            <div className="flex items-center justify-between">
              <Bar w="55%" />
              <span className="font-mono text-[0.65rem] text-[#38bdf8]">{s === "open" ? "−" : "+"}</span>
            </div>
            {s === "open" && <Bar w="80%" className="mt-2 bg-white/5" />}
          </div>
        ))}
      </div>
      {/* Form */}
      <div className="space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
        <span className="block h-7 rounded-lg border border-white/10 bg-black/20" />
        <span className="block h-7 rounded-lg border border-[#38bdf8]/60 bg-black/20 shadow-[0_0_0_3px_rgba(56,189,248,0.15)]" />
        <span className="block rounded-lg bg-[#38bdf8] py-1.5 text-center font-mono text-[0.6rem] font-medium text-ink">Submit</span>
      </div>
    </div>
  </div>
);
