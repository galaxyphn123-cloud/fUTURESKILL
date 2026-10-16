import { COLORS } from "../theme.js";

export function StatCard({ label, value }) {
  return (
    <div style={{ background: COLORS.panel, borderRadius: 16, padding: 18, border: `1.5px solid ${COLORS.line}` }}>
      <div style={{ fontSize: 11, fontWeight: 800, opacity: .5, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.mossDeep }}>{value}</div>
    </div>
  );
}
