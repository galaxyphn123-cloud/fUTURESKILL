/* Domain "Keterampilan Hidup". Adding a skill = one import + one row here;
   domains.js, skillContent.js and the taxonomy pick it up from this list. */
import { LIF_01_ACTIVITIES } from "./lif01.js";
import { LIF_02_ACTIVITIES } from "./lif02.js";
import { LIF_03_ACTIVITIES } from "./lif03.js";
import { LIF_04_ACTIVITIES } from "./lif04.js";
import { LIF_05_ACTIVITIES } from "./lif05.js";
import { LIF_06_ACTIVITIES } from "./lif06.js";
import { LIF_07_ACTIVITIES } from "./lif07.js";
import { LIF_08_ACTIVITIES } from "./lif08.js";

export const LIF_DOMAIN_NAME = "Keterampilan Hidup";
export const LIF_SKILLS = [
  { id: "LIF-01", name: "Merawat Diri & Rumah", activities: LIF_01_ACTIVITIES },
  { id: "LIF-02", name: "Rutinitas Harian", activities: LIF_02_ACTIVITIES },
  { id: "LIF-03", name: "Makan Sehat & Dapur Sederhana", activities: LIF_03_ACTIVITIES },
  { id: "LIF-04", name: "Keselamatan Sehari-hari", activities: LIF_04_ACTIVITIES },
  { id: "LIF-05", name: "Bepergian & Transportasi", activities: LIF_05_ACTIVITIES },
  { id: "LIF-06", name: "Merawat Barang & Pakaian", activities: LIF_06_ACTIVITIES },
  { id: "LIF-07", name: "Keadaan Darurat", activities: LIF_07_ACTIVITIES },
  { id: "LIF-08", name: "Mandiri & Mengurus Diri Sendiri", activities: LIF_08_ACTIVITIES },
];
