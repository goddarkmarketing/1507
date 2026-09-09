/** Remote booking cloud sync (Supabase). Optional — falls back to localStorage when unset. */

export function isBookingRemoteEnabled(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  );
}

export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
}

/** Shared with Supabase RPC / Edge Function — treat as ops password, not public. */
export function getBookingAdminSecret(): string {
  return (
    process.env.NEXT_PUBLIC_BOOKING_ADMIN_SECRET?.trim() ||
    process.env.BOOKING_ADMIN_SECRET?.trim() ||
    ""
  );
}

export function getAdminNotifyWebhook(): string {
  return process.env.NEXT_PUBLIC_ADMIN_NOTIFY_WEBHOOK?.trim() ?? "";
}

export function getPublicSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "https://www.krabilinkstaxi.com";
}

export function voucherUrl(bookingNumber: string, locale = "th"): string {
  const base = getPublicSiteUrl();
  const pathBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${pathBase}/${locale}/booking/voucher/?n=${encodeURIComponent(bookingNumber)}`;
}

export function statusUrl(locale = "th"): string {
  const base = getPublicSiteUrl();
  const pathBase = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${pathBase}/${locale}/booking/status/`;
}
