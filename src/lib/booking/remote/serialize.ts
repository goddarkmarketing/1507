import type { AdminBooking } from "@/lib/admin/types";
import { deriveOpsStatus, withAdminFields } from "@/lib/admin/types";
import type { Booking } from "@/lib/types";

/** Digits only for phone matching (supports 0… and +66…). */
export function normalizePhoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("66") && digits.length >= 11) {
    return `0${digits.slice(2)}`;
  }
  return digits;
}

/** Strip huge slip payloads before cloud sync (keep metadata). */
export function sanitizeBookingForRemote(booking: Booking): Booking {
  const payment = booking.payment;
  if (!payment?.transferProof?.dataUrl) return booking;
  const dataUrl = payment.transferProof.dataUrl;
  if (dataUrl.length <= 120_000) return booking;
  return {
    ...booking,
    payment: {
      ...payment,
      transferProof: {
        ...payment.transferProof,
        dataUrl: "",
        fileName: `${payment.transferProof.fileName} (stored on device only)`,
      },
    },
  };
}

export function toAdminBooking(
  booking: Booking,
  extra?: Partial<AdminBooking>
): AdminBooking {
  return withAdminFields(booking, {
    opsStatus: extra?.opsStatus ?? deriveOpsStatus(booking),
    driverId: extra?.driverId ?? null,
    adminNotes: extra?.adminNotes ?? "",
    updatedAt: extra?.updatedAt ?? new Date().toISOString(),
  });
}

export type RemoteBookingRow = {
  id: string;
  booking_number: string;
  phone_digits: string;
  status: string;
  ops_status: string;
  payload: AdminBooking;
  created_at: string;
  updated_at: string;
};

export function rowToAdminBooking(row: RemoteBookingRow): AdminBooking {
  const payload = row.payload;
  return {
    ...payload,
    id: row.id || payload.id,
    bookingNumber: row.booking_number || payload.bookingNumber,
    status: (row.status as Booking["status"]) || payload.status,
    opsStatus: (row.ops_status as AdminBooking["opsStatus"]) || payload.opsStatus,
    updatedAt: row.updated_at || payload.updatedAt,
  };
}
