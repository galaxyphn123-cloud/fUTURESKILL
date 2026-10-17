import { AnswerService } from "./AnswerService.js";
import { ProgressService } from "./ProgressService.js";
import { XPService } from "./XPService.js";
import { AnalyticsService } from "./AnalyticsService.js";
import { QuestionService } from "./QuestionService.js";

export const AttemptService = {
  async submitAnswer({ studentId, skillId, activity, result, isRetry = false }) {
    await AnswerService.record(studentId, skillId, activity, result);
    const progress = await ProgressService.recordResult(studentId, skillId, activity.n, result);
    const xpDelta = result.gradable ? (result.correct ? (isRetry ? 5 : 10) : 2) : 8;
    const student = await XPService.award(studentId, xpDelta, result.gradable && result.correct && !isRetry);
    await AnalyticsService.publishSummary(student, skillId, progress, QuestionService.listForSkill(skillId));
    return { student, progress };
  },
};
