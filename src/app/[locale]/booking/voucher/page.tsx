"use client";

import { Suspense, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { EVoucher } from "@/components/booking/e-voucher";
import { canIssueVoucher } from "@/lib/booking/booking-mode";
import { getVoucherHoldReason } from "@/lib/booking/booking-rules";
import { getRemoteBookingByNumber } from "@/lib/booking/remote/bookings-remote";
import { isBookingRemoteEnabled } from "@/lib/booking/remote/config";
import {
  getBookingByNumber,
  useBookingStore,
  useBookingStoreHydrated,
} from "@/lib/booking/store";
import {
  OFFICIAL_WHATSAPP_LOCAL,
  OFFICIAL_WHATSAPP_QR_SRC,
  whatsappHref,
} from "@/lib/contact-links";
import type { Booking } from "@/lib/types";
import { assetPath } from "@/lib/utils";

function VoucherContent() {
  const t = useTranslations("Voucher");
  const searchParams = useSearchParams();
  const bookingNumber = searchParams.get("n") ?? "";
  const hydrated = useBookingStoreHydrated();
  const confirmedBookings = useBookingStore((s) => s.confirmedBookings);
  const localBooking = getBookingByNumber(bookingNumber, confirmedBookings);
  const [remoteBooking, setRemoteBooking] = useState<Booking | null>(null);
  const [remoteChecked, setRemoteChecked] = useState(!isBookingRemoteEnabled());

  useEffect(() => {
    if (!bookingNumber || !isBookingRemoteEnabled()) {
      setRemoteChecked(true);
      return;
    }
    let alive = true;
    setRemoteChecked(false);
    getRemoteBookingByNumber(bookingNumber).then((result) => {
      if (!alive) return;
      if (result.ok) setRemoteBooking(result.booking);
      setRemoteChecked(true);
    });
    return () => {
      alive = false;
    };
  }, [bookingNumber]);

  const booking = remoteBooking ?? localBooking;
  const holdReason = booking ? getVoucherHoldReason(booking) : null;
  const waHref = whatsappHref(OFFICIAL_WHATSAPP_LOCAL);
  const waMessage = booking
    ? encodeURIComponent(t("whatsappPrefill", { n: booking.bookingNumber }))
    : "";
  const waLink = `${waHref}?text=${waMessage}`;

  if (!hydrated || (bookingNumber && !remoteChecked && !localBooking)) {
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
        <div className="mt-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <ButtonLink href="/booking/status">{t("checkStatus")}</ButtonLink>
          <ButtonLink href="/booking" variant="outline">
            {t("makeNew")}
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (!canIssueVoucher(booking)) {
    const title =
      holdReason === "night-hours"
        ? t("nightHoldTitle")
        : holdReason === "short-notice"
          ? t("shortNoticeTitle")
          : t("awaitingStaffTitle");
    const body =
      holdReason === "night-hours"
        ? t("nightHoldBody")
        : holdReason === "short-notice"
          ? t("shortNoticeBody")
          : t("awaitingStaffBody");

    return (
      <div className="mx-auto max-w-lg space-y-4 px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{body}</p>
        <p className="rounded-lg border bg-muted/40 px-4 py-3 font-mono text-sm font-semibold">
          {booking.bookingNumber}
        </p>
        <p className="text-sm text-muted-foreground">{t("whatsappHint")}</p>
        <ButtonLink href={waLink} target="_blank" rel="noopener noreferrer">
          {t("whatsappCta")}
        </ButtonLink>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetPath(OFFICIAL_WHATSAPP_QR_SRC)}
          alt={`WhatsApp ${OFFICIAL_WHATSAPP_LOCAL}`}
          width={160}
          height={160}
          className="mx-auto size-40 rounded-xl border bg-white p-2 object-contain"
        />
        <p className="text-xs text-muted-foreground">{t("noReplyIncomplete")}</p>
        <ButtonLink href="/booking/status" variant="outline">
          {t("checkStatus")}
        </ButtonLink>
      </div>
    );
  }

  return <EVoucher booking={booking} />;
}

export default function VoucherPage() {
  const t = useTranslations("Voucher");
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24 text-center text-muted-foreground">
          {t("loading")}
        </div>
      }
    >
      <VoucherContent />
    </Suspense>
  );
}
