import { useState, useEffect, useRef } from "react";
import { COLORS } from "../theme.js";
import { PHASES } from "../data/domains.js";
import { microMastery, microOf } from "../engine/metadata.js";
import { pickNext, MODE_COPY } from "../engine/adaptive.js";
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
export function StudentFlow({ studentId, session, onExit, onProfile }) {
  const skillId = session.skill_id;
  const skill = LIVE_SKILLS.find(s => s.id === skillId);
  const activities = QuestionService.listForSkill(skillId);
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState({});
  const startedAt = useRef(Date.now());
  const [currentN, setCurrentN] = useState(null);
  const [mode, setMode] = useState("steady");
  const [retryGen, setRetryGen] = useState(0);   // bumps to remount the card fresh
  const [retrying, setRetrying] = useState(false); // true until the retry is answered
  const [justAwarded, setJustAwarded] = useState(null);

  useEffect(() => { (async () => {
    const s = await StudentService.getById(studentId);
    const p = await ProgressService.getForStudent(s.id, skillId);
    setStudent(s); setProgress(p);
    const pick = pickNext({ activities, progress: p });
    setCurrentN(pick.activity ? pick.activity.n : null); setMode(pick.mode);
  })(); }, [studentId, skillId]);

  useEffect(() => { startedAt.current = Date.now(); }, [currentN, retryGen]);

  if (!student) return <div style={{ padding: 40, textAlign: "center", color: COLORS.ink, opacity: .6 }}>Memuat kemajuanmu…</div>;

  const current = currentN !== null ? activities.find(a => a.n === currentN) : null;
  const activePhase = current ? PHASES.find(p => current.n >= p.range[0] && current.n <= p.range[1]).key : "A";
  const phaseActs = activities.filter(a => a.n >= PHASES.find(p => p.key === activePhase).range[0] && a.n <= PHASES.find(p => p.key === activePhase).range[1]);
  const saved = current ? progress[current.n] : null;
  // After a miss the child may retry; the card is shown fresh while retrying.
  const canRetry = saved && saved.gradable && !saved.correct;

  async function handleAnswer(res) {
    const { student: updatedStudent, progress: updatedProgress, newBadges } = await AttemptService.submitAnswer({
      studentId: student.id, sessionId: session.id, skillId, activity: current, result: res, isRetry: !!saved,
      choice: res.choice, timeMs: Date.now() - startedAt.current,
    });
    setStudent(updatedStudent);
    setProgress(updatedProgress);
    setRetrying(false);
    const xpText = res.gradable && res.correct ? (saved ? "+5 XP" : "+10 XP") : null;
    const badgeText = newBadges.length ? `${newBadges[0].icon} Lencana baru: ${newBadges[0].name}` : null;
    if (xpText || badgeText) { setJustAwarded([xpText, badgeText].filter(Boolean).join("  ·  ")); setTimeout(() => setJustAwarded(null), badgeText ? 3000 : 1200); }
  }

  function goNext() {
    const pick = pickNext({ activities, progress });
    setCurrentN(pick.activity ? pick.activity.n : null); setMode(pick.mode); setRetryGen(0); setRetrying(false);
  }

  function openPhase(p) {
    const inPhase = activities.filter(a => a.n >= p.range[0] && a.n <= p.range[1]);
    const target = inPhase.find(a => !progress[a.n]) || inPhase[0];
    setCurrentN(target.n); setMode("steady"); setRetryGen(0); setRetrying(false);
  }

  const doneInPhase = phaseActs.filter(a => progress[a.n]).length;

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, opacity: .55, fontWeight: 700 }}>SELAMAT DATANG KEMBALI</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.mossDeep }}>{student.name}</div>
        </div>
        <XPBar xp={student.xp} />
        <span style={{ display: "flex", gap: 8 }}><Btn variant="amber" onClick={onProfile}>Profilku</Btn><Btn variant="ghost" onClick={onExit}>Keluar</Btn></span>
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
                onClick={() => openPhase(p)}
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

      <details style={{ background: COLORS.panel, borderRadius: 18, padding: "12px 18px", marginBottom: 20, border: `1.5px solid ${COLORS.line}` }}>
        <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 800, opacity: .6 }}>PETA MICRO-SKILL{current ? ` · sekarang: ${microOf(skillId, current.n).name}` : ""}</summary>
        <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
          {microMastery(skillId, progress).map(m => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12 }}>
              <span style={{ flex: "1 1 55%", fontWeight: current && microOf(skillId, current.n).id === m.id ? 800 : 500 }}>{m.name}</span>
              <span style={{ flex: "1 1 25%", height: 6, borderRadius: 3, background: COLORS.line, overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${m.done * 10}%`, background: m.color }} />
              </span>
              <span style={{ flex: "0 0 120px", color: m.color, fontWeight: 700, fontSize: 10 }}>{m.label}{m.ready ? ` · ${m.pct}%` : ""}</span>
            </div>
          ))}
        </div>
      </details>

      {current ? (
        <>
          {MODE_COPY[mode] && <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 700, color: mode === "support" ? COLORS.build : COLORS.master }}>{MODE_COPY[mode]}</div>}
          <ActivityCard key={`${current.n}-${retryGen}`} activity={current} feedback={retrying ? undefined : saved} onAnswer={handleAnswer} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <span style={{ fontSize: 13, opacity: .55 }}>{doneInPhase}/{phaseActs.length} pada fase ini{student.streak >= 3 ? ` · 🔥 rentetan ${student.streak}` : ""}</span>
            <span style={{ display: "flex", gap: 8 }}>
              {canRetry && !retrying && <Btn variant="amber" onClick={() => { setRetrying(true); setRetryGen(g => g + 1); }}>Coba lagi</Btn>}
              {saved && <Btn onClick={goNext}>Aktivitas berikutnya →</Btn>}
            </span>
          </div>
        </>
      ) : <div style={{ padding: 24, background: COLORS.panel, borderRadius: 18, border: `1.5px solid ${COLORS.line}` }}>
          Semua aktivitas yang terbuka sudah kamu kerjakan. Pilih fase lain di atas, atau ulangi yang masih ingin diperkuat.
        </div>}

      {justAwarded && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: COLORS.mossDeep, color: "#fff", padding: "10px 20px", borderRadius: 999, fontWeight: 700 }}>
          {justAwarded}
        </div>
      )}
    </div>
  );
}
