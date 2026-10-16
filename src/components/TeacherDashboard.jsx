import { useState, useEffect, useCallback } from "react";
import { COLORS } from "../theme.js";
import { LIVE_SKILLS } from "../data/skillContent.js";
import { masteryLabel } from "../engine/mastery.js";
import { AnalyticsService } from "../services/AnalyticsService.js";
import { Btn } from "./ui/Btn.jsx";
import { Pill } from "./ui/Pill.jsx";
import { StatCard } from "./StatCard.jsx";
import { DevSettingsPanel } from "./DevSettingsPanel.jsx";

export function TeacherDashboard({ onExit }) {
  const [skillId, setSkillId] = useState(LIVE_SKILLS[0].id);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDev, setShowDev] = useState(false);
  const skill = LIVE_SKILLS.find(s => s.id === skillId);

  const refresh = useCallback(async () => {
    setLoading(true);
    setStudents(await AnalyticsService.classSummary(skillId));
    setLoading(false);
  }, [skillId]);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, opacity: .55, fontWeight: 700 }}>DASBOR GURU</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.mossDeep }}>Ringkasan Kelas — {skill ? skill.name : ""}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select value={skillId} onChange={e => setSkillId(e.target.value)}
            style={{ fontFamily: "inherit", fontSize: 13, padding: "8px 10px", borderRadius: 10, border: `1.5px solid ${COLORS.line}` }}>
            {LIVE_SKILLS.map(s => <option key={s.id} value={s.id}>{s.domain} → {s.name}</option>)}
          </select>
          <Btn variant="ghost" onClick={onExit}>Kembali</Btn>
        </div>
      </div>
      <div style={{ fontSize: 13, opacity: .55, marginBottom: 20 }}>
        Data kemajuan yang ditampilkan di sini disimpan oleh siswa saat mengerjakan aplikasi ini — terlihat oleh siapa pun yang membuka dasbor ini.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
        <StatCard label="Siswa aktif" value={students.length} />
        <StatCard label="Rata-rata akurasi" value={students.length ? `${Math.round(students.reduce((s, x) => s + x.accuracy, 0) / students.length)}%` : "—"} />
        <StatCard label="Rata-rata XP" value={students.length ? Math.round(students.reduce((s, x) => s + x.xp, 0) / students.length) : "—"} />
      </div>

      <div style={{ background: COLORS.panel, borderRadius: 18, border: `1.5px solid ${COLORS.line}`, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr .8fr .8fr .8fr 1fr", padding: "12px 18px",
          fontSize: 11, fontWeight: 800, opacity: .5, textTransform: "uppercase", borderBottom: `1px solid ${COLORS.line}` }}>
          <span>Siswa</span><span>XP</span><span>Rentetan</span><span>Akurasi</span><span>Fase tercapai</span>
        </div>
        {loading && <div style={{ padding: 20, opacity: .5 }}>Memuat data kelas…</div>}
        {!loading && students.length === 0 && <div style={{ padding: 20, opacity: .5 }}>Belum ada siswa yang memulai. Bagikan kode gabung untuk memulai.</div>}
        {!loading && students.map(s => (
          <div key={s.id || s.name} style={{ display: "grid", gridTemplateColumns: "1.5fr .8fr .8fr .8fr 1fr", padding: "14px 18px",
            fontSize: 14, borderBottom: `1px solid ${COLORS.line}`, alignItems: "center" }}>
            <span style={{ fontWeight: 700 }}>{s.name}</span>
            <span>{s.xp}</span>
            <span>{s.streak > 0 ? `🔥 ${s.streak}` : "—"}</span>
            <span>{s.accuracy}%</span>
            <span><Pill color={masteryLabel(s.accuracy).color}>Fase {s.unlockedPhase}</Pill></span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center" }}>
        <Btn variant="ghost" onClick={refresh}>Segarkan</Btn>
        <button onClick={() => setShowDev(v => !v)} style={{ background: "none", border: "none", color: COLORS.ink,
          opacity: .4, fontSize: 12, cursor: "pointer", fontFamily: "inherit", marginLeft: "auto" }}>
          {showDev ? "Sembunyikan" : ""} Pengaturan pengembang
        </button>
      </div>
      {showDev && <DevSettingsPanel />}
    </div>
  );
}
