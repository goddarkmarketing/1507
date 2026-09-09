import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
  isBookingRemoteEnabled,
} from "@/lib/booking/remote/config";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isBookingRemoteEnabled()) return null;
  if (client) return client;
  client = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
