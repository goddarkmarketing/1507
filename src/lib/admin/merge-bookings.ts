import type { Booking } from "@/lib/types";
import { withAdminFields, type AdminBooking } from "@/lib/admin/types";

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
      byId.set(raw.id, {
        ...prev,
        ...raw,
        payment: adminPaid ? prev.payment : raw.payment ?? prev.payment,
        status: adminPaid ? prev.status : raw.status ?? prev.status,
        amountDueNow: raw.amountDueNow ?? prev.amountDueNow,
        balanceDue: raw.balanceDue ?? prev.balanceDue,
        service: raw.service ?? prev.service,
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
