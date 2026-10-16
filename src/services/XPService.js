import { getAdapter } from "./adapters/index.js";

export const XPService = {
  async award(studentId, delta, bumpStreak) {
    const adapter = getAdapter();
    const student = await adapter.get("students", studentId);
    const updated = { ...student, xp: (student.xp || 0) + delta, streak: bumpStreak ? (student.streak || 0) + 1 : (delta <= 2 ? 0 : student.streak) };
    return adapter.put("students", updated);
  },
};
