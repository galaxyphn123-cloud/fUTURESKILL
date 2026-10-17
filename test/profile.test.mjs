import assert from "node:assert/strict";
const mem = new Map();
globalThis.localStorage = {
  get length() { return mem.size; }, key: i => [...mem.keys()][i] ?? null,
  getItem: k => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => void mem.set(k, String(v)), removeItem: k => void mem.delete(k),
};
const { ClassService } = await import("../src/services/ClassService.js");
const { AttemptService } = await import("../src/services/AttemptService.js");
const { ProfileService } = await import("../src/services/ProfileService.js");
const { QuestionService } = await import("../src/services/QuestionService.js");
const { StudentService } = await import("../src/services/StudentService.js");

const cls = await ClassService.createClass("t1", "Kelas 3B");
const ani = await ClassService.enroll(cls.id, "Ani");
const budi = await ClassService.enroll(cls.id, "Budi");
assert.match(ani.parent_code, /^[A-HJKMNP-Z2-9]{6}$/); assert.notEqual(ani.parent_code, budi.parent_code);
assert.equal((await ClassService.findByParentCode(ani.parent_code.toLowerCase())).id, ani.id);
assert.equal(await ClassService.findByParentCode("ZZZZZZ"), null);

const play = async (skill, n, correct, isRetry = false) => AttemptService.submitAnswer({
  studentId: ani.id, sessionId: "s", skillId: skill, activity: QuestionService.listForSkill(skill)[n - 1],
  result: { correct, gradable: true }, isRetry, choice: 0, timeMs: 900 });

// empty profile: nothing earned, no recommendation, no crash
let p = await ProfileService.load(ani.id);
assert.equal(p.totals.done, 0); assert.equal(p.recommended, null); assert.equal(p.domains.length, (await import("../src/data/domains.js")).DOMAINS.length);

// first answer earns "first_step" once, and only once
let r = await play("M-01", 1, true);
assert.deepEqual(r.newBadges.map(b => b.id), ["first_step"]);
r = await play("M-01", 2, true); assert.equal(r.newBadges.length, 0);

// six first-try answers in strand 1 (5 right, 1 wrong) -> micro-skill TUNTAS (83%)
for (let n = 3; n <= 5; n++) await play("M-01", n, true);
r = await play("M-01", 6, false);
p = await ProfileService.load(ani.id);
const m = p.skills[0];
assert.equal(m.mastered, 1); assert.equal(m.level, 2);
assert.equal(p.domains.find(d => d.id === "MATH").mastered, 1);
assert.equal(p.domains.find(d => d.id === "MATH").level, 1);          // 1 + floor(1/3)
assert.ok((await StudentService.getById(ani.id)).badges.some(b => b.id === "micro_1"));
assert.equal(p.strengths[0].pct, 83); assert.equal(p.growth.length, 0);
// the miss is retried and fixed -> counted as a recovered activity, not as mastery
await play("M-01", 6, true, true);
assert.equal((await ProfileService.load(ani.id)).totals.retriesFixed, 1);

// recommendation continues in the most recent skill, at the next unfinished strand
assert.equal(p.recommended.skillId, "M-01"); assert.ok(p.recommended.micro);

// growth areas appear once a strand has enough attempts and is below 80%
for (let n = 11; n <= 15; n++) await play("M-01", n, n === 11);   // 1/5 = 20%
p = await ProfileService.load(ani.id);
assert.equal(p.growth[0].pct, 20);
assert.equal(p.recommended.micro, p.skills[0].micro[1].name, "most recent strand is the one to practise");

// badge duplication guard and cross-skill badges
await play("CT-01", 1, true); await play("CT-02", 1, true);
const ids = (await StudentService.getById(ani.id)).badges.map(b => b.id);
assert.equal(new Set(ids).size, ids.length); assert.ok(ids.includes("explorer"));
console.log("profile: all assertions passed");
