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
