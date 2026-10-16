import { useState } from "react";
import { COLORS } from "../theme.js";
import { getBackendMode } from "../services/backendConfig.js";
import { AnalyticsService } from "../services/AnalyticsService.js";
import { Pill } from "./ui/Pill.jsx";
import { Btn } from "./ui/Btn.jsx";

/* Developer/admin-only panel — never shown to students */
export function DevSettingsPanel() {
  const [status, setStatus] = useState("");
  const mode = getBackendMode();

  async function handleExport() {
    const dump = await AnalyticsService.exportAll();
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fsfk-export-${Date.now()}.json`;
    a.click();
    setStatus(`${Object.values(dump.data).reduce((n, arr) => n + arr.length, 0)} data berhasil diekspor.`);
  }
  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const dump = JSON.parse(text);
      const result = await AnalyticsService.importAll(dump);
      setStatus(`Berhasil diimpor ke: ${result.importedCollections.join(", ")}.`);
    } catch (err) { setStatus(`Impor gagal: ${err.message}`); }
  }

  return (
    <div style={{ marginTop: 16, background: COLORS.panel, border: `1.5px dashed ${COLORS.line}`, borderRadius: 16, padding: 18 }}>
      <div style={{ fontSize: 11, fontWeight: 800, opacity: .5, textTransform: "uppercase", marginBottom: 10 }}>Status backend (khusus pengembang)</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <Pill color={mode === "supabase" ? COLORS.moss : COLORS.sky}>{mode === "supabase" ? "Mode Supabase" : "Mode lokal (belum ada backend dikonfigurasi)"}</Pill>
        <span style={{ fontSize: 12, opacity: .5 }}>
          {mode === "supabase" ? "Membaca/menulis melalui PostgREST." : "Data disimpan menggunakan penyimpanan bawaan aplikasi ini — atur SUPABASE_URL dan SUPABASE_ANON_KEY untuk beralih."}
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <Btn variant="ghost" onClick={handleExport}>Ekspor semua data (JSON)</Btn>
        <label style={{ display: "inline-block" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.mossDeep, border: `1.5px solid ${COLORS.line}`,
            borderRadius: 12, padding: "12px 22px", cursor: "pointer" }}>Impor JSON…</span>
          <input type="file" accept="application/json" onChange={handleImport} style={{ display: "none" }} />
        </label>
      </div>
      {status && <div style={{ marginTop: 10, fontSize: 12, opacity: .6 }}>{status}</div>}
    </div>
  );
}
