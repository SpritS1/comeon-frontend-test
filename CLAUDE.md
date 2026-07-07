# CLAUDE.md

ComeOn Group frontend take-home assignment. See `README.md` for the
assignment brief and `docs/IMPLEMENTATION.md` for the implementation plan.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui, TanStack Query,
react-hook-form + zod, Zustand. Package manager is **pnpm** — don't use
npm/yarn commands or lockfiles.

## Commands

```bash
pnpm dev              # Next.js dev server (also serves the mock API)
pnpm build
pnpm lint
```

The mock API is served by Next.js route handlers under `app/api/*` (login,
logout, games, categories) — no separate json-server process. The original
`mock/mock-data.json` is still the data source; `lib/mock/db.ts` re-exports it
plus the credentials from `mock/mock-api.js`.

## Project structure

- `app/` — routes (`/login`, `/games`, `/games/[code]`)
- `assets/` — game icons, avatars, logo — imported as modules, not served
  from `public/`
- `public/` — only literal-URL static files (favicon, `comeon.game-*.min.js`)
- `lib/` — API client, game-launch script
- `mock/` — json-server data + middleware, untouched from the original
  assignment
- `docs/` — planning docs

## Conventions

- No comments unless explaining a non-obvious _why_ (hidden constraint,
  workaround, surprising behavior). Never restate what the code does.
- Server state (games/categories/login) goes through TanStack Query, not
  component state or Zustand.
- Client-only local UI state (search text, selected category) stays in the
  component — don't lift it into Zustand/Context just because it exists.
- Auth guard is client-side only (redirect if no player in the auth store) —
  the mock API has no real session/token to verify against, so don't invent
  server-side auth checks that don't correspond to anything the API does.

## Gotchas

- The mock API lives in `app/api/*` route handlers, so the browser only ever
  talks to same-origin `/api/*` — no json-server, no CORS, no rewrites. Player
  passwords stay server-side in `lib/mock/db.ts` and are stripped before a
  player is returned from `/api/login`.
- `public/comeon.game-1.1.min.js` must be reachable as a static URL for
  `comeon.game.launch()` to work — it needs to live under `public/`, loaded
  via `next/script`, not imported as a JS module.
