import type { Booking, BookingPayment } from "@/lib/types";
import { withAdminFields, type AdminBooking } from "@/lib/admin/types";
import { preferProofWithData } from "@/lib/booking/slim-storage";

function mergePayment(
  prev: BookingPayment | undefined,
  incoming: BookingPayment | undefined,
  keepAdminPayment: boolean
): BookingPayment | undefined {
  const base = keepAdminPayment ? prev : incoming ?? prev;
  if (!base) return base;
  const proof = preferProofWithData(
    incoming?.transferProof,
    prev?.transferProof
  );
  if (!proof || proof === base.transferProof) return base;
  return { ...base, transferProof: proof };
}

/** Merge customer website bookings into the admin list without losing admin fields. */
export function mergeBookings(
  existing: AdminBooking[],
  incoming: Booking[]
): AdminBooking[] {
  const byId = new Map(existing.map((b) => [b.id, b]));
  for (const raw of incoming) {
    const prev = byId.get(raw.id);
    if (prev) {
      const adminPaid = prev.payment?.status === "paid";
      const staffLocked =
        adminPaid ||
        prev.status === "confirmed" ||
        prev.status === "cancelled";
      byId.set(raw.id, {
        ...prev,
        ...raw,
        payment: mergePayment(prev.payment, raw.payment, adminPaid),
        status: staffLocked ? prev.status : raw.status ?? prev.status,
        amountDueNow: raw.amountDueNow ?? prev.amountDueNow,
        serviceCharge: raw.serviceCharge ?? prev.serviceCharge,
        balanceDue: raw.balanceDue ?? prev.balanceDue,
        service: raw.service ?? prev.service,
        paymentPlan: raw.paymentPlan ?? prev.paymentPlan,
        rentalPackageId: raw.rentalPackageId ?? prev.rentalPackageId,
        rentalDays: raw.rentalDays ?? prev.rentalDays,
        opsStatus: prev.opsStatus,
        driverId: prev.driverId,
        adminNotes: prev.adminNotes,
        updatedAt: prev.updatedAt,
      });
    } else {
      byId.set(raw.id, withAdminFields(raw));
    }
  }
  return Array.from(byId.values()).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}
