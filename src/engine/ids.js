/* stable IDs & timestamps (never array indexes) */
export function uid(prefix) {
  const rnd = () => Math.random().toString(16).slice(2, 6);
  return `${prefix}_${Date.now().toString(36)}${rnd()}${rnd()}`;
}

export function nowISO() { return new Date().toISOString(); }

export function stamp(record) {
  const t = nowISO();
  return { created_at: record.created_at || t, updated_at: t, ...record };
}
