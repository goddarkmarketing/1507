"use client";

import { useParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { EVoucher } from "@/components/booking/e-voucher";
import {
  getBookingByNumber,
  useBookingStore,
  useBookingStoreHydrated,
} from "@/lib/booking/store";

export default function VoucherPage() {
  const params = useParams();
  const bookingNumber = params.bookingNumber as string;
  const hydrated = useBookingStoreHydrated();
  const confirmedBookings = useBookingStore((s) => s.confirmedBookings);
  const booking = getBookingByNumber(bookingNumber, confirmedBookings);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-muted-foreground">
        Loading voucher...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Voucher Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          This booking may have expired or was not found in your browser storage.
        </p>
        <ButtonLink className="mt-6" href="/booking">
          Make a New Booking
        </ButtonLink>
      </div>
    );
  }

  return <EVoucher booking={booking} />;
}
