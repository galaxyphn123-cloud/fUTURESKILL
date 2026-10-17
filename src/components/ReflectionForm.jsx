import { useState } from "react";
import { COLORS } from "../theme.js";
import { REFLECTION_QUESTIONS } from "../data/projects.js";
import { ReflectionService } from "../services/ReflectionService.js";
import { Btn } from "./ui/Btn.jsx";

/* REFLECT — the last step of the learning loop. Saves one reflection per challenge. */
export function ReflectionForm({ studentId, context, onDone }) {
  const [answers, setAnswers] = useState({});
  const [err, setErr] = useState("");
  async function save() {
    try { const r = await ReflectionService.save(studentId, context, answers); onDone(r.newBadges); }
    catch (e) { setErr(e.message); }
  }
  return (
    <div style={{ background: COLORS.panel, border: `1.5px solid ${COLORS.lilac}60`, borderRadius: 18, padding: 20, marginTop: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: COLORS.lilac, textTransform: "uppercase", marginBottom: 10 }}>Refleksi · {context.title}</div>
      {REFLECTION_QUESTIONS.map(q => (
        <label key={q.id} style={{ display: "block", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{q.q}</div>
          <textarea rows={2} value={answers[q.id] || ""} onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
            style={{ width: "100%", boxSizing: "border-box", borderRadius: 10, border: `1.5px solid ${COLORS.line}`, padding: 10, fontFamily: "inherit", fontSize: 14 }} />
        </label>
      ))}
      {err && <div style={{ color: COLORS.coral, fontSize: 13, marginBottom: 8 }}>{err}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        <Btn onClick={save}>Simpan refleksi</Btn>
        <Btn variant="ghost" onClick={() => onDone([])}>Nanti saja</Btn>
      </div>
    </div>
  );
}
