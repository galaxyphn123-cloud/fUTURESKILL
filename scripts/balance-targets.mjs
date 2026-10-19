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
  const low = flags.filter(f => f.rule === "longest-low" || f.rule === "shortest-low");
  for (const f of low) {
    const kind = f.rule === "longest-low" ? "longest" : "shortest";
    const need = Math.ceil(m.mcq * (m.chance - 0.1 - m[kind]));
    console.log(`-- ${f.rule}: ${f.detail}. Rewrite ~${need} items so the RIGHT answer becomes the ${kind} option (by lengthening/shortening the right answer or distractors; keep it natural):`);
    const rows = acts.filter(a => a.type === "mcq").map(a => { const L = a.options.map(o => o.length), r = L[a.answer], o = L.filter((_, i) => i !== a.answer); return { a, gap: kind === "longest" ? Math.max(...o) - r : r - Math.min(...o) }; }).filter(r => r.gap > 0).sort((x, y) => x.gap - y.gap).slice(0, need * 2);
    rows.sort((x, y) => x.a.n - y.a.n).forEach(({ a }) => { console.log(`${a.n}. ${a.q}`); a.options.forEach((o, i) => console.log(`   ${i === a.answer ? "*" : " "}${i} (${o.length}) ${o}`)); });
  }
  const abs = flags.find(f => f.rule === "absolute-skew");
  if (abs) {
    const A = /\b(selalu|pasti|sama sekali|semua orang|tidak pernah|selamanya|apa pun|siapa pun|tidak ada yang|satu-satunya)\b/i;
    const rows = acts.filter(a => a.type === "mcq" && !A.test(a.options[a.answer]) && a.options.some((o, i) => i !== a.answer && A.test(o)));
    const need = Math.ceil(m.mcq * (m.absolute - 0.04));
    console.log(`-- absolute-skew: ${abs.detail}. Remove the absolute word from distractors (reword to a plausible hedged-but-wrong claim) in ~${need} of these ${rows.length}:`);
    rows.forEach(a => { console.log(`${a.n}. ${a.q}`); a.options.forEach((o, i) => console.log(`   ${i === a.answer ? "*" : " "}${i} (${o.length}) ${o}`)); });
  }
  const rat = flags.find(f => f.rule === "rationale-skew") || (Math.abs(m.rationale) > 0.15 ? { detail: `rationale gap ${Math.round(m.rationale * 100)} points (soft target <= 15)` } : null);
  if (rat) {
    const R = /\b(karena|sebab|supaya|sehingga|agar)\b/i;
    const nW = acts.filter(a => a.type === "mcq").reduce((t, a) => t + a.options.length - 1, 0);
    const need = Math.ceil(nW * (m.rationale - 0.17));
    const rows = acts.filter(a => a.type === "mcq" && !R.test(a.options[a.answer]) && a.options.some((o, i) => i !== a.answer && R.test(o)));
    console.log(`-- rationale-skew: ${rat.detail}. Remove ~${need} justification clauses from WRONG options (rewrite as a plain wrong claim, NOT a shorter stub) and/or add a short natural reason to the RIGHT answer, across these ${rows.length} items (spread over all strands):`);
    rows.forEach(a => { console.log(`${a.n}. ${a.q}`); a.options.forEach((o, i) => console.log(`   ${i === a.answer ? "*" : " "}${i} (${o.length}) ${R.test(o) ? "[R] " : ""}${o}`)); });
  }
}
