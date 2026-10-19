/* Domain "Kepemimpinan". Adding a skill = one import + one row here;
   domains.js, skillContent.js and the taxonomy pick it up from this list. */
import { LDR_01_ACTIVITIES } from "./ldr01.js";
import { LDR_02_ACTIVITIES } from "./ldr02.js";
import { LDR_03_ACTIVITIES } from "./ldr03.js";
import { LDR_04_ACTIVITIES } from "./ldr04.js";
import { LDR_05_ACTIVITIES } from "./ldr05.js";
import { LDR_06_ACTIVITIES } from "./ldr06.js";
import { LDR_07_ACTIVITIES } from "./ldr07.js";
import { LDR_08_ACTIVITIES } from "./ldr08.js";

export const LDR_DOMAIN_NAME = "Kepemimpinan";
export const LDR_SKILLS = [
  { id: "LDR-01", name: "Memimpin Diri", activities: LDR_01_ACTIVITIES },
  { id: "LDR-02", name: "Inisiatif", activities: LDR_02_ACTIVITIES },
  { id: "LDR-03", name: "Menetapkan Tujuan Bersama", activities: LDR_03_ACTIVITIES },
  { id: "LDR-04", name: "Mendengarkan & Memotivasi", activities: LDR_04_ACTIVITIES },
  { id: "LDR-05", name: "Membagi Tugas & Mempercayai", activities: LDR_05_ACTIVITIES },
  { id: "LDR-06", name: "Teladan & Integritas", activities: LDR_06_ACTIVITIES },
  { id: "LDR-07", name: "Memimpin saat Sulit", activities: LDR_07_ACTIVITIES },
  { id: "LDR-08", name: "Memimpin dengan Melayani", activities: LDR_08_ACTIVITIES },
];
