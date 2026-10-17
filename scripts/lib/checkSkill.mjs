/* Machine-checkable part of the Phase 27 quality check, shared by the repo-wide report
   and the per-file validator used while authoring a new skill. */
const maxQ = n => (n <= 60 ? 420 : 600), maxOpt = n => (n <= 60 ? 160 : 240);
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export function checkSkill(skill, acts, { metaCheck = null } = {}) {
  const flags = [];
  const flag = (n, rule, detail) => flags.push({ skill, n, rule, detail });
  const seen = new Map();
  if (acts.length < 100) flag(0, "min-100", `only ${acts.length}`);
  acts.forEach((a, i) => {
    if (a.n !== i + 1) flag(a.n, "sequence", `expected n=${i + 1}`);
    for (const f of ["q", "explain", "hint", "micro"]) if (!a[f] || !String(a[f]).trim()) flag(a.n, "missing-field", f);
    if (metaCheck) metaCheck(skill, a, flag);
    if (a.q && a.q.length > maxQ(a.n)) flag(a.n, "too-long", `${a.q.length} chars`);
    if (a.type === "mcq") {
      if (!Array.isArray(a.options) || a.options.length < 2) flag(a.n, "options", "needs >=2");
      else {
        if (!Number.isInteger(a.answer) || a.answer < 0 || a.answer >= a.options.length) flag(a.n, "answer-range", String(a.answer));
        const set = new Set(a.options.map(o => String(o).trim().toLowerCase()));
        if (set.size !== a.options.length) flag(a.n, "duplicate-options", "two options are identical");
        a.options.forEach(o => { if (o.length > maxOpt(a.n)) flag(a.n, "option-long", o.slice(0, 40)); });
        // Length cue: a child can "win" by always picking the longest sentence. Flag when the right
        // answer is the unique longest and clearly longer (>=20%) than every distractor.
        const L = a.options.map(o => o.length), right = L[a.answer], others = L.filter((_, k) => k !== a.answer);
        if (a.options.every(o => o.length >= 20) && others.every(l => right >= l * 1.2)) flag(a.n, "length-cue", `correct ${right} chars vs ${Math.max(...others)}`);
      }
    } else if (a.type === "tf") {
      if (typeof a.answer !== "boolean") flag(a.n, "answer-type", "tf needs boolean");
    } else if (a.type === "order") {
      if (!a.items || !Array.isArray(a.answer) || a.answer.length !== a.items.length || new Set(a.answer).size !== a.items.length) flag(a.n, "order-shape", "answer must be a permutation");
    } else if (a.type === "classify") {
      const all = new Set((a.groups || []).flatMap(g => a.answer?.[g] || []));
      const placed = (a.groups || []).flatMap(g => a.answer?.[g] || []);
      if (!a.items || !a.groups || a.items.some(it => !all.has(it))) flag(a.n, "classify-shape", "every item needs a group");
      else if (placed.length !== a.items.length) flag(a.n, "classify-shape", "an item sits in two groups or a stray item exists");
    } else if (a.type === "open") {
      if (!a.sample) flag(a.n, "open-sample", "missing model answer");
    } else flag(a.n, "unknown-type", a.type);
    if (a.type === "mcq" && a.options && Number.isInteger(a.answer) && a.hint) {
      const ans = norm(a.options[a.answer] || "");
      if (ans.length > 12 && norm(a.hint).includes(ans)) flag(a.n, "hint-leak", "hint contains the correct option");
    }
    const key = a.q.trim().toLowerCase() + "|" + JSON.stringify(a.options || a.items || a.answer);
    if (seen.has(key)) flag(a.n, "duplicate-question", `identical question and answer set as #${seen.get(key)}`);
    else seen.set(key, a.n);
  });
  return flags;
}

/* Authoring-time statistics: not hard failures, but they reveal lazy patterns. */
export function statsFor(acts) {
  const types = {}, pos = {};
  let mcq = 0, longest = 0, shortest = 0;
  acts.forEach(a => {
    types[a.type] = (types[a.type] || 0) + 1;
    if (a.type === "mcq") {
      mcq++; pos[a.answer] = (pos[a.answer] || 0) + 1;
      const lens = a.options.map(o => o.length);
      if (lens[a.answer] === Math.max(...lens) && lens.filter(l => l === lens[a.answer]).length === 1) longest++;
      if (lens[a.answer] === Math.min(...lens) && lens.filter(l => l === lens[a.answer]).length === 1) shortest++;
    }
  });
  const phaseTypes = [0, 1, 2, 3, 4].map(p => acts.slice(p * 20, p * 20 + 20).filter(a => a.type !== "mcq").length);
  const microPerStrand = Array.from({ length: 10 }, (_, b) => new Set(acts.slice(b * 10, b * 10 + 10).map(a => a.micro)).size);
  return { types, answerPosition: pos, mcq, longestAnswerShare: mcq ? Math.round((longest / mcq) * 100) : 0, shortestAnswerShare: mcq ? Math.round((shortest / mcq) * 100) : 0, nonMcqPerPhase: phaseTypes, distinctMicroPerStrand: microPerStrand };
}
