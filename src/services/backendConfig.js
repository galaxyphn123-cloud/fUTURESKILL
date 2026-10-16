/* Config is read from window.__FSFK_CONFIG__ if the host page sets it.
   Credentials are never hardcoded here. Absent config => local mode. */
export function getBackendConfig() {
  const cfg = (typeof window !== "undefined" && window.__FSFK_CONFIG__) || {};
  return { SUPABASE_URL: cfg.SUPABASE_URL || null, SUPABASE_ANON_KEY: cfg.SUPABASE_ANON_KEY || null };
}

export function getBackendMode() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = getBackendConfig();
  return (SUPABASE_URL && SUPABASE_ANON_KEY) ? "supabase" : "local";
}
