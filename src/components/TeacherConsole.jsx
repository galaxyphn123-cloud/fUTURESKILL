import { useState, useEffect, useCallback } from "react";
import { COLORS } from "../theme.js";
import { LIVE_SKILLS } from "../data/skillContent.js";
import { masteryLabel } from "../engine/mastery.js";
import { TeacherService } from "../services/TeacherService.js";
import { ClassService } from "../services/ClassService.js";
import { SessionService } from "../services/SessionService.js";
import { AnalyticsService } from "../services/AnalyticsService.js";
import { Btn } from "./ui/Btn.jsx";
import { Pill } from "./ui/Pill.jsx";
import { StatCard } from "./StatCard.jsx";
import { DevSettingsPanel } from "./DevSettingsPanel.jsx";

const box = { background: COLORS.panel, borderRadius: 18, border: `1.5px solid ${COLORS.line}`, padding: 18, marginBottom: 16 };
const field = { fontFamily: "inherit", fontSize: 14, padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${COLORS.line}` };
const h = { fontSize: 11, fontWeight: 800, opacity: .5, textTransform: "uppercase", marginBottom: 10 };
const skillName = id => LIVE_SKILLS.find(s => s.id === id)?.name || id;
const when = t => (t ? new Date(t).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" }) : "—");

function Gate({ onLogin }) {
  const [exists, setExists] = useState(null);
  const [name, setName] = useState(""); const [pin, setPin] = useState(""); const [err, setErr] = useState("");
  useEffect(() => { TeacherService.exists().then(setExists); }, []);
  if (exists === null) return null;
  async function go() {
    setErr("");
    try {
      if (!exists) await TeacherService.setup(name, pin);
      const t = await TeacherService.login(pin);
      if (!t) setErr("PIN salah."); else onLogin(t);
    } catch (e) { setErr(e.message); }
  }
  return (
    <div style={{ maxWidth: 380, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.mossDeep, marginBottom: 6 }}>{exists ? "Masuk sebagai guru" : "Buat akun guru"}</div>
      <div style={{ fontSize: 12, opacity: .55, marginBottom: 18 }}>PIN hanya melindungi konsol ini di perangkat ini; bukan pengganti akun sungguhan.</div>
      {!exists && <input value={name} onChange={e => setName(e.target.value)} placeholder="Namamu" style={{ ...field, width: "100%", boxSizing: "border-box", marginBottom: 10 }} />}
      <input value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} type="password" inputMode="numeric" placeholder="PIN 4–8 angka"
        style={{ ...field, width: "100%", boxSizing: "border-box", marginBottom: 12 }} />
      {err && <div style={{ color: COLORS.coral, fontSize: 13, marginBottom: 10 }}>{err}</div>}
      <Btn style={{ width: "100%" }} disabled={pin.length < 4 || (!exists && !name.trim())} onClick={go}>{exists ? "Masuk" : "Buat & masuk"}</Btn>
    </div>
  );
}

function ClassesTab({ teacher, classes, reload }) {
  const [name, setName] = useState(""); const [openId, setOpenId] = useState(null);
  const [roster, setRoster] = useState([]); const [newKid, setNewKid] = useState(""); const [err, setErr] = useState("");
  const loadRoster = useCallback(async id => setRoster(await ClassService.roster(id)), []);
  useEffect(() => { if (openId) loadRoster(openId); }, [openId, loadRoster]);
  return (
    <>
      <div style={box}>
        <div style={h}>Kelas baru</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="mis. Kelas 2A" style={{ ...field, flex: 1 }} />
          <Btn disabled={!name.trim()} onClick={async () => { try { const c = await ClassService.createClass(teacher.id, name); setName(""); setErr(""); await reload(); setOpenId(c.id); } catch (e) { setErr(e.message); } }}>Buat</Btn>
        </div>
        {err && <div style={{ color: COLORS.coral, fontSize: 13, marginTop: 8 }}>{err}</div>}
      </div>
      {classes.map(c => (
        <div key={c.id} style={box}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 800 }}>{c.name}</div>
            <Btn variant="ghost" onClick={() => setOpenId(openId === c.id ? null : c.id)}>{openId === c.id ? "Tutup daftar" : "Lihat siswa"}</Btn>
          </div>
          {openId === c.id && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input value={newKid} onChange={e => setNewKid(e.target.value)} placeholder="Nama siswa" style={{ ...field, flex: 1 }} />
                <Btn variant="amber" disabled={!newKid.trim()} onClick={async () => { await ClassService.enroll(c.id, newKid); setNewKid(""); loadRoster(c.id); }}>Tambah</Btn>
              </div>
              {roster.length === 0 && <div style={{ opacity: .5, fontSize: 13 }}>Belum ada siswa. Siswa juga otomatis terdaftar saat mengetik namanya di layar gabung.</div>}
              {roster.map(s => (
                <div key={s.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: `1px solid ${COLORS.line}`, fontSize: 14 }}>
                  <span>{s.name}</span><span style={{ fontSize: 12 }}>siswa <code style={{ fontWeight: 800, letterSpacing: ".15em" }}>{s.code}</code> · orang tua <code style={{ fontWeight: 800, letterSpacing: ".1em" }}>{s.parent_code}</code></span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
}

function SessionsTab({ classes, sessions, reload }) {
  const [classId, setClassId] = useState(""); const [skillId, setSkillId] = useState(LIVE_SKILLS[0].id);
  const domains = [...new Set(LIVE_SKILLS.map(s => s.domain))];
  const cid = classId || classes[0]?.id || "";
  return (
    <>
      <div style={box}>
        <div style={h}>Mulai sesi baru</div>
        {classes.length === 0 ? <div style={{ opacity: .6, fontSize: 13 }}>Buat kelas dulu di tab Kelas.</div> : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select value={cid} onChange={e => setClassId(e.target.value)} style={field}>{classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
            <select value={skillId} onChange={e => setSkillId(e.target.value)} style={{ ...field, flex: 1, minWidth: 220 }}>
              {domains.map(d => <optgroup key={d} label={d}>{LIVE_SKILLS.filter(s => s.domain === d).map(s => <option key={s.id} value={s.id}>{s.id} · {s.name}</option>)}</optgroup>)}
            </select>
            <Btn onClick={async () => { await SessionService.create({ classId: cid, skillId }); reload(); }}>Buat kode</Btn>
          </div>
        )}
      </div>
      {sessions.map(s => (
        <div key={s.id} style={{ ...box, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, opacity: s.status === "open" ? 1 : .55 }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: ".18em", color: COLORS.mossDeep }}>{s.code}</div>
            <div style={{ fontSize: 13 }}>{classes.find(c => c.id === s.class_id)?.name} · {skillName(s.skill_id)}</div>
          </div>
          {s.status === "open" ? <Btn variant="ghost" onClick={async () => { await SessionService.close(s.id); reload(); }}>Tutup sesi</Btn> : <Pill color={COLORS.line}>Ditutup</Pill>}
        </div>
      ))}
    </>
  );
}

function ReportTab({ sessions, classes }) {
  const [sid, setSid] = useState(""); const [ov, setOv] = useState(null); const [qa, setQa] = useState(null);
  const [detail, setDetail] = useState(null);
  const session = sessions.find(s => s.id === (sid || sessions[0]?.id));
  const load = useCallback(async () => {
    if (!session) return;
    setDetail(null); setOv(await AnalyticsService.classOverview(session)); setQa(await AnalyticsService.questionAnalytics(session));
  }, [session?.id]);
  useEffect(() => { load(); }, [load]);
  if (!session) return <div style={{ ...box, opacity: .6 }}>Belum ada sesi. Buat sesi di tab Sesi.</div>;
  const qRow = q => (
    <div key={q.n} style={{ padding: "8px 0", borderTop: `1px solid ${COLORS.line}`, fontSize: 13 }}>
      <b>#{q.n}</b> · {q.accuracy}% benar ({q.attempts} siswa) — {q.q.slice(0, 110)}
      {q.commonMistake && <div style={{ opacity: .65 }}>Kesalahan terbanyak: “{String(q.commonMistake.text).slice(0, 80)}” ({q.commonMistake.count}×)</div>}
    </div>
  );
  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, alignItems: "center" }}>
        <select value={session.id} onChange={e => setSid(e.target.value)} style={{ ...field, flex: 1 }}>
          {sessions.map(s => <option key={s.id} value={s.id}>{s.code} · {classes.find(c => c.id === s.class_id)?.name} · {skillName(s.skill_id)}{s.status === "closed" ? " (ditutup)" : ""}</option>)}
        </select>
        <Btn variant="ghost" onClick={load}>Segarkan</Btn>
      </div>
      {ov && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 16 }}>
            <StatCard label="Siswa terdaftar" value={ov.total} />
            <StatCard label="Sudah mengerjakan" value={ov.active} />
            <StatCard label="Rata-rata selesai" value={`${ov.avgCompletion}%`} />
            <StatCard label="Rata-rata akurasi" value={ov.active ? `${ov.avgAccuracy}%` : "—"} />
          </div>
          <div style={{ ...box, padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 }}>
              <thead><tr style={{ textAlign: "left", fontSize: 11, opacity: .5, textTransform: "uppercase" }}>
                {["Siswa", "Selesai", "Akurasi", "XP", "Fase", "Terakhir aktif"].map(x => <th key={x} style={{ padding: "12px 14px" }}>{x}</th>)}
              </tr></thead>
              <tbody>
                {ov.rows.length === 0 && <tr><td colSpan={6} style={{ padding: 18, opacity: .5 }}>Belum ada siswa di kelas ini.</td></tr>}
                {ov.rows.map(r => (
                  <tr key={r.id} onClick={async () => setDetail({ row: r, ...(await AnalyticsService.studentDetail(r.id, session.skill_id)) })}
                    style={{ borderTop: `1px solid ${COLORS.line}`, cursor: "pointer" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 700 }}>{r.name}</td>
                    <td style={{ padding: "12px 14px" }}>{r.done}/100</td>
                    <td style={{ padding: "12px 14px" }}>{r.done ? <Pill color={masteryLabel(r.accuracy).color}>{r.accuracy}%</Pill> : "—"}</td>
                    <td style={{ padding: "12px 14px" }}>{r.xp}</td>
                    <td style={{ padding: "12px 14px" }}>{r.phase}</td>
                    <td style={{ padding: "12px 14px", fontSize: 12 }}>{when(r.lastActive)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {detail && (
        <div style={box}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ fontWeight: 800, fontSize: 17 }}>{detail.row.name} · {detail.attempts} percobaan</div><Btn variant="ghost" onClick={() => setDetail(null)}>Tutup</Btn></div>
          <div style={{ ...h, marginTop: 14 }}>Micro-skill</div>
          {detail.micro.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}>
              <span>{m.name}</span><span style={{ color: m.color, fontWeight: 700 }}>{m.label}{m.ready ? ` · ${m.pct}%` : ""}</span>
            </div>
          ))}
          <div style={{ ...h, marginTop: 14 }}>Yang perlu diperkuat ({detail.mistakes.length})</div>
          {detail.mistakes.length === 0 && <div style={{ fontSize: 13, opacity: .55 }}>Belum ada jawaban yang meleset.</div>}
          {detail.mistakes.slice(-10).map((m, i) => (
            <div key={i} style={{ fontSize: 13, padding: "8px 0", borderTop: `1px solid ${COLORS.line}` }}>
              <b>#{m.n}</b> {m.q.slice(0, 120)}<div style={{ opacity: .7 }}>Dipilih: {m.chosen} · Seharusnya: {m.expected}</div>
            </div>
          ))}
        </div>
      )}
      {qa && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
          <div style={box}><div style={h}>Paling sulit</div>{qa.hardest.length ? qa.hardest.map(qRow) : <div style={{ fontSize: 13, opacity: .5 }}>Butuh minimal 2 siswa menjawab soal yang sama.</div>}</div>
          <div style={box}><div style={h}>Paling mudah</div>{qa.easiest.length ? qa.easiest.map(qRow) : <div style={{ fontSize: 13, opacity: .5 }}>Belum cukup data.</div>}</div>
        </div>
      )}
    </>
  );
}

export function TeacherConsole({ onExit }) {
  const [teacher, setTeacher] = useState(null);
  const [tab, setTab] = useState("classes");
  const [classes, setClasses] = useState([]); const [sessions, setSessions] = useState([]); const [showDev, setShowDev] = useState(false);
  const reload = useCallback(async () => {
    if (!teacher) return;
    const cs = await ClassService.listClasses(teacher.id);
    setClasses(cs.sort((a, b) => (a.created_at < b.created_at ? -1 : 1)));
    const ss = (await Promise.all(cs.map(c => SessionService.listForClass(c.id)))).flat();
    setSessions(ss.sort((a, b) => (a.created_at < b.created_at ? 1 : -1)));
  }, [teacher]);
  useEffect(() => { reload(); }, [reload]);

  if (!teacher) return <><Gate onLogin={setTeacher} /><div style={{ textAlign: "center" }}><Btn variant="ghost" onClick={onExit}>Kembali</Btn></div></>;
  const tabs = [["classes", "Kelas"], ["sessions", "Sesi"], ["report", "Laporan"]];
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div><div style={{ fontSize: 13, opacity: .55, fontWeight: 700 }}>KONSOL GURU</div><div style={{ fontSize: 22, fontWeight: 800, color: COLORS.mossDeep }}>Halo, {teacher.name}</div></div>
        <Btn variant="ghost" onClick={onExit}>Keluar</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map(([k, l]) => <button key={k} onClick={() => setTab(k)} style={{ fontFamily: "inherit", fontWeight: 700, fontSize: 14, padding: "9px 18px", borderRadius: 999, cursor: "pointer",
          border: `1.5px solid ${tab === k ? COLORS.mossDeep : COLORS.line}`, background: tab === k ? COLORS.mossDeep : "#fff", color: tab === k ? "#fff" : COLORS.ink }}>{l}</button>)}
      </div>
      <div style={{ fontSize: 12, opacity: .55, marginBottom: 14 }}>Mode lokal: data tersimpan di browser ini. Agar siswa di perangkat lain bisa bergabung, aktifkan backend Supabase.</div>
      {tab === "classes" && <ClassesTab teacher={teacher} classes={classes} reload={reload} />}
      {tab === "sessions" && <SessionsTab classes={classes} sessions={sessions} reload={reload} />}
      {tab === "report" && <ReportTab sessions={sessions} classes={classes} />}
      <button onClick={() => setShowDev(v => !v)} style={{ background: "none", border: "none", opacity: .4, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Pengaturan pengembang</button>
      {showDev && <DevSettingsPanel />}
    </div>
  );
}
