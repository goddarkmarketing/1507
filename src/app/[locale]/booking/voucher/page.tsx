"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { EVoucher } from "@/components/booking/e-voucher";
import { canIssueVoucher } from "@/lib/booking/booking-mode";
import { getVoucherHoldReason } from "@/lib/booking/booking-rules";
import {
  getBookingByNumber,
  useBookingStore,
  useBookingStoreHydrated,
} from "@/lib/booking/store";
import { useSiteContact } from "@/lib/admin/settings-store";
import {
  OFFICIAL_WHATSAPP_LOCAL,
  OFFICIAL_WHATSAPP_QR_SRC,
  whatsappHref,
} from "@/lib/contact-links";
import { assetPath } from "@/lib/utils";

function VoucherContent() {
  const t = useTranslations("Voucher");
  const searchParams = useSearchParams();
  const bookingNumber = searchParams.get("n") ?? "";
  const hydrated = useBookingStoreHydrated();
  const confirmedBookings = useBookingStore((s) => s.confirmedBookings);
  const booking = getBookingByNumber(bookingNumber, confirmedBookings);
  const holdReason = booking ? getVoucherHoldReason(booking) : null;
  const waHref = whatsappHref(OFFICIAL_WHATSAPP_LOCAL);
  const waMessage = booking
    ? encodeURIComponent(
        t("whatsappPrefill", { n: booking.bookingNumber })
      )
    : "";
  const waLink = `${waHref}?text=${waMessage}`;

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
        <p className="text-xs text-muted-foreground">{t("noReplyIncomplete")}</p>
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="mx-auto block w-fit rounded-xl border bg-white p-3 shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath(OFFICIAL_WHATSAPP_QR_SRC)}
            alt={`WhatsApp ${OFFICIAL_WHATSAPP_LOCAL}`}
            width={180}
            height={180}
            className="size-[180px] object-contain"
          />
        </a>
        <p className="font-mono text-sm font-semibold">
          WhatsApp {OFFICIAL_WHATSAPP_LOCAL}
        </p>
        <div className="flex flex-col items-center gap-2 pt-2 sm:flex-row sm:justify-center">
          <ButtonLink href={waLink} target="_blank" rel="noreferrer">
            {t("whatsappCta")}
          </ButtonLink>
          <ButtonLink variant="outline" href="/">
            {t("backHome")}
          </ButtonLink>
        </div>
        <p className="text-sm text-muted-foreground">{t("awaitingStaffHint")}</p>
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
