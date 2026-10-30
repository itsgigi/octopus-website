# AI usage & costs

## Tools
- **Claude Code** (VS Code extension) — all code generation, refactors, tests.
  - Phases 0–5 and the start of phase 6: through **OpenRouter** with the API key provided for the test.
  - From phase 6 on: my own **Claude subscription**, after the key hit its spend limit (see below).
- **Claude (claude.ai)** — Figma inspection in view-only mode (export disabled) → `docs/DESIGN_SYSTEM.md`, project setup (`CLAUDE.md`, `docs/PLAN.md`). Not billed to the OpenRouter key.

Cost source: OpenRouter `GET /api/v1/key` (`usage` field, USD), snapshotted by `scripts/ai-usage.mjs` at the start/end of each phase. Per-request detail: openrouter.ai/activity. Per-session detail inside Claude Code: `/cost`.

## Switch from the OpenRouter key to my Claude subscription

During phase 6 the provided key ran out of budget. OpenRouter returned `402`: Claude Code requests up to 128k output tokens, and the key could only cover about 118–123k. Rather than ask for a higher limit mid-test, I moved Claude Code to my own Claude subscription (`.claude/settings.local.json` renamed to `.claude/openrouter.local.json`, then `/login`). The spend log below is complete for the key-billed part only. Subscription usage isn't billed per request, so it doesn't appear here in USD.

Takeaway: the scaffold → PDP build (phases 0–5) cost about $11–12 on the key. When Claude Code runs on a key with a hard spend limit, cap its max output tokens (`CLAUDE_CODE_MAX_OUTPUT_TOKENS`).

## Corrections

Places where AI output was wrong and had to be rewritten. (Kept above the spend log: the script appends rows at the end of the file.)

| Phase | What was wrong | Fix |
|---|---|---|
| 0 | Ran `create-next-app _app` as planned — rejected: npm names cannot start with `_` | Scaffolded into `_app/octopus-website` and moved up |
| 0 | Planned to install TypeScript 7.0.2 (latest) — `typescript-eslint` peers on `<6.1.0` | Pinned 6.0.3 |
| 0 | First `tsc` failed on `LayoutProps` after deleting `.next` | `typecheck` script runs `next typegen` first |
| 0 | `prettier --write .` re-aligned the tables in `docs/*.md` (noisy diff against the append-only log) | Reverted, `docs/*.md` added to `.prettierignore` |
| 0 | Redaction regex used `\s`, which BSD sed doesn't support, so a secret was echoed in the local session output (not committed). The same session found the example settings file in `docs/` was a copy holding the real key | Example file values replaced with `REPLACE_ME` before the first commit; key rotation recommended |
| 1 | DS §12 fluid clamps (also AI-written) missed the Figma sizes at the breakpoints, e.g. display 54px instead of 60 at 1200 | Recomputed as two-segment clamps, verified in the browser |
| 1 | `Text` typed its props as `<p>` props while allowing `as="li"`, which broke the types | Props typed as `HTMLAttributes<HTMLElement>` |
| 1 | Styleguide used `<Heading as="p">`, outside the allowed heading levels | Used `headingVariants()` on a plain `<p>` |
| 3 | The scaffold e2e smoke test asserted `<main>` was visible; it failed on WebKit once the homepage became an empty shell | Replaced with tests of the real shell (banner, footer, skip link, mobile menu) |
| 3 | Mobile menu links were indented more than the logo (ghost button padding + panel padding) | Spotted in the browser and realigned to the 20px logo inset |
| 4 | Carousel slides held sr-only spans (`position: absolute`); with a static track they escaped `overflow: auto` and widened the page by 364px on mobile | Track made `relative`; found by measuring scrollWidth in the browser |
| 4 | `Container` put the 48px gutter inside the 1344 max-width, so desktop content was 1248 wide | `box-content`, verified: content starts at 128 at 1600 |
| 4 | The image placeholder covered the red find-us banner and hid its white text | Added a `brand` placeholder tone |
| 5 | Carousel showed one dot per slide; with 5 of 6 PDP cards visible, 4 dots were unreachable | Dots now count reachable positions (unit-tested) |
| 5 | A verification script clicked the same accordion button twice and reported it closed | Script bug, not a component bug; the behaviour is covered by unit tests |
| 7 | The carousel was a `<section>` labelled "Best sellers" inside a section with the same name: duplicate landmarks | Changed to `role="group"` |
| 7 | The hero and banner "Learn more" links had no sr-only product name (only the cards did); Lighthouse SEO flagged it | Added "about {product}" |
| 7 | The first e2e draft force-checked the visually hidden radio, which fails on mobile WebKit | The test taps the visible swatch label, as a user would |
| 1 | `cn` would have merged `font-book` as a font-family (it drops `font-sans`) | Registered custom font-size, font-weight and radius groups in tailwind-merge |

## Spend log

| When (UTC) | Phase / label | Δ since last | Project total | Key total |
|---|---|---|---|---|
| 2026-10-30 14:04 | baseline | $0.0000 | $0.0000 | $0.6146 |
| 2026-10-30 14:08 | phase 0 scaffold | $0.9871 | $0.9871 | $1.6017 |
| 2026-10-30 14:15 | phase 1 tokens & primitives | $1.6608 | $2.6479 | $3.2625 |
| 2026-10-30 14:19 | phase 2 data layer start | $0.2028 | $2.8507 | $3.4652 |
| 2026-10-30 14:23 | phase 2 data layer end | $1.0194 | $3.8701 | $4.4846 |
| 2026-10-30 14:26 | phase 3 layout shell start | $0.3247 | $4.1947 | $4.8093 |
| 2026-10-30 14:31 | phase 3 layout shell end | $1.4881 | $5.6828 | $6.2974 |
| 2026-10-30 14:35 | phase 4 homepage start | $1.4881 | $7.1709 | $7.7855 |
| 2026-10-30 14:42 | phase 4 homepage end | $2.1774 | $9.3483 | $9.9629 |
| 2026-10-30 14:48 | phase 5 pdp start | $0.3391 | $9.6874 | $10.3020 |
| 2026-10-30 14:52 | phase 5 pdp end | $1.2474 | $10.9348 | $11.5494 |
| 2026-10-30 14:57 | phase 6 motion start | $0.3640 | $11.2987 | $11.9133 |
