# Decisions

Ambiguities in the brief / design system and the option chosen. Design-level discrepancies (Figma vs brief) are in `DESIGN_SYSTEM.md` §11; this file covers implementation choices.

| # | Topic | Decision | Why |
|---|---|---|---|
| 1 | Scaffold folder | `create-next-app` was run in `_app/octopus-website/`, not `_app/` | npm package names cannot start with `_`, so `_app` is rejected as a project name |
| 2 | TypeScript version | **6.0.3** instead of latest 7.0.2 | `typescript-eslint` (used by `eslint-config-next`) peers on `typescript <6.1.0`; TS 7 would break lint |
| 3 | ESLint version | stay on **9.x** (scaffold default) instead of 10.x | `eslint-config-next` 16.4 plugins (`eslint-plugin-react` 7.x) target ESLint 9 |
| 4 | Typecheck script | `next typegen && tsc --noEmit` | Next 16 route types (`LayoutProps`, `PageProps`) are generated into `.next/types`; a clean checkout fails `tsc` without them |
| 5 | Prettier scope | `docs/*.md` excluded | The spend log is append-only from a script; re-aligning tables would make every snapshot a noisy diff |
| 6 | e2e server | Playwright builds and runs `next start` on port 3100 | Tests run against the production build (what Lighthouse sees), on a port that doesn't clash with `next dev` |
| 7 | Fluid type | Two-segment `clamp()` (402→810 in base, 810→1200 under `md`) instead of the single clamps in DS §12 | A single linear clamp cannot hit three Figma anchors; the §12 formulas gave 54px instead of 60 at 1200. Now exact at 402 / 810 / 1200 (verified in the browser) |
| 8 | Card radius | `--radius-card` 16 on mobile, 24 from `md`, via a token override | DS §5.3 gives two values; one token keeps components breakpoint-agnostic |
| 9 | Focus indicator | Outline 2px `--color-focus-ring` (#2069E8, opaque version of the Figma `--color-focus`), offset 2px; white on red/dark surfaces | The Figma 35% alpha ring is ~1.6:1 on white and fails WCAG 1.4.11 (3:1) for non-text contrast |
| 10 | Button sizes | `sm` 32 · `md` 40 (Figma) · `lg` 48 | Figma only defines 40; `sm`/`lg` are for dense UI (spec rows) and touch-first CTAs |
| 11 | Link buttons can't be disabled | `disabled` exists only on the `<button>` branch of the `Button` union | A disabled link is not a native concept; it would need `aria-disabled` plus removing `href` |
| 12 | Styleguide state previews | `hover` / `active` / `focus-visible` variants also match `[data-preview~=…]` | Shows every state side by side without duplicating class strings in the page; no effect outside the styleguide |
| 13 | Styleguide in production | Built and deployed, `robots: noindex, nofollow`, not linked from the site | Useful during the review call; PLAN calls it "dev-only", noindex keeps it out of search |
| 14 | Font weight token | `font-book` = 470 (Figma "Weight 470") | Satoshi Variable supports any weight 300–900; a named token avoids magic numbers |
| 15 | Logo | Mark approximated as an inline SVG (head + 4 tentacles), wordmark set in Satoshi Bold | Figma export disabled; flagged for replacement in the README |
| 16 | Data validation | zod schemas in `src/lib/types.ts`, parsed when each loader module loads; types inferred from the schemas | A content typo (bad category, duplicate slug, unknown reference in home.json) fails `next build` instead of shipping a broken page |
| 17 | Homepage placement rule | `featured: n` puts a product in its category section (n = order, the first one is the large card); `bestSeller` + `bestSellerRank` drive the carousels | "Adding a product to the data shows it in the right section": a new `featured` product joins its bento grid with no code change |
| 18 | Home best-sellers carousel | `home.json` lists 3 editorial picks (Air Fryer, Indoor Camera, Hair Dryer); the PDP carousel shows every best seller by rank, minus the current product | Figma shows different sets on the two pages; without `products` the home carousel falls back to the ranked list |
| 19 | Specs shape | `items: { label, value }[]` instead of the brief's `string[]` | Renders as a semantic `<dl>` and keeps "Label: value" formatting out of the content |
| 20 | Colour swatches | Hex values live in the product data (`colours[].value`) | A product's colour is content, not a design token; the "no hex in components" rule still holds |
| 21 | Blender placeholder copy | Figma truncates dimensions and hides some specs: dimensions 238 × 210 × 450 mm, weight 4.6 kg, jug 2 L, "In the box" and the Silver/Red colours are **plausible placeholders** | DS §11 #3 and #5 |
| 22 | Image fallback | Loaders keep `src` only if the file exists in `/public` | Real assets can be dropped in with no JSON or code change; until then, ratio-correct placeholders |
| 23 | Explore tiles | Link to the homepage anchors (`/#kitchen`, …); hair care points to the banner section | The brief allows an anchor or a placeholder route; anchors keep users on the demo |
| 24 | Retailer | "Find us at" shows the text "Partner Retailer" | The retailer logo can't be exported and reproducing a third-party logo is avoided |
| 25 | Cache lifetime | Default `cacheLife` profile (revalidate 15 min) | Static at build today; with a CMS, content refreshes without a redeploy |
| 26 | Menu pattern | Disclosure (button + `aria-expanded`/`aria-controls`) with a focus trap, not a modal dialog | The panel is part of the header; a constant "Menu" label plus `aria-expanded` follows WAI-ARIA APG (no label swap) |
| 27 | Close on route change | Open state stores the pathname it was opened on; `open = openOn === pathname` | Closes on navigation without a `setState` in an effect (React Compiler / `react-hooks` v7 friendly) |
| 28 | Scroll lock | CSS `html:has([data-scroll-lock])` inside `@variant max-lg` | No JS, uses the breakpoint token, and releases automatically when resizing past 1200px |
| 29 | Outside click | `pointerdown` listener closes the menu; the dim backdrop is decorative (`aria-hidden`) | Avoids a click handler on a non-interactive element; Escape covers keyboard users |
| 30 | Nav targets | Header and footer category links point to homepage anchors (`/#kitchen`…); "Where to buy", "Contact us" and "Policies & Terms" go to `/placeholder/*` | Category pages are out of scope; anchors keep the demo navigable |
| 31 | Placeholder route | `generateStaticParams` returns every `/placeholder/*` href found in the content; unlisted paths still render on request; `noindex` | `dynamicParams` isn't compatible with Cache Components |
| 32 | UI chrome strings | "Skip to content", "Menu", "Octopus home" stay in components; page copy stays in `src/data` | They're accessibility labels for the interface, not content (a future i18n pass would move them to a dictionary) |
| 33 | Mobile logo | Mark only below 810px, full logo from tablet | DS §6.2 (mobile pill shows the mark) |
| 34 | Section rhythm | Uniform `py-10 md:py-20` for the category sections (hero, best sellers and explore follow DS §5.2) | The Figma desktop paddings vary (60/180/120…) without a clear rule; one rhythm keeps the spacing consistent, which is what the brief asks for |
| 35 | Hero without video | The video is rendered only if `/public/videos/…` exists; the poster placeholder is otherwise the hero | Figma export disabled; no autoplaying asset means no pause control to show |
| 36 | Carousel dots | Shown at every breakpoint, 24px hit area around an 8px dot | Brief asks for dots on desktop; on touch they're still useful and harmless |
| 37 | "Learn more" links | Visible label + sr-only "about {product}" | Several identical link names on one page fail WCAG 2.4.4 in context |
| 38 | Container | `box-content`: max-width applies to the content (1344), the gutter sits outside | Matches Figma: content is 1344 wide at 1600, starting at 128 |
