import { AnswerService } from "./AnswerService.js";
import { ProgressService } from "./ProgressService.js";
import { XPService } from "./XPService.js";

export const AttemptService = {
  async submitAnswer({ studentId, sessionId, skillId, activity, result, isRetry = false, choice, timeMs }) {
    await AnswerService.record({ studentId, sessionId, skillId, activity, result, isRetry, choice, timeMs });
    const progress = await ProgressService.recordResult(studentId, skillId, activity.n, result);
    const xpDelta = result.gradable ? (result.correct ? (isRetry ? 5 : 10) : 2) : 8;
    const student = await XPService.award(studentId, xpDelta, result.gradable && result.correct && !isRetry);
    return { student, progress };
  },
};
