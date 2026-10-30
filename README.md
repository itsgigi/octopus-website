# Octopus Website — technical test

Demo of two pages of the Octopus consumer-electronics site — **Homepage** and **Product Detail Page (Octopus Countertop Blender)** — responsive at three breakpoints (mobile < 810, tablet 810–1199, desktop ≥ 1200).

> **Status: in progress.** This README is updated at the end of every phase: what was done, why, and what it cost in AI usage. Live URL and Lighthouse reports land in Phase 7–8.

## Quick start

```bash
pnpm install
pnpm exec playwright install chromium webkit   # first time only, for e2e
pnpm dev                                        # http://localhost:3000
```

| Script                                         | What it does                                                                                                                                                                |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev` / `pnpm build` / `pnpm start`       | Next.js dev server / production build / serve the build                                                                                                                     |
| `pnpm lint` · `pnpm typecheck` · `pnpm format` | ESLint · route typegen + `tsc --noEmit` · Prettier                                                                                                                          |
| `pnpm test`                                    | **All tests in one command**: unit (Vitest), then e2e (Playwright on a production build)                                                                                    |
| `pnpm test:unit` · `pnpm test:e2e`             | Each suite on its own                                                                                                                                                       |
| `pnpm ai:usage "<label>"`                      | Snapshot of AI spend appended to `docs/AI_USAGE.md` (needs an OpenRouter key in `.claude/settings.local.json`, git-ignored — see `docs/claude-settings.local.example.json`) |

Useful routes: `/` (homepage), `/styleguide` (every token and primitive in every state, `noindex`).

## Stack

|                                                                   | Version               | Why                                                                             |
| ----------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------- |
| Next.js (App Router, Turbopack, Cache Components, React Compiler) | 16.4.3                | Preferred by the brief; static generation fits content that comes from JSON     |
| React / React DOM                                                 | 19.3.1                |                                                                                 |
| Tailwind CSS (CSS-first `@theme`)                                 | 4.3.3                 | Tokens defined once, in CSS, with no JS config                                  |
| TypeScript (strict + `noUncheckedIndexedAccess`)                  | 6.0.3                 | Not 7.x: `typescript-eslint` doesn't support it yet                             |
| Vitest + Testing Library + jsdom                                  | 5.0.5                 | Fast component tests                                                            |
| Playwright (chromium + mobile Safari)                             | 1.64.1                | e2e Home → PDP on desktop and touch                                             |
| `class-variance-authority`, `clsx`, `tailwind-merge`              | 0.7.1 · 2.1.1 · 3.7.0 | Typed variants with no duplicated class strings                                 |
| Font: Satoshi Variable (Fontshare, ITF FFL)                       | —                     | The Figma typeface, self-hosted with `next/font/local` (no third-party request) |

Versions were checked with `npm view` on 2026-10-30 and are the latest stable releases, except where noted.

## Architecture (so far)

```
src/
  app/
    globals.css         # design tokens (@theme) — the only place colours, type, radius… are defined
    layout.tsx          # html, Satoshi font, default metadata
    styleguide/         # internal page: all primitives × all states
    fonts/              # Satoshi-Variable.woff2 + licence
  components/ui/        # primitives (below)
  data/                 # products.json · categories.json · pages/home.json — all site content
  lib/
    types.ts            # zod schemas → inferred TS types (Product, Category, HomeSection…)
    data/               # 'use cache' loaders: products, categories, home (+ image fallback)
    cn.ts               # clsx + tailwind-merge aware of the custom tokens
tests/unit · tests/e2e
docs/                   # brief, design system, plan, decisions, AI usage
```

**Rendering:** everything is static at build time (content comes from local JSON). Server Components by default; `'use client'` only for small interactive islands (menu, carousel, colour selector, accordion).

### Data layer

- **Content lives only in `src/data`.** `home.json` is an ordered list of typed sections (hero, best-sellers, category, banner, explore-categories, find-us) that reference products by slug.
- **Validated at build time.** zod parses every JSON file when its loader loads. A wrong category, a duplicate slug or a `home.json` reference to a missing product fails `next build` instead of shipping a broken page. The TS types are inferred from the same schemas.
- **CMS-ready seam.** Pages only call async `'use cache'` functions (`getHomePage`, `getProduct`, `getBestSellers`, `getFeaturedProducts`…). Replacing the JSON with a headless CMS changes these function bodies, not the components.
- **Placement from data.** `featured: n` puts a product in its category section (the first one is the large card); `bestSeller` + `bestSellerRank` drive the carousels. Adding a product to `products.json` is enough for it to appear.
- **Images:** paths are in the JSON. The loader keeps a path only if the file exists in `/public`, so dropping real assets into `public/images` replaces the placeholders with no code change.

### Design tokens

`src/app/globals.css` → `@theme` (from `docs/DESIGN_SYSTEM.md` §12). Components never hard-code hex or px values; they use utilities such as `bg-brand`, `text-ink-muted`, `text-h2` and `rounded-card`.

- **Breakpoints** `md` 810 · `lg` 1200 (the Tailwind defaults are removed so nobody can use `sm`/`xl` by mistake).
- **Fluid type in two segments:** each heading interpolates 402→810 and 810→1200, so it matches Figma _exactly_ at the three frame widths and scales smoothly in between (verified in the browser: 48/40/28 px at 810, 60/44/32 px at 1200).
- **Responsive radius:** `--radius-card` is 16 on mobile and 24 from tablet up, changed in one place.
- **Focus:** a visible 2 px outline on every `:focus-visible`, white on red or dark surfaces.

### UI primitives (`src/components/ui`)

| Component        | Notes                                                                                                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`         | Renders a `next/link` when `href` is set, otherwise a `<button>` (type-safe union). Variants `primary · secondary · ghost · ghost-inverse`, sizes `sm · md (40, Figma) · lg`, `fullWidth`, leading/trailing icon |
| `IconButton`     | 40 px circle, **required** `label` → `aria-label`. Shares one `cva` definition with `Button`                                                                                                                     |
| `Heading`        | Semantic level (`as="h1"`) independent of visual size (`size="h3"`)                                                                                                                                              |
| `Text`           | Sizes subtitle → tiny, tones default / muted / accent / inverse                                                                                                                                                  |
| `Container`      | Max 1344, gutters 16 / 32 / 48                                                                                                                                                                                   |
| `Icon`           | Inline SVG set (chevrons, menu, close, download, play/pause, arrow), `currentColor`, hidden from assistive tech unless it has a `title`                                                                          |
| `ProductImage`   | Single wrapper for every content image: reserves the slot's aspect ratio (no CLS), renders `next/image` when a file exists, otherwise a neutral placeholder                                                      |
| `Logo`           | Mark + wordmark (full / stacked / mark-only), accessible name "Octopus"                                                                                                                                          |
| `VisuallyHidden` | Screen-reader-only text                                                                                                                                                                                          |

## Progress

| Phase                   | Status | What & why                                                                                                                                             | AI cost |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| 0 — Scaffold            | ✅     | Next 16 + Tailwind 4 + strict TS, Prettier, Vitest, Playwright, folder structure. Small commits per step, so the history can be reviewed               | $0.99   |
| 1 — Tokens & primitives | ✅     | `@theme` tokens, Satoshi, the primitives above, logo + favicon, `/styleguide`. Tokens first so every later component is token-only and consistent      | $1.66   |
| 2 — Data layer          | ✅     | zod-validated JSON (16 products, 4 categories, home sections) + cached loaders. Data first so pages are pure composition and the CMS swap is one layer | $1.02   |
| 3 — Layout shell        | ⏳     | Navbar + mobile menu, footer, skip link                                                                                                                | —       |
| 4 — Homepage            | ⏳     | Hero, carousel, category bentos, banners                                                                                                               | —       |
| 5 — PDP                 | ⏳     | Product info, colour selector, gallery, accordion                                                                                                      | —       |
| 6 — Motion & polish     | ⏳     | Scroll reveal, hover states                                                                                                                            | —       |
| 7 — Quality             | ⏳     | e2e, Lighthouse ≥ 90, axe                                                                                                                              | —       |
| 8 — Ship                | ⏳     | Vercel deploy, final README                                                                                                                            | —       |

Detailed checklist: [`docs/PLAN.md`](docs/PLAN.md).

## Assumptions & trade-offs

Full lists: [`docs/DECISIONS.md`](docs/DECISIONS.md) (implementation) and [`docs/DESIGN_SYSTEM.md` §11](docs/DESIGN_SYSTEM.md) (Figma vs brief). Highlights:

- **The Figma file is view-only with export disabled.** Values were read by hand from the properties panel. Images use placeholders with the correct ratio, and the logo is an approximated SVG.
- **Navigation collapses below 1200 px** (brief) even though the Figma tablet frame shows inline links.
- **Primary hover is `#C2151B`** instead of Figma's `#F23F45`: white on `#F23F45` is 3.8:1 and fails WCAG AA.
- **Focus ring:** the Figma ring (35% alpha blue) is about 1.6:1 on white and fails WCAG 1.4.11, so the outline uses the same blue, fully opaque.
- **Body line-height is 1.3** instead of Figma's 100% for multi-line copy (readability).
- **The `/styleguide` page ships to production** with `noindex`, for use during the review call.
- **Data shape adapted from the brief:** specs are `{ label, value }` pairs (rendered as `<dl>`), and products gain `description`, `lifestyleImages`, `features`, `downloads`, `featured` and `bestSellerRank`.
- **Two best-seller lists:** the home carousel shows three editorial picks from `home.json`; the PDP shows every best seller by rank except the current product (Figma shows different sets).
- **Placeholder content:** Figma truncates some blender specs (dimensions, weight, "In the box") and only shows a Black swatch, so these values and the Silver/Red colours are plausible placeholders.

## AI usage & costs

**Tools**

- **Claude Code** (CLI) through **OpenRouter**, with the key provided for the test: scaffolding, all code, tests and docs, in one session per phase following [`docs/PLAN.md`](docs/PLAN.md).
- **Claude (claude.ai)**: reading the view-only Figma into [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) and preparing the project setup. Not billed to the key.

**How costs are tracked:** `pnpm ai:usage` reads the key's `usage` from OpenRouter at the start and end of each phase and appends a row to [`docs/AI_USAGE.md`](docs/AI_USAGE.md). The key is never printed or committed.

| Phase                   | Cost (USD) | Cumulative |
| ----------------------- | ---------- | ---------- |
| 0 — Scaffold            | 0.99       | 0.99       |
| 1 — Tokens & primitives | 1.66       | 2.65       |
| README set-up           | 0.20       | 2.85       |
| 2 — Data layer          | 1.02       | 3.87       |

**Where the AI output was wrong** (full list in [`docs/AI_USAGE.md` → Corrections](docs/AI_USAGE.md)):

- The planned `create-next-app _app` was rejected by npm naming rules, so the scaffold went in a subfolder.
- It aimed for TypeScript 7 (latest), which the lint toolchain doesn't support, so it was pinned to 6.0.3.
- The fluid type formulas in the AI-written design system missed the Figma sizes (54 instead of 60 px at 1200) and were recomputed.
- It typed `Text` props too narrowly and used `Heading as="p"`; both were caught by `tsc` and fixed.
- A shell redaction command didn't work on macOS and echoed a secret into the local session. Separately, an example config in `docs/` contained a real key. Both were caught before the first commit and the key was flagged for rotation.

## What I'd do with more time

_To be completed at the end of the project._
