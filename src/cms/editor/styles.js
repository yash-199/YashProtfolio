// 16px text prevents iOS from zooming into inputs; generous padding = easy taps.
export const inputBase =
  "w-full rounded-xl border border-white/10 bg-ink/70 px-3.5 py-3 text-base text-paper placeholder:text-muted/50 outline-none transition-[border-color,box-shadow] focus:border-ember/70 focus:shadow-[0_0_0_3px_rgba(255,90,31,0.15)]";

export const iconBtn =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-muted transition-colors hover:bg-white/[0.06] hover:text-paper active:bg-white/10 disabled:pointer-events-none disabled:opacity-30";
