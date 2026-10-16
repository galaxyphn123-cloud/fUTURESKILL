import { SKILL_CONTENT } from "../data/skillContent.js";

export const QuestionService = {
  activityId(skillId, n) { return `${skillId}-${String(n).padStart(3, "0")}`; },
  listForSkill(skillId) { return SKILL_CONTENT[skillId] || []; },
  byN(skillId, n) { return this.listForSkill(skillId).find(a => a.n === n); },
};
