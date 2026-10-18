/* Content gate: fails (exit 1) when any registered skill leaks its answers.
     1. item level  - every checkSkill rule (length/short/absolute cues, hint-leak, option/question length, structure ...) must be clean
     2. skill level - answer-slot clustering, longest/shortest-answer skew, absolute-word skew (lib/skillBalance.mjs)
   Legacy skills may sit at their recorded skew (scripts/lib/balance-baseline.json) but never get worse;
   any skill NOT in the baseline (i.e. every new domain) must meet the plain limits.
   node scripts/gate.mjs                    check
   node scripts/gate.mjs --update-baseline  record current metrics, only ever TIGHTENING existing entries */
import fs from "node:fs";
import { SKILL_CONTENT } from "../src/data/skillContent.js";
import { TAXONOMY } from "../src/data/taxonomy.js";
import { activityMeta } from "../src/engine/metadata.js";
import { checkSkill } from "./lib/checkSkill.mjs";
import { balanceFlags, balanceMetrics } from "./lib/skillBalance.mjs";

const basePath = new URL("./lib/balance-baseline.json", import.meta.url);
const baseline = fs.existsSync(basePath) ? JSON.parse(fs.readFileSync(basePath, "utf8")) : {};
const RULE_KEY = { "position-skew": "slotShare", "position-run": "run", "longest-skew": "longest", "shortest-skew": "shortest", "absolute-skew": "absolute" };

if (process.argv.includes("--update-baseline")) {
  const next = {};
  for (const [id, acts] of Object.entries(SKILL_CONTENT)) {
    const cur = balanceFlags(acts); // violations vs plain limits only
    if (!cur.length) continue;
    const m = balanceMetrics(acts), old = baseline[id] || {};
    next[id] = {};
    for (const f of cur) { const v = m[RULE_KEY[f.rule]]; next[id][f.rule] = +Math.min(v, old[f.rule] ?? Infinity).toFixed(3); }
  }
  fs.writeFileSync(basePath, JSON.stringify(next, null, 1) + "\n");
  console.log("baseline entries:", Object.keys(next).length);
  process.exit(0);
}

const problems = [];
for (const [skill, acts] of Object.entries(SKILL_CONTENT)) {
  const meta = TAXONOMY[skill] ? (sk, a, flag) => { for (const [k, v] of Object.entries(activityMeta(sk, a))) if (v === undefined || v === "") flag(a.n, "metadata", k); } : null;
  for (const f of checkSkill(skill, acts, { metaCheck: meta })) problems.push(`${skill} #${f.n} ${f.rule}: ${f.detail}`);
  for (const f of balanceFlags(acts, baseline[skill])) problems.push(`${skill} [skill-level] ${f.rule}: ${f.detail} (limit ${f.limit})`);
}
if (problems.length) {
  console.error(`CONTENT GATE FAILED (${problems.length})`);
  problems.slice(0, 60).forEach(p => console.error("  " + p));
  if (problems.length > 60) console.error(`  ... +${problems.length - 60} more`);
  process.exit(1);
}
console.log("content gate: all skills clean (baseline entries: " + Object.keys(baseline).length + ")");
