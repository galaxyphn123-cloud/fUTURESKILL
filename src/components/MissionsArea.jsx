import { useState, useEffect, useCallback } from "react";
import { COLORS } from "../theme.js";
import { MissionService } from "../services/MissionService.js";
import { ProjectService } from "../services/ProjectService.js";
import { ReflectionService } from "../services/ReflectionService.js";
import { RUBRIC } from "../data/projects.js";
import { DOMAINS } from "../data/domains.js";
import { ActivityCard } from "./ActivityCard.jsx";
import { ReflectionForm } from "./ReflectionForm.jsx";
import { Btn } from "./ui/Btn.jsx";
import { Pill } from "./ui/Pill.jsx";

const box = { background: COLORS.panel, borderRadius: 18, border: `1.5px solid ${COLORS.line}`, padding: 18 };
const h = { fontSize: 11, fontWeight: 800, opacity: .5, textTransform: "uppercase", marginBottom: 10, letterSpacing: ".06em" };
const domainName = id => DOMAINS.find(d => d.id === id)?.name || id;

function Toast({ badges }) {
  if (!badges.length) return null;
  return <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: COLORS.mossDeep, color: "#fff", padding: "10px 20px", borderRadius: 999, fontWeight: 700, zIndex: 5 }}>
    {badges.map(b => `${b.icon} Lencana baru: ${b.name}`).join("  ·  ")}</div>;
}

/* ---- MISSION / BOSS PLAYER ---- */
function MissionPlayer({ studentId, mission, onBack }) {
  const [run, setRun] = useState(null);
  const [idx, setIdx] = useState(null);
  const [badges, setBadges] = useState([]);
  const [reflected, setReflected] = useState(false);
  useEffect(() => { (async () => {
    const r = await MissionService.getRun(studentId, mission.id);
    setRun(r); setIdx(Math.min(Object.keys(r.answers).length, mission.steps.length));
    setReflected(!!(await ReflectionService.forContext(studentId, { type: mission.kind, id: mission.id })));
  })(); }, [studentId, mission]);
  const flash = b => { if (b.length) { setBadges(b); setTimeout(() => setBadges([]), 3000); } };
  if (!run) return null;

  const step = mission.steps[idx];
  const saved = step && run.answers[step.n];
  const finished = idx >= mission.steps.length;
  const graded = Object.values(run.answers).filter(a => a.gradable);

  async function handle(res) {
    const out = await MissionService.answer({ studentId, mission, step, result: res, choice: res.choice });
    setRun(out.run); flash(out.newBadges);
  }

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div><div style={{ fontSize: 12, opacity: .55, fontWeight: 700 }}>{mission.kind === "boss" ? "BOSS CHALLENGE" : "MISI"}</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.mossDeep }}>{mission.icon} {mission.title}</div></div>
        <Btn variant="ghost" onClick={onBack}>← Daftar misi</Btn>
      </div>
      {idx === 0 && !saved && <div style={{ ...box, marginBottom: 16, background: `${COLORS.amber}12`, borderColor: COLORS.amber }}>{mission.story}</div>}
      {!finished && step && (
        <>
          <ActivityCard key={`${mission.id}-${step.n}`} activity={{ ...step, tag: mission.kind === "boss" ? "BOSS" : "MISI" }} feedback={saved} onAnswer={handle} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <span style={{ fontSize: 13, opacity: .55 }}>Langkah {idx + 1} dari {mission.steps.length}</span>
            {saved && <Btn onClick={() => setIdx(idx + 1)}>{idx + 1 === mission.steps.length ? "Selesai →" : "Berikutnya →"}</Btn>}
          </div>
        </>
      )}
      {finished && (
        <>
          <div style={{ ...box, textAlign: "center" }}>
            <div style={{ fontSize: 40 }}>{mission.kind === "boss" ? "🏆" : "🎉"}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.mossDeep }}>{mission.kind === "boss" ? "Boss Challenge selesai!" : "Misi selesai!"}</div>
            <div style={{ fontSize: 14, opacity: .7, marginTop: 6 }}>{graded.filter(a => a.correct).length} dari {graded.length} jawaban pilihan tepat. Jawaban terbukamu menunjukkan caramu berpikir — itu yang paling berharga.</div>
          </div>
          {!reflected
            ? <ReflectionForm studentId={studentId} context={{ type: mission.kind, id: mission.id, title: mission.title }} onDone={b => { flash(b); setReflected(true); }} />
            : <div style={{ textAlign: "center", marginTop: 16 }}><Btn onClick={onBack}>Kembali ke daftar misi</Btn></div>}
        </>
      )}
      <Toast badges={badges} />
    </div>
  );
}

/* ---- PROJECT ---- */
function ProjectForm({ studentId, project, onBack }) {
  const [sub, setSub] = useState(undefined);
  const [answers, setAnswers] = useState({});
  const [rating, setRating] = useState({});
  const [err, setErr] = useState("");
  const [badges, setBadges] = useState([]);
  const [askReflect, setAskReflect] = useState(false);
  useEffect(() => { ProjectService.get(studentId, project.id).then(s => {
    setSub(s || null);
    if (s) { setAnswers(Object.fromEntries(s.answers.map((a, i) => [i, a]))); setRating(s.self_rating); }
  }); }, [studentId, project.id]);
  if (sub === undefined) return null;
  const locked = sub?.status === "reviewed";

  async function submit() {
    try {
      const out = await ProjectService.submit({ studentId, projectId: project.id, answers: project.prompts.map((_, i) => answers[i] || ""), selfRating: rating });
      setSub(out.submission); setErr(""); setBadges(out.newBadges); setAskReflect(!(await ReflectionService.forContext(studentId, { type: "project", id: project.id })));
      setTimeout(() => setBadges([]), 3000);
    } catch (e) { setErr(e.message); }
  }
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.mossDeep }}>{project.icon} {project.title}</div>
        <Btn variant="ghost" onClick={onBack}>← Kembali</Btn>
      </div>
      <div style={{ fontSize: 14, opacity: .75, marginBottom: 16 }}>{project.brief} <span style={{ opacity: .6 }}>(Tidak ada jawaban benar atau salah — tunjukkan caramu berpikir.)</span></div>
      {sub?.status === "reviewed" && (
        <div style={{ ...box, borderColor: COLORS.master, marginBottom: 16 }}>
          <div style={h}>Komentar gurumu</div>
          <div style={{ fontSize: 14 }}>{sub.teacher_comment || "Terima kasih sudah mengerjakan dengan sungguh-sungguh!"}</div>
        </div>
      )}
      {project.prompts.map((q, i) => (
        <label key={i} style={{ display: "block", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{i + 1}. {q}</div>
          <textarea rows={3} disabled={locked} value={answers[i] || ""} onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))}
            style={{ width: "100%", boxSizing: "border-box", borderRadius: 10, border: `1.5px solid ${COLORS.line}`, padding: 10, fontFamily: "inherit", fontSize: 14 }} />
        </label>
      ))}
      <div style={{ ...box, marginTop: 18 }}>
        <div style={h}>Nilai dirimu sendiri</div>
        {RUBRIC.map(d => (
          <div key={d.id} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{d.name}</div>
            <div style={{ display: "grid", gap: 4 }}>
              {d.levels.map((lv, k) => (
                <label key={k} style={{ display: "flex", gap: 8, fontSize: 13, alignItems: "center", cursor: locked ? "default" : "pointer" }}>
                  <input type="radio" name={d.id} disabled={locked} checked={rating[d.id] === k + 1} onChange={() => setRating(r => ({ ...r, [d.id]: k + 1 }))} />
                  <span>{lv}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        {sub?.status === "reviewed" && (
          <div style={{ marginTop: 8, fontSize: 13 }}><b>Penilaian guru:</b> {RUBRIC.map(d => `${d.name} ${sub.teacher_rating[d.id]}/3`).join(" · ")}</div>
        )}
      </div>
      {err && <div style={{ color: COLORS.coral, fontSize: 13, margin: "10px 0" }}>{err}</div>}
      {!locked && <div style={{ marginTop: 14 }}><Btn onClick={submit}>{sub ? "Perbarui karya" : "Kumpulkan karya"}</Btn>{sub && <span style={{ marginLeft: 12, fontSize: 13, color: COLORS.master, fontWeight: 700 }}>✓ Terkirim — guru akan menilai.</span>}</div>}
      {askReflect && <ReflectionForm studentId={studentId} context={{ type: "project", id: project.id, title: project.title }} onDone={() => setAskReflect(false)} />}
      <Toast badges={badges} />
    </div>
  );
}

/* ---- HUB ---- */
export function MissionsArea({ studentId, onBack }) {
  const [view, setView] = useState({ name: "hub" });
  const [missions, setMissions] = useState(null);
  const [subs, setSubs] = useState({});
  const load = useCallback(async () => {
    setMissions(await MissionService.summary(studentId));
    setSubs(Object.fromEntries((await ProjectService.listForStudent(studentId)).map(s => [s.project_id, s])));
  }, [studentId]);
  useEffect(() => { if (view.name === "hub") load(); }, [view.name, load]);

  if (view.name === "mission") return <MissionPlayer studentId={studentId} mission={MissionService.byId(view.id)} onBack={() => setView({ name: "hub" })} />;
  if (view.name === "project") return <ProjectForm studentId={studentId} project={ProjectService.byId(view.id)} onBack={() => setView({ name: "hub" })} />;
  if (!missions) return null;

  const Card = m => {
    const open = m.availability.open;
    return (
      <div key={m.id} style={{ ...box, opacity: open || m.completed ? 1 : .7, borderColor: m.kind === "boss" ? COLORS.amber : COLORS.line }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{m.icon} {m.title}</div>
          {m.completed ? <Pill color={COLORS.master}>Selesai</Pill> : open ? <Pill color={COLORS.amber}>{m.done ? `${m.done}/${m.total}` : "Siap"}</Pill> : <Pill color={COLORS.line}>🔒 Terkunci</Pill>}
        </div>
        <div style={{ fontSize: 13, opacity: .7, margin: "8px 0 12px" }}>{MissionService.byId(m.id).story}</div>
        {open || m.completed
          ? <Btn variant={m.completed ? "ghost" : "primary"} onClick={() => setView({ name: "mission", id: m.id })}>{m.completed ? "Lihat lagi" : m.done ? "Lanjutkan" : "Mulai"}</Btn>
          : <div style={{ fontSize: 12, color: COLORS.build }}><b>Bangun fondasinya dulu:</b> {m.availability.reasons.map(r => r.text).join(" · ")}</div>}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div><div style={{ fontSize: 13, opacity: .55, fontWeight: 700 }}>TERAPKAN KEMAMPUANMU</div><div style={{ fontSize: 24, fontWeight: 800, color: COLORS.mossDeep }}>Misi, Boss & Proyek</div></div>
        <Btn variant="ghost" onClick={onBack}>← Kembali belajar</Btn>
      </div>
      <div style={{ ...h }}>Misi</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14, marginBottom: 22 }}>{missions.filter(m => m.kind === "mission").map(Card)}</div>
      <div style={{ ...h }}>Boss Challenge</div>
      <div style={{ display: "grid", gap: 14, marginBottom: 22 }}>{missions.filter(m => m.kind === "boss").map(Card)}</div>
      <div style={{ ...h }}>Proyek per domain</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 14 }}>
        {ProjectService.all().map(p => {
          const s = subs[p.id];
          return (
            <div key={p.id} style={box}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ fontWeight: 800 }}>{p.icon} {p.title}</div>
                {s ? <Pill color={s.status === "reviewed" ? COLORS.master : COLORS.sky}>{s.status === "reviewed" ? "Dinilai" : "Terkirim"}</Pill> : null}
              </div>
              <div style={{ fontSize: 11, opacity: .55, margin: "4px 0 6px" }}>{domainName(p.domain)}</div>
              <div style={{ fontSize: 13, opacity: .75, marginBottom: 10 }}>{p.brief}</div>
              <Btn variant="ghost" onClick={() => setView({ name: "project", id: p.id })}>{s ? "Buka karya" : "Kerjakan"}</Btn>
            </div>
          );
        })}
      </div>
    </div>
  );
}
