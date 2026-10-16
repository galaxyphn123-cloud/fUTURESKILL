import { getAdapter } from "./adapters/index.js";

export const ProjectService = {
  // Reserved for Phase 19 (per-domain projects) — not yet populated
  // for the MVP domains, kept as an explicit stub in the service map
  // rather than omitted, so the UI layer has a stable contract.
  async submit(studentId, projectId, payload) {
    return getAdapter().put("project_submissions", { student_id: studentId, project_id: projectId, payload });
  },
};
