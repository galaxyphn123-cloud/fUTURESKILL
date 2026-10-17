/* Phase 27 — automated subset of the question quality check.
   Human review (age fit, bias, ambiguity) stays in the review workflow;
   this flags everything a machine can: structure, answer validity,
   duplicates, length, and answer leaks. Flagged items => NEEDS REVIEW. */
import fs from "node:fs";
import { SKILL_CONTENT } from "../src/data/skillContent.js";

// Foundation..Application (n<=60) stays short; Reasoning/Challenge may carry longer scenarios.
const maxQ = n => (n <= 60 ? 420 : 600), maxOpt = n => (n <= 60 ? 160 : 240);
const flags = [];
const seenQ = new Map();
const flag = (skill, n, rule, detail) => flags.push({ skill, n, rule, detail });
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

for (const [skill, acts] of Object.entries(SKILL_CONTENT)) {
  if (acts.length < 100) flag(skill, 0, "min-100", `only ${acts.length}`);
  acts.forEach((a, i) => {
    if (a.n !== i + 1) flag(skill, a.n, "sequence", `expected n=${i + 1}`);
    for (const f of ["q", "explain", "hint", "micro"]) if (!a[f] || !String(a[f]).trim()) flag(skill, a.n, "missing-field", f);
    if (a.q && a.q.length > maxQ(a.n)) flag(skill, a.n, "too-long", `${a.q.length} chars`);
    if (a.type === "mcq") {
      if (!Array.isArray(a.options) || a.options.length < 2) flag(skill, a.n, "options", "needs >=2");
      else {
        if (!Number.isInteger(a.answer) || a.answer < 0 || a.answer >= a.options.length) flag(skill, a.n, "answer-range", String(a.answer));
        const set = new Set(a.options.map(o => String(o).trim().toLowerCase()));
        if (set.size !== a.options.length) flag(skill, a.n, "duplicate-options", "two options are identical");
        a.options.forEach(o => { if (o.length > maxOpt(a.n)) flag(skill, a.n, "option-long", o.slice(0, 40)); });
      }
    } else if (a.type === "tf") {
      if (typeof a.answer !== "boolean") flag(skill, a.n, "answer-type", "tf needs boolean");
    } else if (a.type === "order") {
      if (!a.items || !Array.isArray(a.answer) || a.answer.length !== a.items.length || new Set(a.answer).size !== a.items.length) flag(skill, a.n, "order-shape", "answer must be a permutation");
    } else if (a.type === "classify") {
      const all = new Set((a.groups || []).flatMap(g => a.answer?.[g] || []));
      if (!a.items || !a.groups || a.items.some(it => !all.has(it))) flag(skill, a.n, "classify-shape", "every item needs a group");
    } else if (a.type === "open") {
      if (!a.sample) flag(skill, a.n, "open-sample", "missing model answer");
    } else flag(skill, a.n, "unknown-type", a.type);
    // hint must not simply give the answer away
    if (a.type === "mcq" && a.options && Number.isInteger(a.answer) && a.hint) {
      const ans = norm(a.options[a.answer] || "");
      if (ans.length > 12 && norm(a.hint).includes(ans)) flag(skill, a.n, "hint-leak", "hint contains the correct option");
    }
    // duplicate question text within the same skill (not just renamed numbers)
    const key = skill + "|" + a.q.trim().toLowerCase() + "|" + JSON.stringify(a.options || a.items || a.answer);
    if (seenQ.has(key)) flag(skill, a.n, "duplicate-question", `identical question and answer set as #${seenQ.get(key)}`);
    else seenQ.set(key, a.n);
  });
}

const byRule = flags.reduce((m, f) => (m[f.rule] = (m[f.rule] || 0) + 1, m), {});
const bad = new Set(flags.map(f => `${f.skill}#${f.n}`));
const total = Object.values(SKILL_CONTENT).reduce((s, a) => s + a.length, 0);
fs.writeFileSync(new URL("../quality-report.json", import.meta.url), JSON.stringify({ total, needsReview: bad.size, byRule, flags }, null, 1));
console.log(`activities: ${total} | NEEDS REVIEW: ${bad.size} | by rule:`, byRule);
process.exit(0);
