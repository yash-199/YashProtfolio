import { useCallback } from "react";
import { useLenis } from "lenis/react";

const NAV_OFFSET = -24;

/**
 * Smooth-scroll to a section id. Uses Lenis when active, otherwise native
 * scrolling (e.g. reduced-motion users). Also updates the URL hash.
 */
export function useScrollTo() {
  const lenis = useLenis();

  return useCallback(
    (id, event) => {
      const target = id === "top" ? 0 : document.getElementById(id);
      if (target === null) return;
      event?.preventDefault();

      if (lenis) {
        lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.4 });
      } else if (target === 0) {
        window.scrollTo({ top: 0 });
      } else {
        target.scrollIntoView({ block: "start" });
      }
      history.replaceState(null, "", id === "top" ? " " : `#${id}`);
    },
    [lenis]
  );
}
