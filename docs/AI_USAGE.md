# AI usage & costs

## Tools
- **Claude Code** (CLI) through **OpenRouter** with the API key provided for the test — all code generation, refactors, tests.
- **Claude (claude.ai)** — Figma inspection in view-only mode (export disabled) → `docs/DESIGN_SYSTEM.md`, project setup (`CLAUDE.md`, `docs/PLAN.md`). Not billed to the OpenRouter key.

Cost source: OpenRouter `GET /api/v1/key` (`usage` field, USD), snapshotted by `scripts/ai-usage.mjs` at the start/end of each phase. Per-request detail: openrouter.ai/activity. Per-session detail inside Claude Code: `/cost`.

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
| 1 | `cn` would have merged `font-book` as a font-family (it drops `font-sans`) | Registered custom font-size, font-weight and radius groups in tailwind-merge |

## Spend log

| When (UTC) | Phase / label | Δ since last | Project total | Key total |
|---|---|---|---|---|
| 2026-10-30 14:04 | baseline | $0.0000 | $0.0000 | $0.6146 |
| 2026-10-30 14:08 | phase 0 scaffold | $0.9871 | $0.9871 | $1.6017 |
| 2026-10-30 14:15 | phase 1 tokens & primitives | $1.6608 | $2.6479 | $3.2625 |
| 2026-10-30 14:19 | phase 2 data layer start | $0.2028 | $2.8507 | $3.4652 |
| 2026-10-30 14:23 | phase 2 data layer end | $1.0194 | $3.8701 | $4.4846 |
