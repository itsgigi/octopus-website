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
| 15 | Logo | Mark traced from the brand artwork (provided by the developer) as one 45-unit stroke path, overlaid on the PNG to check the fit; wordmark set in Satoshi Bold; ™ omitted | Figma export disabled. A single stroke path stays crisp at any size and takes `currentColor` (red navbar, white footer, grey placeholders). The first version was an invented approximation |
| 16 | Data validation | zod schemas in `src/lib/types.ts`, parsed when each loader module loads; types inferred from the schemas | A content typo (bad category, duplicate slug, unknown reference in home.json) fails `next build` instead of shipping a broken page |
| 17 | Homepage placement rule | `featured: n` puts a product in its category section (n = order, the first one is the large card); `bestSeller` + `bestSellerRank` drive the carousels | "Adding a product to the data shows it in the right section": a new `featured` product joins its bento grid with no code change |
| 18 | Home best-sellers carousel | `home.json` lists 3 editorial picks (Air Fryer, Indoor Camera, Hair Dryer); the PDP carousel shows every best seller by rank, minus the current product | Figma shows different sets on the two pages; without `products` the home carousel falls back to the ranked list |
| 19 | Specs shape | `items: { label, value }[]` instead of the brief's `string[]` | Renders as a semantic `<dl>` and keeps "Label: value" formatting out of the content |
| 20 | Colour swatches | Hex values live in the product data (`colours[].value`) | A product's colour is content, not a design token; the "no hex in components" rule still holds |
| 21 | Blender placeholder copy | Figma truncates dimensions and hides some specs: dimensions 238 × 210 × 450 mm, weight 4.6 kg, jug 2 L, "In the box" and the Silver/Red colours are **plausible placeholders** | DS §11 #3 and #5 |
| 22 | Image fallback | Loaders keep `src` only if the file exists in `/public` | Real assets can be dropped in with no JSON or code change; until then, ratio-correct placeholders |
| 23 | Explore tiles | Link to the homepage anchors (`/#kitchen`, …); hair care points to the banner section | The brief allows an anchor or a placeholder route; anchors keep users on the demo |
| 24 | Retailer | "Find us at" shows The Warehouse icon (redrawn as SVG from the artwork provided by the developer) + the name as text; the icon is decorative (`alt=""`) | As in Figma. Name as real text keeps it readable and translatable; logo path comes from `home.json` |
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
| 36 | Carousel dots | Removed: arrows only, right-aligned | Figma has no dots; the developer chose Figma over the brief's mention. Arrows still stop at the last reachable position |
| 37 | "Learn more" links | Visible label + sr-only "about {product}" | Several identical link names on one page fail WCAG 2.4.4 in context |
| 38 | Container | `box-content`: max-width applies to the content (1344), the gutter sits outside | Matches Figma: content is 1344 wide at 1600, starting at 128 |
| 39 | PDP grid | One CSS grid + `order`: mobile image → info → gallery, tablet info → image → gallery, desktop 709fr/555fr columns with the info column `sticky` | No duplicated markup per breakpoint; verified 709×900 gallery and 355 info content at 1600 |
| 40 | Colour selector | Native `<input type="radio">` styled as swatches inside a `<fieldset>` | Arrow keys, roving tabindex and announcements for free; less code than an ARIA radiogroup |
| 41 | Downloads | Its own box, but also an accordion item | The brief lists Downloads among the sections that expand and collapse; DS §6.11 draws it as a separate box |
| 42 | Accordion panels | Always in the DOM; closed = `inert` + `aria-hidden`, `grid-rows` transition | Animatable height without measuring; closed links leave the tab order |
| 43 | Mobile CTA | Sticky bottom bar below 810px; the in-flow button is hidden there; `body:has([data-sticky-cta])` adds bottom padding so the footer isn't covered | DS §6.9 |
| 44 | Unknown product slug | `notFound()` renders the 404 UI with `noindex`, but the HTTP status is 200 | With Partial Prefetching the shell has already started streaming; every real product is prerendered, so this only affects invented URLs |
| 45 | PDP best sellers | All best sellers by rank except the current product; 2 / 3 / 5 visible; Next stops at the last reachable position | DS §6.6 |
| 46 | Feature bento shapes | By position: wide, tall, tall, wide (repeating) | Matches Figma for the blender's 4 features and keeps working if features are added |
| 47 | Scroll reveal | One shared `IntersectionObserver`; it sets `data-visible` on the DOM, and the transition is CSS | No re-renders and one observer for the whole page; DS §8 values (60/30px, 1.2s, ease-out, 0.1s delay, no replay) |
| 48 | What is not revealed | Hero, PDP main image and product info | They're above the fold and contain the LCP; animating them would delay LCP and hurt Lighthouse |
| 49 | Reveal without JS | Elements are hidden only under `@media (scripting: enabled)` | With JS off (or before hydration on a no-JS crawler) content is visible, never stuck at opacity 0 |
| 50 | Reduced motion and reveal | Fade kept, translate removed (overrides the global reset on purpose) | DS §8: "Reduced motion: opacity only" |
| 51 | Image fade-in | `FadeInImage` client wrapper rendered only when `src` exists | Placeholders cost no JS; real assets get a 500ms fade, except `priority` (LCP) images |
| 52 | Carousel container role | `role="group"` + `aria-roledescription="carousel"`, not a second `<section>` | The surrounding section is already the landmark; two regions named "Best sellers" were announced twice (found by the e2e locator) |
| 53 | Browser coverage | Playwright projects: Chrome, Firefox, desktop Safari, iPhone 15 (WebKit), Pixel 7 (Chromium) | Brief's list; Edge shares Chromium. These are engine emulations, not real devices |
| 54 | Lighthouse | CLI 13.6 against `next start`, mobile preset (simulated throttling), reports in `docs/lighthouse/` | Reproducible locally; the deployed URL can be re-audited in Phase 8 |
| 55 | Axe scope | WCAG 2.0/2.1/2.2 A + AA tags, after forcing every `Reveal` visible | Checks the final state; at opacity 0 axe would skip or misjudge contrast |
| 56 | Asset identification | Screenshots matched to Figma frames by content; the four small consecutive captures (blender, indoor camera, hair dryer, USB-C cable) are the "Explore all categories" tiles, in section order | They follow the category order exactly and their sizes match the tile crops |
| 57 | Power bank cut-out | Assigned to Power Bank 10,000 mAh | Both power banks have a built-in cable; the 10,000 is the one shown on the homepage (Accessories section) |
| 58 | Red studio photo | Find-us banner, shown on the right 60% with a fade into the brand red (`mask-l`) | DS §6.7 calls it a "red product photo"; as a full-bleed 2.4:1 cover it cropped the products and put white text over them. The photo red (`#BF151B`) is darker than `brand`, hence the fade instead of a hard edge |
| 59 | Baked-in text | Removed from the hair care banner and the indoor camera card by interpolating the plain background column by column | Otherwise the page's own heading and CTA would be duplicated over the screenshot's |
| 60 | Hero video | 7.6 s loop cut from the 24 s recording (12.2–19.8 s): no cursor, play button or player bar; top 72 px cropped (Figma navbar); H.264 CRF 26, 30 fps, no audio, 244 KB; poster = first frame | Only part of the recording without UI on top; small enough to load after the poster without hurting LCP |
| 61 | Hero legibility | A light top scrim (`canvas` 90% → transparent) behind the heading | In some frames the dark dryer head passes under the subtitle; checked on the darkest frame |
| 62 | Portrait card on tablet | Indoor Camera large card keeps the vertical composition (text centred on top, 4:5) from 810px, instead of Figma's landscape crop | The only asset is portrait: a landscape crop puts the text on the camera lens. A landscape asset would restore the Figma tablet layout |
| 63 | Low-resolution sources | Kept as-is | They're screenshots (136–1228 px wide), so they look soft when upscaled; replacing the files in `public/images` fixes it with no code change |
| 64 | Raw captures | Git-ignored, not deleted | They're the user's originals; the processed copies are what ships |
| 65 | Image focal point | Optional `focus` on `ImageRef` (CSS object-position) in the JSON, applied by `ProductImage` | The crop subject is content, not layout: the kettle sits on the right of a landscape photo and fell out of the portrait mobile card |
| 66 | Category section titles | "Kitchen", "Home Security", "Accessories" use the H1 scale (60 desktop · 48 tablet · 40 mobile), still as `<h2>` | Checked against Figma by the developer: the section titles are 60 px, not H2/L 44 as first extracted |
| 67 | Security bento on desktop | Large card fixed at 660 × 1038 (`aspect-card-portrait`), the two medium cards split the remaining height (507 each); large-card text column 450 wide, centred | Figma frame sizes; the card used to stretch to the medium cards' content height (706) |
