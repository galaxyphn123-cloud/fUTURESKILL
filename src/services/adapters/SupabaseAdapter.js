import { getBackendConfig } from "../backendConfig.js";
import { uid, stamp } from "../../engine/ids.js";

/* Same interface, implemented over PostgREST. Inert unless
   SUPABASE_URL + SUPABASE_ANON_KEY are configured. Swapping this in
   for LocalKVAdapter is the entire migration; Services and UI are
   untouched. */
export const SupabaseAdapter = (() => {
  const cfg = getBackendConfig();
  const headers = () => ({
    apikey: cfg.SUPABASE_ANON_KEY, Authorization: `Bearer ${cfg.SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json", Prefer: "return=representation",
  });
  const url = (collection, qs = "") => `${cfg.SUPABASE_URL}/rest/v1/${collection}${qs}`;
  return {
    mode: "supabase",
    async put(collection, record) {
      const saved = stamp({ id: record.id || uid(collection), ...record });
      const res = await fetch(url(collection), { method: "POST", headers: headers(), body: JSON.stringify(saved) });
      const rows = await res.json();
      return rows[0] || saved;
    },
    async get(collection, id) {
      const res = await fetch(url(collection, `?id=eq.${id}`), { headers: headers() });
      const rows = await res.json();
      return rows[0] || null;
    },
    async list(collection, filterFn) {
      const res = await fetch(url(collection), { headers: headers() });
      const rows = await res.json();
      return filterFn ? rows.filter(filterFn) : rows;
    },
    async remove(collection, id) {
      await fetch(url(collection, `?id=eq.${id}`), { method: "DELETE", headers: headers() });
    },
  };
})();
