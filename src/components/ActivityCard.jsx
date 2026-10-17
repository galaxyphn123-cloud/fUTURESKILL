import { useState, useEffect } from "react";
import { COLORS } from "../theme.js";
import { phaseOf } from "../data/domains.js";
import { Btn } from "./ui/Btn.jsx";
import { Pill } from "./ui/Pill.jsx";

export function ActivityCard({ activity, onAnswer, feedback }) {
  const [selected, setSelected] = useState(null);
  const [orderState, setOrderState] = useState(activity.type === "order" ? [...activity.items] : null);
  const [classifyState, setClassifyState] = useState(
    activity.type === "classify" ? Object.fromEntries(activity.items.map(i => [i, null])) : null
  );
  const [openText, setOpenText] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => { setSelected(null); setOpenText(""); setRevealed(false);
    if (activity.type === "order") setOrderState([...activity.items].sort(() => Math.random() - .5));
    if (activity.type === "classify") setClassifyState(Object.fromEntries(activity.items.map(i => [i, null])));
  }, [activity.n]);

  const ph = phaseOf(activity.n);
  const answered = !!feedback;

  function submitMCQorTF(idx) {
    if (answered) return;
    setSelected(idx);
    const correct = idx === (activity.type === "tf" ? activity.answer : activity.answer);
    onAnswer({ correct, gradable: true, choice: idx });
  }
  function submitOrder() {
    if (answered) return;
    const correctOrder = activity.answer.map(i => activity.items[i]);
    const correct = JSON.stringify(orderState) === JSON.stringify(correctOrder);
    onAnswer({ correct, gradable: true, choice: orderState.join(" → ") });
  }
  function submitClassify() {
    if (answered) return;
    let correct = true;
    for (const g of activity.groups) {
      const expected = new Set(activity.answer[g]);
      for (const item of activity.items) {
        const placed = classifyState[item] === g;
        if (expected.has(item) !== placed) correct = false;
      }
    }
    onAnswer({ correct, gradable: true, choice: JSON.stringify(classifyState) });
  }
  function submitOpen() {
    if (answered) return;
    setRevealed(true);
    onAnswer({ correct: true, gradable: false, choice: openText.trim() });
  }
  function move(item, dir) {
    const i = orderState.indexOf(item);
    const j = i + dir;
    if (j < 0 || j >= orderState.length) return;
    const copy = [...orderState];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setOrderState(copy);
  }

  return (
    <div style={{ background: COLORS.panel, borderRadius: 20, padding: "26px 26px 22px", border: `1.5px solid ${COLORS.line}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <Pill color={ph.tone}>{ph.label} · #{activity.n}</Pill>
        <span style={{ fontSize: 12, color: COLORS.ink, opacity: .5, fontWeight: 600 }}>{activity.micro}</span>
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, color: COLORS.ink, lineHeight: 1.4, marginBottom: 18 }}>{activity.q}</div>

      {(activity.type === "mcq") && (
        <div style={{ display: "grid", gap: 10 }}>
          {activity.options.map((opt, idx) => {
            const isCorrect = idx === activity.answer;
            const isPicked = selected === idx;
            let bg = "#fff", border = COLORS.line, color = COLORS.ink;
            if (answered && isCorrect) { bg = `${COLORS.master}15`; border = COLORS.master; }
            else if (answered && isPicked && !isCorrect) { bg = `${COLORS.coral}15`; border = COLORS.coral; }
            return (
              <button key={idx} onClick={() => submitMCQorTF(idx)} disabled={answered}
                style={{ textAlign: "left", padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${border}`,
                  background: bg, color, cursor: answered ? "default" : "pointer", fontSize: 15, fontFamily: "inherit" }}>
                {opt}
              </button>
            );
          })}
        </div>
      )}

      {activity.type === "tf" && (
        <div style={{ display: "flex", gap: 10 }}>
          {[true, false].map(v => {
            const isCorrect = v === activity.answer;
            const isPicked = selected === v;
            let bg = "#fff", border = COLORS.line;
            if (answered && isCorrect) { bg = `${COLORS.master}15`; border = COLORS.master; }
            else if (answered && isPicked && !isCorrect) { bg = `${COLORS.coral}15`; border = COLORS.coral; }
            return (
              <button key={String(v)} onClick={() => submitMCQorTF(v)} disabled={answered}
                style={{ flex: 1, padding: "14px", borderRadius: 12, border: `1.5px solid ${border}`, background: bg,
                  fontWeight: 700, fontSize: 15, cursor: answered ? "default" : "pointer", fontFamily: "inherit" }}>
                {v ? "Benar" : "Salah"}
              </button>
            );
          })}
        </div>
      )}

      {activity.type === "order" && (
        <div>
          <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
            {orderState.map((item, i) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                borderRadius: 10, background: COLORS.paper, border: `1px solid ${COLORS.line}` }}>
                <span style={{ fontWeight: 800, color: COLORS.moss, width: 18 }}>{i + 1}</span>
                <span style={{ flex: 1, fontSize: 14 }}>{item}</span>
                {!answered && <div style={{ display: "flex", gap: 4 }}>
                  <button onClick={() => move(item, -1)} style={{ border: "none", background: COLORS.line, borderRadius: 6, width: 26, cursor: "pointer" }}>↑</button>
                  <button onClick={() => move(item, 1)} style={{ border: "none", background: COLORS.line, borderRadius: 6, width: 26, cursor: "pointer" }}>↓</button>
                </div>}
              </div>
            ))}
          </div>
          {!answered && <Btn variant="amber" onClick={submitOrder}>Periksa urutanku</Btn>}
        </div>
      )}

      {activity.type === "classify" && (
        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {activity.items.map(item => (
              <div key={item} style={{ padding: "8px 12px", borderRadius: 10, background: COLORS.paper,
                border: `1px solid ${COLORS.line}`, fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                <span>{item}</span>
                {!answered && <select value={classifyState[item] || ""} onChange={e =>
                  setClassifyState(s => ({ ...s, [item]: e.target.value }))}
                  style={{ fontFamily: "inherit", fontSize: 12, borderRadius: 6, border: `1px solid ${COLORS.line}` }}>
                  <option value="">pilih…</option>
                  {activity.groups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>}
                {answered && <Pill color={COLORS.moss}>{classifyState[item]}</Pill>}
              </div>
            ))}
          </div>
          {!answered && <Btn variant="amber" onClick={submitClassify}
            disabled={activity.items.some(i => !classifyState[i])}>Periksa kelompokku</Btn>}
        </div>
      )}

      {activity.type === "open" && (
        <div>
          <textarea value={openText} onChange={e => setOpenText(e.target.value)} disabled={answered}
            placeholder="Tulis pemikiranmu di sini…" rows={4}
            style={{ width: "100%", borderRadius: 12, border: `1.5px solid ${COLORS.line}`, padding: 12,
              fontFamily: "inherit", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
          {!answered && <div style={{ marginTop: 10 }}>
            <Btn variant="amber" onClick={submitOpen} disabled={!openText.trim()}>Saya selesai — tunjukkan contoh jawaban</Btn>
          </div>}
          {revealed && (
            <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: `${COLORS.lilac}12`, border: `1px solid ${COLORS.lilac}40` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.lilac, marginBottom: 6, textTransform: "uppercase" }}>Satu contoh yang baik (jawabanmu tidak harus sama persis)</div>
              <div style={{ fontSize: 14, color: COLORS.ink }}>{activity.sample}</div>
            </div>
          )}
        </div>
      )}

      {answered && activity.type !== "open" && (
        <div style={{ marginTop: 16, padding: 14, borderRadius: 12,
          background: feedback.correct ? `${COLORS.master}12` : `${COLORS.build}12`,
          border: `1px solid ${feedback.correct ? COLORS.master : COLORS.build}40` }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4, color: feedback.correct ? COLORS.master : COLORS.build }}>
            {feedback.correct ? "Bagus — itu dia." : "Belum tepat — ini alasannya:"}
          </div>
          <div style={{ fontSize: 14, color: COLORS.ink }}>{activity.explain}</div>
        </div>
      )}
      {answered && activity.type === "open" && (
        <div style={{ marginTop: 14, fontSize: 13, color: COLORS.ink, opacity: .75 }}>{activity.explain}</div>
      )}
      {!answered && activity.hint && (
        <details style={{ marginTop: 14 }}>
          <summary style={{ fontSize: 12, color: COLORS.sky, cursor: "pointer", fontWeight: 700 }}>Butuh petunjuk?</summary>
          <div style={{ fontSize: 13, color: COLORS.ink, opacity: .8, marginTop: 6 }}>{activity.hint}</div>
        </details>
      )}
    </div>
  );
}
