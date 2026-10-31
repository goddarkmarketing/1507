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
import { formatDayMonthYear } from "@/components/booking/date-time-fields";
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

const BOARD_VEHICLE_NAMES: Record<string, string> = {
  ECO: "Economy Taxi",
  PREM: "Luxury Taxi",
  SUV: "SUV Taxi",
  VAN: "Van Taxi",
  EXE: "VIP Van",
  VIP: "Alphard VIP",
  SIG: "Alphard VIP",
  BUS: "Mini Bus",
};

/** Name width in cqi: 15 Latin capitals span the full board, short names cap at the line height. */
function boardNameSize(name: string) {
  const chars = Math.max(Array.from(name.trim()).length, 1);
  return Math.min(15, 86 / (chars * 0.7));
}

function WelcomeBoard({ booking, leg }: { booking: Booking; leg: BookingLeg }) {
  const from = getLocation(leg.fromId);
  const to = getLocation(leg.toId);
  const fromLabel = welcomePlaceLabel(leg.fromId, from?.name ?? "");
  const toLabel = welcomePlaceLabel(leg.toId, to?.name ?? "");
  const route = [fromLabel, toLabel].filter(Boolean).join(" to ");
  const placeLine =
    leg.hotelName?.trim() ||
    (to?.type === "hotel" && to.name && to.name !== toLabel ? to.name : null);
  const name = booking.customerName.trim().toUpperCase();
  const details = [
    formatDayMonthYear(leg.date),
    booking.flightNumber?.trim().toUpperCase(),
    leg.time ? `At ${leg.time}` : null,
    BOARD_VEHICLE_NAMES[leg.vehicleCode] ?? leg.vehicleCode,
    booking.passengerCount ? `${booking.passengerCount} pax` : null,
  ].filter(Boolean);

  return (
    <section className="voucher-page voucher-board relative mx-auto box-border aspect-[1024/724] w-full max-w-[297mm] overflow-hidden bg-white print:border-0 [container-type:inline-size]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assetPath("/voucher/welcome-sign.jpg")}
        alt=""
        className="absolute inset-0 h-full w-full object-fill"
      />
      <div
        className="absolute inset-x-[6%] top-[50%] bottom-[6%] flex flex-col items-center justify-between text-center"
        style={{ color: BOARD_INK }}
      >
        <div className="flex w-full flex-1 items-center justify-center">
          <p
            className="voucher-board-title max-w-full leading-none font-bold whitespace-nowrap"
            style={{ fontSize: `${boardNameSize(name)}cqi` }}
          >
            {name}
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-[0.5cqi]">
          {route ? (
            <p className="voucher-board-meta max-w-full text-[2cqi] leading-tight font-bold">
              {route}
            </p>
          ) : null}
          {placeLine ? (
            <p className="voucher-board-meta max-w-full text-[1.8cqi] leading-tight font-semibold">
              {placeLine}
            </p>
          ) : null}
          <p className="voucher-board-meta mt-[1cqi] max-w-full text-[2cqi] leading-tight font-bold">
            {details.join("  ·  ")}
          </p>
        </div>
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
  const outArea = outTo?.pricingAreaId
    ? (getLocation(outTo.pricingAreaId) ?? outTo)
    : outTo;
  const outHotel =
    outbound?.hotelName?.trim() ||
    (outTo?.type === "hotel" ? locName(outTo) : "");
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
  const discountAmount = Math.max(0, booking.discountAmount ?? 0);
  const hasDiscount = discountAmount > 0;
  const nightCharge = Math.max(0, booking.serviceCharge ?? 0);
  const netPrice = Math.max(0, booking.totalPrice);
  const listPrice = netPrice + discountAmount;
  const listTransfer = Math.max(0, listPrice - nightCharge);
  const baht = (n: number) => `${n.toLocaleString()} THB`;

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
            <Cell label={t("destination")} value={locName(outArea)} />
            <Cell
              label={t("from")}
              value={
                outbound?.pickupPlace?.trim() ||
                (outFrom ? locName(outFrom) : "—")
              }
            />
            <Cell
              label={t("to")}
              value={outHotel || (outTo ? locName(outTo) : "—")}
            />
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
            <Cell
              label={t("babySeatNo")}
              value={booking.carSeatRequested ? 1 : 0}
            />
            <Cell label={t("otherServices")} value={booking.notes || "—"} />
            <Cell label={t("touringTime")} value="—" />
          </div>
        </div>

        <div className="voucher-block grid min-h-0 flex-1 grid-cols-2">
          <div className="voucher-col flex min-h-0 flex-col">
            <SectionBar>{t("reservationDetails")}</SectionBar>
            <Cell label={t("typeOfCar")} value={`1 ${vehicleLabel}`} />
            <Cell
              label={t("passengers")}
              value={
                booking.adultCount || booking.childCount || booking.infantCount
                  ? [
                      booking.adultCount ? `A${booking.adultCount}` : null,
                      booking.childCount ? `C${booking.childCount}` : null,
                      booking.infantCount ? `I${booking.infantCount}` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")
                  : booking.passengerCount
              }
            />
            <Cell label={t("bookingType")} value={typeLabel} />
            <Cell
              label={hasDiscount ? t("listPrice") : t("transferPrice")}
              value={
                booking.priceStatus === "pending"
                  ? t("quoteBannerTitle")
                  : baht(hasDiscount ? listTransfer : Math.max(0, netPrice - nightCharge))
              }
            />
            {hasDiscount && booking.priceStatus !== "pending" ? (
              <Cell label={t("discountAmount")} value={`− ${baht(discountAmount)}`} />
            ) : null}
            <Cell
              label={t("otherServicesPrice")}
              value={nightCharge ? baht(nightCharge) : "0 THB"}
            />
            <Cell
              label={hasDiscount ? t("netTotal") : t("totalCost")}
              value={
                booking.priceStatus === "pending"
                  ? t("quoteBannerTitle")
                  : baht(netPrice)
              }
            />
            {hasDiscount && booking.priceStatus !== "pending" ? (
              <p className="voucher-note shrink-0 border border-[#e7d7a8] bg-[#fbf6e8] px-1.5 py-1 text-[9px] leading-snug text-neutral-700">
                {t("discountSummary", {
                  list: listPrice.toLocaleString(),
                  discount: discountAmount.toLocaleString(),
                  net: netPrice.toLocaleString(),
                })}
              </p>
            ) : null}
            <Cell label={t("amountDue")} value={baht(amountDue)} />
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
        <WelcomeBoard booking={booking} leg={outbound} />
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
