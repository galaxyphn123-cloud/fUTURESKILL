/* Domain "Belajar Cara Belajar" (Learning How to Learn). Adding a skill = one import + one row here;
   domains.js, skillContent.js and the taxonomy pick it up from this list. */
import { KNOW_YOUR_LEARNING_ACTIVITIES } from "./knowYourLearning.js";
import { FOCUS_ATTENTION_ACTIVITIES } from "./focusAttention.js";
import { REMEMBER_STRATEGIES_ACTIVITIES } from "./rememberStrategies.js";
import { STUDY_TIME_ACTIVITIES } from "./studyTime.js";
import { LEARNING_GOALS_ACTIVITIES } from "./learningGoals.js";
import { ASK_AND_FIND_ACTIVITIES } from "./askAndFind.js";

export const LHL_DOMAIN_NAME = "Belajar Cara Belajar";
export const LHL_SKILLS = [
  { id: "LHL-01", name: "Mengenal Cara Belajarmu", activities: KNOW_YOUR_LEARNING_ACTIVITIES },
  { id: "LHL-02", name: "Fokus & Perhatian", activities: FOCUS_ATTENTION_ACTIVITIES },
  { id: "LHL-03", name: "Strategi Mengingat", activities: REMEMBER_STRATEGIES_ACTIVITIES },
  { id: "LHL-04", name: "Mengatur Waktu Belajar", activities: STUDY_TIME_ACTIVITIES },
  { id: "LHL-05", name: "Tujuan Belajar", activities: LEARNING_GOALS_ACTIVITIES },
  { id: "LHL-06", name: "Bertanya & Mencari Sumber", activities: ASK_AND_FIND_ACTIVITIES },
];
