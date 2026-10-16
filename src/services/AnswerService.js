import { getAdapter } from "./adapters/index.js";
import { QuestionService } from "./QuestionService.js";

export const AnswerService = {
  async record(studentId, skillId, activity, result) {
    const adapter = getAdapter();
    return adapter.put("answers", {
      student_id: studentId, skill_id: skillId, activity_id: QuestionService.activityId(skillId, activity.n),
      correct: !!result.correct, gradable: !!result.gradable,
    });
  },
};
