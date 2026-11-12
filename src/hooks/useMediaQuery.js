import { useSyncExternalStore } from "react";

/** Subscribe to a CSS media query. SSR-safe (returns false on the server). */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

/** True on devices with a precise pointer that can hover (desktop/laptop). */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
