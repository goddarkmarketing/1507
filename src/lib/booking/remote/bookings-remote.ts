import type { AdminBooking } from "@/lib/admin/types";
import type { Booking } from "@/lib/types";
import {
  getBookingAdminSecret,
  isBookingRemoteEnabled,
} from "@/lib/booking/remote/config";
import {
  normalizePhoneDigits,
  rowToAdminBooking,
  sanitizeBookingForRemote,
  toAdminBooking,
  type RemoteBookingRow,
} from "@/lib/booking/remote/serialize";
import { getSupabase } from "@/lib/booking/remote/supabase";

export type LookupResult =
  | { ok: true; booking: AdminBooking }
  | { ok: false; error: "not_configured" | "not_found" | "network" | string };

export async function createRemoteBooking(
  booking: Booking,
  adminExtra?: Partial<AdminBooking>
): Promise<{ ok: true; booking: AdminBooking } | { ok: false; error: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "not_configured" };

  const clean = sanitizeBookingForRemote(booking);
  const adminBooking = toAdminBooking(clean, adminExtra);
  const now = new Date().toISOString();

  const { error } = await supabase.from("bookings").upsert(
    {
      id: adminBooking.id,
      booking_number: adminBooking.bookingNumber,
      phone_digits: normalizePhoneDigits(adminBooking.customerPhone),
      status: adminBooking.status,
      ops_status: adminBooking.opsStatus,
      payload: adminBooking,
      created_at: adminBooking.createdAt || now,
      updated_at: now,
    },
    { onConflict: "booking_number" }
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true, booking: adminBooking };
}

export async function lookupRemoteBooking(
  bookingNumber: string,
  phone: string
): Promise<LookupResult> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "not_configured" };

  const number = bookingNumber.trim().toUpperCase();
  const phoneDigits = normalizePhoneDigits(phone);
  if (!number || phoneDigits.length < 9) {
    return { ok: false, error: "not_found" };
  }

  const { data, error } = await supabase.rpc("lookup_booking", {
    p_number: number,
    p_phone: phoneDigits,
  });

  if (error) {
    // Fallback: direct select if RPC not deployed yet (dev only)
    const { data: row, error: selErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_number", number)
      .maybeSingle();
    if (selErr || !row) return { ok: false, error: "not_found" };
    const typed = row as RemoteBookingRow;
    if (typed.phone_digits !== phoneDigits) {
      return { ok: false, error: "not_found" };
    }
    return { ok: true, booking: rowToAdminBooking(typed) };
  }

  if (!data) return { ok: false, error: "not_found" };
  return { ok: true, booking: data as AdminBooking };
}

export async function getRemoteBookingByNumber(
  bookingNumber: string
): Promise<LookupResult> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "not_configured" };

  const number = bookingNumber.trim().toUpperCase();
  const secret = getBookingAdminSecret();

  if (secret) {
    const { data, error } = await supabase.rpc("get_booking_admin", {
      p_secret: secret,
      p_number: number,
    });
    if (!error && data) {
      return { ok: true, booking: data as AdminBooking };
    }
  }

  // Public voucher reopen by number only (weaker) — enabled when RLS allows
  const { data: row, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_number", number)
    .maybeSingle();

  if (error || !row) return { ok: false, error: "not_found" };
  return { ok: true, booking: rowToAdminBooking(row as RemoteBookingRow) };
}

export async function listRemoteBookings(): Promise<
  { ok: true; bookings: AdminBooking[] } | { ok: false; error: string }
> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "not_configured" };

  const secret = getBookingAdminSecret();
  if (!secret) return { ok: false, error: "missing_admin_secret" };

  const { data, error } = await supabase.rpc("list_bookings_admin", {
    p_secret: secret,
  });

  if (error) return { ok: false, error: error.message };
  const rows = (data ?? []) as AdminBooking[];
  return { ok: true, bookings: rows };
}

export async function patchRemoteBooking(
  booking: AdminBooking
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = getSupabase();
  if (!supabase) return { ok: false, error: "not_configured" };

  const secret = getBookingAdminSecret();
  if (!secret) return { ok: false, error: "missing_admin_secret" };

  const clean = sanitizeBookingForRemote(booking) as AdminBooking;
  const updated: AdminBooking = {
    ...clean,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabase.rpc("upsert_booking_admin", {
    p_secret: secret,
    p_payload: updated,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export { isBookingRemoteEnabled };
