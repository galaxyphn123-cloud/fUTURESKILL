import { COLORS } from "../../theme.js";

export function Btn({ children, onClick, variant = "primary", disabled, style }) {
  const base = {
    fontFamily: "inherit", fontSize: 15, fontWeight: 600, padding: "12px 22px",
    borderRadius: 12, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1, transition: "transform .12s ease, box-shadow .12s ease",
  };
  const variants = {
    primary: { background: COLORS.mossDeep, color: "#fff", boxShadow: "0 3px 0 #0f2e27" },
    ghost: { background: "transparent", color: COLORS.mossDeep, border: `1.5px solid ${COLORS.line}` },
    amber: { background: COLORS.amber, color: "#3a2600", boxShadow: "0 3px 0 #a97318" },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = "translateY(2px)")}
      onMouseUp={e => (e.currentTarget.style.transform = "translateY(0)")}
      style={{ ...base, ...variants[variant], ...style }}
    >{children}</button>
  );
}
