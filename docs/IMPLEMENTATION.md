# Implementation Plan

Context: ComeOn Group frontend take-home assignment (see `README.md`). Goal is a
minimal but well-built casino frontend: login, games lobby with search/category
filtering, and a game-play screen — implemented with Next.js, TypeScript,
Tailwind and shadcn/ui.

## Stack

- **Next.js (App Router)** — routing, server/client component split
- **TypeScript** — strict mode
- **Tailwind CSS** — styling
- **shadcn/ui** — Button, Input, Card, Badge, Avatar, Skeleton, Dialog
- **TanStack Query** — data fetching/caching for `/games`, `/categories`, and
  the login/logout mutations
- **react-hook-form + zod** — login form + validation
- **Zustand** — holds the logged-in player (small, doesn't need Query/Context
  boilerplate for something this shallow)
- pnpm as package manager

## Screens / routes

```
/login          public, redirects to /games if already logged in
/games          protected, lobby: search + category filter + grid
/games/[code]   protected, game-play screen (loads via comeon.game.launch)
```

"Protected" here means client-side guard (redirect to `/login` if no player in
the store) — the mock API has no real token/session, just a success/fail
response, so there's nothing to verify server-side. This is a known
simplification, worth calling out explicitly rather than faking a JWT flow
that doesn't exist.

## Data layer

- `app/api/*` route handlers (`login`, `logout`, `games`, `categories`) serve
  the mock API directly — no separate json-server process, so the browser
  only ever talks to same-origin `/api/*` and there's no CORS/rewrites to
  configure.
- `lib/mock/db.ts` is the data source: re-exports `mock/mock-data.json`
  (games, categories) plus the three player records (credentials moved here
  from the original `mock/mock-api.js`). Passwords never leave this file —
  stripped before `/api/login` returns a player.
- `lib/api.ts` — thin fetch wrappers around those routes (`getGames`,
  `getCategories`, `login`, `logout`).
- TanStack Query: `useGames()` / `useCategories()` hooks in `lib/queries.ts`;
  login and logout are inline `useMutation` calls in `LoginScreen` /
  `LobbyHeader` (not extracted into named hooks — only one call site each).

## State

- `useAuthStore` (Zustand) — `{ player, login(), logout() }`, persisted to
  `sessionStorage` so a refresh on `/games` doesn't bounce the user back to
  login.
- Games list filtering (search text + selected category) is local component
  state, derived with `useMemo` — no need for global state, it's one screen.

## Game-play screen

- `lib/comeon.game-1.1.min.js` needs to live under `public/` (not root
  `lib/`) so it's fetchable as a static URL — load it with
  `next/script` (`strategy="beforeInteractive"` or `afterInteractive"`) on
  `/games/[code]`.
- On mount, call `comeon.game.launch(code)` into the `#game-launch` div.
- "Back" button routes to `/games` (`router.back()` if history is reliable,
  otherwise `router.push('/games')`).

## Assets

- `assets/` — game icons, avatars, logo: imported as modules
  (`import fox from '@/assets/game-icon/feasting_fox.png'`) so `next/image`
  gets automatic dimensions/optimization.
- `public/` — only for things that must be a literal URL: favicon, and the
  `comeon.game-1.1.min.js` script.

## Testing

- Vitest + React Testing Library + jsdom, `pnpm test` (`pnpm test:watch` for
  watch mode). Config in `vitest.config.ts` (`vite-tsconfig-paths` so `@/*`
  resolves the same as in the app).

## Known issues

- **The game CDN itself returns 403.** `public/comeon.game-1.1.min.js`
  launches each title from
  `https://d2k3wptpwv4u4d.cloudfront.net/mcasino/quickspin/<code>/index.html`.
  All five of those URLs currently return `403 Request blocked` straight from
  CloudFront:
  ```
  curl -I "https://d2k3wptpwv4u4d.cloudfront.net/mcasino/quickspin/bookofinferno/index.html?moneymode=fun"
  HTTP/2 403
  server: CloudFront
  x-cache: Error from cloudfront
  ```
  This reproduces outside the browser entirely (plain `curl`, no cookies, no
  referer, no app code involved), so it isn't a CORS/referer/integration bug
  on our side — the CDN distribution provided with the assignment is dead or
  has been locked down since the exercise was written. `GameLauncher`
  (`components/game/game-launcher.tsx`) loads the script and calls
  `comeon.game.launch(code)` correctly; the resulting iframe just can't reach
  its content.
  - Not something fixable from the frontend — no code change here can make a
    third-party CDN stop returning 403.
