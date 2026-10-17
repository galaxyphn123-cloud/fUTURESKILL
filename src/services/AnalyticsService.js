import { getAdapter } from "./adapters/index.js";
import { getBackendMode } from "./backendConfig.js";
import { nowISO } from "../engine/ids.js";
import { ClassService } from "./ClassService.js";
import { ProgressService } from "./ProgressService.js";
import { QuestionService } from "./QuestionService.js";
import { MasteryService } from "./MasteryService.js";
import { microMastery } from "../engine/metadata.js";

const MIN_ANSWERS = 2; // an item needs a couple of first tries before it can be called hard/easy

export const AnalyticsService = {
  /* CLASS OVERVIEW — one row per enrolled child for the session's skill. */
  async classOverview(session) {
    const activities = QuestionService.listForSkill(session.skill_id);
    const roster = await ClassService.roster(session.class_id);
    const rows = await Promise.all(roster.map(async s => {
      const progress = await ProgressService.getForStudent(s.id, session.skill_id);
      const done = Object.keys(progress).length;
      const last = Math.max(0, ...Object.values(progress).map(r => r.at || 0));
      return {
        id: s.id, name: s.name, code: s.code, xp: s.xp || 0, streak: s.streak || 0,
        done, completion: Math.round((done / activities.length) * 100),
        accuracy: MasteryService.accuracy(progress),
        phase: MasteryService.highestUnlockedPhase(progress, activities), lastActive: last || null,
      };
    }));
    const active = rows.filter(r => r.done > 0);
    return {
      rows: rows.sort((a, b) => a.name.localeCompare(b.name)),
      total: rows.length, active: active.length,
      avgCompletion: rows.length ? Math.round(rows.reduce((s, r) => s + r.completion, 0) / rows.length) : 0,
      avgAccuracy: active.length ? Math.round(active.reduce((s, r) => s + r.accuracy, 0) / active.length) : 0,
    };
  },

  /* STUDENT DETAIL — micro-skill mastery plus every missed item with what they chose. */
  async studentDetail(studentId, skillId) {
    const progress = await ProgressService.getForStudent(studentId, skillId);
    const answers = (await getAdapter().list("answers", a => a.student_id === studentId && a.skill_id === skillId))
      .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
    const mistakes = answers.filter(a => a.gradable && !a.correct).map(a => {
      const act = QuestionService.byN(skillId, a.n);
      return { n: a.n, q: act.q, chosen: describeChoice(act, a.choice), expected: describeExpected(act), explain: act.explain, retry: a.is_retry };
    });
    return { micro: microMastery(skillId, progress), mistakes, attempts: answers.length };
  },

  /* QUESTION ANALYTICS — hardest / easiest by first-try accuracy, plus the commonest wrong choice. */
  async questionAnalytics(session) {
    const answers = await getAdapter().list("answers", a => a.session_id === session.id && a.gradable && !a.is_retry);
    const byN = {};
    answers.forEach(a => { (byN[a.n] ||= []).push(a); });
    const items = Object.entries(byN).filter(([, v]) => v.length >= MIN_ANSWERS).map(([n, v]) => {
      const act = QuestionService.byN(session.skill_id, Number(n));
      const wrong = v.filter(a => !a.correct), tally = {};
      wrong.forEach(a => { const k = describeChoice(act, a.choice); tally[k] = (tally[k] || 0) + 1; });
      const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
      return { n: Number(n), q: act.q, attempts: v.length, accuracy: Math.round(((v.length - wrong.length) / v.length) * 100), commonMistake: top ? { text: top[0], count: top[1] } : null };
    });
    items.sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);
    return { hardest: items.slice(0, 5), easiest: [...items].reverse().slice(0, 5), analysed: items.length };
  },

  /* migration-ready export/import */
  async exportAll() {
    const adapter = getAdapter();
    const dump = { exported_at: nowISO(), mode: getBackendMode(), data: {} };
    for (const c of ["teachers", "classes", "students", "sessions", "answers", "progress"]) dump.data[c] = await adapter.list(c);
    return dump;
  },
  async importAll(dump) {
    // LOCAL DATA → VALIDATE → UPLOAD. Ids are kept: sessions, rosters and progress reference each other by id.
    if (!dump || !dump.data) throw new Error("Invalid export file");
    const adapter = getAdapter();
    for (const [collection, records] of Object.entries(dump.data)) for (const rec of records) await adapter.put(collection, rec);
    return { importedCollections: Object.keys(dump.data) };
  },
};

function describeChoice(act, choice) {
  if (choice === null || choice === undefined) return "(tidak tercatat)";
  if (act.type === "mcq") return act.options[choice] ?? String(choice);
  if (act.type === "tf") return choice ? "Benar" : "Salah";
  return String(choice);
}

function describeExpected(act) {
  if (act.type === "order") return act.answer.map(i => act.items[i]).join(" → ");
  if (act.type === "classify") return act.groups.map(g => `${g}: ${act.answer[g].join(", ")}`).join(" | ");
  return describeChoice(act, act.answer);
}
