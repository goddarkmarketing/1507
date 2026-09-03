import { getBookingAmountDue } from "@/lib/booking/booking-mode";
import type { Booking } from "@/lib/types";

/** Amount collected from the customer (deposit or full fare). */
export function bookingCollectedAmount(booking: Booking): number {
  if (booking.status === "cancelled") return 0;
  if (booking.payment?.status !== "paid") return 0;
  return getBookingAmountDue(booking);
}

export function bookingDisplayAmount(booking: Booking): number {
  return getBookingAmountDue(booking);
}
