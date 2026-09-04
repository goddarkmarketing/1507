import type { Booking } from "@/lib/types";

export type BookingService = "transfer" | "rental";

/** Customer payment plan at checkout */
export type PaymentPlan = "pay-driver" | "deposit" | "full";

/** @deprecated use getTieredDepositAmount() */
export const RENTAL_ADVANCE_DEPOSIT_THB = 500;

/**
 * Online deposit tiers (THB) based on booking total:
 * - total ≤ 1,000 → 200
 * - 1,000 < total < 3,000 → 500
 * - total ≥ 3,000 → 1,000
 * Never exceeds total.
 */
export function getTieredDepositAmount(totalPrice: number): number {
  const total = Math.max(0, totalPrice);
  let deposit: number;
  if (total <= 1000) deposit = 200;
  else if (total < 3000) deposit = 500;
  else deposit = 1000;
  return Math.min(deposit, total);
}

/** @deprecated prefer getTieredDepositAmount — kept for older call sites */
export function getRentalAdvanceDeposit(): number {
  return 500;
}

export function getBookingService(
  param: string | null | undefined
): BookingService {
  return param === "rental" ? "rental" : "transfer";
}

export function isCarRentalService(service: BookingService) {
  return service === "rental";
}

export function normalizePaymentPlan(
  plan: PaymentPlan | null | undefined,
  service: BookingService
): PaymentPlan {
  if (plan === "pay-driver" || plan === "deposit" || plan === "full") {
    return plan;
  }
  // Legacy bookings without a plan
  return isCarRentalService(service) ? "deposit" : "full";
}

export function getAmountDueNow(
  totalPrice: number,
  service: BookingService,
  plan?: PaymentPlan | null
): number {
  const resolved = normalizePaymentPlan(plan, service);
  if (resolved === "pay-driver") return 0;
  if (resolved === "full") return totalPrice;
  return getTieredDepositAmount(totalPrice);
}

export function getRemainingBalance(
  totalPrice: number,
  service: BookingService,
  plan?: PaymentPlan | null
): number {
  return Math.max(0, totalPrice - getAmountDueNow(totalPrice, service, plan));
}

export function getBookingAmountDue(booking: {
  totalPrice: number;
  amountDueNow?: number;
}): number {
  return booking.amountDueNow ?? booking.totalPrice;
}

/** Pay-to-driver bookings need staff confirmation before voucher is issued. */
export function canIssueVoucher(booking: Pick<Booking, "status" | "paymentPlan" | "payment">): boolean {
  const plan = booking.paymentPlan;
  const isPayDriver =
    plan === "pay-driver" ||
    (!plan && booking.payment?.method === "cash");
  if (!isPayDriver) return true;
  return booking.status === "confirmed";
}
