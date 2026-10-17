import { getAdapter } from "./adapters/index.js";

export const StudentService = {
  getById(id) { return getAdapter().get("students", id); },
};
