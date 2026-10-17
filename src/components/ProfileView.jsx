import { useState, useEffect } from "react";
import { COLORS } from "../theme.js";
import { BADGES } from "../data/badges.js";
import { PROJECTS } from "../data/projects.js";
import { ProfileService } from "../services/ProfileService.js";
import { Btn } from "./ui/Btn.jsx";

const box = { background: COLORS.panel, borderRadius: 18, border: `1.5px solid ${COLORS.line}`, padding: 18, marginBottom: 16 };
const h = { fontSize: 11, fontWeight: 800, opacity: .5, textTransform: "uppercase", marginBottom: 10, letterSpacing: ".06em" };
const when = t => (t ? new Date(t).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—");

/* One view for both audiences. Children see "MY FUTURE SKILLS"; parents see the same
   growth data in plain language plus a home suggestion. No ranking, no diagnosis. */
export function ProfileView({ studentId, audience = "student", onBack }) {
  const [p, setP] = useState(null);
  useEffect(() => { ProfileService.load(studentId).then(setP); }, [studentId]);
  if (!p) return <div style={{ padding: 40, textAlign: "center", opacity: .6 }}>Memuat…</div>;
  const parent = audience === "parent";
  const held = new Set(p.student.badges.map(b => b.id));

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 13, opacity: .55, fontWeight: 700 }}>{parent ? "PERKEMBANGAN BELAJAR" : "MY FUTURE SKILLS"}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.mossDeep }}>{p.student.name}</div>
        </div>
        <Btn variant="ghost" onClick={onBack}>{parent ? "Keluar" : "← Kembali belajar"}</Btn>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 16 }}>
        {[["Aktivitas selesai", p.totals.done], ["Micro-skill tuntas", p.totals.mastered], ["Skill dijelajahi", p.totals.skillsStarted], ["Terakhir belajar", when(p.totals.lastActive)]].map(([l, v]) => (
          <div key={l} style={{ ...box, marginBottom: 0, padding: 14 }}><div style={{ ...h, marginBottom: 4 }}>{l}</div><div style={{ fontSize: 24, fontWeight: 800, color: COLORS.mossDeep }}>{v}</div></div>
        ))}
      </div>

      {p.totals.done === 0 && <div style={{ ...box, textAlign: "center", opacity: .7 }}>{parent ? "Belum ada aktivitas yang dikerjakan. Begitu mulai, perkembangannya muncul di sini." : "Kerjakan aktivitas pertamamu — profilmu akan tumbuh di sini!"}</div>}

      {p.recommended && (
        <div style={{ ...box, borderColor: COLORS.amber, background: `${COLORS.amber}12` }}>
          <div style={h}>{parent ? "Saran untuk di rumah" : "Berikutnya untukmu"}</div>
          <div style={{ fontWeight: 800 }}>{p.recommended.skill} → {p.recommended.micro}</div>
          <div style={{ fontSize: 13, opacity: .75, marginTop: 4 }}>{parent
            ? `Ajak ${p.student.name} berlatih bagian ini 10–15 menit. Tanyakan: “Bagaimana kamu tahu jawabannya?” — menjelaskan alasan memperkuat pemahaman.`
            : p.recommended.reason}</div>
        </div>
      )}

      <div style={box}>
        <div style={h}>Level tiap domain</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 10 }}>
          {p.domains.map(d => (
            <div key={d.id} style={{ border: `1px solid ${COLORS.line}`, borderRadius: 14, padding: 12, opacity: d.started ? 1 : .5 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}><span style={{ color: d.color }}>{d.icon}</span> {d.name}</span>
                <span style={{ fontWeight: 800, color: COLORS.mossDeep }}>Level {d.level}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: COLORS.line, margin: "8px 0 4px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.min(100, (d.mastered / (d.skillCount * 10)) * 100)}%`, background: d.color }} />
              </div>
              <div style={{ fontSize: 11, opacity: .6 }}>{d.started}/{d.skillCount} skill dicoba · {d.mastered} micro-skill tuntas</div>
            </div>
          ))}
        </div>
      </div>

      {p.skills.length > 0 && (
        <div style={box}>
          <div style={h}>Skill yang sedang dijalani</div>
          {[...p.skills].sort((a, b) => b.lastActive - a.lastActive).map(s => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${COLORS.line}`, fontSize: 14, gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontWeight: 700 }}>{s.name}</span>
              <span style={{ opacity: .7 }}>Level {s.level} · {s.done}/100 aktivitas · fase {s.phase}</span>
            </div>
          ))}
        </div>
      )}

      {(p.missions.length > 0 || p.projects.length > 0) && (
        <div style={box}>
          <div style={h}>Penerapan: misi, boss & proyek</div>
          {p.missions.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, gap: 10 }}>
              <span>{m.icon} {m.title}</span><span style={{ opacity: .7 }}>{m.completed ? "selesai" : `${m.done}/${m.total} langkah`}</span>
            </div>
          ))}
          {p.projects.map(pr => (
            <div key={pr.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, gap: 10 }}>
              <span>🎨 {PROJECTS.find(x => x.id === pr.project_id)?.title}</span><span style={{ opacity: .7 }}>{pr.status === "reviewed" ? "sudah dinilai guru" : "terkirim"}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
        <div style={box}>
          <div style={h}>Yang sudah kuat</div>
          {p.strengths.length === 0 ? <div style={{ fontSize: 13, opacity: .55 }}>Akan muncul setelah beberapa aktivitas di satu bagian.</div>
            : p.strengths.map(s => <div key={s.skillId + s.micro} style={{ fontSize: 13, padding: "5px 0" }}>✓ {s.micro} <span style={{ opacity: .55 }}>· {s.skill} · {s.pct}%</span></div>)}
        </div>
        <div style={box}>
          <div style={h}>Sedang dibangun</div>
          {p.growth.length === 0 ? <div style={{ fontSize: 13, opacity: .55 }}>Belum ada bagian yang perlu perhatian khusus.</div>
            : p.growth.map(s => <div key={s.skillId + s.micro} style={{ fontSize: 13, padding: "5px 0" }}>↗ {s.micro} <span style={{ opacity: .55 }}>· {s.skill}</span></div>)}
        </div>
      </div>

      <div style={box}>
        <div style={h}>Lencana ({held.size}/{BADGES.length})</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
          {BADGES.map(b => (
            <div key={b.id} title={b.desc} style={{ display: "flex", gap: 10, alignItems: "center", opacity: held.has(b.id) ? 1 : .35, filter: held.has(b.id) ? "none" : "grayscale(1)" }}>
              <span style={{ fontSize: 26 }}>{b.icon}</span>
              <span><div style={{ fontWeight: 700, fontSize: 13 }}>{b.name}</div><div style={{ fontSize: 11, opacity: .65 }}>{b.desc}</div></span>
            </div>
          ))}
        </div>
      </div>

      {p.recent.length > 0 && (
        <div style={box}>
          <div style={h}>Aktivitas terakhir</div>
          {p.recent.map((a, i) => (
            <div key={i} style={{ fontSize: 13, padding: "6px 0", borderTop: i ? `1px solid ${COLORS.line}` : "none" }}>
              {a.gradable ? (a.correct ? "✓" : "↻") : "✎"} {a.q.slice(0, 100)}{a.q.length > 100 ? "…" : ""}
            </div>
          ))}
        </div>
      )}
      {parent && <div style={{ fontSize: 12, opacity: .55, textAlign: "center" }}>Ini gambaran kemajuan belajar, bukan penilaian atau diagnosis. Setiap anak tumbuh dengan kecepatannya sendiri.</div>}
    </div>
  );
}
