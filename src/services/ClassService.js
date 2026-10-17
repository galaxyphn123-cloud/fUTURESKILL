import { getAdapter } from "./adapters/index.js";
import { uid } from "../engine/ids.js";

// No 0/O/1/I/L so a 7-year-old copying a code off the board can't mix them up.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const makeCode = () => Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
// Parent codes are longer (6) and globally unique: a parent can look up their child with just this code.
const makeParentCode = () => Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
const nameKey = n => String(n).trim().toLowerCase().replace(/\s+/g, " ");

export const ClassService = {
  async createClass(teacherId, name) {
    if (!name.trim()) throw new Error("Nama kelas wajib diisi.");
    return getAdapter().put("classes", { id: uid("class"), teacher_id: teacherId, name: name.trim() });
  },
  listClasses(teacherId) { return getAdapter().list("classes", c => c.teacher_id === teacherId); },
  async roster(classId) {
    const list = await getAdapter().list("students", s => s.class_id === classId);
    return Promise.all(list.map(s => (s.parent_code ? s : this.ensureParentCode(s))));  // back-fill older records
  },
  async ensureParentCode(student) {
    const all = await getAdapter().list("students");
    let code;
    do { code = makeParentCode(); } while (all.some(s => s.parent_code === code));
    return getAdapter().put("students", { ...student, parent_code: code });
  },
  async findByParentCode(code) {
    const c = String(code).trim().toUpperCase();
    return (await getAdapter().list("students", s => s.parent_code === c))[0] || null;
  },

  /* Enrol a child; returns the existing record if the same name is already in the class. */
  async enroll(classId, name, age = null) {
    const roster = await this.roster(classId);
    const dup = roster.find(s => nameKey(s.name) === nameKey(name));
    if (dup) return dup;
    let code;
    do { code = makeCode(); } while (roster.some(s => s.code === code));
    const all = await getAdapter().list("students");
    let parentCode;
    do { parentCode = makeParentCode(); } while (all.some(s => s.parent_code === parentCode));
    return getAdapter().put("students", {
      id: `student_${classId}_${code}`, parent_code: parentCode, class_id: classId, name: name.trim(), code, age,
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
