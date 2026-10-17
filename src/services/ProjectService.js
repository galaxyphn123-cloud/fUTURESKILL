import { getAdapter } from "./adapters/index.js";
import { PROJECTS, RUBRIC } from "../data/projects.js";
import { BadgeService } from "./BadgeService.js";

const subId = (studentId, projectId) => `${studentId}__${projectId}`;
const validRatings = r => RUBRIC.every(d => [1, 2, 3].includes(r?.[d.id]));

export const ProjectService = {
  all: () => PROJECTS,
  byId: id => PROJECTS.find(p => p.id === id),
  get(studentId, projectId) { return getAdapter().get("project_submissions", subId(studentId, projectId)); },
  listForStudent(studentId) { return getAdapter().list("project_submissions", s => s.student_id === studentId); },

  /* Child's work + self-rating on the same rubric the teacher uses. Locked once the teacher has reviewed it. */
  async submit({ studentId, projectId, answers, selfRating }) {
    const project = this.byId(projectId);
    if (!project) throw new Error("Proyek tidak ditemukan.");
    if (project.prompts.some((_, i) => !String(answers[i] || "").trim())) throw new Error("Jawab semua pertanyaan proyek dulu.");
    if (!validRatings(selfRating)) throw new Error("Nilai dirimu pada semua aspek.");
    const existing = await this.get(studentId, projectId);
    if (existing && existing.status === "reviewed") throw new Error("Proyek ini sudah dinilai guru dan tidak bisa diubah.");
    const saved = await getAdapter().put("project_submissions", {
      id: subId(studentId, projectId), student_id: studentId, project_id: projectId, domain: project.domain,
      answers: project.prompts.map((_, i) => String(answers[i]).trim()), self_rating: selfRating, status: "submitted", teacher_rating: null, teacher_comment: "",
    });
    return { submission: saved, newBadges: await BadgeService.checkAndAward(studentId) };
  },

  async rate({ submissionId, scores, comment }) {
    if (!validRatings(scores)) throw new Error("Beri nilai 1–3 pada semua aspek rubrik.");
    const sub = await getAdapter().get("project_submissions", submissionId);
    if (!sub) throw new Error("Karya tidak ditemukan.");
    return getAdapter().put("project_submissions", { ...sub, teacher_rating: scores, teacher_comment: String(comment || "").trim(), status: "reviewed" });
  },
};
