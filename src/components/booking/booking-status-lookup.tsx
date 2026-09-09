"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EVoucher } from "@/components/booking/e-voucher";
import { canIssueVoucher } from "@/lib/booking/booking-mode";
import { getVoucherHoldReason } from "@/lib/booking/booking-rules";
import {
  getRemoteBookingByNumber,
  lookupRemoteBooking,
  isBookingRemoteEnabled,
} from "@/lib/booking/remote/bookings-remote";
import {
  getBookingByNumber,
  useBookingStore,
} from "@/lib/booking/store";
import type { Booking } from "@/lib/types";
import { Link } from "@/i18n/navigation";

function StatusPanel({ booking }: { booking: Booking }) {
  const t = useTranslations("BookingStatus");
  const hold = getVoucherHoldReason(booking);
  const issued = canIssueVoucher(booking);

  const statusLabel = (() => {
    if (booking.status === "cancelled") return t("statusCancelled");
    if (hold === "pay-driver") return t("statusAwaitingStaff");
    if (hold === "night-hours") return t("statusNightHold");
    if (hold === "short-notice") return t("statusShortNotice");
    if (booking.payment?.status === "awaiting-transfer" && !issued) {
      return t("statusPaymentReview");
    }
    if (booking.payment?.status === "awaiting-transfer") {
      return t("statusPaymentPending");
    }
    if (booking.status === "confirmed") return t("statusConfirmed");
    return t("statusPending");
  })();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
          {t("resultTitle")}
        </p>
        <p className="mt-2 font-mono text-lg font-bold">{booking.bookingNumber}</p>
        <p className="mt-3 text-sm">
          <span className="text-muted-foreground">{t("customer")}: </span>
          <span className="font-medium">{booking.customerName}</span>
        </p>
        <p className="mt-1 text-sm">
          <span className="text-muted-foreground">{t("status")}: </span>
          <span className="font-semibold text-amber-800">{statusLabel}</span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ButtonLink href={`/booking/voucher/?n=${booking.bookingNumber}`}>
            {t("openVoucher")}
          </ButtonLink>
          <ButtonLink href="/booking" variant="outline">
            {t("newBooking")}
          </ButtonLink>
        </div>
      </div>

      {issued ? (
        <EVoucher booking={booking} />
      ) : (
        <p className="text-center text-sm text-muted-foreground">{t("holdHint")}</p>
      )}
    </div>
  );
}

export function BookingStatusLookup() {
  const t = useTranslations("BookingStatus");
  const locale = useLocale();
  const localBookings = useBookingStore((s) => s.confirmedBookings);
  const [bookingNumber, setBookingNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const remoteOn = isBookingRemoteEnabled();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setBooking(null);

    const number = bookingNumber.trim().toUpperCase();
    const local = getBookingByNumber(number, localBookings);

    try {
      if (remoteOn) {
        const remote = await lookupRemoteBooking(number, phone);
        if (remote.ok) {
          setBooking(remote.booking);
          return;
        }
        // Fallback: number-only cloud fetch (weaker) if phone RPC fails
        if (phone.trim().length < 9) {
          toast.error(t("toastPhone"));
          return;
        }
        toast.error(t("toastNotFound"));
        return;
      }

      if (local) {
        setBooking(local);
        return;
      }

      // Try cloud by number even if "not configured" path already handled
      const byNumber = await getRemoteBookingByNumber(number);
      if (byNumber.ok) {
        setBooking(byNumber.booking);
        return;
      }

      toast.error(
        remoteOn ? t("toastNotFound") : t("toastLocalOnly")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">{t("subtitle")}</p>
        {!remoteOn && (
          <p className="text-xs text-amber-800">{t("localModeHint")}</p>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-md space-y-4 rounded-2xl border bg-card p-5 sm:p-6"
      >
        <div className="space-y-1.5">
          <Label htmlFor="booking-number">{t("bookingNumber")}</Label>
          <Input
            id="booking-number"
            value={bookingNumber}
            onChange={(e) => setBookingNumber(e.target.value)}
            placeholder="KLT2609070000"
            className="font-mono uppercase"
            autoComplete="off"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="booking-phone">{t("phone")}</Label>
          <Input
            id="booking-phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder={t("phonePlaceholder")}
            required={remoteOn}
          />
          <p className="text-[11px] text-muted-foreground">{t("phoneHint")}</p>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          <Search className="size-4" />
          {loading ? t("searching") : t("search")}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          <Link href="/booking" className="underline-offset-2 hover:underline">
            {t("newBooking")}
          </Link>
          {" · "}
          <span>{locale.toUpperCase()}</span>
        </p>
      </form>

      {booking ? <StatusPanel booking={booking} /> : null}
    </div>
  );
}
