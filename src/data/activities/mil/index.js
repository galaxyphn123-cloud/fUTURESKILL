/* Domain "Literasi Media & Informasi". Adding a skill = one import + one row here;
   domains.js, skillContent.js and the taxonomy pick it up from this list. */
import { MIL_01_ACTIVITIES } from "./mil01.js";
import { MIL_02_ACTIVITIES } from "./mil02.js";
import { MIL_03_ACTIVITIES } from "./mil03.js";
import { MIL_04_ACTIVITIES } from "./mil04.js";
import { MIL_05_ACTIVITIES } from "./mil05.js";
import { MIL_06_ACTIVITIES } from "./mil06.js";
import { MIL_07_ACTIVITIES } from "./mil07.js";
import { MIL_08_ACTIVITIES } from "./mil08.js";

export const MIL_DOMAIN_NAME = "Literasi Media & Informasi";
export const MIL_SKILLS = [
  { id: "MIL-01", name: "Mengenal Jenis Media", activities: MIL_01_ACTIVITIES },
  { id: "MIL-02", name: "Sumber & Penulis", activities: MIL_02_ACTIVITIES },
  { id: "MIL-03", name: "Iklan & Bujukan", activities: MIL_03_ACTIVITIES },
  { id: "MIL-04", name: "Berita, Opini & Hoaks", activities: MIL_04_ACTIVITIES },
  { id: "MIL-05", name: "Memeriksa Fakta", activities: MIL_05_ACTIVITIES },
  { id: "MIL-06", name: "Gambar, Video & Manipulasi", activities: MIL_06_ACTIVITIES },
  { id: "MIL-07", name: "Algoritma & Gelembung Informasi", activities: MIL_07_ACTIVITIES },
  { id: "MIL-08", name: "Membuat & Membagikan dengan Bertanggung Jawab", activities: MIL_08_ACTIVITIES },
];
