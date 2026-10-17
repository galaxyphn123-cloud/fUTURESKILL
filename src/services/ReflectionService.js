import { getAdapter } from "./adapters/index.js";
import { REFLECTION_QUESTIONS } from "../data/projects.js";
import { BadgeService } from "./BadgeService.js";

export const ReflectionService = {
  /* One reflection per (child, thing reflected on); saving again updates it. */
  async save(studentId, context, answers) {
    const clean = Object.fromEntries(REFLECTION_QUESTIONS.map(q => [q.id, String(answers[q.id] || "").trim()]).filter(([, v]) => v));
    if (!Object.keys(clean).length) throw new Error("Isi minimal satu jawaban refleksi.");
    const saved = await getAdapter().put("reflections", { id: `reflection_${studentId}_${context.type}_${context.id}`, student_id: studentId, context, answers: clean });
    return { reflection: saved, newBadges: await BadgeService.checkAndAward(studentId) };
  },
  list(studentId) { return getAdapter().list("reflections", r => r.student_id === studentId); },
  async forContext(studentId, context) { return getAdapter().get("reflections", `reflection_${studentId}_${context.type}_${context.id}`); },
};
