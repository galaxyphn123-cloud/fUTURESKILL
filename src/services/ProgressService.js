import { getAdapter } from "./adapters/index.js";

export const ProgressService = {
  key(studentId, skillId) { return `${studentId}__${skillId}`; },
  async getForStudent(studentId, skillId) {
    const adapter = getAdapter();
    const rec = await adapter.get("progress", this.key(studentId, skillId));
    return rec ? rec.results : {};
  },
  async recordResult(studentId, skillId, n, result) {
    const adapter = getAdapter();
    const id = this.key(studentId, skillId);
    const existing = (await adapter.get("progress", id)) || { id, student_id: studentId, skill_id: skillId, results: {} };
    const prev = existing.results[n];
    existing.results = { ...existing.results, [n]: {
      ...result,
      attempts: (prev?.attempts || 0) + 1,
      firstTry: prev ? prev.firstTry : (result.gradable ? result.correct : true),
      at: Date.now(),
    } };
    await adapter.put("progress", existing);
    return existing.results;
  },
};
