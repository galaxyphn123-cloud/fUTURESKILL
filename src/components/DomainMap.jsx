import { COLORS } from "../theme.js";
import { DOMAINS } from "../data/domains.js";
import { Pill } from "./ui/Pill.jsx";

/* Skill map for domains not yet live */
export function DomainMap({ selectedSkillId, onSelectLive }) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 20px 40px" }}>
      <div style={{ fontSize: 12, fontWeight: 800, opacity: .5, marginBottom: 10, textTransform: "uppercase" }}>Peta skill · domain MVP</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
        {DOMAINS.map(d => (
          <div key={d.id} style={{ background: COLORS.panel, border: `1.5px solid ${COLORS.line}`, borderRadius: 16, padding: 16 }}>
            <div style={{ fontSize: 20, color: d.color, marginBottom: 6 }}>{d.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 2 }}>{d.name}</div>
            <div style={{ fontSize: 11, opacity: .5, marginBottom: 10 }}>{d.group}</div>
            {d.skills.map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
                <span style={{ fontSize: 13, fontWeight: s.id === selectedSkillId ? 800 : 400 }}>{s.id} · {s.name}</span>
                {s.status === "live"
                  ? <button onClick={() => onSelectLive(s.id)} style={{ fontSize: 11, fontWeight: 800, color: "#fff",
                      background: s.id === selectedSkillId ? COLORS.amber : COLORS.moss, border: "none", borderRadius: 999,
                      padding: "4px 10px", cursor: "pointer" }}>
                      {s.id === selectedSkillId ? "TERPILIH · 100 aktivitas" : "MAIN · 100 aktivitas"}
                    </button>
                  : <Pill color={COLORS.line}>DIRENCANAKAN</Pill>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
