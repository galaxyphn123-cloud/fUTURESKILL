/* Phase 27 — automated subset of the question quality check.
   Human review (age fit, bias, ambiguity) stays in the review workflow;
   this flags everything a machine can: structure, answer validity,
   duplicates, length, and answer leaks. Flagged items => NEEDS REVIEW. */
import fs from "node:fs";
import { SKILL_CONTENT } from "../src/data/skillContent.js";
import { TAXONOMY } from "../src/data/taxonomy.js";
import { activityMeta } from "../src/engine/metadata.js";

import { checkSkill } from "./lib/checkSkill.mjs";

const flags = [];
for (const [skill, acts] of Object.entries(SKILL_CONTENT)) {
  if (!TAXONOMY[skill]) flags.push({ skill, n: 0, rule: "no-taxonomy", detail: "skill missing from taxonomy" });
  flags.push(...checkSkill(skill, acts, {
    metaCheck: TAXONOMY[skill] ? (sk, a, flag) => { for (const [k, v] of Object.entries(activityMeta(sk, a))) if (v === undefined || v === "") flag(a.n, "metadata", k); } : null,
  }));
}

const byRule = flags.reduce((m, f) => (m[f.rule] = (m[f.rule] || 0) + 1, m), {});
const bad = new Set(flags.map(f => `${f.skill}#${f.n}`));
const total = Object.values(SKILL_CONTENT).reduce((s, a) => s + a.length, 0);
fs.writeFileSync(new URL("../quality-report.json", import.meta.url), JSON.stringify({ total, needsReview: bad.size, byRule, flags }, null, 1));
console.log(`activities: ${total} | NEEDS REVIEW: ${bad.size} | by rule:`, byRule);
process.exit(0);
