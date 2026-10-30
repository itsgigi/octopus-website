#!/usr/bin/env node
// Snapshot OpenRouter spend for this project and append it to docs/AI_USAGE.md.
// Usage: node scripts/ai-usage.mjs "<label>"   (or: pnpm ai:usage "<label>")
// Key lookup: OPENROUTER_API_KEY env var, else .claude/settings.local.json → env.
// The key is never printed or written anywhere.

import { readFile, writeFile, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const logFile = path.join(root, "docs", "AI_USAGE.md");
const stateFile = path.join(root, "docs", "ai-usage.json");
const label = process.argv.slice(2).join(" ").trim() || "snapshot";

async function getKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  const settings = path.join(root, ".claude", "settings.local.json");
  if (existsSync(settings)) {
    const json = JSON.parse(await readFile(settings, "utf8"));
    const env = json.env ?? {};
    return env.OPENROUTER_API_KEY || env.ANTHROPIC_AUTH_TOKEN;
  }
  return undefined;
}

const key = await getKey();
if (!key) {
  console.error("No OpenRouter key found (OPENROUTER_API_KEY or .claude/settings.local.json).");
  process.exit(1);
}

const res = await fetch("https://openrouter.ai/api/v1/key", {
  headers: { Authorization: `Bearer ${key}` },
});
if (!res.ok) {
  console.error(`OpenRouter responded ${res.status}`);
  process.exit(1);
}
const { data } = await res.json();
const usage = Number(data.usage ?? 0);

const state = existsSync(stateFile)
  ? JSON.parse(await readFile(stateFile, "utf8"))
  : { baseline: usage, last: usage, snapshots: [] };

const sinceLast = usage - state.last;
const sinceStart = usage - state.baseline;
const now = new Date().toISOString().replace("T", " ").slice(0, 16);
const fmt = (n) => `$${n.toFixed(4)}`;

state.snapshots.push({ at: now, label, usage, sinceLast, sinceStart });
state.last = usage;
await writeFile(stateFile, JSON.stringify(state, null, 2) + "\n");

await appendFile(
  logFile,
  `| ${now} | ${label} | ${fmt(sinceLast)} | ${fmt(sinceStart)} | ${fmt(usage)} |\n`,
);

const limit =
  data.limit_remaining != null ? ` · remaining limit ${fmt(Number(data.limit_remaining))}` : "";
console.log(`[ai-usage] ${label}: +${fmt(sinceLast)} (project total ${fmt(sinceStart)})${limit}`);
