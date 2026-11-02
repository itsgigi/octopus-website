# Octopus Website — technical test

Demo of two pages of the Octopus consumer-electronics site — **Homepage** and **Product Detail Page (Octopus Countertop Blender)** — responsive at three breakpoints (mobile < 810, tablet 810–1199, desktop ≥ 1200).

**Live:** https://octopus-website-phi.vercel.app · [Homepage](https://octopus-website-phi.vercel.app) · [PDP — Octopus Countertop Blender](https://octopus-website-phi.vercel.app/products/octopus-countertop-blender)

**Lighthouse on the live site: 100 / 100 / 100 / 100 on both pages, desktop and mobile** (PageSpeed Insights: [homepage](https://pagespeed.web.dev/analysis/https-octopus-website-phi-vercel-app/6uao75nz92?form_factor=mobile) · [PDP](https://pagespeed.web.dev/analysis/https-octopus-website-phi-vercel-app-products-octopus-countertop-blender/5not43ysej?form_factor=mobile); details in [Lighthouse](#lighthouse)).

## Constraints

**No editor access to the Figma file.** The file was shared view-only with export disabled, so I couldn't download any asset or use Dev Mode to inspect exact values. To get as close to pixel-perfect as possible:

- Every value (sizes, spacing, type scale, colours) was read by hand from the properties panel and recorded in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).
- The images started as screenshots of the Figma frames, with the frame's own text and buttons removed and the background rebuilt. The company later sent the official assets, which replaced most of them; the rest are still screenshots (see [Assets](#assets)).

**This raised the AI cost.** Ingesting the design as screenshots, comparing the build against them and processing the images took far more AI work than reading a Dev Mode spec and exporting assets would have. I went over the AI budget the company offered, and chose to for two reasons:

1. The budget wasn't a hard limit, so I didn't treat staying inside it as a requirement.
2. I could have spent less by doing more of this work by hand. Given point 1, I chose to keep using AI to move faster, since the total cost of the build stays low anyway (breakdown in [AI usage & costs](#ai-usage--costs)).

## Quick start

```bash
pnpm install
pnpm exec playwright install chromium webkit firefox   # first time only, for e2e
pnpm dev                                        # http://localhost:3000
pnpm test                                       # unit (Vitest) + e2e (Playwright)
```

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

## Architecture

```
src/
  app/
    globals.css         # design tokens (@theme) — the only place colours, type, radius… are defined
    layout.tsx          # html, Satoshi font, default metadata
    styleguide/         # internal page: all primitives × all states
    placeholder/[...slug]/ # landing page for out-of-scope links (noindex)
    fonts/              # Satoshi-Variable.woff2 + licence
  components/ui/        # primitives (below)
  components/layout/    # Navbar (server) · MobileMenu (client island) · Footer · SkipLink
  hooks/                # useFocusTrap
  data/                 # products.json · categories.json · pages/home.json — all site content
  lib/
    types.ts            # zod schemas → inferred TS types (Product, Category, HomeSection…)
    data/               # 'use cache' loaders: products, categories, home (+ image fallback)
    cn.ts               # clsx + tailwind-merge aware of the custom tokens
tests/unit · tests/e2e
docs/                   # brief, design system, plan, decisions, AI usage
```

**Rendering:** everything is static at build time (content comes from local JSON). Server Components by default; `'use client'` only for small interactive islands (menu, carousel, colour selector, accordion).

<details>
<summary><h3>Data layer</h3></summary>
<br>

- **Content lives only in `src/data`.** `home.json` is an ordered list of typed sections (hero, best-sellers, category, banner, explore-categories, find-us) that reference products by slug.
- **Validated at build time.** zod parses every JSON file when its loader loads. A wrong category, a duplicate slug or a `home.json` reference to a missing product fails `next build` instead of shipping a broken page. The TS types are inferred from the same schemas.
- **CMS-ready seam.** Pages only call async `'use cache'` functions (`getHomePage`, `getProduct`, `getBestSellers`, `getFeaturedProducts`…). Replacing the JSON with a headless CMS changes these function bodies, not the components.
- **Placement from data.** `featured: n` puts a product in its category section (the first one is the large card); `bestSeller` + `bestSellerRank` drive the carousels. Adding a product to `products.json` is enough for it to appear.
- **Images:** paths are in the JSON. The loader keeps a path only if the file exists in `/public`, so dropping real assets into `public/images` replaces the placeholders with no code change.

</details>

<details>
<summary><h3>Design tokens</h3></summary>
<br>

`src/app/globals.css` → `@theme` (from `docs/DESIGN_SYSTEM.md` §12). Components never hard-code hex or px values; they use utilities such as `bg-brand`, `text-ink-muted`, `text-h2` and `rounded-card`.

- **Breakpoints** `md` 810 · `lg` 1200 (the Tailwind defaults are removed so nobody can use `sm`/`xl` by mistake).
- **Fluid type in two segments:** each heading interpolates 402→810 and 810→1200, so it matches Figma _exactly_ at the three frame widths and scales smoothly in between (verified in the browser: 48/40/28 px at 810, 60/44/32 px at 1200).
- **Responsive radius:** `--radius-card` is 16 on mobile and 24 from tablet up, changed in one place.
- **Focus:** a visible 2 px outline on every `:focus-visible`, white on red or dark surfaces.

</details>

<details>
<summary><h3>Layout shell</h3></summary>
<br>

- **Navbar**: a fixed glass pill (`bg-nav` + `backdrop-blur-nav` + `shadow-nav`), rendered as a Server Component. From 1200px it shows the full links and the "Where to buy" button.
- **MobileMenu** (below 1200px) is the only client code in the shell. It uses the disclosure pattern (`aria-expanded` + `aria-controls`) and handles focus trap, Escape (focus returns to the toggle), outside click, link click and route change. The page scroll lock is pure CSS (`html:has([data-scroll-lock])`, below `lg` only).
- **Footer**: the link columns come from `navigation.json` ("Our Products" splits into two sub-columns from tablet). Stacked on mobile.
- **Skip link** to a focusable `<main>`; every out-of-scope link goes to `/placeholder/*`, which is prerendered from the links found in the data.

</details>

<details>
<summary><h3>Homepage</h3></summary>
<br>

`app/page.tsx` maps the resolved `home.json` sections to section components (`Hero`, `BestSellers`, `CategorySection`, `Banner`, `ExploreCategories`, `FindUsBanner`); reordering or removing sections is a JSON change.

- **Carousel** (client): native `scroll-snap` gives swipe and trackpad support with no library. Arrows are disabled at the ends and follow native scrolling (no pagination dots, as in Figma), and the track is a focusable region with `aria-roledescription` carousel and slide.
- **Category bentos:** three layouts (`large-first`, `large-side`, `small-row`). The first `featured` product becomes the large card, the others flow into the grid.
- **Cards** share one `CardContent` block; every "Learn more" link has an sr-only "about {product}" so link names are unique.
- **Hero:** the poster is the LCP image (`priority`); the video loads client-side, muted, with a pause button, and is skipped with `prefers-reduced-motion`.

</details>

<details>
<summary><h3>Product Detail Page</h3></summary>
<br>

`app/products/[slug]/page.tsx` prerenders every product (`generateStaticParams`), returns `notFound()` for unknown slugs and builds title, description and Open Graph from the data.

- **One grid, two layouts:** CSS `order` gives image → info → gallery on mobile; from tablet the Figma two-column layout, gallery 709fr + sticky info 555fr (gap 40 on tablet, 80 on desktop). In the narrower tablet column the wide feature cards stack their text above the photo.
- **ColourSelector** (client): native radios styled as swatches, so arrow keys and announcements come from the platform. The legend reads "Colour - {selected}".
- **Accordion** (client): each section toggles on its own (heading > button, `aria-expanded`/`aria-controls`, labelled region). Closed panels are `inert`, and the height animates with `grid-rows`. Used for the three spec sections; Downloads is a static box next to it, as in Figma.
- **Best sellers:** the same `Carousel` with `ProductCard`s, 2 / 3 / 5 visible; Next stops at the last reachable position. On mobile "Where to buy" becomes a sticky bottom bar.

</details>

## Assets

**Official assets** (delivered by the company after the first deploy): all 16 product photos, the four Explore tiles, the logo in every variant, and the hair care and find-us banners at high resolution. Each banner has its own crop per breakpoint, set in `home.json` (`imageTablet`, `imageMobile`), and the browser only downloads the one it shows. Hi-res masters are re-encoded to JPEG, so the banners weigh 64–256 KB each. The logo is inlined as SVG paths, so it takes its colour from `currentColor`.

**Still taken from Figma screenshots** (not in the delivery): the hero video and poster, the kettle and indoor camera large cards, the Countertop Blender's lifestyle and feature photos, and The Warehouse lockup. They're softer when enlarged; where a screenshot had the frame's text or buttons baked in, I removed them and rebuilt the background. Replacing the files in `public/images` is enough to upgrade them. Details per asset are in [`docs/DECISIONS.md`](docs/DECISIONS.md).

**Delivered but unused:** the Kitchen, Home Security and Accessories category banners, a family photo and a phone mockup. None of them appears in the two pages of the Figma flows.

**Placeholders:** only the PDP photos of products other than the Countertop Blender, which the brief doesn't ask for. Their pages use a neutral box with the correct ratio. Raw captures are git-ignored.

## Tests & quality

`pnpm test` runs everything: **44 unit tests** (Vitest) and then **e2e** (Playwright on a production build).

| Suite                                              | What it proves                                                                                                                         |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `Carousel` (unit)                                  | Arrows disabled at start and end, follow native scroll, stop at the last reachable position, no dots, slide semantics, focusable track |
| `Accordion` (unit)                                 | `aria-expanded`/`aria-controls`, labelled region, inert when closed, independent toggles, keyboard                                     |
| `ColourSelector` (unit)                            | Radio group, label shows the selected colour, arrow keys move the selection                                                            |
| `MobileMenu` (unit)                                | Open/close, Escape returns focus, focus trap, closes on link, route change and outside click                                           |
| `Reveal`, `Button`, `Heading`, data loaders (unit) | Reveal fires once; link vs button; heading level vs size; slugs unique, categories valid, home references resolve                      |
| `home-to-pdp` (e2e)                                | Home → "Learn more" on the Countertop Blender → PDP title, colour change, specs accordion; carousel ends                               |
| `responsive` (e2e)                                 | No horizontal scroll on both pages at 360, 402, 640, 809, 810, 1024, 1199, 1200, 1440, 1600 and 1920 px                                |
| `a11y` (e2e)                                       | axe WCAG 2.0–2.2 A/AA on both pages; skip link is the first stop and focuses `<main>`                                                  |
| `smoke` (e2e)                                      | Shell landmarks; menu below 1200px opens and closes on Escape                                                                          |

The e2e suites run on **Chrome, Firefox, desktop Safari, iPhone 15 (WebKit) and Pixel 7 (Chromium)**; Edge is Chromium. These are engine emulations, not real devices.

### Lighthouse

Measured on the **live Vercel deployment** with Lighthouse 13.6 (simulated throttling), real assets included.

| Homepage — desktop                                                             | Homepage — mobile                                                            |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| ![Lighthouse desktop: 100 in every category](docs/lighthouse/home-desktop.png) | ![Lighthouse mobile: 100 in every category](docs/lighthouse/home-mobile.png) |

| PDP — desktop                                                                     | PDP — mobile                                                                    |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| ![Lighthouse PDP desktop: 100 in every category](docs/lighthouse/pdp-desktop.png) | ![Lighthouse PDP mobile: 100 in every category](docs/lighthouse/pdp-mobile.png) |

| Page     | Device  | Performance | Accessibility | Best Practices | SEO | LCP   | CLS | TBT   | Weight  |
| -------- | ------- | ----------- | ------------- | -------------- | --- | ----- | --- | ----- | ------- |
| Homepage | Desktop | 100         | 100           | 100            | 100 | 0.5 s | 0   | 0 ms  | 604 KiB |
| Homepage | Mobile  | 100         | 100           | 100            | 100 | 1.2 s | 0   | 10 ms | 585 KiB |
| PDP      | Desktop | 100         | 100           | 100            | 100 | 0.4 s | 0   | 0 ms  | 343 KiB |
| PDP      | Mobile  | 100         | 100           | 100            | 100 | 1.7 s | 0   | 10 ms | 349 KiB |

Live reports: PageSpeed Insights [homepage](https://pagespeed.web.dev/analysis/https-octopus-website-phi-vercel-app/6uao75nz92?form_factor=mobile) · [PDP](https://pagespeed.web.dev/analysis/https-octopus-website-phi-vercel-app-products-octopus-countertop-blender/5not43ysej?form_factor=mobile).

The table was re-measured with the Lighthouse CLI after the official assets went live; the screenshots and PageSpeed links are from the deployment just before them, with the same scores. Reports: [`docs/lighthouse/`](docs/lighthouse/) (HTML + JSON per page and device). `next/image` serves AVIF/WebP at the right `sizes`, below-the-fold images are lazy, the hero poster is the LCP and the video loads after it.

## Progress

| Phase                   | Status | What & why                                                                                                                                                                                        | AI cost       |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| 0 — Scaffold            | ✅     | Next 16 + Tailwind 4 + strict TS, Prettier, Vitest, Playwright, folder structure. Small commits per step, so the history can be reviewed                                                          | $0.99         |
| 1 — Tokens & primitives | ✅     | `@theme` tokens, Satoshi, UI primitives (`src/components/ui`), logo + favicon, `/styleguide`. Tokens first so every later component is token-only and consistent                                  | $1.66         |
| 2 — Data layer          | ✅     | zod-validated JSON (16 products, 4 categories, home sections) + cached loaders. Data first so pages are pure composition and the CMS swap is one layer                                            | $1.02         |
| 3 — Layout shell        | ✅     | Floating navbar, accessible mobile menu below 1200px (focus trap, Escape, closes on route change), data-driven footer, skip link, placeholder route. Shared by both pages, so built before them   | $1.49         |
| 4 — Homepage            | ✅     | Hero (poster as LCP, optional video + pause), scroll-snap carousel, three category bentos, hair care and find-us banners, explore tiles — all composed from `home.json`                           | $2.18         |
| 5 — PDP                 | ✅     | `products/[slug]` with static params + OG, sticky product info, native-radio colour selector, feature bento, accessible specs accordion + downloads box, 2/3/5-up best sellers, mobile sticky CTA | $1.25         |
| 6 — Motion & polish     | ✅     | CSS scroll reveal with one shared IntersectionObserver (DS §8 timings, reduced-motion = fade only, visible without JS), image fade-in for real assets. LCP content is never animated              | subscription² |
| 7 — Quality             | ✅     | e2e Home → PDP on 5 browser projects, no-overflow sweep at 11 widths, axe WCAG 2.2 AA, Lighthouse reports. Fixed the duplicate carousel landmark and two generic link names it surfaced           | subscription  |
| 8 — Ship                | ✅     | Public GitHub repo (raw captures purged from history first), Vercel deploy, Lighthouse on the live site, final README                                                                             | subscription  |

Detailed checklist: [`docs/PLAN.md`](docs/PLAN.md).

## Assumptions & trade-offs

Full lists: [`docs/DECISIONS.md`](docs/DECISIONS.md) (implementation) and [`docs/DESIGN_SYSTEM.md` §11](docs/DESIGN_SYSTEM.md) (Figma vs brief). Highlights:

- **The Figma file is view-only with export disabled.** Values were read by hand from the properties panel. Most images are now the official assets; the ones that weren't delivered are still screenshots (see [Assets](#assets)).
- **Navigation collapses below 1200 px** (brief) even though the Figma tablet frame shows inline links.
- **Best sellers carousel without pagination dots.** The brief (requirement 3) asks for dots on desktop, but the Figma frames have none; I followed Figma. The carousel still has arrows (disabled at the ends), native swipe and a keyboard-scrollable track.
- **Downloads is a static box, not an accordion item.** The brief (requirement 8) lists it with the collapsible spec sections; Figma draws it as a separate box with the file link always visible, so there is nothing to expand. I followed Figma; the three spec sections are the accessible accordion.
- **Primary hover is `#C2151B`** instead of Figma's `#F23F45`: white on `#F23F45` is 3.8:1 and fails WCAG AA.
- **Hero video has a pause button** that isn't in Figma: an autoplaying loop longer than 5 s needs a way to stop it (WCAG 2.2.2, level A). It's a real `<button>` with an accessible label and the focus ring; with `prefers-reduced-motion` the video doesn't play at all and the poster stays.
- **Focus ring:** the Figma ring (35% alpha blue) is about 1.6:1 on white and fails WCAG 1.4.11, so the outline uses the same blue, fully opaque.
- **Body line-height is 1.3** instead of Figma's 100% for multi-line copy (readability).
- **The `/styleguide` page ships to production** with `noindex`, for use during the review call.
- **Data shape adapted from the brief:** specs are `{ label, value }` pairs (rendered as `<dl>`), and products gain `description`, `lifestyleImages`, `features`, `downloads`, `featured` and `bestSellerRank`.
- **Two best-seller lists:** the home carousel shows three editorial picks from `home.json`; the PDP shows every best seller by rank except the current product (Figma shows different sets).
- **Placeholder content:** Figma truncates some blender specs (dimensions, weight, "In the box") and only shows a Black swatch, so these values and the Silver/Red colours are plausible placeholders.

## AI usage & costs

**Tools**

- **Claude Code** (VS Code extension): scaffolding, all code, tests and docs, one session per phase following [`docs/PLAN.md`](docs/PLAN.md). Phases 0–5 (and the start of 6) ran through **OpenRouter** on the key provided for the test; from phase 6 on, my own **Claude subscription**.
- **Claude (claude.ai)**: reading the view-only Figma into [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) and preparing the project setup. Not billed to the key.

**How costs are tracked:** `pnpm ai:usage` reads the key's `usage` from OpenRouter at the start and end of each phase and appends a row to [`docs/AI_USAGE.md`](docs/AI_USAGE.md). The key is never printed or committed.

| Phase                            | Cost (USD) | Cumulative |
| -------------------------------- | ---------- | ---------- |
| 0 — Scaffold                     | 0.99       | 0.99       |
| 1 — Tokens & primitives          | 1.66       | 2.65       |
| README set-up                    | 0.20       | 2.85       |
| 2 — Data layer                   | 1.02       | 3.87       |
| Phase 2 wrap-up (docs, summary)  | 0.32       | 4.19       |
| 3 — Layout shell                 | 1.49       | 5.68       |
| Phase 3 wrap-up (docs, summary)¹ | 1.49       | 7.17       |
| 4 — Homepage                     | 2.18       | 9.35       |
| Phase 4 wrap-up (docs, summary)  | 0.34       | 9.69       |
| 5 — PDP                          | 1.25       | 10.93      |
| Phase 5 wrap-up + phase 6 start  | 0.36       | 11.30      |

¹ Same delta as the previous phase; OpenRouter usage can lag by a few minutes, so the split between adjacent rows is approximate (the totals are exact).

² **Switch to the subscription.** During phase 6 the key hit its spend limit: OpenRouter returned `402`, because Claude Code requests up to 128k output tokens per call and the remaining budget covered less. Instead of asking for a higher limit mid-test, I moved Claude Code to my own Claude subscription, which isn't billed per request, so there are no USD figures from phase 6 on. Takeaway: on a key with a hard limit, cap `CLAUDE_CODE_MAX_OUTPUT_TOKENS`. **Key-billed total for scaffold → PDP: about $11.30.**

**Where the AI output was wrong** (full list in [`docs/AI_USAGE.md` → Corrections](docs/AI_USAGE.md)):

- The planned `create-next-app _app` was rejected by npm naming rules, so the scaffold went in a subfolder.
- It aimed for TypeScript 7 (latest), which the lint toolchain doesn't support, so it was pinned to 6.0.3.
- The fluid type formulas in the AI-written design system missed the Figma sizes (54 instead of 60 px at 1200) and were recomputed.
- It typed `Text` props too narrowly and used `Heading as="p"`; both were caught by `tsc` and fixed.
- An outdated smoke e2e test failed on WebKit once the homepage became an empty shell, and the mobile menu links were misaligned with the logo; the browser check caught both.
- Homepage: sr-only text inside carousel slides widened the mobile page by 364px; the Container put the gutter inside the 1344 max-width (content 1248 instead of 1344); a light placeholder hid the white text on the red banner. All three were found by measuring in the browser.
- PDP: the carousel showed one dot per slide, so with 5 of 6 cards visible most dots could never be reached; fixed and unit-tested.
- Quality pass: the carousel duplicated the "Best sellers" landmark, the hero and banner "Learn more" links lacked a product name, and a first e2e draft force-checked a visually hidden radio. Fixed after the e2e, axe and Lighthouse runs surfaced them.
- Assets: real images exposed two bugs the placeholders had hidden. Images that loaded before hydration stayed at opacity 0 (the `onLoad` handler was never called), and the `Container` shrank inside flex columns, which put the banner text over the photo. Both were found in the browser, then fixed and regression-tested. Separately, a `git add -A` swept the raw screenshots and the 19 MB recording into an unrelated commit.
- A shell redaction command didn't work on macOS and echoed a secret into the local session. Separately, an example config in `docs/` contained a real key. Both were caught before the first commit and the key was flagged for rotation.

## What I'd do with more time

- **The remaining assets.** Source files for the hero video, the two lifestyle cards and the blender's PDP photos would replace the last screenshots, with no code change.
- **Art direction with `<picture>`.** The hair care banner switches photos by rendering two `next/image`s and hiding one per breakpoint (the hidden one is lazy, so it is never downloaded). `getImageProps` with a `<picture>` would give the browser a single element and one decision.
- **CI.** Run lint, typecheck, unit tests and the Playwright matrix on every pull request in GitHub Actions, and add Lighthouse CI with budgets so performance can't regress silently.
- **Visual regression.** Add Playwright screenshot tests per breakpoint. Most of the late fixes were visual details found by comparing against Figma by eye, so a baseline would catch them earlier.
- **Headless CMS.** Swap the JSON for a CMS behind the same `src/lib/data/*` functions, with on-demand revalidation through cache tags instead of build-time only.
- **Colour variants.** Show a product photo per colour, so the swatch changes the gallery and not only the label.
