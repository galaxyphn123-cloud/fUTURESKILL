/* Lists MCQs to rewrite so a skill passes the skill-level skew limits (lib/skillBalance.mjs).
   node scripts/balance-targets.mjs ID [ID...]
   For longest-skew: items whose correct option is the longest, picked closest-to-tie first
   (cheapest to fix: make one distractor genuinely longer/more detailed than the right answer).
   Apply edits with: node scripts/legacy-edit.mjs apply spec.json */
import { SKILL_CONTENT } from "../src/data/skillContent.js";
import { balanceMetrics, balanceFlags, LIMITS } from "./lib/skillBalance.mjs";

for (const id of process.argv.slice(2)) {
  const acts = SKILL_CONTENT[id]; if (!acts) { console.log("unknown", id); continue; }
  const m = balanceMetrics(acts), flags = balanceFlags(acts);
  console.log(`## ${id}  mcq=${m.mcq} longest=${Math.round(m.longest * 100)}% (limit ${Math.round((m.chance + LIMITS.longest) * 100)}%) shortest=${Math.round(m.shortest * 100)}% abs=${Math.round(m.absolute * 100)}% flags=${flags.map(f => f.rule).join(",") || "none"}`);
  const longest = flags.find(f => f.rule === "longest-skew");
  if (longest) {
    const target = Math.ceil(m.mcq * (m.longest - (m.chance + 0.08)));
    const rows = acts.filter(a => a.type === "mcq").map(a => {
      const L = a.options.map(o => o.length), right = L[a.answer], other = Math.max(...L.filter((_, i) => i !== a.answer));
      return { a, gap: right - other, right };
    }).filter(r => r.gap > 0).sort((x, y) => x.gap - y.gap).slice(0, target + 2);
    console.log(`-- need ~${target} items where a distractor becomes the longest option (shown: ${rows.length})`);
    rows.sort((x, y) => x.a.n - y.a.n).forEach(({ a, gap }) => {
      console.log(`${a.n}. (gap ${gap}) ${a.q}`);
      a.options.forEach((o, i) => console.log(`   ${i === a.answer ? "*" : " "}${i} (${o.length}) ${o}`));
    });
  }
  const abs = flags.find(f => f.rule === "absolute-skew");
  if (abs) console.log("-- absolute-skew: " + abs.detail + "; give the RIGHT answer a hedge-free but absolute-looking word or strip it from distractors");
}
