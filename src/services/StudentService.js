import { getAdapter } from "./adapters/index.js";

// Turn a display name into a stable key: lower-cased, trimmed, runs of
// non-alphanumerics collapsed to a single "-". Two devices typing the
// same name therefore resolve to the same record id.
function nameKey(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const StudentService = {
  // Uses a deterministic id derived from the name instead of a random
  // one, so a duplicate-creation race (two students, or one student on
  // two devices, joining under the same name at once) collapses to a
  // single last-write-wins record rather than two rival profiles.
  async getOrCreateByName(name) {
    const adapter = getAdapter();
    const id = `student_${nameKey(name)}`;
    const existing = await adapter.get("students", id);
    if (existing) return existing;
    return adapter.put("students", { id, name, xp: 0, streak: 0, badges: [] });
  },
};
