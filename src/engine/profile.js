import { DOMAINS } from "../data/domains.js";
import { TAXONOMY } from "../data/taxonomy.js";
import { microMastery } from "./metadata.js";
import { phaseUnlocked, firstTry } from "./mastery.js";
import { PHASES } from "../data/domains.js";

/* MY FUTURE SKILLS — a growth view. Deliberately no ranking and no
   deficit words: weak areas are "sedang dibangun" / "bisa diperkuat". */
const SKILL_INFO = {};
DOMAINS.forEach(d => d.skills.forEach(s => { SKILL_INFO[s.id] = { name: s.name, domain: d }; }));

export const domainLevel = mastered => 1 + Math.floor(mastered / 3);
export const skillLevel = mastered => 1 + mastered;

function highestPhase(progress, activities) {
  let last = "A";
  for (const p of PHASES) { if (phaseUnlocked(p.key, progress, activities)) last = p.key; else break; }
  return last;
}

export function buildProfile({ student, progressBySkill, listActivities }) {
  const skills = Object.entries(progressBySkill).filter(([, pr]) => Object.keys(pr).length).map(([id, progress]) => {
    const micro = microMastery(id, progress);
    const mastered = micro.filter(m => m.label === "TUNTAS").length;
    const results = Object.values(progress);
    const graded = results.filter(r => r.gradable);
    return {
      id, name: SKILL_INFO[id].name, domainId: SKILL_INFO[id].domain.id,
      done: results.length, micro, mastered, level: skillLevel(mastered),
      accuracy: graded.length ? Math.round((graded.filter(firstTry).length / graded.length) * 100) : 0,
      phase: highestPhase(progress, listActivities(id)),
      lastActive: Math.max(0, ...results.map(r => r.at || 0)),
      retriesFixed: results.filter(r => r.gradable && r.attempts > 1 && r.correct).length,
    };
  });

  const domains = DOMAINS.map(d => {
    const mine = skills.filter(s => s.domainId === d.id);
    const mastered = mine.reduce((n, s) => n + s.mastered, 0);
    return { id: d.id, name: d.name, color: d.color, icon: d.icon, skillCount: d.skills.length,
      started: mine.length, done: mine.reduce((n, s) => n + s.done, 0), mastered, level: domainLevel(mastered) };
  });

  // micro-level entries only where there are enough attempts to say anything (>= MIN_ATTEMPTS)
  const judged = skills.flatMap(s => s.micro.filter(m => m.ready).map(m => ({ skillId: s.id, skill: s.name, micro: m.name, pct: m.pct })));
  const strengths = judged.filter(m => m.pct >= 80).sort((a, b) => b.pct - a.pct).slice(0, 5);
  const growth = judged.filter(m => m.pct < 80).sort((a, b) => a.pct - b.pct).slice(0, 5);

  const latest = [...skills].sort((a, b) => b.lastActive - a.lastActive)[0];
  let recommended = null;
  if (latest) {
    const next = latest.micro.find(m => m.label !== "TUNTAS" && m.done < 10) || latest.micro.find(m => m.label !== "TUNTAS");
    if (next) recommended = { skillId: latest.id, skill: latest.name, micro: next.name,
      reason: growth.find(g => g.skillId === latest.id && g.micro === next.name) ? "Latihan lagi akan membuatnya semakin kuat." : "Lanjutan alami dari yang baru kamu kerjakan." };
  }

  return {
    student: { id: student.id, name: student.name, xp: student.xp || 0, streak: student.streak || 0, badges: student.badges || [] },
    skills, domains, strengths, growth, recommended,
    totals: {
      done: skills.reduce((n, s) => n + s.done, 0), mastered: skills.reduce((n, s) => n + s.mastered, 0),
      retriesFixed: skills.reduce((n, s) => n + s.retriesFixed, 0),
      skillsStarted: skills.length, domainsStarted: domains.filter(d => d.started).length,
      lastActive: latest ? latest.lastActive : null,
    },
  };
}
