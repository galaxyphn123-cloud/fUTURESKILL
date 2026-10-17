import { COLORS } from "../theme.js";
import { PHASES } from "../data/domains.js";

/* Skill-agnostic: every function takes the activity list to score
   against, instead of assuming a single hardcoded skill. */
export function masteryLabel(pct) {
  if (pct >= 80) return { label: "TUNTAS", color: COLORS.master };
  if (pct >= 60) return { label: "BERKEMBANG", color: COLORS.practice };
  return { label: "BANGUN FONDASI", color: COLORS.build };
}

// No-random-jump: student may only enter a phase once the previous phase's
// graded accuracy is >=60% (DEVELOPING or better) OR it's Phase A (always open).
export function phaseUnlocked(phaseKey, progress, activities) {
  const idx = PHASES.findIndex(p => p.key === phaseKey);
  if (idx === 0) return true;
  const prev = PHASES[idx - 1];
  const stats = phaseStats(prev, progress, activities);
  return stats.total === 0 ? false : (stats.correct / stats.gradedTotal) * 100 >= 60 || stats.gradedTotal === 0;
}

// A result counts toward mastery by its FIRST attempt; retries earn XP but
// never inflate the mastery signal.
export function firstTry(r) { return r.firstTry !== undefined ? !!r.firstTry : !!r.correct; }

export function phaseStats(phase, progress, activities) {
  const acts = activities.filter(a => a.n >= phase.range[0] && a.n <= phase.range[1]);
  let correct = 0, gradedTotal = 0, total = 0;
  acts.forEach(a => {
    const r = progress[a.n];
    if (r) {
      total++;
      if (a.type !== "open") { gradedTotal++; if (firstTry(r)) correct++; }
    }
  });
  return { correct, gradedTotal, total, of: acts.length };
}
