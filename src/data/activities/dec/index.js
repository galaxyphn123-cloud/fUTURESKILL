/* Domain "Pengambilan Keputusan". Adding a skill = one import + one row here;
   domains.js, skillContent.js and the taxonomy pick it up from this list. */
import { DEC_01_ACTIVITIES } from "./dec01.js";
import { DEC_02_ACTIVITIES } from "./dec02.js";
import { DEC_03_ACTIVITIES } from "./dec03.js";
import { DEC_04_ACTIVITIES } from "./dec04.js";
import { DEC_05_ACTIVITIES } from "./dec05.js";
import { DEC_06_ACTIVITIES } from "./dec06.js";
import { DEC_07_ACTIVITIES } from "./dec07.js";
import { DEC_08_ACTIVITIES } from "./dec08.js";

export const DEC_DOMAIN_NAME = "Pengambilan Keputusan";
export const DEC_SKILLS = [
  { id: "DEC-01", name: "Mengenali Pilihan", activities: DEC_01_ACTIVITIES },
  { id: "DEC-02", name: "Prioritas & Kriteria", activities: DEC_02_ACTIVITIES },
  { id: "DEC-03", name: "Mengumpulkan Informasi", activities: DEC_03_ACTIVITIES },
  { id: "DEC-04", name: "Risiko & Peluang", activities: DEC_04_ACTIVITIES },
  { id: "DEC-05", name: "Konsekuensi Jangka Pendek & Panjang", activities: DEC_05_ACTIVITIES },
  { id: "DEC-06", name: "Emosi & Bias dalam Memilih", activities: DEC_06_ACTIVITIES },
  { id: "DEC-07", name: "Memutuskan Bersama", activities: DEC_07_ACTIVITIES },
  { id: "DEC-08", name: "Mengevaluasi & Belajar dari Keputusan", activities: DEC_08_ACTIVITIES },
];
