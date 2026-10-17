import { getAdapter } from "./adapters/index.js";
import { BADGES } from "../data/badges.js";
import { ProfileService } from "./ProfileService.js";
import { nowISO } from "../engine/ids.js";

export const BadgeService = {
  /* Awards every badge whose test now passes and which the child doesn't hold yet.
     Returns only the NEWLY earned ones so the UI can celebrate them once. */
  async checkAndAward(studentId) {
    const profile = await ProfileService.load(studentId);
    const student = await getAdapter().get("students", studentId);
    const held = new Set((student.badges || []).map(b => b.id));
    const fresh = BADGES.filter(b => !held.has(b.id) && b.test(profile, student));
    if (fresh.length) {
      await getAdapter().put("students", { ...student, badges: [...(student.badges || []), ...fresh.map(b => ({ id: b.id, at: nowISO() }))] });
    }
    return fresh.map(({ id, icon, name, desc }) => ({ id, icon, name, desc }));
  },
};
