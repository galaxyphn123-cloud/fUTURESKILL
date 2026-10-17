import { PHASES } from "../data/domains.js";
import { phaseUnlocked, firstTry } from "./mastery.js";

/* Adaptive selection (Phases 8-10). Pure: takes the skill's activities and the
   student's progress map, returns the next activity plus the reason.
   Rules:
   - never leaves phases the student has not unlocked (no random jump);
   - 3 first-try-correct in a row  -> "advance": skip ahead a few activities;
   - 2 first-try-misses in a row   -> "support": go back to a missed/easier one;
   - otherwise                     -> "steady": next unanswered, in order. */
const ADVANCE_STREAK = 3, SUPPORT_MISSES = 2, ADVANCE_SKIP = 3;

export function gradedHistory(progress) {
  return Object.entries(progress)
    .map(([n, r]) => ({ n: Number(n), ...r }))
    .filter(r => r.gradable)
    .sort((a, b) => (b.at || 0) - (a.at || 0));
}

export function pickNext({ activities, progress }) {
  const open = activities.filter(a => {
    const ph = PHASES.find(p => a.n >= p.range[0] && a.n <= p.range[1]);
    return phaseUnlocked(ph.key, progress, activities);
  });
  const unanswered = open.filter(a => !progress[a.n]).sort((a, b) => a.n - b.n);
  const hist = gradedHistory(progress);

  const hot = hist.length >= ADVANCE_STREAK && hist.slice(0, ADVANCE_STREAK).every(firstTry);
  const cold = hist.length >= SUPPORT_MISSES && hist.slice(0, SUPPORT_MISSES).every(r => !firstTry(r));

  if (cold) {
    const missed = open.filter(a => progress[a.n] && progress[a.n].gradable && !firstTry(progress[a.n]))
      .sort((a, b) => a.n - b.n);
    const easier = unanswered.find(a => a.n < hist[0].n);
    const target = easier || missed[0] || unanswered[0];
    if (target) return { activity: target, mode: "support" };
  }
  if (hot && unanswered.length) {
    const last = hist[0].n;
    const ahead = unanswered.find(a => a.n >= last + ADVANCE_SKIP) || unanswered[0];
    return { activity: ahead, mode: "advance" };
  }
  return { activity: unanswered[0] || null, mode: "steady" };
}

export const MODE_COPY = {
  advance: "Kamu sedang lancar — tantangan dinaikkan sedikit.",
  support: "Ayo perkuat fondasinya dulu — kita coba yang lebih mendasar.",
  steady: "",
};
