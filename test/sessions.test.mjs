import assert from "node:assert/strict";
const mem = new Map();
globalThis.localStorage = {
  get length() { return mem.size; }, key: i => [...mem.keys()][i] ?? null,
  getItem: k => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => void mem.set(k, String(v)), removeItem: k => void mem.delete(k),
};
const { TeacherService } = await import("../src/services/TeacherService.js");
const { ClassService } = await import("../src/services/ClassService.js");
const { SessionService } = await import("../src/services/SessionService.js");
const { AttemptService } = await import("../src/services/AttemptService.js");
const { AnalyticsService } = await import("../src/services/AnalyticsService.js");
const { QuestionService } = await import("../src/services/QuestionService.js");

// teacher gate
assert.equal(await TeacherService.exists(), false);
await assert.rejects(() => TeacherService.setup("Bu Ani", "12"), /PIN/);
const t = await TeacherService.setup("Bu Ani", "4321");
assert.equal(await TeacherService.login("0000"), null);
assert.equal((await TeacherService.login("4321")).id, t.id);
assert.ok(!JSON.stringify([...mem.values()]).includes("4321"), "PIN must not be stored in clear");

// class + roster + student codes
const cls = await ClassService.createClass(t.id, "Kelas 2A");
const budi = await ClassService.enroll(cls.id, "Budi");
const sari = await ClassService.enroll(cls.id, "Sari");
assert.equal((await ClassService.enroll(cls.id, "  budi ")).id, budi.id, "same name must not create a second profile");
assert.match(budi.code, /^[A-HJKMNP-Z2-9]{4}$/);
assert.equal((await ClassService.identify(cls.id, budi.code.toLowerCase())).id, budi.id);
assert.equal((await ClassService.identify(cls.id, "SARI")).id, sari.id);
assert.equal(await ClassService.identify(cls.id, "nobody"), null);

// session codes: 6 digits, unique among open sessions, only open ones resolve
const s1 = await SessionService.create({ classId: cls.id, skillId: "M-01" });
const s2 = await SessionService.create({ classId: cls.id, skillId: "CT-01" });
assert.match(s1.code, /^\d{6}$/); assert.notEqual(s1.code, s2.code);
assert.equal((await SessionService.findOpenByCode(s1.code)).id, s1.id);
assert.equal(await SessionService.findOpenByCode("000000"), null);
await SessionService.close(s2.id);
assert.equal(await SessionService.findOpenByCode(s2.code), null);

// attempts persisted per session; analytics
const acts = QuestionService.listForSkill("M-01");
const play = (student, n, correct, choice, isRetry = false) => AttemptService.submitAnswer({
  studentId: student.id, sessionId: s1.id, skillId: "M-01", activity: acts[n - 1],
  result: { correct, gradable: true }, isRetry, choice, timeMs: 1500 });
await play(budi, 1, true, 0); await play(sari, 1, false, 1);
await play(sari, 1, true, 0, true);                       // retry fixes it but first try stays a miss
await play(budi, 2, false, 1); await play(sari, 2, false, 1);
const ov = await AnalyticsService.classOverview(s1);
assert.equal(ov.total, 2); assert.equal(ov.active, 2);
const rb = ov.rows.find(r => r.name === "Budi"), rs = ov.rows.find(r => r.name === "Sari");
assert.equal(rb.done, 2); assert.equal(rb.accuracy, 50); assert.equal(rs.accuracy, 0, "retry must not count as mastery");
assert.ok(rb.xp > 0 && rb.completion === 2);
const qa = await AnalyticsService.questionAnalytics(s1);
assert.equal(qa.hardest[0].n, 2); assert.equal(qa.hardest[0].accuracy, 0);
assert.equal(qa.hardest[0].commonMistake.count, 2);
assert.equal(qa.easiest[0].n, 1); assert.equal(qa.easiest[0].accuracy, 50);
const det = await AnalyticsService.studentDetail(sari.id, "M-01");
assert.equal(det.attempts, 3); assert.equal(det.mistakes.length, 2); assert.equal(det.mistakes[0].chosen, acts[0].options[1]);
assert.equal(det.micro.length, 10);

// export/import keeps ids so references survive a round trip
const dump = await AnalyticsService.exportAll();
mem.clear();
await AnalyticsService.importAll(dump);
assert.equal((await SessionService.findOpenByCode(s1.code)).id, s1.id);
assert.equal((await ClassService.roster(cls.id)).length, 2);
console.log("sessions: all assertions passed");
