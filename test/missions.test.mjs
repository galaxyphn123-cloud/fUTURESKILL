import assert from "node:assert/strict";
const mem = new Map();
globalThis.localStorage = {
  get length() { return mem.size; }, key: i => [...mem.keys()][i] ?? null,
  getItem: k => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => void mem.set(k, String(v)), removeItem: k => void mem.delete(k),
};
const { MISSIONS } = await import("../src/data/missions.js");
const { PROJECTS, RUBRIC } = await import("../src/data/projects.js");
const { DOMAINS } = await import("../src/data/domains.js");
const { TAXONOMY } = await import("../src/data/taxonomy.js");
const { ClassService } = await import("../src/services/ClassService.js");
const { AttemptService } = await import("../src/services/AttemptService.js");
const { QuestionService } = await import("../src/services/QuestionService.js");
const { MissionService } = await import("../src/services/MissionService.js");
const { ReflectionService } = await import("../src/services/ReflectionService.js");
const { ProjectService } = await import("../src/services/ProjectService.js");
const { ProfileService } = await import("../src/services/ProfileService.js");

// ---- content integrity ----
for (const m of MISSIONS) {
  assert.ok(m.steps.length >= 6, m.id + " needs a real arc");
  m.steps.forEach((s, i) => {
    assert.equal(s.n, i + 1, m.id + " step numbering");
    assert.ok(TAXONOMY[s.skill], m.id + " unknown skill " + s.skill);
    assert.ok(s.q && s.explain, m.id + "#" + s.n + " text");
    if (s.type === "mcq") { assert.ok(s.options.length >= 2 && new Set(s.options).size === s.options.length); assert.ok(Number.isInteger(s.answer) && s.answer < s.options.length); assert.ok(s.hint); }
    if (s.type === "tf") assert.equal(typeof s.answer, "boolean");
    if (s.type === "order") assert.deepEqual([...s.answer].sort(), s.items.map((_, k) => k));
    if (s.type === "classify") assert.deepEqual(Object.values(s.answer).flat().sort(), [...s.items].sort());
    if (s.type === "open") assert.ok(s.sample);
  });
  for (const k of Object.keys(m.requires.skills || {})) assert.ok(TAXONOMY[k]);
}
assert.ok(MISSIONS.some(m => m.kind === "boss"));
assert.equal(DOMAINS.every(d => PROJECTS.some(p => p.domain === d.id)), true, "every domain needs a project");
assert.equal(RUBRIC.length, 6);
// the boss arithmetic the story depends on
const boss = MISSIONS.find(m => m.kind === "boss");
assert.equal(40000 + 9 * 5000 + 9 * 3000, 112000); assert.equal(120000 - 112000, 8000);
assert.equal(boss.steps[3].options[boss.steps[3].answer], "Rp 8.000");
const shop = MISSIONS.find(m => m.id === "smart_shopper");
assert.equal(shop.steps[1].options[shop.steps[1].answer], "Rp 13.500");

// ---- flow ----
const cls = await ClassService.createClass("t1", "Kelas 4C");
const kid = await ClassService.enroll(cls.id, "Dewi");
const doAct = (skill, n) => AttemptService.submitAnswer({ studentId: kid.id, sessionId: "s", skillId: skill, activity: QuestionService.listForSkill(skill)[n - 1], result: { correct: true, gradable: true }, choice: 0 });

let a = await MissionService.availability(kid.id, shop);
assert.equal(a.open, false); assert.equal(a.reasons.length, 2);
for (let n = 1; n <= 10; n++) await doAct("M-08", n);
a = await MissionService.availability(kid.id, shop);
assert.equal(a.reasons.length, 1, "one prerequisite left");
for (let n = 1; n <= 10; n++) await doAct("CT-02", n);
assert.equal((await MissionService.availability(kid.id, shop)).open, true);

let last;
for (const step of shop.steps) {
  const correct = step.type === "open" ? true : step.type === "tf" ? step.answer : true;
  last = await MissionService.answer({ studentId: kid.id, mission: shop, step, result: { correct, gradable: step.type !== "open" }, choice: step.answer ?? null });
}
assert.ok(last.run.completed_at, "completes after the last step");
const again = await MissionService.answer({ studentId: kid.id, mission: shop, step: shop.steps[0], result: { correct: false, gradable: true } });
assert.equal(again.run.answers[1].correct, true, "a step cannot be overwritten");
const sum = (await MissionService.summary(kid.id)).find(m => m.id === "smart_shopper");
assert.equal(sum.completed, true); assert.equal(sum.done, 7);
// mission work does not touch the 100-activity progress
const { ProgressService } = await import("../src/services/ProgressService.js");
assert.equal(Object.keys(await ProgressService.getForStudent(kid.id, "M-08")).length, 10);

// boss stays closed until two missions are done
let b = await MissionService.availability(kid.id, boss);
assert.ok(b.reasons.some(r => /misi lagi/.test(r.text)));
for (const id of ["safe_online", "fact_detective"]) {
  const m = MissionService.byId(id);
  for (const [k, min] of Object.entries(m.requires.skills)) for (let n = 1; n <= min; n++) await doAct(k, n);
  for (const step of m.steps) await MissionService.answer({ studentId: kid.id, mission: m, step, result: { correct: true, gradable: step.type !== "open" } });
}
b = await MissionService.availability(kid.id, boss);
assert.equal(b.open, true);

// reflection
await assert.rejects(() => ReflectionService.save(kid.id, { type: "mission", id: "smart_shopper" }, { learned: "  " }), /minimal satu/);
const rf = await ReflectionService.save(kid.id, { type: "mission", id: "smart_shopper", title: "x" }, { learned: "Membandingkan harga per satuan", hardest: "" });
assert.deepEqual(Object.keys(rf.reflection.answers), ["learned"]);
assert.ok(rf.newBadges.some(b => b.id === "reflect_1"));

// project: validation, submit, teacher rating, lock
const proj = PROJECTS[0];
const good = { understanding: 2, reasoning: 2, creativity: 3, application: 2, communication: 2, reflection: 1 };
await assert.rejects(() => ProjectService.submit({ studentId: kid.id, projectId: proj.id, answers: ["a"], selfRating: good }), /Jawab semua/);
await assert.rejects(() => ProjectService.submit({ studentId: kid.id, projectId: proj.id, answers: proj.prompts.map(() => "isi"), selfRating: { ...good, reasoning: 5 } }), /Nilai dirimu/);
const sub = await ProjectService.submit({ studentId: kid.id, projectId: proj.id, answers: proj.prompts.map((_, i) => "jawaban " + i), selfRating: good });
assert.ok(sub.newBadges.some(b => b.id === "project_1"));
await ProjectService.submit({ studentId: kid.id, projectId: proj.id, answers: proj.prompts.map((_, i) => "revisi " + i), selfRating: good }); // resubmit before review ok
await assert.rejects(() => ProjectService.rate({ submissionId: sub.submission.id, scores: { ...good, creativity: 0 } }), /1–3/);
const rated = await ProjectService.rate({ submissionId: sub.submission.id, scores: good, comment: "Bagus sekali!" });
assert.equal(rated.status, "reviewed");
await assert.rejects(() => ProjectService.submit({ studentId: kid.id, projectId: proj.id, answers: proj.prompts.map(() => "x"), selfRating: good }), /sudah dinilai/);

// profile + badges
const p = await ProfileService.load(kid.id);
assert.equal(p.totals.missionsCompleted, 3); assert.equal(p.totals.projectsSubmitted, 1); assert.equal(p.totals.reflections, 1);
const held = (await (await import("../src/services/StudentService.js")).StudentService.getById(kid.id)).badges.map(x => x.id);
for (const id of ["mission_1", "project_1", "reflect_1"]) assert.ok(held.includes(id), id);
console.log("missions/projects/reflection: all assertions passed");
