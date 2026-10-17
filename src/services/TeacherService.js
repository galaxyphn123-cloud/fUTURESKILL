import { getAdapter } from "./adapters/index.js";

/* Local-mode teacher gate. The PIN is hashed so it isn't stored in the clear,
   but this only keeps students from wandering into the teacher console on a
   shared device — it is NOT real authentication. Real accounts need the
   Supabase backend. */
const ID = "teacher_main";
async function hash(pin) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`fsfk:${pin}`));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

export const TeacherService = {
  async exists() { return !!(await getAdapter().get("teachers", ID)); },
  async setup(name, pin) {
    if (!/^\d{4,8}$/.test(pin)) throw new Error("PIN harus 4–8 angka.");
    if (await this.exists()) throw new Error("Guru sudah terdaftar.");
    return getAdapter().put("teachers", { id: ID, name: name.trim() || "Guru", pin_hash: await hash(pin) });
  },
  async login(pin) {
    const t = await getAdapter().get("teachers", ID);
    return t && t.pin_hash === (await hash(pin)) ? { id: t.id, name: t.name } : null;
  },
};
