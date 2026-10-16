export const BadgeService = {
  // Reserved for future skills that define badge criteria; the
  // interface exists now so ProjectService/AttemptService can call
  // into it later without another refactor.
  async checkAndAward(studentId, skillId, progress) { return []; },
};
