/* Domain "Ketangguhan". Adding a skill = one import + one row here;
   domains.js, skillContent.js and the taxonomy pick it up from this list. */
import { RES_01_ACTIVITIES } from "./res01.js";
import { RES_02_ACTIVITIES } from "./res02.js";
import { RES_03_ACTIVITIES } from "./res03.js";
import { RES_04_ACTIVITIES } from "./res04.js";
import { RES_05_ACTIVITIES } from "./res05.js";
import { RES_06_ACTIVITIES } from "./res06.js";
import { RES_07_ACTIVITIES } from "./res07.js";
import { RES_08_ACTIVITIES } from "./res08.js";

export const RES_DOMAIN_NAME = "Ketangguhan";
export const RES_SKILLS = [
  { id: "RES-01", name: "Mengenali Kesulitan", activities: RES_01_ACTIVITIES },
  { id: "RES-02", name: "Mengelola Kekecewaan", activities: RES_02_ACTIVITIES },
  { id: "RES-03", name: "Bangkit dari Kegagalan", activities: RES_03_ACTIVITIES },
  { id: "RES-04", name: "Optimisme Realistis", activities: RES_04_ACTIVITIES },
  { id: "RES-05", name: "Mencari Dukungan", activities: RES_05_ACTIVITIES },
  { id: "RES-06", name: "Beradaptasi pada Perubahan", activities: RES_06_ACTIVITIES },
  { id: "RES-07", name: "Menghadapi Tekanan & Ketakutan", activities: RES_07_ACTIVITIES },
  { id: "RES-08", name: "Membangun Ketangguhan Jangka Panjang", activities: RES_08_ACTIVITIES },
];
