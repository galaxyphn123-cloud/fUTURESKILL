/* Domain "Belajar Cara Belajar" (Learning How to Learn). Adding a skill = one import + one row here;
   domains.js, skillContent.js and the taxonomy pick it up from this list. */
import { KNOW_YOUR_LEARNING_ACTIVITIES } from "./knowYourLearning.js";
import { FOCUS_ATTENTION_ACTIVITIES } from "./focusAttention.js";
import { REMEMBER_STRATEGIES_ACTIVITIES } from "./rememberStrategies.js";

export const LHL_DOMAIN_NAME = "Belajar Cara Belajar";
export const LHL_SKILLS = [
  { id: "LHL-01", name: "Mengenal Cara Belajarmu", activities: KNOW_YOUR_LEARNING_ACTIVITIES },
  { id: "LHL-02", name: "Fokus & Perhatian", activities: FOCUS_ATTENTION_ACTIVITIES },
  { id: "LHL-03", name: "Strategi Mengingat", activities: REMEMBER_STRATEGIES_ACTIVITIES },
];
