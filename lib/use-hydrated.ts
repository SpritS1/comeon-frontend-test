import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// Returns false during SSR and the first (hydration) client render, then true.
// Lets components read browser-only state (sessionStorage-backed auth) without
// a hydration mismatch — and without a setState-in-effect.
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
