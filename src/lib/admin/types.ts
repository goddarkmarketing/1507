import type { Booking, BookingPayment, VehicleCode } from "@/lib/types";

export type OpsStatus =
  | "new"
  | "payment_review"
  | "awaiting_contract"
  | "balance_due"
  | "deposit_refund_pending"
  | "assigned"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Driver {
  id: string;
  name: string;
  phone: string;
  lineId?: string;
  plate?: string;
  vehicleCodes: VehicleCode[];
  active: boolean;
  note?: string;
}

export interface AdminBooking extends Booking {
  opsStatus: OpsStatus;
  driverId?: string | null;
  adminNotes?: string;
  updatedAt: string;
}

export type AdminBookingPatch = Partial<
  Pick<
    AdminBooking,
    "opsStatus" | "driverId" | "adminNotes" | "status" | "payment"
  >
>;

export function deriveOpsStatus(booking: Booking): OpsStatus {
  if (booking.status === "cancelled") return "cancelled";
  if (booking.status === "pending") return "payment_review";

  if (
    booking.paymentPlan === "pay-driver" ||
    booking.payment?.method === "cash"
  ) {
    return "new";
  }

  if (booking.payment?.status === "awaiting-transfer") return "payment_review";

  if (
    booking.service === "rental" &&
    booking.payment?.status === "paid" &&
    (booking.balanceDue ?? 0) > 0
  ) {
    return "awaiting_contract";
  }

  if (
    booking.paymentPlan === "deposit" &&
    booking.payment?.status === "paid" &&
    (booking.balanceDue ?? 0) > 0
  ) {
    return "balance_due";
  }

  if (booking.status === "confirmed") return "new";
  return "new";
}

export function withAdminFields(
  booking: Booking,
  patch?: Partial<AdminBooking>
): AdminBooking {
  return {
    ...booking,
    opsStatus: patch?.opsStatus ?? deriveOpsStatus(booking),
    driverId: patch?.driverId ?? null,
    adminNotes: patch?.adminNotes ?? "",
    updatedAt: patch?.updatedAt ?? booking.createdAt,
    payment: patch?.payment ?? booking.payment,
    status: patch?.status ?? booking.status,
  };
}

export function markPayment(
  payment: BookingPayment | undefined,
  status: BookingPayment["status"]
): BookingPayment | undefined {
  if (!payment) return payment;
  return {
    ...payment,
    status,
    paidAt:
      status === "paid" ? payment.paidAt ?? new Date().toISOString() : payment.paidAt,
    summary:
      status === "paid"
        ? payment.summary.replace(/\(pending verification\)/gi, "(verified)")
        : payment.summary,
  };
}
