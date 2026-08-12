"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { EVoucher } from "@/components/booking/e-voucher";
import {
  getBookingByNumber,
  useBookingStore,
  useBookingStoreHydrated,
} from "@/lib/booking/store";

function VoucherContent() {
  const t = useTranslations("Voucher");
  const searchParams = useSearchParams();
  const bookingNumber = searchParams.get("n") ?? "";
  const hydrated = useBookingStoreHydrated();
  const confirmedBookings = useBookingStore((s) => s.confirmedBookings);
  const booking = getBookingByNumber(bookingNumber, confirmedBookings);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (!bookingNumber || !booking) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">{t("notFoundTitle")}</h1>
        <p className="mt-2 text-muted-foreground">{t("notFoundBody")}</p>
        <ButtonLink className="mt-6" href="/booking">
          {t("makeNew")}
        </ButtonLink>
      </div>
    );
  }

  return <EVoucher booking={booking} />;
}

function VoucherFallback() {
  const t = useTranslations("Voucher");
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center text-muted-foreground">
      {t("loading")}
    </div>
  );
}

export default function VoucherPage() {
  return (
    <Suspense fallback={<VoucherFallback />}>
      <VoucherContent />
    </Suspense>
  );
}
