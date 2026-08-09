# Deployment — Pulse (Fitness Tracker)

Vite + React + react-router SPA. **Local-first** — no backend, no accounts, no API keys. Data lives in the browser (localStorage). Targets: **Vercel** or **Netlify** (static).

## Build / run
| Command | Purpose |
|---------|---------|
| `npm ci` | Clean install |
| `npm run typecheck` | `tsc -b` |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (65 tests) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run check` | All of the above in sequence |

Node: 22+ (CI), verified on 24. Output dir: `dist`.

## Vercel
`vercel.json` is included (framework `vite`, output `dist`, SPA rewrite to `/index.html`). Import the repo — no extra config needed. The rewrite is **required**: the app uses `BrowserRouter`, so deep links like `/exercises` must fall back to `index.html`.

## Netlify
`netlify.toml` is included (build `npm run build`, publish `dist`, SPA 200-redirect fallback). Connect the repo and deploy.

Both hosting configurations set a same-origin Content Security Policy, frame blocking, strict referrer handling, MIME-sniffing protection, and a restrictive browser permissions policy. The theme bootstrap is an external same-origin script, so the policy does not require `unsafe-inline` for scripts. Inline styles remain allowed because the charts and progress components calculate dimensions and colors at runtime.

## Environment variables
None required. `.env.example` only lists *optional future* `VITE_` vars (analytics, remote API). Any `VITE_`-prefixed var is **client-visible** — never put secrets there.

## Known limitations
- All data is local to the browser/device; clearing site data wipes it. Export/import (Settings → Data) is the backup and restore mechanism.
- If browser storage is blocked or full, the app keeps the current session in memory and displays an export warning; closing the tab can still lose unsaved changes.
- Future backup versions are rejected until an explicit migration is implemented.
