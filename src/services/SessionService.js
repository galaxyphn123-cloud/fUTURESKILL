import { getAdapter } from "./adapters/index.js";

export const SessionService = {
  // Sessions are shared storage: the join code must be visible to any
  // student's device, not just the account that first created it.
  // Uses a deterministic id (one open demo session per skill) instead of a
  // random one, so a duplicate-creation race collapses to a single
  // last-write-wins record instead of two different codes for the same skill.
  async ensureDemoSession(skillId) {
    const adapter = getAdapter();
    const id = `session_${skillId}`;
    const existing = await adapter.get("sessions", id);
    if (existing && existing.status === "open") return existing;
    const code = String(100000 + Math.floor(Math.random() * 900000)).slice(0, 6);
    return adapter.put("sessions", { id, skill_id: skillId, code, status: "open", __shared: true });
  },
  async validateCode(skillId, code) {
    const session = await this.ensureDemoSession(skillId);
    return session.code === String(code).trim();
  },
};
