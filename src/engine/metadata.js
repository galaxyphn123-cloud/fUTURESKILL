import { TAXONOMY } from "../data/taxonomy.js";
import { PHASES } from "../data/domains.js";
import { masteryLabel, firstTry } from "./mastery.js";

/* Phase-0 metadata, derived (not stored per activity) so the 11k activities
   stay small and a fix to the rules applies everywhere. */
const LOAD = ["low", "low", "medium", "medium-high", "high"];
const BASE_SECONDS = { tf: 20, mcq: 30, order: 50, classify: 60, open: 120 };
export const MIN_ATTEMPTS = 5; // a micro-skill is judged only after enough attempts, not one try

export function phaseIndex(n) { return PHASES.findIndex(p => n >= p.range[0] && n <= p.range[1]); }

export function microOf(skillId, n) {
  return TAXONOMY[skillId].micro.find(m => n >= m.range[0] && n <= m.range[1]);
}

export function activityMeta(skillId, a) {
  const t = TAXONOMY[skillId], pi = phaseIndex(a.n), m = microOf(skillId, a.n);
  return {
    domain: t.domain, skill: skillId, micro_skill: m.id, micro_skill_name: m.name,
    age_level: t.age_entry, phase: PHASES[pi].key,
    difficulty: Math.ceil(a.n / 10),                 // 1..10, rises with every strand
    cognitive_load: LOAD[pi], activity_type: a.type,
    learning_objective: m.name,
    estimated_time: Math.round(BASE_SECONDS[a.type] * (1 + pi * 0.25)),
    prerequisite_skill: t.prerequisite_skill,
    mastery_requirement: `>=80% first-try over >=${MIN_ATTEMPTS} attempts in ${m.id}`,
  };
}

/* Mastery per micro-skill, from first-try results of graded activities only. */
export function microMastery(skillId, progress) {
  return TAXONOMY[skillId].micro.map(m => {
    let graded = 0, right = 0, done = 0;
    for (let n = m.range[0]; n <= m.range[1]; n++) {
      const r = progress[n]; if (!r) continue;
      done++;
      if (r.gradable) { graded++; if (firstTry(r)) right++; }
    }
    const pct = graded ? Math.round((right / graded) * 100) : 0;
    const enough = graded >= MIN_ATTEMPTS;
    return { id: m.id, name: m.name, done, graded, pct, ready: enough, ...(enough ? masteryLabel(pct) : { label: done ? "SEDANG DIBANGUN" : "BELUM DIMULAI", color: "#9AA5A0" }) };
  });
}
