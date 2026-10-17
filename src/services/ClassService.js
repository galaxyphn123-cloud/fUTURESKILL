import { getAdapter } from "./adapters/index.js";
import { uid } from "../engine/ids.js";

// No 0/O/1/I/L so a 7-year-old copying a code off the board can't mix them up.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const makeCode = () => Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
const nameKey = n => String(n).trim().toLowerCase().replace(/\s+/g, " ");

export const ClassService = {
  async createClass(teacherId, name) {
    if (!name.trim()) throw new Error("Nama kelas wajib diisi.");
    return getAdapter().put("classes", { id: uid("class"), teacher_id: teacherId, name: name.trim() });
  },
  listClasses(teacherId) { return getAdapter().list("classes", c => c.teacher_id === teacherId); },
  roster(classId) { return getAdapter().list("students", s => s.class_id === classId); },

  /* Enrol a child; returns the existing record if the same name is already in the class. */
  async enroll(classId, name, age = null) {
    const roster = await this.roster(classId);
    const dup = roster.find(s => nameKey(s.name) === nameKey(name));
    if (dup) return dup;
    let code;
    do { code = makeCode(); } while (roster.some(s => s.code === code));
    return getAdapter().put("students", {
      id: `student_${classId}_${code}`, class_id: classId, name: name.trim(), code, age,
      xp: 0, streak: 0, badges: [],
    });
  },
  /* Student types either their student code or (first time) their name. */
  async identify(classId, codeOrName) {
    const q = codeOrName.trim();
    const roster = await this.roster(classId);
    return roster.find(s => s.code === q.toUpperCase()) || roster.find(s => nameKey(s.name) === nameKey(q)) || null;
  },
};
