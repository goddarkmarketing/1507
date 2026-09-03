import { getActiveRentalDeposits } from "@/lib/admin/settings-store";

export type BookingService = "transfer" | "rental";

/** @deprecated use getRentalAdvanceDeposit() */
export const RENTAL_ADVANCE_DEPOSIT_THB = 500;

export function getRentalAdvanceDeposit(): number {
  return getActiveRentalDeposits().advanceDeposit;
}

export function getBookingService(
  param: string | null | undefined
): BookingService {
  return param === "rental" ? "rental" : "transfer";
}

export function isCarRentalService(service: BookingService) {
  return service === "rental";
}

export function getAmountDueNow(
  totalPrice: number,
  service: BookingService
): number {
  if (!isCarRentalService(service)) return totalPrice;
  return Math.min(getRentalAdvanceDeposit(), totalPrice);
}

export function getRemainingBalance(
  totalPrice: number,
  service: BookingService
): number {
  return Math.max(0, totalPrice - getAmountDueNow(totalPrice, service));
}

export function getBookingAmountDue(booking: {
  totalPrice: number;
  amountDueNow?: number;
}): number {
  return booking.amountDueNow ?? booking.totalPrice;
}
