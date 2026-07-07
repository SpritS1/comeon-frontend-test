// Pure display-formatting helpers, extracted so they're unit-testable
// without rendering the components that use them.

export function titleCase(s: string) {
  return s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// Turns a game `code` (e.g. "warp-wreckers") into a display title
// ("Warp Wreckers") — used as a fallback when API data lacks a `name`.
export function titleize(code: string) {
  return code.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Up to 2 uppercase initials from a full name, for avatar fallbacks.
export function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
