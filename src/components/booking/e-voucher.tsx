"use client";

import { useTranslations, useLocale } from "next-intl";
import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { getLocation } from "@/lib/data/locations";
import { SET1_PLACE_NAMES } from "@/lib/data/set1-place-names";
import { vehicles } from "@/lib/data/vehicles";
import { useLocationName, useVehicleCopy } from "@/lib/i18n-labels";
import { useSiteContact } from "@/lib/admin/settings-store";
import { getBookingAmountDue } from "@/lib/booking/booking-mode";
import { getDateLocale } from "@/i18n/locales";
import type { Booking, BookingLeg } from "@/lib/types";
import { assetPath, cn } from "@/lib/utils";

interface EVoucherProps {
  booking: Booking;
}

function formatVoucherDate(isoDate: string, locale: string) {
  if (!isoDate) return "—";
  const d = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(getDateLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatVoucherTime(time: string) {
  if (!time) return "—";
  const [h, m] = time.split(":");
  if (!h || !m) return time;
  return `${h} : ${m}`;
}

function Cell({
  label,
  value,
  className,
  wide,
}: {
  label: string;
  value?: string | number | null;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "voucher-cell flex flex-1 items-center gap-1.5 border border-[#e7d7a8] px-1.5 py-1 text-[10px] leading-snug sm:text-[11px]",
        wide && "col-span-2",
        className
      )}
    >
      <span className="shrink-0 font-medium text-[#6b5424]">{label} :</span>
      <span className="min-w-0 flex-1 break-words font-semibold text-neutral-900 [overflow-wrap:anywhere]">
        {value === undefined || value === null || value === "" ? "—" : value}
      </span>
    </div>
  );
}

function SectionBar({ children }: { children: ReactNode }) {
  return (
    <div className="voucher-section-bar shrink-0 bg-gradient-to-r from-[#f6e2a8] via-[#e6c36a] to-[#d4ae45] px-2 py-1 text-[10px] font-bold tracking-wide text-[#3d3214] sm:text-[11px]">
      {children}
    </div>
  );
}

const BOARD_INK = "#1c2740";
const BOARD_GOLD = "#c4a35a";

function welcomePlaceLabel(id: string | undefined, fallback: string) {
  if (!id) return fallback;
  return SET1_PLACE_NAMES[id]?.en ?? fallback;
}

function WelcomeBoard({
  booking,
  leg,
  vehicleLabel,
}: {
  booking: Booking;
  leg: BookingLeg;
  vehicleLabel: string;
}) {
  const from = getLocation(leg.fromId);
  const to = getLocation(leg.toId);
  const fromLabel = welcomePlaceLabel(leg.fromId, from?.name ?? "");
  const toLabel = welcomePlaceLabel(leg.toId, to?.name ?? "");
  const route = [fromLabel, toLabel].filter(Boolean).join(" to ");
  const placeLine =
    leg.hotelName?.trim() ||
    (to?.type === "hotel" && to.name && to.name !== toLabel ? to.name : null);

  return (
    <section className="voucher-page voucher-board relative mx-auto box-border aspect-[1024/724] w-full max-w-[297mm] overflow-hidden bg-white print:border-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assetPath("/voucher/welcome-sign.jpg")}
        alt=""
        className="absolute inset-0 h-full w-full object-fill"
      />
      <div className="absolute inset-x-[10%] top-[54%] flex flex-col items-center gap-1.5 px-3 text-center sm:gap-2">
        {route ? (
          <p className="voucher-board-meta max-w-full text-sm leading-snug font-bold text-balance sm:text-xl">
            <span style={{ color: BOARD_INK }}>{route}</span>
          </p>
        ) : null}
        {placeLine ? (
          <p
            className="voucher-board-meta max-w-full text-xs leading-snug font-semibold sm:text-base"
            style={{ color: BOARD_INK }}
          >
            {placeLine}
          </p>
        ) : null}
        <p
          className="voucher-board-meta text-base leading-snug font-bold sm:text-2xl"
          style={{ color: BOARD_INK }}
        >
          {leg.date} · {leg.time}
        </p>
        <p
          className="voucher-board-meta text-sm leading-snug font-bold sm:text-xl"
          style={{ color: BOARD_INK }}
        >
          {vehicleLabel}
        </p>
        <p
          className="voucher-board-title max-w-full text-3xl leading-tight font-bold break-words sm:text-5xl"
          style={{ color: BOARD_INK }}
        >
          {booking.customerName}
        </p>
        <div className="mt-0.5 flex items-center gap-2 sm:gap-3">
          <span className="h-px w-10 sm:w-16" style={{ backgroundColor: BOARD_GOLD }} />
          <span
            className="size-1.5 shrink-0 rotate-45"
            style={{ backgroundColor: BOARD_GOLD }}
          />
          <span className="h-px w-10 sm:w-16" style={{ backgroundColor: BOARD_GOLD }} />
        </div>
        <p
          className="mt-1.5 text-[11px] font-bold tracking-[0.14em] sm:text-sm"
          style={{ color: BOARD_INK }}
        >
          By KRABILINKSTAXI
        </p>
      </div>
    </section>
  );
}

export function EVoucher({ booking }: EVoucherProps) {
  const t = useTranslations("Voucher");
  const tBooking = useTranslations("Booking");
  const locale = useLocale();
  const locName = useLocationName();
  const { name: vehicleName } = useVehicleCopy();
  const site = useSiteContact();
  const amountDue = getBookingAmountDue(booking);
  const outbound = booking.legs[0];
  const returnLeg =
    booking.type === "round-trip" && booking.legs.length > 1
      ? booking.legs[1]
      : booking.legs.length > 1
        ? booking.legs[1]
        : undefined;
  const outFrom = outbound ? getLocation(outbound.fromId) : undefined;
  const outTo = outbound ? getLocation(outbound.toId) : undefined;
  const outVehicle = outbound
    ? vehicles.find((v) => v.code === outbound.vehicleCode)
    : undefined;
  const retFrom = returnLeg ? getLocation(returnLeg.fromId) : undefined;
  const retTo = returnLeg ? getLocation(returnLeg.toId) : undefined;
  const vehicleLabel = outVehicle
    ? `${outVehicle.code} — ${vehicleName(outVehicle.code)}`
    : "—";
  const typeLabel = tBooking(
    `types.${booking.type}.label` as "types.one-way.label"
  );
  const paid = booking.payment?.status === "paid";
  const paymentStatusLabel =
    booking.payment?.method === "cash" || booking.paymentPlan === "pay-driver"
      ? t("statusCash")
      : booking.payment?.status === "paid"
        ? t("statusPaid")
        : t("statusAwaiting");

  return (
    <div className="voucher-sheet mx-auto w-full max-w-[297mm] space-y-8 overflow-x-auto px-3 py-6 sm:px-0 sm:py-8 print:max-w-none print:space-y-0 print:overflow-visible print:px-0 print:py-0">
      <div className="voucher-print-actions flex flex-col gap-2 sm:flex-row sm:justify-center print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="size-4" />
          {t("print")}
        </Button>
        <ButtonLink href="/booking">{t("newBooking")}</ButtonLink>
      </div>

      {booking.priceStatus === "pending" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 print:hidden">
          <p className="font-semibold">{t("quoteBannerTitle")}</p>
          <p className="mt-1 leading-relaxed">{t("quoteBannerBody")}</p>
        </div>
      )}

      {/* Page 1 — Transfer Voucher sized to A4 and stretched to fill */}
      <section className="voucher-page voucher-form mx-auto box-border flex w-full max-w-[210mm] flex-col border-2 border-[#d4b56a] bg-white text-neutral-900 aspect-auto print:max-w-none print:aspect-auto print:border-[#d4b56a] md:aspect-[210/297]">
        <header className="voucher-form-header shrink-0 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/voucher/voucher-letterhead.jpg")}
            alt="Krabi Links Taxi"
            className="block h-auto w-full"
          />
          <p className="border-b border-[#e7d7a8] px-2 py-1 text-right text-[11px] font-semibold text-[#6b5424]">
            {t("orderNo")} :{" "}
            <span className="font-mono text-neutral-950">{booking.bookingNumber}</span>
          </p>
        </header>

        <SectionBar>{t("clientDetails")}</SectionBar>
        <div className="voucher-client flex shrink-0 flex-col">
          <Cell label={t("clientName")} value={booking.customerName} />
          <Cell label={t("passengerName")} value={booking.customerName} />
          <Cell label={t("clientPhone")} value={booking.customerPhone} />
          <Cell label={t("email")} value={booking.customerEmail} />
        </div>

        <div className="voucher-block grid min-h-0 flex-1 grid-cols-2">
          <div className="voucher-col flex min-h-0 flex-col">
            <SectionBar>{t("arrivalDetails")}</SectionBar>
            <Cell label={t("start")} value={locName(outFrom)} />
            <Cell label={t("destination")} value={locName(outTo)} />
            <Cell label={t("from")} value={outFrom ? locName(outFrom) : "—"} />
            <Cell label={t("to")} value={outTo ? locName(outTo) : "—"} />
            <Cell
              label={t("arrivalDate")}
              value={outbound ? formatVoucherDate(outbound.date, locale) : "—"}
            />
            <Cell
              label={t("timeOfPickup")}
              value={outbound ? formatVoucherTime(outbound.time) : "—"}
            />
            <Cell label={t("flightNo")} value={booking.flightNumber} />
            <Cell label={t("transferTime")} value="—" />
          </div>
          <div className="voucher-col flex min-h-0 flex-col">
            <SectionBar>{t("returnTripDetails")}</SectionBar>
            <Cell
              label={t("returnDate")}
              value={
                returnLeg ? formatVoucherDate(returnLeg.date, locale) : "—"
              }
            />
            <Cell
              label={t("pickupTime")}
              value={returnLeg ? formatVoucherTime(returnLeg.time) : "—"}
            />
            <Cell label={t("rtFlightNo")} value="—" />
            <Cell
              label={t("rtLocation")}
              value={
                returnLeg ? `${locName(retFrom)} → ${locName(retTo)}` : "—"
              }
            />
            <SectionBar>{t("specialRequirements")}</SectionBar>
            <Cell label={t("babySeatNo")} value={0} />
            <Cell label={t("otherServices")} value={booking.notes || "—"} />
            <Cell label={t("touringTime")} value="—" />
          </div>
        </div>

        <div className="voucher-block grid min-h-0 flex-1 grid-cols-2">
          <div className="voucher-col flex min-h-0 flex-col">
            <SectionBar>{t("reservationDetails")}</SectionBar>
            <Cell label={t("typeOfCar")} value={`1 ${vehicleLabel}`} />
            <Cell label={t("bookingType")} value={typeLabel} />
            <Cell
              label={t("transferPrice")}
              value={
                booking.priceStatus === "pending"
                  ? t("quoteBannerTitle")
                  : `${Math.max(0, booking.totalPrice - (booking.serviceCharge ?? 0)).toLocaleString()} THB`
              }
            />
            <Cell
              label={t("otherServicesPrice")}
              value={
                booking.serviceCharge
                  ? `${booking.serviceCharge.toLocaleString()} THB`
                  : "0 THB"
              }
            />
            <Cell
              label={t("totalCost")}
              value={
                booking.priceStatus === "pending"
                  ? t("quoteBannerTitle")
                  : `${booking.totalPrice.toLocaleString()} THB`
              }
            />
            <Cell
              label={t("amountDue")}
              value={`${amountDue.toLocaleString()} THB`}
            />
            <p className="voucher-note shrink-0 border border-[#e7d7a8] bg-[#fbf6e8] px-1.5 py-1 text-[9px] leading-snug text-neutral-700">
              {paid ? t("receiptPaidNote") : t("receiptUnpaidNote")}
            </p>
          </div>
          <div className="voucher-col flex min-h-0 flex-col">
            <SectionBar>{t("clientConfirmation")}</SectionBar>
            <Cell
              label={t("amount")}
              value={`${amountDue.toLocaleString()} THB`}
            />
            <Cell label={t("paymentStatus")} value={paymentStatusLabel} />
            {booking.payment?.summary ? (
              <Cell label={t("method")} value={booking.payment.summary} />
            ) : null}
            {booking.balanceDue != null && booking.balanceDue > 0 ? (
              <Cell
                label={t("balanceLabel")}
                value={`${booking.balanceDue.toLocaleString()} THB`}
              />
            ) : null}
            <div className="voucher-sign flex flex-1 flex-col justify-end border border-[#e7d7a8] px-1.5 py-1">
              <p className="flex max-w-full items-end gap-1 overflow-hidden border-b border-neutral-800 pb-0.5 font-mono text-[10px]">
                <span>X</span>
                <span className="mb-0.5 h-px min-w-0 flex-1 border-b border-dotted border-neutral-800" />
              </p>
              <p className="mt-0.5 text-[9px] text-neutral-600">
                {t("clientSignature")}
              </p>
            </div>
            <div className="voucher-sign flex flex-1 flex-col justify-end border border-[#e7d7a8] px-1.5 py-1">
              <p className="flex max-w-full items-end gap-1 overflow-hidden border-b border-neutral-800 pb-0.5 font-mono text-[10px]">
                <span>X</span>
                <span className="mb-0.5 h-px min-w-0 flex-1 border-b border-dotted border-neutral-800" />
              </p>
              <p className="mt-0.5 text-[9px] text-neutral-600">
                {t("driverSignature")} / {t("receiptOfPayment")}
              </p>
            </div>
          </div>
        </div>

        <div className="voucher-support shrink-0">
          <SectionBar>{t("support")}</SectionBar>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <Cell label={t("support")} value={site.phone} />
            <Cell label={t("hotelRoomNo")} value="—" />
            <Cell label={t("hotelPhone")} value="—" />
          </div>
          <Cell label={t("hotelAddress")} value="—" />
        </div>

        <div className="voucher-footer shrink-0">
          <SectionBar>{t("comments")}</SectionBar>
          <div className="voucher-comments border border-[#e7d7a8] px-1.5 py-1.5 text-[10px]">
            {booking.notes || "—"}
          </div>
          <p className="border border-[#e7d7a8] px-1.5 py-1 text-[8px] leading-snug text-neutral-600">
            {t("voucherLegal")}
          </p>
          <p className="bg-gradient-to-r from-[#f6e2a8] via-[#e6c36a] to-[#d4ae45] px-1.5 py-1.5 text-center text-[10px] font-bold tracking-wide text-[#3d3214] uppercase">
            {t("pleasePrint")}
          </p>
        </div>
      </section>

      {/* Page 2 — single Welcome board (max 2 printable pages) */}
      {outbound ? (
        <WelcomeBoard
          booking={booking}
          leg={outbound}
          vehicleLabel={vehicleLabel}
        />
      ) : null}

      <div className="voucher-print-actions flex flex-col gap-2 sm:flex-row sm:justify-center print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="size-4" />
          {t("print")}
        </Button>
        <ButtonLink href="/booking">{t("newBooking")}</ButtonLink>
      </div>
    </div>
  );
}
