import { getBackendMode } from "../backendConfig.js";
import { LocalKVAdapter } from "./LocalKVAdapter.js";
import { SupabaseAdapter } from "./SupabaseAdapter.js";

export function getAdapter() { return getBackendMode() === "supabase" ? SupabaseAdapter : LocalKVAdapter; }
