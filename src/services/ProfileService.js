import { getAdapter } from "./adapters/index.js";
import { QuestionService } from "./QuestionService.js";
import { StudentService } from "./StudentService.js";
import { MissionService } from "./MissionService.js";
import { ProjectService } from "./ProjectService.js";
import { ReflectionService } from "./ReflectionService.js";
import { buildProfile } from "../engine/profile.js";

export const ProfileService = {
  async load(studentId) {
    const student = await StudentService.getById(studentId);
    const records = await getAdapter().list("progress", p => p.student_id === studentId);
    const progressBySkill = Object.fromEntries(records.map(r => [r.skill_id, r.results]));
    const missions = (await MissionService.summary(studentId, { skipAvailability: true })).filter(m => m.done > 0);
    const projects = await ProjectService.listForStudent(studentId);
    const reflections = (await ReflectionService.list(studentId)).length;
    const profile = buildProfile({ student, progressBySkill, listActivities: id => QuestionService.listForSkill(id), extras: { missions, projects, reflections } });
    const answers = (await getAdapter().list("answers", a => a.student_id === studentId))
      .sort((a, b) => (a.created_at < b.created_at ? 1 : -1)).slice(0, 8)
      .map(a => ({ skillId: a.skill_id, n: a.n, q: QuestionService.byN(a.skill_id, a.n).q, correct: a.correct, gradable: a.gradable, at: a.created_at }));
    return { ...profile, recent: answers };
  },
};
