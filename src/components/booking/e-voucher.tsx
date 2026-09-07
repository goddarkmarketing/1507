"use client";

import { useTranslations, useLocale } from "next-intl";
import type { ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowRight,
  Baby,
  CalendarDays,
  Car,
  Clock3,
  Download,
  FileText,
  MapPin,
  Plane,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { SiteLogo } from "@/components/shared/site-logo";
import { getLocation } from "@/lib/data/locations";
import { vehicles } from "@/lib/data/vehicles";
import { useLocationName, useVehicleCopy } from "@/lib/i18n-labels";
import { useSiteContact } from "@/lib/admin/settings-store";
import { getBookingAmountDue } from "@/lib/booking/booking-mode";
import { getDateLocale } from "@/i18n/locales";
import type { Booking, BookingLeg, Location } from "@/lib/types";
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
        "voucher-cell flex flex-1 items-center gap-1.5 border border-[#7aa2c9] px-1.5 py-1 text-[10px] leading-snug sm:text-[11px]",
        wide && "col-span-2",
        className
      )}
    >
      <span className="shrink-0 font-medium text-[#2b5f8a]">{label} :</span>
      <span className="min-w-0 flex-1 break-words font-semibold text-neutral-900 [overflow-wrap:anywhere]">
        {value === undefined || value === null || value === "" ? "—" : value}
      </span>
    </div>
  );
}

function SectionBar({ children }: { children: ReactNode }) {
  return (
    <div className="voucher-section-bar shrink-0 bg-[#d9dde3] px-2 py-1 text-[10px] font-bold tracking-wide text-[#1e4f7a] uppercase sm:text-[11px]">
      {children}
    </div>
  );
}

const BOARD_GOLD = "#c4a35a";
const BOARD_INK = "#1a1a1a";
const BOARD_BEIGE = "rgba(245, 240, 230, 0.72)";

function BoardDetail({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 text-left">
      <span
        className="mt-0.5 shrink-0"
        style={{ color: BOARD_GOLD }}
        aria-hidden
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p
          className="text-[9px] font-semibold tracking-[0.16em] uppercase sm:text-[10px]"
          style={{ color: BOARD_GOLD }}
        >
          {label}
        </p>
        <p
          className="mt-0.5 text-xs font-bold break-words sm:text-sm"
          style={{ color: BOARD_INK }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function WelcomeBoard({
  booking,
  leg,
  locName,
  vehicleLabel,
  siteDomain,
}: {
  booking: Booking;
  leg: BookingLeg;
  index: number;
  totalLegs: number;
  locName: (loc: Location | undefined) => string;
  vehicleLabel: string;
  siteDomain: string;
}) {
  const t = useTranslations("Voucher");
  const locale = useLocale();
  const from = getLocation(leg.fromId);
  const to = getLocation(leg.toId);
  const isAirport =
    from?.type === "airport" || to?.type === "airport";
  const title = isAirport ? t("boardAirportTitle") : t("boardTransferTitle");
  const fromName = locName(from);
  const toName = locName(to);
  const vehicle = vehicles.find((v) => v.code === leg.vehicleCode);
  const babySeatCount = 0;
  const paxLabel = vehicle?.passengers
    ? t("boardPax", { n: vehicle.passengers })
    : "—";
  const FromIcon = from?.type === "airport" ? Plane : MapPin;
  const ToIcon = to?.type === "airport" ? Plane : MapPin;

  return (
    <section
      className="voucher-page voucher-board relative mx-auto box-border flex w-full max-w-[210mm] min-h-0 flex-col justify-between overflow-visible border border-neutral-300 bg-[#fbfaf7] px-4 py-4 text-center sm:aspect-[297/210] sm:overflow-hidden sm:px-7 sm:py-5 print:aspect-auto print:overflow-hidden print:border-0 print:px-7 print:py-4"
      style={{
        color: BOARD_INK,
        backgroundImage: `url(${assetPath("/voucher/welcome-board-bg.png")})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <header className="relative z-[1] grid grid-cols-1 items-start gap-2 sm:grid-cols-[1fr_auto_1fr]">
        <p
          className="hidden max-w-[11rem] justify-self-start text-left text-[9px] leading-snug font-semibold tracking-[0.14em] uppercase sm:block sm:text-[10px]"
          style={{ color: BOARD_GOLD }}
        >
          {t("boardTrustedTransfer")}
        </p>
        <div className="flex flex-col items-center gap-1.5">
          <SiteLogo height={48} />
          <p
            className="voucher-board-brand text-sm font-bold tracking-[0.04em] sm:text-base"
            style={{ color: BOARD_INK }}
          >
            {t("boardBrandCompact")}
          </p>
          <p
            className="flex items-center gap-2 text-[9px] font-semibold tracking-[0.22em] uppercase sm:text-[10px]"
            style={{ color: BOARD_GOLD }}
          >
            <span
              className="hidden h-px w-6 sm:block"
              style={{ backgroundColor: BOARD_GOLD }}
            />
            {t("boardPremiumService")}
            <span
              className="hidden h-px w-6 sm:block"
              style={{ backgroundColor: BOARD_GOLD }}
            />
          </p>
        </div>
        <p
          className="hidden max-w-[11rem] justify-self-end text-right text-[9px] leading-snug font-semibold tracking-[0.14em] uppercase sm:block sm:text-[10px]"
          style={{ color: BOARD_GOLD }}
        >
          {t("boardSafeJourney")}
        </p>
      </header>

      <div className="relative z-[1] mt-2 space-y-1 sm:mt-2.5">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <span
            className="hidden h-px w-8 sm:block sm:w-12"
            style={{ backgroundColor: BOARD_GOLD }}
          />
          <h2 className="voucher-board-title text-base font-bold tracking-[0.06em] uppercase sm:text-xl md:text-2xl">
            {title}
          </h2>
          <span
            className="hidden h-px w-8 sm:block sm:w-12"
            style={{ backgroundColor: BOARD_GOLD }}
          />
        </div>
        <p
          className="text-[9px] font-semibold tracking-[0.28em] uppercase sm:text-[10px]"
          style={{ color: BOARD_GOLD }}
        >
          {t("boardConfirmed")}
        </p>
      </div>

      <div
        className="relative z-[1] mt-2 flex flex-wrap items-center justify-center gap-1.5 rounded-lg px-3 py-2 sm:mt-2.5 sm:gap-2.5 sm:px-4"
        style={{
          border: `1px solid ${BOARD_GOLD}`,
          backgroundColor: BOARD_BEIGE,
        }}
      >
        <FromIcon className="size-3.5 shrink-0 sm:size-4" style={{ color: BOARD_GOLD }} />
        <span className="text-xs font-bold sm:text-sm">{fromName}</span>
        <ArrowRight className="size-3.5 shrink-0" style={{ color: BOARD_GOLD }} />
        <ToIcon className="size-3.5 shrink-0 sm:size-4" style={{ color: BOARD_GOLD }} />
        <span className="text-xs font-bold sm:text-sm">{toName}</span>
      </div>

      <div className="relative z-[1] mt-2 space-y-1 sm:mt-2.5">
        <p
          className="text-[9px] font-semibold tracking-[0.22em] uppercase sm:text-[10px]"
          style={{ color: BOARD_GOLD }}
        >
          {t("passengerName")}
        </p>
        <p
          className="mx-auto inline-block max-w-full rounded-lg px-5 py-1.5 text-lg font-bold break-words sm:text-xl md:text-2xl"
          style={{
            backgroundColor: BOARD_BEIGE,
            border: `1px solid ${BOARD_GOLD}55`,
            color: BOARD_INK,
          }}
        >
          {booking.customerName}
        </p>
      </div>

      <div
        className="relative z-[1] mt-2 grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg px-3 py-2.5 sm:mt-2.5 sm:gap-x-8 sm:gap-y-3 sm:px-5 sm:py-3"
        style={{
          border: `1px solid ${BOARD_GOLD}`,
          backgroundColor: "rgba(255,255,255,0.55)",
        }}
      >
        <div className="space-y-2.5 sm:space-y-3">
          <BoardDetail
            icon={<CalendarDays className="size-3.5" />}
            label={t("boardPickupDate")}
            value={formatVoucherDate(leg.date, locale)}
          />
          <BoardDetail
            icon={<Clock3 className="size-3.5" />}
            label={t("boardPickupTime")}
            value={leg.time || "—"}
          />
          <BoardDetail
            icon={<Car className="size-3.5" />}
            label={t("boardVehicleLabel")}
            value={vehicleLabel}
          />
        </div>
        <div className="space-y-2.5 sm:space-y-3">
          <BoardDetail
            icon={<Baby className="size-3.5" />}
            label={t("boardBabySeatLabel")}
            value={String(babySeatCount)}
          />
          <BoardDetail
            icon={<Users className="size-3.5" />}
            label={t("boardPassengersLabel")}
            value={paxLabel}
          />
          <BoardDetail
            icon={<FileText className="size-3.5" />}
            label={t("boardBookingId")}
            value={booking.bookingNumber}
          />
        </div>
      </div>

      <footer className="relative z-[1] mt-2 space-y-0.5 sm:mt-2.5">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <span
            className="h-px w-10 sm:w-16"
            style={{ backgroundColor: BOARD_GOLD }}
          />
          <p className="text-xs font-semibold sm:text-sm">{siteDomain}</p>
          <span
            className="h-px w-10 sm:w-16"
            style={{ backgroundColor: BOARD_GOLD }}
          />
        </div>
        <p
          className="text-[8px] font-semibold tracking-[0.2em] uppercase sm:text-[9px]"
          style={{ color: BOARD_GOLD }}
        >
          {t("boardTagline")}
        </p>
      </footer>
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
  const qrData = JSON.stringify({
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    total: booking.totalPrice,
  });
  const domain = site.domain?.replace(/^https?:\/\//, "") || "www.krabilinkstaxi.com";

  return (
    <div className="voucher-sheet mx-auto w-full max-w-[210mm] space-y-8 overflow-x-auto px-3 py-6 sm:px-0 sm:py-8 print:max-w-none print:space-y-0 print:overflow-visible print:px-0 print:py-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="size-4" />
          {t("print")}
        </Button>
        <ButtonLink href="/booking">{t("newBooking")}</ButtonLink>
      </div>

      {/* Page 1 — Transfer Voucher sized to A4 and stretched to fill */}
      <section className="voucher-page voucher-form mx-auto box-border flex w-full max-w-[210mm] flex-col border-2 border-[#3d6f99] bg-white text-neutral-900 aspect-auto print:max-w-none print:aspect-auto print:border-[#3d6f99] md:aspect-[210/297]">
        <header className="voucher-form-header flex shrink-0 items-center justify-between gap-3 border-b border-[#3d6f99] px-2 py-1.5 sm:px-3">
          <div className="flex items-center gap-2">
            <SiteLogo height={44} />
            <p className="hidden text-[10px] font-medium text-neutral-500 sm:block">
              {domain}
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-base font-black tracking-tight text-[#1e4f7a] sm:text-lg">
              {t("transferTitle")}
            </h1>
            <p className="text-[11px] font-semibold text-[#2b5f8a]">
              {t("orderNo")} :{" "}
              <span className="font-mono">{booking.bookingNumber}</span>
            </p>
          </div>
        </header>

        <SectionBar>{t("clientDetails")}</SectionBar>
        <div className="voucher-client grid shrink-0 grid-cols-[1fr_auto]">
          <div className="flex flex-col">
            <Cell label={t("clientName")} value={booking.customerName} />
            <Cell label={t("passengerName")} value={booking.customerName} />
            <Cell label={t("clientPhone")} value={booking.customerPhone} />
            <Cell label={t("email")} value={booking.customerEmail} />
            <p className="shrink-0 border border-[#7aa2c9] bg-[#fff8e1] px-1.5 py-1 text-[10px] font-semibold text-amber-900">
              {t("lookForDriver")}
            </p>
          </div>
          <div className="voucher-qr-box flex w-[5.5rem] flex-col items-center justify-center gap-0.5 border border-[#7aa2c9] bg-[#ffe44d] px-1 py-1 text-center sm:w-32">
            <span className="sm:hidden">
              <QRCodeSVG value={qrData} size={56} />
            </span>
            <span className="hidden sm:inline-block">
              <QRCodeSVG value={qrData} size={64} />
            </span>
            <p className="text-[8px] font-bold leading-tight text-neutral-900">
              {t("welcomeBanner", {
                place:
                  outFrom?.type === "airport"
                    ? locName(outFrom)
                    : locName(outFrom) || "Krabi",
              })}
            </p>
            <p className="text-[10px] font-black break-all leading-tight">
              {booking.customerName}
            </p>
            <p className="text-[7px] font-medium text-neutral-700">{domain}</p>
          </div>
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
              value={`${Math.max(0, booking.totalPrice - (booking.serviceCharge ?? 0)).toLocaleString()} THB`}
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
              value={`${booking.totalPrice.toLocaleString()} THB`}
            />
            <Cell
              label={t("amountDue")}
              value={`${amountDue.toLocaleString()} THB`}
            />
            <p className="voucher-note shrink-0 border border-[#7aa2c9] px-1.5 py-1 text-[9px] leading-snug text-neutral-700">
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
            <div className="voucher-sign flex flex-1 flex-col justify-end border border-[#7aa2c9] px-1.5 py-1">
              <p className="flex max-w-full items-end gap-1 overflow-hidden border-b border-neutral-800 pb-0.5 font-mono text-[10px]">
                <span>X</span>
                <span className="mb-0.5 h-px min-w-0 flex-1 border-b border-dotted border-neutral-800" />
              </p>
              <p className="mt-0.5 text-[9px] text-neutral-600">
                {t("clientSignature")}
              </p>
            </div>
            <div className="voucher-sign flex flex-1 flex-col justify-end border border-[#7aa2c9] px-1.5 py-1">
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
          <div className="voucher-comments border border-[#7aa2c9] px-1.5 py-1.5 text-[10px]">
            {booking.notes || "—"}
          </div>
          <p className="border border-[#7aa2c9] px-1.5 py-1 text-[8px] leading-snug text-neutral-600">
            {t("voucherLegal")}
          </p>
          <p className="border border-[#7aa2c9] bg-[#fff8e1] px-1.5 py-1.5 text-center text-[10px] font-bold tracking-wide uppercase">
            {t("pleasePrint")}
          </p>
        </div>
      </section>

      {/* Page 2 — single Welcome board (max 2 printable pages) */}
      {outbound ? (
        <WelcomeBoard
          booking={booking}
          leg={outbound}
          index={0}
          totalLegs={1}
          locName={locName}
          vehicleLabel={
            outVehicle
              ? `${outVehicle.code} ${vehicleName(outVehicle.code)}`
              : vehicleLabel
          }
          siteDomain={domain}
        />
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center print:hidden">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="size-4" />
          {t("print")}
        </Button>
        <ButtonLink href="/booking">{t("newBooking")}</ButtonLink>
      </div>
    </div>
  );
}
