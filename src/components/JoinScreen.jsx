import { useState, useEffect } from "react";
import { COLORS } from "../theme.js";
import { LIVE_SKILLS } from "../data/skillContent.js";
import { SessionService } from "../services/SessionService.js";
import { Btn } from "./ui/Btn.jsx";

export function JoinScreen({ skillId, onJoin, onTeacher }) {
  const skill = LIVE_SKILLS.find(s => s.id === skillId);
  const [session, setSession] = useState(null);
  const [name, setName] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { setSession(null); (async () => setSession(await SessionService.ensureDemoSession(skillId)))(); }, [skillId]);
  useEffect(() => { if (session) setCodeInput(session.code); }, [session]);

  async function handleStart() {
    setError("");
    const ok = await SessionService.validateCode(skillId, codeInput);
    if (!ok) { setError("Kode gabung tersebut tidak cocok dengan sesi ini. Tanyakan pada gurumu."); return; }
    onJoin(name.trim());
  }

  return (
    <div style={{ maxWidth: 440, margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
      <div style={{ fontSize: 13, letterSpacing: ".12em", fontWeight: 800, color: COLORS.amber, marginBottom: 6 }}>SESI</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.mossDeep, marginBottom: 4 }}>
        Kode gabung {session ? session.code : "······"}
      </div>
      <div style={{ fontSize: 13, opacity: .55, marginBottom: 28 }}>{skill ? `${skill.domain} → ${skill.name}, sedang berlangsung` : "Pilih skill di bawah"}</div>
      <input value={codeInput} onChange={e => setCodeInput(e.target.value)} placeholder="Kode 6 digit"
        style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", borderRadius: 12,
          border: `1.5px solid ${COLORS.line}`, fontSize: 15, fontFamily: "inherit", marginBottom: 10, textAlign: "center" }} />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ketik namamu"
        style={{ width: "100%", boxSizing: "border-box", padding: "14px 16px", borderRadius: 12,
          border: `1.5px solid ${COLORS.line}`, fontSize: 16, fontFamily: "inherit", marginBottom: 14, textAlign: "center" }} />
      {error && <div style={{ color: COLORS.coral, fontSize: 13, marginBottom: 12 }}>{error}</div>}
      <Btn style={{ width: "100%" }} disabled={!name.trim() || !codeInput.trim()} onClick={handleStart}>Mulai belajar</Btn>
      <div style={{ marginTop: 22 }}>
        <button onClick={onTeacher} style={{ background: "none", border: "none", color: COLORS.sky, fontFamily: "inherit",
          fontSize: 13, cursor: "pointer", fontWeight: 700 }}>Saya seorang guru — buka dasbor</button>
      </div>
    </div>
  );
}
