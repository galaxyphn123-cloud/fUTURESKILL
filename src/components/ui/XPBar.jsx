import { COLORS } from "../../theme.js";

export function XPBar({ xp }) {
  const level = Math.floor(xp / 100) + 1;
  const pct = xp % 100;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%", background: COLORS.amber, color: "#3a2600",
        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13,
        border: "2px solid #3a2600",
      }}>{level}</div>
      <div style={{ width: 120, height: 8, background: COLORS.line, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: COLORS.amber, transition: "width .3s" }} />
      </div>
      <span style={{ fontSize: 12, color: COLORS.ink, opacity: .6, fontWeight: 600 }}>{xp} XP</span>
    </div>
  );
}
