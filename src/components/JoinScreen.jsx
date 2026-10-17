import { useState } from "react";
import { COLORS } from "../theme.js";
import { LIVE_SKILLS } from "../data/skillContent.js";
import { SessionService } from "../services/SessionService.js";
import { ClassService } from "../services/ClassService.js";
import { Btn } from "./ui/Btn.jsx";

const input = { width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 12,
  border: `1.5px solid ${COLORS.line}`, fontSize: 18, fontFamily: "inherit", marginBottom: 12, textAlign: "center" };

/* Quizizz-style entry: 6-digit session code, then student code (or name the first time). */
export function JoinScreen({ onJoin, onTeacher }) {
  const [code, setCode] = useState("");
  const [session, setSession] = useState(null);
  const [who, setWho] = useState("");
  const [error, setError] = useState("");
  const skill = session && LIVE_SKILLS.find(s => s.id === session.skill_id);

  async function checkCode() {
    setError("");
    const s = await SessionService.findOpenByCode(code);
    if (!s) { setError("Kode ini tidak ditemukan atau sesinya sudah ditutup. Tanyakan pada gurumu."); return; }
    setSession(s);
  }
  async function enter() {
    setError("");
    let student = await ClassService.identify(session.class_id, who);
    if (!student) student = await ClassService.enroll(session.class_id, who);
    onJoin({ student, session });
  }

  return (
    <div style={{ maxWidth: 440, margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
      <div style={{ fontSize: 13, letterSpacing: ".12em", fontWeight: 800, color: COLORS.amber, marginBottom: 6 }}>GABUNG SESI</div>
      {!session ? (
        <>
          <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.mossDeep, marginBottom: 20 }}>Masukkan kode dari gurumu</div>
          <input value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric"
            placeholder="······" style={{ ...input, fontSize: 28, letterSpacing: ".3em" }} />
          {error && <div style={{ color: COLORS.coral, fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <Btn style={{ width: "100%" }} disabled={code.length !== 6} onClick={checkCode}>Lanjut</Btn>
        </>
      ) : (
        <>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.mossDeep, marginBottom: 4 }}>{skill ? skill.name : session.skill_id}</div>
          <div style={{ fontSize: 13, opacity: .55, marginBottom: 20 }}>Kode siswa (4 huruf) atau, kalau belum punya, ketik namamu</div>
          <input value={who} onChange={e => setWho(e.target.value)} placeholder="Kode siswa / namamu" style={input} />
          <Btn style={{ width: "100%" }} disabled={!who.trim()} onClick={enter}>Mulai belajar</Btn>
          <div style={{ marginTop: 10 }}><button onClick={() => { setSession(null); setWho(""); }} style={link}>← Ganti kode sesi</button></div>
        </>
      )}
      <div style={{ marginTop: 28 }}>
        <button onClick={onTeacher} style={{ ...link, color: COLORS.sky }}>Saya seorang guru</button>
      </div>
    </div>
  );
}
const link = { background: "none", border: "none", color: COLORS.ink, opacity: .7, fontFamily: "inherit", fontSize: 13, cursor: "pointer", fontWeight: 700 };
