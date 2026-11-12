/** Pointer handler that feeds --x/--y to elements using the `.spotlight` class. */
export const trackSpotlight = (e) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--x", `${e.clientX - r.left}px`);
  el.style.setProperty("--y", `${e.clientY - r.top}px`);
};
