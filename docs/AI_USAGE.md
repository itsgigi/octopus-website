# AI usage & costs

## Tools
- **Claude Code** (CLI) through **OpenRouter** with the API key provided for the test — all code generation, refactors, tests.
- **Claude (claude.ai)** — Figma inspection in view-only mode (export disabled) → `docs/DESIGN_SYSTEM.md`, project setup (`CLAUDE.md`, `docs/PLAN.md`). Not billed to the OpenRouter key.

Cost source: OpenRouter `GET /api/v1/key` (`usage` field, USD), snapshotted by `scripts/ai-usage.mjs` at the start/end of each phase. Per-request detail: openrouter.ai/activity. Per-session detail inside Claude Code: `/cost`.

## Spend log

| When (UTC) | Phase / label | Δ since last | Project total | Key total |
|---|---|---|---|---|
| 2026-10-30 14:04 | baseline | $0.0000 | $0.0000 | $0.6146 |
| 2026-10-30 14:08 | phase 0 scaffold | $0.9871 | $0.9871 | $1.6017 |
