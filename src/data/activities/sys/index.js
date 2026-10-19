/* Domain "Berpikir Sistem" (Systems Thinking). Adding a skill = one import + one row here;
   domains.js, skillContent.js and the taxonomy pick it up from this list. */
import { SYS_01_ACTIVITIES } from "./sys01.js";
import { SYS_02_ACTIVITIES } from "./sys02.js";
import { SYS_03_ACTIVITIES } from "./sys03.js";
import { SYS_04_ACTIVITIES } from "./sys04.js";
import { SYS_05_ACTIVITIES } from "./sys05.js";
import { SYS_06_ACTIVITIES } from "./sys06.js";
import { SYS_07_ACTIVITIES } from "./sys07.js";
import { SYS_08_ACTIVITIES } from "./sys08.js";

export const SYS_DOMAIN_NAME = "Berpikir Sistem";
export const SYS_SKILLS = [
  { id: "SYS-01", name: "Bagian & Keseluruhan", activities: SYS_01_ACTIVITIES },
  { id: "SYS-02", name: "Sebab-Akibat Berantai", activities: SYS_02_ACTIVITIES },
  { id: "SYS-03", name: "Umpan Balik (Feedback)", activities: SYS_03_ACTIVITIES },
  { id: "SYS-04", name: "Pola & Perubahan Seiring Waktu", activities: SYS_04_ACTIVITIES },
  { id: "SYS-05", name: "Sistem Alam & Daur", activities: SYS_05_ACTIVITIES },
  { id: "SYS-06", name: "Sistem Buatan Manusia", activities: SYS_06_ACTIVITIES },
  { id: "SYS-07", name: "Dampak Tak Terduga & Titik Ungkit", activities: SYS_07_ACTIVITIES },
  { id: "SYS-08", name: "Merancang & Memperbaiki Sistem", activities: SYS_08_ACTIVITIES },
];
