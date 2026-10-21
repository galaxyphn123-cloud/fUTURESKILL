/* Domain "Etika & Karakter". Adding a skill = one import + one row here;
   domains.js, skillContent.js and the taxonomy pick it up from this list. */
import { ETH_01_ACTIVITIES } from "./eth01.js";
import { ETH_02_ACTIVITIES } from "./eth02.js";
import { ETH_03_ACTIVITIES } from "./eth03.js";
import { ETH_04_ACTIVITIES } from "./eth04.js";
import { ETH_05_ACTIVITIES } from "./eth05.js";
import { ETH_06_ACTIVITIES } from "./eth06.js";
import { ETH_07_ACTIVITIES } from "./eth07.js";
import { ETH_08_ACTIVITIES } from "./eth08.js";

export const ETH_DOMAIN_NAME = "Etika & Karakter";
export const ETH_SKILLS = [
  { id: "ETH-01", name: "Jujur & Dapat Dipercaya", activities: ETH_01_ACTIVITIES },
  { id: "ETH-02", name: "Adil & Setara", activities: ETH_02_ACTIVITIES },
  { id: "ETH-03", name: "Hormat & Empati", activities: ETH_03_ACTIVITIES },
  { id: "ETH-04", name: "Tanggung Jawab & Akibat", activities: ETH_04_ACTIVITIES },
  { id: "ETH-05", name: "Berani Berbuat Benar", activities: ETH_05_ACTIVITIES },
  { id: "ETH-06", name: "Dilema Moral", activities: ETH_06_ACTIVITIES },
  { id: "ETH-07", name: "Nilai, Budaya & Perbedaan", activities: ETH_07_ACTIVITIES },
  { id: "ETH-08", name: "Karakter di Dunia Digital & Masa Depan", activities: ETH_08_ACTIVITIES },
];
