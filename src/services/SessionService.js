import { getAdapter } from "./adapters/index.js";
import { uid } from "../engine/ids.js";

export const SessionService = {
  /* A teacher starts a session = one class working on one skill, with a 6-digit join code
     that is unique among currently open sessions. */
  async create({ classId, skillId }) {
    const adapter = getAdapter();
    const open = await adapter.list("sessions", s => s.status === "open");
    let code;
    do { code = String(100000 + Math.floor(Math.random() * 900000)); } while (open.some(s => s.code === code));
    return adapter.put("sessions", { id: uid("session"), class_id: classId, skill_id: skillId, code, status: "open" });
  },
  async findOpenByCode(code) {
    const c = String(code).trim();
    return (await getAdapter().list("sessions", s => s.status === "open" && s.code === c))[0] || null;
  },
  listForClass(classId) { return getAdapter().list("sessions", s => s.class_id === classId); },
  async close(id) {
    const s = await getAdapter().get("sessions", id);
    return getAdapter().put("sessions", { ...s, status: "closed" });
  },
};
