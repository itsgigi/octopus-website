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
