/** Booking / voucher rules for Krabi Links Taxi (Asia/Bangkok). */

export const BANGKOK_OFFSET = "+07:00";
export const NIGHT_WINDOW_END_HOUR = 8; // [00:00, 08:00)
export const ADVANCE_BOOKING_HOURS = 24;
export const NIGHT_DRIVER_SURCHARGE_THB = 200;

export type PickupLegLike = { date: string; time: string };

/** Pickup datetime in Asia/Bangkok (no DST). */
export function legPickupInstant(date: string, time: string): Date | null {
  if (!date || !time) return null;
  const normalized = time.length === 5 ? `${time}:00` : time;
  const d = new Date(`${date}T${normalized}${BANGKOK_OFFSET}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function getBangkokHour(now: Date = new Date()): number {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(now).find((p) => p.type === "hour")?.value;
  const n = Number(hour);
  return Number.isFinite(n) ? n % 24 : 0;
}

/** Current clock is between midnight and 08:00 Bangkok. */
export function isNightClockWindow(now: Date = new Date()): boolean {
  return getBangkokHour(now) < NIGHT_WINDOW_END_HOUR;
}

/** Pickup time-of-day is in the night window (00:00–07:59). */
export function isNightPickupTime(time: string): boolean {
  const hour = Number((time || "").split(":")[0]);
  return Number.isFinite(hour) && hour >= 0 && hour < NIGHT_WINDOW_END_HOUR;
}

/** One ฿200 surcharge per order if any leg is a night pickup. */
export function getNightDriverSurcharge(legs: PickupLegLike[]): number {
  return legs.some((leg) => isNightPickupTime(leg.time))
    ? NIGHT_DRIVER_SURCHARGE_THB
    : 0;
}

export function earliestPickupInstant(
  legs: PickupLegLike[]
): Date | null {
  let earliest: Date | null = null;
  for (const leg of legs) {
    const at = legPickupInstant(leg.date, leg.time);
    if (!at) continue;
    if (!earliest || at.getTime() < earliest.getTime()) earliest = at;
  }
  return earliest;
}

/** Pickup must be at least 24 hours from now. */
export function hasAdvanceBooking(
  legs: PickupLegLike[],
  now: Date = new Date()
): boolean {
  const earliest = earliestPickupInstant(legs);
  if (!earliest) return false;
  return (
    earliest.getTime() - now.getTime() >=
    ADVANCE_BOOKING_HOURS * 60 * 60 * 1000
  );
}

export function minPickupInstant(now: Date = new Date()): Date {
  return new Date(
    now.getTime() + ADVANCE_BOOKING_HOURS * 60 * 60 * 1000
  );
}

/** YYYY-MM-DD in Asia/Bangkok for <input type="date" min>. */
export function toBangkokDateInput(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export type VoucherHoldReason =
  | "pay-driver"
  | "night-hours"
  | "short-notice"
  | null;

/**
 * Why voucher is held. Staff confirmation (status === "confirmed") unlocks
 * pay-driver, night-hours, and short-notice cases.
 */
export function getVoucherHoldReason(
  booking: {
    status: string;
    paymentPlan?: string | null;
    payment?: { method?: string } | null;
    legs: PickupLegLike[];
  },
  now: Date = new Date()
): VoucherHoldReason {
  if (booking.status === "confirmed") return null;

  const isPayDriver =
    booking.paymentPlan === "pay-driver" ||
    (!booking.paymentPlan && booking.payment?.method === "cash");
  if (isPayDriver) return "pay-driver";

  if (isNightClockWindow(now)) return "night-hours";

  if (!hasAdvanceBooking(booking.legs, now)) return "short-notice";

  return null;
}
