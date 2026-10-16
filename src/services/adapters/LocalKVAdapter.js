import { uid, stamp } from "../../engine/ids.js";

/* Standalone, no-backend-required adapter, backed by the browser's
   real window.localStorage — the original artifact build ran on a
   sandbox-only window.storage API that doesn't exist outside Claude
   artifacts, so this was rewritten to a real persistence primitive
   for the app to work as a normal web page. Local mode is inherently
   single-browser: "shared" (cross-device) visibility, like a class's
   join code, requires configuring SupabaseAdapter instead. */
const PREFIX = "fsfk";
const key = (collection, id) => `${PREFIX}:${collection}:${id}`;
const collectionPrefix = (collection) => `${PREFIX}:${collection}:`;

export const LocalKVAdapter = {
  mode: "local",
  async put(collection, record) {
    const saved = stamp({ id: record.id || uid(collection), ...record });
    localStorage.setItem(key(collection, saved.id), JSON.stringify(saved));
    return saved;
  },
  async get(collection, id) {
    const raw = localStorage.getItem(key(collection, id));
    return raw ? JSON.parse(raw) : null;
  },
  async list(collection, filterFn) {
    const prefix = collectionPrefix(collection);
    const out = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) {
        try { out.push(JSON.parse(localStorage.getItem(k))); } catch {}
      }
    }
    return filterFn ? out.filter(filterFn) : out;
  },
  async remove(collection, id) {
    localStorage.removeItem(key(collection, id));
  },
};
