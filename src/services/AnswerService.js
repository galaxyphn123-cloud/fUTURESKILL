import { getAdapter } from "./adapters/index.js";
import { QuestionService } from "./QuestionService.js";
import { microOf } from "../engine/metadata.js";

/* One row per attempt (retries included) so teachers can see mistakes, not just scores. */
export const AnswerService = {
  async record({ studentId, sessionId, skillId, activity, result, isRetry, choice, timeMs }) {
    return getAdapter().put("answers", {
      student_id: studentId, session_id: sessionId, skill_id: skillId,
      activity_id: QuestionService.activityId(skillId, activity.n), n: activity.n,
      micro_skill: microOf(skillId, activity.n).id,
      correct: !!result.correct, gradable: !!result.gradable,
      is_retry: !!isRetry, choice: choice ?? null, time_ms: timeMs ?? null,
    });
  },
};
