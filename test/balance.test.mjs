// Guards the content-leak engine itself: a synthetic skill with the classic tells must be rejected,
// and a balanced one must pass.
import assert from "node:assert/strict";
import { balanceFlags } from "../scripts/lib/skillBalance.mjs";
import { checkSkill } from "../scripts/lib/checkSkill.mjs";

const mk = (n, answer, texts) => ({ n, type: "mcq", micro: "m", q: "Soal " + n + "?", options: texts, answer, explain: "e", hint: "h" });
const rot = i => i % 3;
const make = f => Array.from({ length: 60 }, (_, i) => f(i + 1, i));

// 1. every right answer in slot A
const allA = make((n) => mk(n, 0, ["Jawaban benar yang rapi", "Pengecoh pertama yang wajar", "Pengecoh kedua yang wajar"]));
assert.ok(balanceFlags(allA).some(f => f.rule === "position-skew"), "slot A clustering must be flagged");
assert.ok(balanceFlags(allA).some(f => f.rule === "position-run"), "runs of the same slot must be flagged");

// 2. right answer is usually the longest (but never by 20%, so per-item rules miss it)
const longRight = make((n, i) => { const a = rot(i); const o = ["Pengecoh pendek satu dua", "Pengecoh pendek dua tiga"]; o.splice(a, 0, "Jawaban benar agak panjang"); return mk(n, a, o); });
assert.equal(checkSkill("T", longRight).filter(f => f.rule === "length-cue").length, 0);
assert.ok(balanceFlags(longRight).some(f => f.rule === "longest-skew"), "long-answer skew must be flagged");

// 3. absolute words only in distractors
const absSkew = make((n, i) => { const a = rot(i); const o = ["Dia selalu menang", "Hasilnya pasti sama"]; o.splice(a, 0, "Hasilnya bisa berbeda tiap kali"); return mk(n, a, o); });
assert.ok(balanceFlags(absSkew).some(f => f.rule === "absolute-skew"), "absolute-word skew must be flagged");

// 3b. justification clause only in wrong options
const ratSkew = make((n, i) => { const a = rot(i); const o = ["Salah karena alasan yang keliru", "Salah sehingga hasilnya rusak"]; o.splice(a, 0, "Benar dan ringkas saja ya"); return mk(n, a, o); });
assert.ok(balanceFlags(ratSkew).some(f => f.rule === "rationale-skew"), "rationale-clause skew must be flagged");

// 4. balanced: rotating slots, right answer longest/shortest/middle in equal parts
const ok = make((n, i) => { const a = rot(i); const len = [["Benar yang paling panjang sekali di sini", "Salah satu yang cukup pendek", "Salah dua yang sedang saja"], ["Benar pendek saja", "Salah satu lebih panjang dari itu", "Salah dua yang paling panjang dari semuanya"], ["Benar yang sedang saja ya", "Salah satu pendek", "Salah dua paling panjang nih ya betul"]][i % 3]; const o = [len[1], len[2]]; o.splice(a, 0, len[0]); return mk(n, a, o); });
assert.deepEqual(balanceFlags(ok), []);

// 5. baseline ratchet: a legacy skill may stay at its recorded skew but not worsen
const flags = balanceFlags(longRight);
const longest = flags.find(f => f.rule === "longest-skew").value;
assert.deepEqual(balanceFlags(longRight, { "longest-skew": longest }).filter(f => f.rule === "longest-skew"), []);
assert.ok(balanceFlags(longRight, { "longest-skew": longest - 0.1 }).some(f => f.rule === "longest-skew"));
// 6. upside-down tells: right answer is never the longest
const neverLongest = make((n, i) => { const a = rot(i); const o = ["Pengecoh yang lebih panjang satu", "Pengecoh yang lebih panjang dua"]; o.splice(a, 0, "Jawaban benar pendek"); return mk(n, a, o); });
assert.ok(balanceFlags(neverLongest).some(f => f.rule === "longest-low"), "never-longest must be flagged");
console.log("balance engine: all assertions passed");
