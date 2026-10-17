import { getAdapter } from "./adapters/index.js";
import { MISSIONS } from "../data/missions.js";
import { ProgressService } from "./ProgressService.js";
import { XPService } from "./XPService.js";
import { BadgeService } from "./BadgeService.js";
import { TAXONOMY } from "../data/taxonomy.js";

const runId = (studentId, missionId) => `${studentId}__${missionId}`;

export const MissionService = {
  all: () => MISSIONS,
  byId: id => MISSIONS.find(m => m.id === id),

  async getRun(studentId, missionId) {
    return (await getAdapter().get("mission_runs", runId(studentId, missionId))) || { answers: {}, completed_at: null };
  },

  /* Foundation-first: a mission opens only when the child has started the foundation of every
     skill it uses; the boss also needs finished missions. Returns the reasons it is still closed. */
  async availability(studentId, mission) {
    const reasons = [];
    for (const [skill, min] of Object.entries(mission.requires.skills || {})) {
      const done = Object.keys(await ProgressService.getForStudent(studentId, skill)).length;
      if (done < min) reasons.push({ text: `${TAXONOMY[skill].name}: kerjakan ${min - done} aktivitas lagi`, skill });
    }
    const need = mission.requires.missions || 0;
    if (need) {
      const finished = (await this.summary(studentId, { skipAvailability: true })).filter(m => m.kind === "mission" && m.completed).length;
      if (finished < need) reasons.push({ text: `Selesaikan ${need - finished} misi lagi` });
    }
    return { open: reasons.length === 0, reasons };
  },

  async summary(studentId, { skipAvailability = false } = {}) {
    return Promise.all(MISSIONS.map(async m => {
      const run = await this.getRun(studentId, m.id);
      const answers = Object.values(run.answers);
      const graded = answers.filter(a => a.gradable);
      return {
        id: m.id, kind: m.kind, title: m.title, icon: m.icon, total: m.steps.length, done: answers.length,
        completed: !!run.completed_at, correct: graded.filter(a => a.correct).length, graded: graded.length,
        availability: skipAvailability ? null : await this.availability(studentId, m),
      };
    }));
  },

  /* One attempt per step (applied work, not drill). Every answer is also stored as a row
     tagged with the skill it is evidence for, so progress is still tracked per skill. */
  async answer({ studentId, mission, step, result, choice }) {
    const adapter = getAdapter();
    const id = runId(studentId, mission.id);
    const run = (await adapter.get("mission_runs", id)) || { id, student_id: studentId, mission_id: mission.id, answers: {}, completed_at: null };
    if (run.answers[step.n]) return { run, newBadges: [] };           // already answered; ignore double-submit
    await adapter.put("mission_answers", { student_id: studentId, mission_id: mission.id, step: step.n, skill_id: step.skill,
      correct: !!result.correct, gradable: !!result.gradable, choice: choice ?? null });
    run.answers = { ...run.answers, [step.n]: { correct: !!result.correct, gradable: !!result.gradable, at: Date.now() } };
    if (Object.keys(run.answers).length === mission.steps.length && !run.completed_at) run.completed_at = new Date().toISOString();
    await adapter.put("mission_runs", run);
    await XPService.award(studentId, result.gradable ? (result.correct ? 10 : 2) : 8, false);
    return { run, newBadges: await BadgeService.checkAndAward(studentId) };
  },
};
