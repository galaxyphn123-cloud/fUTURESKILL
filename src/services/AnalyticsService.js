import { getAdapter } from "./adapters/index.js";
import { getBackendMode } from "./backendConfig.js";
import { nowISO } from "../engine/ids.js";
import { MasteryService } from "./MasteryService.js";

export const AnalyticsService = {
  async publishSummary(student, skillId, progress, activities) {
    const adapter = getAdapter();
    await adapter.put("class_summaries", {
      id: `${skillId}__${student.id}`, name: student.name, xp: student.xp, streak: student.streak,
      accuracy: MasteryService.accuracy(progress), unlockedPhase: MasteryService.highestUnlockedPhase(progress, activities),
      skill_id: skillId, __shared: true,
    });
  },
  async classSummary(skillId) {
    const rows = await getAdapter().list("class_summaries", r => r.skill_id === skillId, true);
    return rows.sort((a, b) => b.xp - a.xp);
  },
  /* migration-ready export/import */
  async exportAll() {
    const adapter = getAdapter();
    const collections = ["students", "sessions", "answers", "progress", "class_summaries"];
    const dump = { exported_at: nowISO(), mode: getBackendMode(), data: {} };
    for (const c of collections) dump.data[c] = await adapter.list(c);
    return dump;
  },
  async importAll(dump) {
    // LOCAL DATA → VALIDATE → MAP IDs → UPLOAD → VERIFY → SYNC
    if (!dump || !dump.data) throw new Error("Invalid export file");
    const adapter = getAdapter();
    const idMap = {};
    for (const [collection, records] of Object.entries(dump.data)) {
      for (const rec of records) {
        const oldId = rec.id;
        const saved = await adapter.put(collection, { ...rec, id: undefined }); // new stable id minted on import
        if (oldId) idMap[oldId] = saved.id;
      }
    }
    return { importedCollections: Object.keys(dump.data), idMap };
  },
};
