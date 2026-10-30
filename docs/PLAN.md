# Build plan

Each phase = one Claude Code session/prompt + several small commits.
Track cost: `pnpm ai:usage "<phase> start"` before, `pnpm ai:usage "<phase> end"` after. (Phase 0: run `node scripts/ai-usage.mjs` directly, package.json doesn't exist yet.)

## Phase 0 — Scaffold
- [x] `git init`, first commit with `CLAUDE.md`, `docs/`, `scripts/`, `.gitignore`
- [x] Scaffold Next.js in a temp dir (create-next-app refuses a folder that already contains files) and move it up:
  `pnpm create next-app@latest _app --ts --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*" --use-pnpm` → move contents of `_app/` to root, merge `.gitignore`
- [x] `next.config.ts`: `cacheComponents: true`, `reactCompiler: true`, `images.formats: ['image/avif','image/webp']`
- [x] TypeScript strict + `noUncheckedIndexedAccess`; Prettier + tailwind plugin; scripts `lint`, `typecheck`, `test`, `test:unit`, `test:e2e`, `ai:usage`
- [x] Vitest + Testing Library + jsdom; Playwright (chromium + mobile Safari project)
- [x] Folder structure from `CLAUDE.md`

> Prompt: *"Read CLAUDE.md and docs/PLAN.md. Do Phase 0. Verify the latest stable versions of next, react, tailwindcss before installing. Commit after each bullet."*

## Phase 1 — Design tokens & primitives
- [x] `globals.css`: `@theme` tokens from `docs/DESIGN_SYSTEM.md` §12 (colours, fluid type, radius, shadow, breakpoints 810/1200, container 1344)
- [x] Satoshi Variable via `next/font/local` (download WOFF2 from Fontshare into `src/app/fonts/`)
- [x] `Container`, `Heading` (display/h2/h3, `as` prop), `Text`, `Button` (primary/secondary/ghost/ghost-inverse, link or button, sizes), `IconButton`, `Icon` (chevrons, menu, close, download, play), `ProductImage` placeholder
- [x] Logo SVG (mark + wordmark, approximated), favicon
- [x] A dev-only `/styleguide` page rendering all primitives (handy for the review call; `robots: noindex`)

## Phase 2 — Data layer
- [x] `src/lib/types.ts` (Product per brief shape + `images`, `features`, `downloads`; Category; HomePage sections)
- [x] `products.json` (16 products, §9.2), `categories.json`, `pages/home.json` (§9.3)
- [x] Loaders in `src/lib/data` with `'use cache'`; unit test: every slug unique, every product in a valid category

## Phase 3 — Layout shell
- [x] Navbar (floating glass pill), MobileMenu < 1200px (button with `aria-expanded`, focus trap, Escape closes, closes on route change, body scroll lock)
- [x] Footer (3 layouts), skip link, placeholder route for out-of-scope links
- [x] Tests: MobileMenu open/close/Escape

## Phase 4 — Homepage
- [x] Hero (poster as LCP + lazy muted video + play/pause), BestSellers (Carousel + CarouselCard), CategorySection (bento variants: kitchen / security / accessories), Banner, ExploreCategories, FindUsBanner
- [x] Generic `Carousel` (scroll-snap, arrows disabled at ends, dots, keyboard, `aria-roledescription="carousel"`)
- [x] Tests: Carousel arrows/dots/disabled states
- [x] Check at 375 / 810 / 1024 / 1200 / 1440 / 1600 — no horizontal scroll (automated: `tests/e2e/responsive.spec.ts`, 11 widths)

## Phase 5 — Product Detail Page
- [x] `products/[slug]` + `generateStaticParams` + `generateMetadata` (OG)
- [x] ProductInfo (sticky on desktop), ColourSelector (radiogroup, arrow keys), Gallery, FeatureBento, SpecsAccordion, Downloads, Best sellers (ProductCard carousel), sticky mobile CTA
- [x] Tests: Accordion (toggle, aria), ColourSelector (selection updates label)

## Phase 6 — Motion & polish
- [x] `Reveal` (IntersectionObserver, 60px/1.2s ease-out, once, reduced-motion = opacity only)
- [x] Hover/focus states, image fade-in

## Phase 7 — Quality
- [x] e2e: Home → "Learn more" on Countertop Blender → PDP (title visible, colour change, accordion)
- [x] Lighthouse mobile ≥ 90 Performance & Accessibility on both pages → save reports in `docs/lighthouse/`
- [x] axe check, keyboard pass, cross-browser smoke test

## Phase 8 — Ship
- [ ] Deploy to Vercel, add URL to README
- [ ] README: setup, architecture, components, trade-offs, Lighthouse results, **AI usage & costs** (from `docs/AI_USAGE.md`), what I'd do with more time
