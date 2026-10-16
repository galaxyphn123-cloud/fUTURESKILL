import { COLORS } from "../../theme.js";

export function Pill({ children, color = COLORS.moss, bg }) {
  return <span style={{
    display: "inline-block", padding: "3px 11px", borderRadius: 999, fontSize: 12, fontWeight: 700,
    letterSpacing: ".04em", textTransform: "uppercase", color: bg ? "#fff" : color,
    background: bg || `${color}18`, border: bg ? "none" : `1px solid ${color}40`,
  }}>{children}</span>;
}
