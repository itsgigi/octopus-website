# Octopus Website — technical test (Product Engineer, Web)

Demo of two pages of the Octopus consumer-electronics site — **Homepage** and **Product Detail Page (Octopus Countertop Blender)** — fully responsive at 3 breakpoints. Full brief: `docs/brief.pdf`. Design reference (extracted from a view-only Figma, export disabled): **`docs/DESIGN_SYSTEM.md` — read it before building any UI.**

Evaluation weights: design fidelity 25% · responsive behaviour 25% · code quality & components 20% · performance & a11y 15% · tests & docs 15%.

## Stack (decided)

- **Next.js 16** (App Router, Turbopack, `cacheComponents: true`, React Compiler) · **React 19** · **TypeScript strict**
- **Tailwind CSS v4** — CSS-first config, all tokens in `@theme` inside `src/app/globals.css` (no `tailwind.config.js`)
- **pnpm**
- Font: Satoshi Variable self-hosted with `next/font/local` (`src/app/fonts/`)
- Tests: **Vitest + Testing Library** (components) · **Playwright** (e2e Home → PDP). One command: `pnpm test`
- Lint/format: ESLint (flat config) + Prettier (+ `prettier-plugin-tailwindcss`)
- Deploy: Vercel

## Rendering strategy

- Everything is **static at build time**: content comes from local JSON, no per-user data.
- Data access through `src/lib/data/*` functions marked `'use cache'` (Cache Components); swapping JSON for a headless CMS later only changes these functions.
- PDP route `src/app/products/[slug]/page.tsx` with `generateStaticParams` over all products; unknown slug → `notFound()`.
- **Server Components by default.** `'use client'` only for interactive islands: mobile menu, carousel, colour selector, accordion, scroll-reveal, hero video toggle. Keep islands small, pass serialisable props.
- `generateMetadata` per page: title, description, Open Graph.

## Folder structure

```
src/
  app/
    layout.tsx            # html, font, Navbar, Footer, skip link
    page.tsx              # Homepage (composes sections from data)
    products/[slug]/page.tsx
    placeholder/[...slug]/page.tsx   # out-of-scope links land here
    globals.css           # @import "tailwindcss"; @theme tokens
    fonts/
  components/
    ui/                   # primitives: Button, IconButton, Container, Heading, Text, Image, Icon, VisuallyHidden
    layout/               # Navbar, MobileMenu, Footer
    cards/                # ProductCard, CarouselCard, CardLarge, CardMedium, CardSmall, CategoryTile
    sections/             # Hero, BestSellers, CategorySection, Banner, ExploreCategories, FindUsBanner
    product/              # ProductInfo, ColourSelector, Gallery, FeatureBento, SpecsAccordion, Downloads
    carousel/             # Carousel (+ hooks)
    accordion/            # Accordion primitives
    motion/               # Reveal
  data/
    products.json
    categories.json
    pages/home.json       # section order + which product goes where
  lib/
    data/                 # typed loaders ('use cache')
    types.ts              # Product, Category, HomeSection… (zod schemas optional)
    cn.ts                 # clsx + tailwind-merge
  hooks/
tests/
  unit/                   # *.test.tsx (Carousel, Accordion, ColourSelector, MobileMenu)
  e2e/                    # home-to-pdp.spec.ts
docs/
```

## Conventions

- Components: typed props, composition over config, variants via `cva` (or a small typed map) — no duplicated class strings. One component per file, named export.
- **Tokens only**: never hard-code hex/px in components; use the `@theme` tokens (`bg-brand`, `text-ink-muted`, `rounded-card`…). If a value is missing, add a token first.
- Mobile-first Tailwind; breakpoints `md` = 810px, `lg` = 1200px.
- Content lives in `src/data`, never in JSX. Adding a product to `products.json` must be enough for it to appear in the right section.
- Images: `next/image` with explicit aspect ratio (no CLS), `priority` only on LCP, lazy below the fold. Assets are **placeholders with the correct ratio** (Figma export disabled) — one `ProductImage` wrapper so real files can be dropped in `public/images`.
- A11y: semantic landmarks, skip link, visible `:focus-visible` ring (token `--color-focus`), full keyboard support, `aria-expanded/controls`, Escape closes menu, `prefers-reduced-motion` respected, WCAG AA contrast.
- Primary button hover uses `#C2151B` (Figma `#F23F45` fails AA) — documented deviation.
- Navigation collapses into a menu **below 1200px** (brief wins over Figma tablet).
- Carousel: native `scroll-snap` + arrows (disabled at ends) + pagination dots; swipe works natively.

## Workflow

- **Small, meaningful commits** (Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `docs:`). Commit after every working step.
- Before each commit: `pnpm lint && pnpm typecheck && pnpm test:unit`.
- Follow the phases in `docs/PLAN.md`; tick them off there.
- AI cost tracking: at the **start and end of every phase** run `pnpm ai:usage "<phase name>"` — it appends a snapshot to `docs/AI_USAGE.md`. Never print or commit the API key.
- Record in `docs/AI_USAGE.md` → "Corrections" any place where AI output was wrong and had to be rewritten (needed for the README).
