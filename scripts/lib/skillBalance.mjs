/* Skill-level answer-leak detector. checkSkill.mjs catches per-question cues; this catches the
   *statistical* ones a child (or a test-wise model) can exploit across a whole skill file:
     position-skew   one answer slot (e.g. "A"/index 0) holds far more than its fair share of right answers
     position-run    >=4 MCQs in a row with the correct option in the same slot
     longest-skew    the right answer is the longest option much more often than chance (or much LESS often:
                   'the longest option is never right' is the same tell upside down; likewise shortest)
     shortest-skew   ... or the shortest
     rationale-skew  wrong options carry a justification clause (karena/sebab/supaya/sehingga/agar) far more often than the right one
   absolute-skew   (net) distractors carry "selalu/pasti/..." while the right answer does not, too often
   Thresholds are chance + margin, so 2-, 3- and 4-option items are all handled. */
const ABSOLUTE = /\b(selalu|pasti|sama sekali|semua orang|tidak pernah|selamanya|apa pun|siapa pun|tidak ada yang|satu-satunya)\b/i;
const RATIONALE = /\b(karena|sebab|supaya|sehingga|agar)\b/i;
export const LIMITS = { longestLow: 0.2, shortestLow: 0.25, position: 0.12, run: 4, longest: 0.17, shortest: 0.12, absolute: 0.12, rationale: 0.25, minMcq: 20 };

export function balanceMetrics(acts) {
  const mcq = acts.filter(a => a.type === "mcq" && Array.isArray(a.options) && Number.isInteger(a.answer));
  const m = { mcq: mcq.length, chance: 0, slotShare: 0, slot: 0, run: 0, longest: 0, shortest: 0, absolute: 0 };
  if (!mcq.length) return m;
  const slots = {};
  let longest = 0, shortest = 0, absolute = 0, ratRight = 0, ratWrong = 0, nWrong = 0, run = 1, maxRun = 1, chance = 0;
  mcq.forEach((a, i) => {
    slots[a.answer] = (slots[a.answer] || 0) + 1;
    const L = a.options.map(o => o.length), right = L[a.answer], k = L.length;
    chance += 1 / k;
    const ties = L.filter(l => l === right).length;
    if (right === Math.max(...L)) longest += 1 / ties;
    if (right === Math.min(...L)) shortest += 1 / ties;
    const abs = a.options.map(o => ABSOLUTE.test(o));
    if (!abs[a.answer] && abs.some((x, j) => x && j !== a.answer)) absolute++;
    else if (abs[a.answer] && !abs.some((x, j) => x && j !== a.answer)) absolute--; // absolutes only in the RIGHT answer cancel out: that is not a tell
    a.options.forEach((o, j) => { if (j === a.answer) { if (RATIONALE.test(o)) ratRight++; } else { nWrong++; if (RATIONALE.test(o)) ratWrong++; } });
    if (i && mcq[i - 1].answer === a.answer) { run++; maxRun = Math.max(maxRun, run); } else run = 1;
  });
  const [slot, count] = Object.entries(slots).sort((x, y) => y[1] - x[1])[0];
  const n = mcq.length;
  return { mcq: n, chance: chance / n, slot: +slot, slotShare: count / n, slotChance: 1 / Math.round(n / (chance || 1)), run: maxRun, longest: longest / n, shortest: shortest / n, absolute: absolute / n, rationale: ratWrong / (nWrong || 1) - ratRight / n, avgOptions: n / chance };
}

/* Returns [{rule, value, limit, detail}]. `baseline` (optional) = previous metrics for a legacy skill:
   a metric may stay at its recorded value but not get worse (ratchet). */
export function balanceFlags(acts, baseline = null) {
  const m = balanceMetrics(acts), out = [];
  if (m.mcq < LIMITS.minMcq) return out;
  const fairSlot = 1 / m.avgOptions;
  const test = (rule, value, limit, detail) => {
    const allowed = baseline && baseline[rule] !== undefined ? Math.max(limit, baseline[rule]) : limit;
    if (value > allowed + 1e-9) out.push({ rule, value: +value.toFixed(3), limit: +allowed.toFixed(3), detail });
  };
  test("position-skew", m.slotShare, fairSlot + LIMITS.position, `slot ${m.slot} (${"ABCD"[m.slot] || m.slot}) holds ${Math.round(m.slotShare * 100)}% of right answers (fair ≈ ${Math.round(fairSlot * 100)}%)`);
  test("position-run", m.run, LIMITS.run - 1, `${m.run} MCQs in a row share the same answer slot`);
  test("longest-skew", m.longest, m.chance + LIMITS.longest, `right answer is the longest in ${Math.round(m.longest * 100)}% (chance ≈ ${Math.round(m.chance * 100)}%)`);
  test("shortest-skew", m.shortest, m.chance + LIMITS.shortest, `right answer is the shortest in ${Math.round(m.shortest * 100)}% (chance ≈ ${Math.round(m.chance * 100)}%)`);
  test("absolute-skew", m.absolute, LIMITS.absolute, `${Math.round(m.absolute * 100)}% of MCQs have absolute words only in distractors`);
  // Upside-down tells: "never pick the longest/shortest" is just as exploitable.
  if (m.longest < m.chance - LIMITS.longestLow) out.push({ rule: "longest-low", value: +m.longest.toFixed(3), limit: +(m.chance - LIMITS.longestLow).toFixed(3), detail: `right answer is the longest in only ${Math.round(m.longest * 100)}% (chance ≈ ${Math.round(m.chance * 100)}%): lengthen some right answers` });
  if (m.shortest < m.chance - LIMITS.shortestLow) out.push({ rule: "shortest-low", value: +m.shortest.toFixed(3), limit: +(m.chance - LIMITS.shortestLow).toFixed(3), detail: `right answer is the shortest in only ${Math.round(m.shortest * 100)}% (chance ≈ ${Math.round(m.chance * 100)}%): shorten some right answers` });
  test("rationale-skew", Math.abs(m.rationale), LIMITS.rationale, `wrong and right options differ by ${Math.round(m.rationale * 100)} points in how often they carry a justification clause`);
  return out;
}
