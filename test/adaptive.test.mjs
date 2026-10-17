import assert from "node:assert/strict";
import { pickNext } from "../src/engine/adaptive.js";
import { SKILL_CONTENT } from "../src/data/skillContent.js";

const acts = SKILL_CONTENT["M-01"];
const r = (correct, at, extra = {}) => ({ correct, gradable: true, firstTry: correct, at, attempts: 1, ...extra });
const run = (progress) => pickNext({ activities: acts, progress });

// fresh student starts at the foundation
assert.equal(run({}).activity.n, 1);
assert.equal(run({}).mode, "steady");

// steady: next unanswered in order
const mixed = run({ 1: r(true, 1), 2: r(false, 2) });
assert.equal(mixed.mode, "steady");
assert.equal(mixed.activity.n, 3);

// hot streak (3 first-try correct) advances past the immediate next
const hot = run({ 1: r(true, 1), 2: r(true, 2), 3: r(true, 3) });
assert.equal(hot.mode, "advance");
assert.ok(hot.activity.n >= 6, "advance should skip ahead, got " + hot.activity.n);

// two misses in a row -> support, revisits a missed activity (nothing easier unanswered)
const cold = run({ 1: r(true, 1), 2: r(true, 2), 3: r(true, 3), 4: r(true, 4), 5: r(true, 5), 6: r(true, 6), 7: r(true, 7), 8: r(true, 8), 9: r(true, 9), 10: r(false, 10), 11: r(false, 11) });
assert.equal(cold.mode, "support");

// never jumps into a locked phase: phase A done with 0% -> phase B stays locked
const failA = {}; for (let i = 1; i <= 20; i++) failA[i] = r(false, i);
const next = run(failA);
assert.ok(next.activity && next.activity.n <= 20, "locked phase B must not be offered");
assert.equal(next.mode, "support");

// retry does not inflate mastery: firstTry stays false though correct now
const retried = { 1: { correct: true, gradable: true, firstTry: false, at: 1, attempts: 2 } };
assert.equal(run(retried).mode, "steady");
console.log("adaptive: all assertions passed");

// --- metadata + micro-skill mastery ---
import { activityMeta, microMastery } from "../src/engine/metadata.js";
import { TAXONOMY } from "../src/data/taxonomy.js";
const m = activityMeta("M-03", acts[0]);
for (const k of ["domain","skill","micro_skill","age_level","phase","difficulty","cognitive_load","activity_type","learning_objective","estimated_time","prerequisite_skill","mastery_requirement"]) assert.ok(k in m, "missing " + k);
assert.equal(m.phase, "A"); assert.equal(activityMeta("M-03", acts[99]).difficulty, 10);
const mm = microMastery("M-03", {});
assert.equal(mm.length, 10); assert.equal(mm[0].label, "BELUM DIMULAI");
const six = {}; for (let i = 1; i <= 6; i++) six[i] = r(i !== 6, i);   // 5/6 first-try = 83%
const m6 = microMastery("M-03", six)[0];
assert.equal(m6.pct, 83); assert.equal(m6.label, "TUNTAS");
const few = microMastery("M-03", { 1: r(true, 1) })[0];       // 1 attempt is never enough to call it mastered
assert.equal(few.label, "SEDANG DIBANGUN");
assert.equal(Object.values(TAXONOMY).every(t => t.micro.length === 10), true);
console.log("metadata + micro mastery: all assertions passed");
