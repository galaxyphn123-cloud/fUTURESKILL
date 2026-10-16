import { useState, useEffect } from "react";
import { COLORS } from "../theme.js";
import { PHASES } from "../data/domains.js";
import { LIVE_SKILLS } from "../data/skillContent.js";
import { phaseUnlocked, phaseStats, masteryLabel } from "../engine/mastery.js";
import { StudentService } from "../services/StudentService.js";
import { ProgressService } from "../services/ProgressService.js";
import { QuestionService } from "../services/QuestionService.js";
import { AttemptService } from "../services/AttemptService.js";
import { Btn } from "./ui/Btn.jsx";
import { XPBar } from "./ui/XPBar.jsx";
import { ActivityCard } from "./ActivityCard.jsx";

/* This component never touches storage directly — every read/write goes
   through StudentService / ProgressService / AttemptService, so it
   would not change at all if getAdapter() started returning a
   SupabaseAdapter tomorrow. Fully skill-agnostic: which skill is being
   played is passed in as a prop, not hardcoded. */
export function StudentFlow({ name, skillId, onExit }) {
  const skill = LIVE_SKILLS.find(s => s.id === skillId);
  const activities = QuestionService.listForSkill(skillId);
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState({});
  const [activePhase, setActivePhase] = useState("A");
  const [cursor, setCursor] = useState(null);
  const [justAwarded, setJustAwarded] = useState(null);

  useEffect(() => { (async () => {
    const s = await StudentService.getOrCreateByName(name);
    const p = await ProgressService.getForStudent(s.id, skillId);
    setStudent(s); setProgress(p);
  })(); }, [name, skillId]);

  if (!student) return <div style={{ padding: 40, textAlign: "center", color: COLORS.ink, opacity: .6 }}>Memuat kemajuanmu…</div>;

  const phaseActs = activities.filter(a => a.n >= PHASES.find(p => p.key === activePhase).range[0] && a.n <= PHASES.find(p => p.key === activePhase).range[1]);
  const current = cursor !== null ? phaseActs.find(a => a.n === cursor) : phaseActs.find(a => !progress[a.n]) || phaseActs[0];

  async function handleAnswer(res) {
    const { student: updatedStudent, progress: updatedProgress } = await AttemptService.submitAnswer({
      studentId: student.id, skillId, activity: current, result: res,
    });
    setStudent(updatedStudent);
    setProgress(updatedProgress);
    if (res.gradable && res.correct) { setJustAwarded("+10 XP"); setTimeout(() => setJustAwarded(null), 1200); }
  }

  function goNext() {
    const idx = phaseActs.findIndex(a => a.n === current.n);
    if (idx < phaseActs.length - 1) setCursor(phaseActs[idx + 1].n);
    else {
      const pIdx = PHASES.findIndex(p => p.key === activePhase);
      if (pIdx < PHASES.length - 1 && phaseUnlocked(PHASES[pIdx + 1].key, progress, activities)) {
        setActivePhase(PHASES[pIdx + 1].key); setCursor(null);
      }
    }
  }

  const doneInPhase = phaseActs.filter(a => progress[a.n]).length;

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, opacity: .55, fontWeight: 700 }}>SELAMAT DATANG KEMBALI</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.mossDeep }}>{name}</div>
        </div>
        <XPBar xp={student.xp} />
        <Btn variant="ghost" onClick={onExit}>Ganti siswa</Btn>
      </div>

      <div style={{ background: COLORS.panel, borderRadius: 18, padding: 18, marginBottom: 20, border: `1.5px solid ${COLORS.line}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, opacity: .55, marginBottom: 10 }}>{(skill ? `${skill.domain.toUpperCase()} → ${skill.name.toUpperCase()}` : skillId)}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PHASES.map((p, i) => {
            const unlocked = phaseUnlocked(p.key, progress, activities);
            const stats = phaseStats(p, progress, activities);
            const active = p.key === activePhase;
            return (
              <button key={p.key} disabled={!unlocked}
                onClick={() => { setActivePhase(p.key); setCursor(null); }}
                style={{
                  flex: "1 1 100px", padding: "10px 8px", borderRadius: 12, cursor: unlocked ? "pointer" : "not-allowed",
                  border: `2px solid ${active ? p.tone : COLORS.line}`, background: active ? `${p.tone}12` : "#fff",
                  opacity: unlocked ? 1 : .4, textAlign: "center", fontFamily: "inherit",
                }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: p.tone }}>{p.key}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.ink }}>{p.label}</div>
                <div style={{ fontSize: 10, opacity: .6, marginTop: 2 }}>{stats.total}/{stats.of} · {unlocked ? masteryLabel(stats.gradedTotal ? (stats.correct/stats.gradedTotal)*100 : 0).label : "🔒 terkunci"}</div>
              </button>
            );
          })}
        </div>
      </div>

      {current ? (
        <>
          <ActivityCard key={current.n} activity={current} feedback={progress[current.n]} onAnswer={handleAnswer} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <span style={{ fontSize: 13, opacity: .55 }}>{doneInPhase}/{phaseActs.length} pada fase ini{student.streak >= 3 ? ` · 🔥 rentetan ${student.streak}` : ""}</span>
            {progress[current.n] && <Btn onClick={goNext}>Aktivitas berikutnya →</Btn>}
          </div>
        </>
      ) : <div>Semua aktivitas pada fase ini sudah selesai untuk saat ini.</div>}

      {justAwarded && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: COLORS.mossDeep, color: "#fff", padding: "10px 20px", borderRadius: 999, fontWeight: 700 }}>
          {justAwarded}
        </div>
      )}
    </div>
  );
}
