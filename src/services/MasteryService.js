import { PHASES } from "../data/domains.js";
import { phaseStats, phaseUnlocked, masteryLabel, firstTry } from "../engine/mastery.js";

export const MasteryService = {
  phaseStats,               // pure functions from the engine, reused as-is
  phaseUnlocked,
  masteryLabel,
  accuracy(progress) {
    let c = 0, t = 0;
    Object.values(progress).forEach(r => { if (r && r.gradable) { t++; if (firstTry(r)) c++; } });
    return t === 0 ? 0 : Math.round((c / t) * 100);
  },
  highestUnlockedPhase(progress, activities) {
    let last = "A";
    for (const p of PHASES) { if (phaseUnlocked(p.key, progress, activities)) last = p.key; else break; }
    return last;
  },
};
