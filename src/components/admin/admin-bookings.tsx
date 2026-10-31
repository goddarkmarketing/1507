"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { Check, ChevronDown, Download, FileText, MessageCircle, Pencil, Phone, Printer, Search, SlidersHorizontal, X } from "lucide-react";
import { BookingEditForm } from "@/components/admin/booking-edit-form";
import { useAdminStore } from "@/lib/admin/store";
import {
  money,
  OPS_STATUSES,
  useRouteLabel,
} from "@/components/admin/admin-ui";
import { TransferProofPreview } from "@/components/admin/transfer-proof-preview";
import type { AdminBooking } from "@/lib/admin/types";
import type { OpsStatus } from "@/lib/admin/types";
import type { BookingService } from "@/lib/booking/booking-mode";
import type { PaymentMethod } from "@/lib/types";
import { downloadCsv } from "@/lib/admin/catalog-csv";
import {
  dropoffAreaName,
  dropoffDetailLabel,
  dropoffHotelName,
} from "@/lib/data/nearby-hotels";
import { getLocation } from "@/lib/data/locations";
import { getVehicle } from "@/lib/data/vehicles";
import { locationShortName } from "@/lib/i18n-labels";
import { whatsappHref } from "@/lib/contact-links";
import { voucherUrl } from "@/lib/booking/remote/config";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DETAIL_STATUSES = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
] as const;

type DetailStatus = (typeof DETAIL_STATUSES)[number];

type MobileChip = "all" | "payment" | "confirmed" | "traveling" | "cancelled";

function cardStatus(booking: AdminBooking): "payment" | DetailStatus {
  if (booking.status === "cancelled" || booking.opsStatus === "cancelled") {
    return "cancelled";
  }
  if (booking.status === "pending") return "pending";
  if (booking.opsStatus === "payment_review") return "payment";
  return detailStatusOf(booking);
}

function matchesMobileChip(booking: AdminBooking, chip: MobileChip) {
  const status = cardStatus(booking);
  if (chip === "all") return true;
  if (chip === "payment") return status === "payment" || status === "pending";
  if (chip === "traveling") return status === "in_progress" || status === "completed";
  if (chip === "cancelled") return status === "cancelled";
  return status === "confirmed";
}

function detailStatusOf(booking: AdminBooking): DetailStatus {
  if (booking.status === "cancelled" || booking.opsStatus === "cancelled") {
    return "cancelled";
  }
  if (booking.status === "pending") return "pending";
  if (booking.opsStatus === "in_progress") return "in_progress";
  if (booking.opsStatus === "completed") return "completed";
  return "confirmed";
}

function pickupLabel(date: string | undefined, time: string | undefined, locale: string) {
  if (!date) return "—";
  const parsed = new Date(`${date}T${time || "00:00"}:00`);
  if (Number.isNaN(parsed.getTime())) return time ? `${date} ${time}` : date;
  const day = parsed.toLocaleDateString(locale === "th" ? "th-TH" : locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return time ? `${day} ${time}` : day;
}

function phoneCallHref(phone: string) {
  const compact = phone.replace(/[^\d+]/g, "");
  return compact ? `tel:${compact}` : "";
}

function splitCustomerName(full: string) {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first: "", last: "" };
  if (parts.length === 1) return { first: parts[0], last: "" };
  return {
    first: parts.slice(0, -1).join(" "),
    last: parts[parts.length - 1],
  };
}

const STATUS_STYLE: Record<
  DetailStatus,
  { trigger: string; dot: string; active: string }
> = {
  pending: {
    trigger: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
    active: "bg-amber-50 text-amber-900",
  },
  confirmed: {
    trigger: "border-emerald-200 bg-emerald-50 text-emerald-800",
    dot: "bg-emerald-500",
    active: "bg-emerald-50 text-emerald-900",
  },
  in_progress: {
    trigger: "border-sky-200 bg-sky-50 text-sky-800",
    dot: "bg-sky-500",
    active: "bg-sky-50 text-sky-900",
  },
  completed: {
    trigger: "border-zinc-200 bg-zinc-100 text-zinc-700",
    dot: "bg-zinc-400",
    active: "bg-zinc-100 text-zinc-900",
  },
  cancelled: {
    trigger: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    active: "bg-rose-50 text-rose-800",
  },
};

function QuotePriceForm({ booking }: { booking: AdminBooking }) {
  const t = useTranslations("Admin");
  const sendQuotedPrice = useAdminStore((s) => s.sendQuotedPrice);
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  return (
    <form
      className="flex max-w-md flex-wrap items-center gap-2"
      onSubmit={async (event) => {
        event.preventDefault();
        const price = Number(amount.replace(/,/g, "").trim());
        if (!Number.isFinite(price) || price <= 0) return;
        setSending(true);
        const result = await sendQuotedPrice(booking.id, price);
        setSending(false);
        if (result.ok) toast.success(t("quoteSent"));
        else toast.error(t("quoteSendFail"));
      }}
    >
      <p className="w-full text-xs font-semibold text-amber-800">{t("quotePending")}</p>
      <Input
        inputMode="decimal"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder={t("quoteAmount")}
        className="h-9 w-36"
        aria-label={t("quoteAmount")}
      />
      <Button type="submit" size="sm" disabled={sending || !amount.trim()}>
        {t("sendQuote")}
      </Button>
    </form>
  );
}

function StatusMenu({
  value,
  onChange,
  label,
}: {
  value: DetailStatus;
  onChange: (status: DetailStatus) => void;
  label: (status: DetailStatus) => string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const tone = STATUS_STYLE[value];

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex h-9 min-w-40 items-center justify-between gap-3 rounded-full border px-3 text-sm font-medium shadow-sm transition hover:brightness-[0.98]",
          tone.trigger
        )}
      >
        <span className="inline-flex items-center gap-2">
          <span className={cn("size-2 rounded-full", tone.dot)} />
          {label(value)}
        </span>
        <ChevronDown
          className={cn("size-4 opacity-70 transition", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div
          role="listbox"
          className="absolute bottom-full left-0 z-30 mb-2 w-48 rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5"
        >
          {DETAIL_STATUSES.map((status) => {
            const item = STATUS_STYLE[status];
            const selected = status === value;
            return (
              <button
                key={status}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(status);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-50",
                  selected && cn("font-medium", item.active)
                )}
              >
                <span className={cn("size-2 shrink-0 rounded-full", item.dot)} />
                <span className="flex-1">{label(status)}</span>
                {selected ? <Check className="size-4 opacity-70" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function csvCell(value: string) {
  const text = value.replace(/\r?\n/g, " ").trim();
  if (/[",]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}

function opsRow(booking: AdminBooking, locale: string) {
  const leg = booking.legs?.[0];
  const fromId = leg?.fromId || "";
  const toId = leg?.toId || "";
  const fromArea = fromId
    ? locationShortName(getLocation(fromId), locale) || fromId
    : "";
  const fromPlace = leg?.pickupPlace?.trim() || "";
  const from =
    fromPlace && fromPlace !== fromArea
      ? `${fromArea} / ${fromPlace}`
      : fromArea || "—";
  const toArea = toId ? dropoffAreaName(toId, locale) : "";
  const toHotel = toId ? dropoffHotelName(toId, leg?.hotelName, locale) : "";
  const to =
    toHotel && toHotel !== toArea
      ? `${toArea || toId} / ${toHotel}`
      : toArea || toId || "—";
  const toIsAirport = Boolean(toId) && getLocation(toId)?.type === "airport";
  const trip =
    booking.type === "round-trip"
      ? "RT"
      : booking.type === "one-way"
        ? "OW"
        : (booking.type || "—").toString().slice(0, 2).toUpperCase() || "—";
  const whenFull = leg?.date
    ? `${leg.date.slice(8, 10)}/${leg.date.slice(5, 7)}/${leg.date.slice(0, 4)} - ${leg.time}`
    : "—";
  const adults =
    booking.adultCount ??
    Math.max(
      0,
      (booking.passengerCount ?? 0) -
        (booking.childCount ?? 0) -
        (booking.infantCount ?? 0)
    );
  const kids = (booking.childCount ?? 0) + (booking.infantCount ?? 0);
  return {
    from,
    to,
    toIsAirport,
    whenFull,
    flight: booking.flightNumber?.trim() || "NA",
    ctype: leg?.vehicleCode || "—",
    trip,
    vd: adults,
    vc: kids,
  };
}

export function AdminBookingsPage() {
  const t = useTranslations("Admin");
  const tVehicle = useTranslations("Vehicles");
  const locale = useLocale();
  const bookings = useAdminStore((s) => s.bookings);
  const setOpsStatus = useAdminStore((s) => s.setOpsStatus);
  const verifyPayment = useAdminStore((s) => s.verifyPayment);
  const routeLabel = useRouteLabel();
  const [confirmTarget, setConfirmTarget] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<OpsStatus | "all">("all");
  const [serviceFilter, setServiceFilter] = useState<BookingService | "all">(
    "all"
  );
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "all">(
    "all"
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [mobileChip, setMobileChip] = useState<MobileChip>("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const confirm = params.get("confirm")?.trim().toUpperCase();
    if (!confirm) return;
    const edit = params.get("edit") === "1";
    const timer = window.setTimeout(() => {
      setConfirmTarget(confirm);
      if (edit) setEditing(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...bookings]
      .filter(
        (b) =>
          !(
            b.id.startsWith("sched-demo-") ||
            b.bookingNumber.startsWith("KLT-DEMO-")
          )
      )
      .sort((a, b) => {
        const ta = Date.parse(a.createdAt || a.updatedAt || "") || 0;
        const tb = Date.parse(b.createdAt || b.updatedAt || "") || 0;
        return tb - ta;
      })
      .filter((b) => {
      const statusOk = filter === "all" || b.opsStatus === filter;
      const serviceOk =
        serviceFilter === "all" || b.service === serviceFilter;
      const paymentOk =
        paymentFilter === "all" || b.payment?.method === paymentFilter;
      const textOk =
        !q ||
        b.bookingNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q);
      return statusOk && serviceOk && paymentOk && textOk;
    });
  }, [bookings, query, filter, serviceFilter, paymentFilter]);

  const deepLinkId = confirmTarget
    ? (bookings.find((b) => b.bookingNumber === confirmTarget)?.id ?? null)
    : null;
  const activeId = selectedId ?? deepLinkId;
  const selected = activeId
    ? (bookings.find((b) => b.id === activeId) ?? null)
    : null;

  const openDetail = (id: string) => {
    setConfirmTarget(null);
    setSelectedId(id);
    setDetailOpen(true);
    setEditing(false);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setEditing(false);
    setSelectedId(null);
    if (confirmTarget) {
      setConfirmTarget(null);
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const approveBooking = (booking: AdminBooking) => {
    verifyPayment(booking.id, true);
    toast.success(t("bookingApproved"));
  };

  const statusLabel = (status: DetailStatus) => {
    if (status === "pending") return t("detailPending");
    if (status === "in_progress") return t("ops.in_progress");
    if (status === "completed") return t("ops.completed");
    if (status === "cancelled") return t("detailCancelled");
    return t("detailConfirmed");
  };

  const vehicleLabel = (code: string) => {
    if (!code) return "—";
    const vehicle = getVehicle(code);
    const seats = vehicle?.passengers?.split(/[–-]/).pop()?.trim();
    const known = ["ECO", "PREM", "SUV", "VAN", "VIP", "SIG", "EXE", "BUS"];
    const name = known.includes(code)
      ? tVehicle(`${code}.name` as "ECO.name")
      : code;
    return seats ? `${name} (${code}) ${tVehicle("pax", { n: seats })}` : `${name} (${code})`;
  };

  const cardStatusLabel = (booking: AdminBooking) => {
    if (booking.priceStatus === "pending") {
      return { label: t("quotePending"), className: "text-amber-600" };
    }
    const status = cardStatus(booking);
    if (status === "pending") {
      return { label: t("detailPending"), className: "text-amber-600" };
    }
    if (status === "payment") {
      return { label: t("chipPayment"), className: "text-amber-500" };
    }
    if (status === "in_progress" || status === "completed") {
      return { label: t("chipTraveling"), className: "text-sky-600" };
    }
    if (status === "cancelled") {
      return { label: t("detailCancelled"), className: "text-rose-600" };
    }
    return { label: t("chipConfirmed"), className: "text-emerald-600" };
  };

  const applyStatus = (bookingId: string, status: DetailStatus) => {
    if (status === "cancelled") setOpsStatus(bookingId, "cancelled");
    else if (status === "pending") setOpsStatus(bookingId, "payment_review");
    else if (status === "in_progress") setOpsStatus(bookingId, "in_progress");
    else if (status === "completed") setOpsStatus(bookingId, "completed");
    else setOpsStatus(bookingId, "new");
  };

  const detailRows = (booking: AdminBooking): { label: string; value: ReactNode }[] => {
    const name = splitCustomerName(booking.customerName || "");
    const first = name.first || "—";
    const last = name.last || "—";
    const legs = booking.legs ?? [];
    const when = legs.map((leg) => `${leg.date} ${leg.time}`).join("\n") || "—";
    const vehicle =
      [...new Set(legs.map((leg) => leg.vehicleCode).filter(Boolean))].join(", ") ||
      "—";
    const pay =
      booking.paymentPlan === "pay-driver" || booking.payment?.method === "cash"
        ? t("detailPayDriver")
        : booking.payment?.summary || "—";
    const phone = booking.customerPhone?.trim() || "";
    const callHref = phoneCallHref(phone);
    const currentStatus = detailStatusOf(booking);
    const rows: { label: string; value: ReactNode }[] = [
      { label: t("detailFirstName"), value: first },
      { label: t("detailLastName"), value: last },
      { label: t("detailEmail"), value: booking.customerEmail || "—" },
      {
        label: t("detailPhone"),
        value: callHref ? (
          <a
            href={callHref}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
          >
            <Phone className="size-3.5" />
            {phone}
          </a>
        ) : (
          "—"
        ),
      },
      { label: t("detailPlace"), value: routeLabel(booking) },
      ...(() => {
        const hotels = legs
          .map((leg) => dropoffHotelName(leg.toId, leg.hotelName, locale))
          .filter(Boolean);
        return hotels.length
          ? [{ label: t("detailHotel"), value: hotels.join("\n") }]
          : [];
      })(),
      { label: t("detailTime"), value: when },
      { label: t("detailVehicle"), value: vehicle },
      {
        label: t("detailPrice"),
        value:
          booking.priceStatus === "pending" ? (
            <QuotePriceForm booking={booking} />
          ) : (
            money(booking.totalPrice)
          ),
      },
      ...((booking.discountAmount ?? 0) > 0
        ? [
            {
              label: t("detailDiscount"),
              value: money(booking.discountAmount!),
            },
          ]
        : []),
      ...((booking.amountDueNow ?? 0) > 0 && booking.paymentPlan === "deposit"
        ? [
            {
              label: t("detailDeposit"),
              value: money(booking.amountDueNow!),
            },
          ]
        : []),
      ...((booking.balanceDue ?? 0) > 0 && booking.paymentPlan === "deposit"
        ? [
            {
              label: t("detailBalanceDue"),
              value: money(booking.balanceDue!),
            },
          ]
        : []),
      { label: t("payment"), value: pay },
      {
        label: t("detailBookedAt"),
        value: booking.createdAt
          ? new Date(booking.createdAt).toLocaleString(locale)
          : "—",
      },
      {
        label: t("detailStatus"),
        value: (
          <StatusMenu
            value={currentStatus}
            label={statusLabel}
            onChange={(status) => applyStatus(booking.id, status)}
          />
        ),
      },
    ];
    if (booking.flightNumber) {
      rows.splice(6, 0, { label: t("flight"), value: booking.flightNumber });
    }
    {
      const parts: string[] = [];
      if (booking.adultCount) parts.push(`${t("adultCount")} ${booking.adultCount}`);
      if (booking.childCount) parts.push(`${t("childCount")} ${booking.childCount}`);
      if (booking.infantCount) parts.push(`${t("infantCount")} ${booking.infantCount}`);
      if (booking.carSeatRequested) parts.push(t("carSeatYes"));
      const pax =
        parts.length > 0
          ? parts.join(" · ")
          : booking.passengerCount
            ? String(booking.passengerCount)
            : "";
      if (pax) rows.splice(6, 0, { label: t("passengerCount"), value: pax });
    }
    if (booking.notes) {
      rows.push({ label: t("detailCustomerNotes"), value: booking.notes });
    }
    return rows;
  };

  const exportBookings = () => {
    const header = [
      t("colBooking"),
      t("detailFirstName"),
      t("detailLastName"),
      t("detailEmail"),
      t("detailPhone"),
      t("scheduleColFrom"),
      t("scheduleColTo"),
      t("scheduleColPickup"),
      t("flight"),
      t("passengerCount"),
      t("scheduleColTrip"),
      t("detailVehicle"),
      t("detailStatus"),
      t("colAmount"),
      t("payment"),
      t("detailBookedAt"),
      t("detailCustomerNotes"),
    ];
    const lines = filtered.map((booking) => {
      const name = splitCustomerName(booking.customerName || "");
      const leg = booking.legs?.[0];
      const fromId = leg?.fromId || "";
      const toId = leg?.toId || "";
      const vehicle = [
        ...new Set((booking.legs ?? []).map((item) => item.vehicleCode).filter(Boolean)),
      ].join(", ");
      const pay =
        booking.paymentPlan === "pay-driver" || booking.payment?.method === "cash"
          ? t("detailPayDriver")
          : booking.payment?.summary || "";
      const trip =
        booking.type === "round-trip"
          ? "RT"
          : booking.type === "one-way"
            ? "OW"
            : booking.type || "";
      return [
        booking.bookingNumber,
        name.first,
        name.last,
        booking.customerEmail || "",
        booking.customerPhone || "",
        fromId ? locationShortName(getLocation(fromId), locale) || fromId : "",
        toId
          ? dropoffDetailLabel(toId, leg?.hotelName, locale) || toId
          : "",
        leg ? `${leg.date} ${leg.time}` : "",
        booking.flightNumber || "",
        booking.passengerCount ? String(booking.passengerCount) : "",
        trip,
        vehicle,
        statusLabel(detailStatusOf(booking)),
        String(booking.totalPrice ?? ""),
        pay,
        booking.createdAt
          ? new Date(booking.createdAt).toLocaleString(locale)
          : "",
        booking.notes || "",
      ]
        .map((cell) => csvCell(String(cell)))
        .join(",");
    });
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(`bookings-${stamp}.csv`, [header.map(csvCell).join(","), ...lines].join("\n"));
  };

  return (
    <div className="space-y-4">
      <div className="hidden items-start justify-between gap-3 lg:flex">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
            {t("bookingsTitle")}
          </h1>
          <p className="text-xs leading-relaxed text-zinc-500 sm:text-sm">
            {t("bookingsSubtitle")}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 shrink-0 rounded-full border-zinc-200 bg-white px-3 text-zinc-800 shadow-sm"
          disabled={filtered.length === 0}
          onClick={exportBookings}
        >
          <Download className="size-3.5" />
          {t("exportBookings")}
        </Button>
      </div>

      <div className="hidden gap-2 lg:flex lg:h-9 lg:flex-row lg:flex-nowrap lg:items-stretch lg:gap-1.5 lg:overflow-x-auto">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchBookings")}
          className="h-10 min-h-10 w-full rounded-md border-zinc-200 bg-white px-3 text-sm shadow-none lg:h-9 lg:min-h-9 lg:min-w-[10rem] lg:flex-[1.6] lg:px-2 lg:text-xs"
        />
        <div className="grid grid-cols-3 gap-2 lg:contents">
        <Select
          value={filter}
          onValueChange={(v) => v && setFilter(v as OpsStatus | "all")}
        >
          <SelectTrigger
            size="default"
            className="h-10 min-h-10 w-full min-w-0 rounded-md border-zinc-200 bg-white px-2 text-xs data-[size=default]:h-10 lg:h-9 lg:min-h-9 lg:w-auto lg:min-w-[7.5rem] lg:flex-1 lg:data-[size=default]:h-9"
          >
            <SelectValue placeholder={t("filterStatus")}>
              {filter === "all" ? t("filterStatus") : t(`ops.${filter}`)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            {OPS_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`ops.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={serviceFilter}
          onValueChange={(v) =>
            v && setServiceFilter(v as BookingService | "all")
          }
        >
          <SelectTrigger
            size="default"
            className="h-10 min-h-10 w-full min-w-0 rounded-md border-zinc-200 bg-white px-2 text-xs data-[size=default]:h-10 lg:h-9 lg:min-h-9 lg:w-auto lg:min-w-[7.5rem] lg:flex-1 lg:data-[size=default]:h-9"
          >
            <SelectValue placeholder={t("filterService")}>
              {serviceFilter === "all"
                ? t("filterService")
                : serviceFilter === "rental"
                  ? t("serviceRental")
                  : t("serviceTransfer")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            <SelectItem value="transfer">{t("serviceTransfer")}</SelectItem>
            <SelectItem value="rental">{t("serviceRental")}</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={paymentFilter}
          onValueChange={(v) =>
            v && setPaymentFilter(v as PaymentMethod | "all")
          }
        >
          <SelectTrigger
            size="default"
            className="h-10 min-h-10 w-full min-w-0 rounded-md border-zinc-200 bg-white px-2 text-xs data-[size=default]:h-10 lg:h-9 lg:min-h-9 lg:w-auto lg:min-w-[7.5rem] lg:flex-1 lg:data-[size=default]:h-9"
          >
            <SelectValue placeholder={t("filterPayment")}>
              {paymentFilter === "all"
                ? t("filterPayment")
                : t(`settingsMethod.${paymentFilter}`)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            <SelectItem value="bank-transfer">
              {t("settingsMethod.bank-transfer")}
            </SelectItem>
            <SelectItem value="promptpay">
              {t("settingsMethod.promptpay")}
            </SelectItem>
            <SelectItem value="cash">
              {t("settingsMethod.cash")}
            </SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("mobileSearch")}
              className="h-11 rounded-full border-zinc-200 bg-white pr-3 pl-10 text-sm shadow-none"
            />
          </div>
          <button
            type="button"
            aria-label={t("exportBookings")}
            disabled={filtered.length === 0}
            onClick={exportBookings}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 disabled:opacity-40"
          >
            <Download className="size-4" />
          </button>
          <button
            aria-pressed={mobileFiltersOpen}
            onClick={() => setMobileFiltersOpen((open) => !open)}
            className={cn(
              "inline-flex size-11 shrink-0 items-center justify-center rounded-full border bg-white text-zinc-700",
              mobileFiltersOpen ? "border-emerald-500 text-emerald-600" : "border-zinc-200"
            )}
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>
        {mobileFiltersOpen ? (
          <div className="grid grid-cols-2 gap-2">
            <Select
              value={serviceFilter}
              onValueChange={(v) => v && setServiceFilter(v as BookingService | "all")}
            >
              <SelectTrigger className="h-10 w-full rounded-full border-zinc-200 bg-white text-xs">
                <SelectValue>
                  {serviceFilter === "all"
                    ? t("filterService")
                    : serviceFilter === "rental"
                      ? t("serviceRental")
                      : t("serviceTransfer")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filterAll")}</SelectItem>
                <SelectItem value="transfer">{t("serviceTransfer")}</SelectItem>
                <SelectItem value="rental">{t("serviceRental")}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={paymentFilter}
              onValueChange={(v) => v && setPaymentFilter(v as PaymentMethod | "all")}
            >
              <SelectTrigger className="h-10 w-full rounded-full border-zinc-200 bg-white text-xs">
                <SelectValue>
                  {paymentFilter === "all"
                    ? t("filterPayment")
                    : t(`settingsMethod.${paymentFilter}`)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filterAll")}</SelectItem>
                <SelectItem value="bank-transfer">{t("settingsMethod.bank-transfer")}</SelectItem>
                <SelectItem value="promptpay">{t("settingsMethod.promptpay")}</SelectItem>
                <SelectItem value="cash">{t("settingsMethod.cash")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(
            [
              ["all", t("filterAll")],
              ["payment", t("chipPayment")],
              ["confirmed", t("chipConfirmed")],
              ["traveling", t("chipTraveling")],
              ["cancelled", t("detailCancelled")],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMobileChip(id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium",
                mobileChip === id
                  ? "bg-emerald-500 text-white"
                  : "border border-zinc-200 bg-white text-zinc-700"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {(() => {
          const mobileRows = filtered.filter((booking) =>
            matchesMobileChip(booking, mobileChip)
          );
          if (mobileRows.length === 0) {
            return (
              <p className="rounded-2xl border border-zinc-200 bg-white px-4 py-10 text-center text-sm text-zinc-500">
                {t("emptyBookings")}
              </p>
            );
          }
          return (
            <div className="-mx-1 overflow-x-auto rounded-xl border border-zinc-300 bg-white">
              <table className="w-max min-w-full border-collapse text-left text-[10px] leading-tight">
                <thead>
                  <tr className="bg-zinc-100 text-[9px] font-semibold uppercase tracking-wide text-zinc-600">
                    <th className="sticky left-0 z-20 border-b border-zinc-300 bg-zinc-100 px-1.5 py-1.5">
                      #
                    </th>
                    <th className="border-b border-zinc-300 px-1.5 py-1.5">{t("scheduleColFrom")}</th>
                    <th className="border-b border-zinc-300 px-1.5 py-1.5">{t("scheduleColTo")}</th>
                    <th className="border-b border-zinc-300 px-1.5 py-1.5 whitespace-nowrap">
                      {t("colPickupFull")}
                    </th>
                    <th className="border-b border-zinc-300 px-1.5 py-1.5">{t("scheduleColFlight")}</th>
                    <th className="border-b border-zinc-300 px-1.5 py-1.5" title={t("colCtype")}>
                      {t("colCtype")}
                    </th>
                    <th className="border-b border-zinc-300 px-1.5 py-1.5">{t("colOwRt")}</th>
                    <th className="border-b border-zinc-300 px-1.5 py-1.5 text-center" title={t("colVdHint")}>
                      {t("colVd")}
                    </th>
                    <th className="border-b border-zinc-300 px-1.5 py-1.5 text-center" title={t("colVcHint")}>
                      {t("colVc")}
                    </th>
                    <th className="border-b border-zinc-300 px-1 py-1.5 text-center" colSpan={4}>
                      {t("colActions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mobileRows.map((b, index) => {
                    const row = opsRow(b, locale);
                    const canConfirm =
                      b.status === "pending" && b.priceStatus !== "pending";
                    const cancelled = detailStatusOf(b) === "cancelled";
                    return (
                      <tr
                        key={b.id}
                        className={cn(
                          "border-b border-zinc-200",
                          index % 2 === 0 ? "bg-white" : "bg-zinc-50"
                        )}
                      >
                        <td className="sticky left-0 z-10 bg-inherit px-1.5 py-1.5">
                          <button
                            type="button"
                            className={cn(
                              "max-w-[7.5rem] truncate text-left font-semibold underline decoration-zinc-300 underline-offset-2",
                              b.type === "round-trip" ? "text-rose-600" : "text-sky-700"
                            )}
                            onClick={() => openDetail(b.id)}
                          >
                            {b.bookingNumber}
                          </button>
                        </td>
                        <td className="max-w-[6.5rem] truncate px-1.5 py-1.5 text-zinc-800">
                          {row.from}
                        </td>
                        <td
                          className={cn(
                            "max-w-[6.5rem] truncate px-1.5 py-1.5 font-medium",
                            row.toIsAirport ? "text-rose-600" : "text-zinc-800"
                          )}
                        >
                          {row.to}
                        </td>
                        <td className="whitespace-nowrap px-1.5 py-1.5 tabular-nums text-zinc-800">
                          {row.whenFull}
                        </td>
                        <td className="max-w-[4.5rem] truncate px-1.5 py-1.5 text-zinc-700">
                          {row.flight}
                        </td>
                        <td className="px-1.5 py-1.5 font-semibold text-zinc-800">{row.ctype}</td>
                        <td className="px-1.5 py-1.5 font-semibold text-zinc-800">{row.trip}</td>
                        <td className="px-1.5 py-1.5 text-center font-semibold text-amber-600 tabular-nums">
                          {row.vd}
                        </td>
                        <td className="px-1.5 py-1.5 text-center font-semibold text-rose-600 tabular-nums">
                          {row.vc}
                        </td>
                        <td className="px-0.5 py-1.5">
                          <button
                            type="button"
                            disabled={!canConfirm || cancelled}
                            title={t("approveBooking")}
                            aria-label={t("approveBooking")}
                            className="inline-flex size-5 items-center justify-center rounded bg-emerald-600 text-white disabled:opacity-30"
                            onClick={() => approveBooking(b)}
                          >
                            <Check className="size-3" />
                          </button>
                        </td>
                        <td className="px-0.5 py-1.5">
                          <button
                            type="button"
                            disabled={cancelled}
                            title={t("detailCancelled")}
                            aria-label={t("detailCancelled")}
                            className="inline-flex size-5 items-center justify-center rounded bg-rose-600 text-white disabled:opacity-30"
                            onClick={() => setOpsStatus(b.id, "cancelled")}
                          >
                            <X className="size-3" />
                          </button>
                        </td>
                        <td className="px-0.5 py-1.5">
                          <button
                            type="button"
                            title={t("editBooking")}
                            aria-label={t("editBooking")}
                            className="inline-flex size-5 items-center justify-center rounded bg-amber-400 text-zinc-900"
                            onClick={() => {
                              openDetail(b.id);
                              setEditing(true);
                            }}
                          >
                            <Pencil className="size-3" />
                          </button>
                        </td>
                        <td className="px-0.5 py-1.5 pr-1.5">
                          <a
                            href={`/booking/voucher/?n=${encodeURIComponent(b.bookingNumber)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={t("scheduleActionPrint")}
                            aria-label={t("scheduleActionPrint")}
                            className="inline-flex size-5 items-center justify-center rounded bg-rose-500 text-white"
                          >
                            <FileText className="size-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>

      <div className="-mx-4 hidden overflow-x-auto border-y border-zinc-300 bg-white sm:mx-0 sm:rounded-lg sm:border sm:shadow-sm lg:block">
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-zinc-500">
            {t("emptyBookings")}
          </p>
        ) : (
          <table className="w-max min-w-full border-collapse text-left text-xs leading-snug">
            <thead>
              <tr className="bg-zinc-100 text-[11px] font-semibold text-zinc-600">
                <th className="sticky left-0 z-20 border-b border-zinc-300 bg-zinc-100 px-2 py-2">
                  {t("colBooking")}
                </th>
                <th className="border-b border-zinc-300 px-2 py-2">{t("scheduleColFrom")}</th>
                <th className="border-b border-zinc-300 px-2 py-2">{t("scheduleColTo")}</th>
                <th className="border-b border-zinc-300 px-2 py-2 whitespace-nowrap">
                  {t("colPickupFull")}
                </th>
                <th className="border-b border-zinc-300 px-2 py-2">{t("scheduleColFlight")}</th>
                <th className="border-b border-zinc-300 px-2 py-2">{t("colCtype")}</th>
                <th className="border-b border-zinc-300 px-2 py-2">{t("colOwRt")}</th>
                <th className="border-b border-zinc-300 px-2 py-2 text-center" title={t("colVdHint")}>
                  {t("colVd")}
                </th>
                <th className="border-b border-zinc-300 px-2 py-2 text-center" title={t("colVcHint")}>
                  {t("colVc")}
                </th>
                <th className="border-b border-zinc-300 px-2 py-2">{t("colStatus")}</th>
                <th className="border-b border-zinc-300 px-2 py-2 text-right">{t("colAmount")}</th>
                <th className="border-b border-zinc-300 px-1 py-2 text-center" colSpan={4}>
                  {t("colActions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, index) => {
                const row = opsRow(b, locale);
                const canConfirm =
                  b.status === "pending" && b.priceStatus !== "pending";
                const cancelled = detailStatusOf(b) === "cancelled";
                return (
                  <tr
                    key={b.id}
                    className={cn(
                      "border-b border-zinc-200",
                      index % 2 === 0 ? "bg-white" : "bg-zinc-50/80"
                    )}
                  >
                    <td className="sticky left-0 z-10 bg-inherit px-2 py-2">
                      <button
                        type="button"
                        className={cn(
                          "max-w-[9rem] truncate text-left font-semibold underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-900",
                          b.type === "round-trip" ? "text-rose-600" : "text-sky-700"
                        )}
                        onClick={() => openDetail(b.id)}
                      >
                        {b.bookingNumber}
                      </button>
                    </td>
                    <td className="max-w-[8rem] truncate px-2 py-2 text-zinc-800">{row.from}</td>
                    <td
                      className={cn(
                        "max-w-[8rem] truncate px-2 py-2 font-medium",
                        row.toIsAirport ? "text-rose-600" : "text-zinc-800"
                      )}
                    >
                      {row.to}
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 tabular-nums text-zinc-800">
                      {row.whenFull}
                    </td>
                    <td className="max-w-[5rem] truncate px-2 py-2 text-zinc-700">{row.flight}</td>
                    <td className="px-2 py-2 font-semibold text-zinc-800">{row.ctype}</td>
                    <td className="px-2 py-2 font-semibold text-zinc-800">{row.trip}</td>
                    <td className="px-2 py-2 text-center font-semibold text-amber-600 tabular-nums">
                      {row.vd}
                    </td>
                    <td className="px-2 py-2 text-center font-semibold text-rose-600 tabular-nums">
                      {row.vc}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={cn(
                          "inline-flex max-w-full items-center gap-1 truncate rounded-full px-1.5 py-0.5 text-[11px] font-medium ring-1",
                          STATUS_STYLE[detailStatusOf(b)].trigger
                        )}
                      >
                        {statusLabel(detailStatusOf(b))}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-right font-semibold tabular-nums text-zinc-950">
                      {money(b.totalPrice)}
                    </td>
                    <td className="px-0.5 py-2">
                      <button
                        type="button"
                        disabled={!canConfirm || cancelled}
                        title={t("approveBooking")}
                        aria-label={t("approveBooking")}
                        className="inline-flex size-6 items-center justify-center rounded bg-emerald-600 text-white disabled:opacity-30"
                        onClick={() => approveBooking(b)}
                      >
                        <Check className="size-3.5" />
                      </button>
                    </td>
                    <td className="px-0.5 py-2">
                      <button
                        type="button"
                        disabled={cancelled}
                        title={t("detailCancelled")}
                        aria-label={t("detailCancelled")}
                        className="inline-flex size-6 items-center justify-center rounded bg-rose-600 text-white disabled:opacity-30"
                        onClick={() => setOpsStatus(b.id, "cancelled")}
                      >
                        <X className="size-3.5" />
                      </button>
                    </td>
                    <td className="px-0.5 py-2">
                      <button
                        type="button"
                        title={t("editBooking")}
                        aria-label={t("editBooking")}
                        className="inline-flex size-6 items-center justify-center rounded bg-amber-400 text-zinc-900"
                        onClick={() => {
                          openDetail(b.id);
                          setEditing(true);
                        }}
                      >
                        <Pencil className="size-3.5" />
                      </button>
                    </td>
                    <td className="px-0.5 py-2 pr-2">
                      <a
                        href={`/booking/voucher/?n=${encodeURIComponent(b.bookingNumber)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={t("scheduleActionPrint")}
                        aria-label={t("scheduleActionPrint")}
                        className="inline-flex size-6 items-center justify-center rounded bg-rose-500 text-white"
                      >
                        <FileText className="size-3.5" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <Dialog
        open={(detailOpen || !!deepLinkId) && !!selected}
        onOpenChange={(open) => {
          if (open) setDetailOpen(true);
          else closeDetail();
        }}
      >
        <DialogContent className="max-h-[min(88vh,640px)] w-full gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-xl ring-1 ring-zinc-200/80 sm:max-w-lg">
          {selected && (
            <div className="flex max-h-[min(88vh,640px)] flex-col bg-white">
              <DialogHeader className="shrink-0 border-b border-zinc-100 px-5 py-4 pr-12 text-left">
                <DialogTitle className="font-mono text-lg font-semibold text-zinc-950">
                  #{selected.bookingNumber}
                </DialogTitle>
                <DialogDescription
                  className={cn(
                    "text-sm",
                    selected.status === "pending"
                      ? "text-amber-700"
                      : "text-emerald-700"
                  )}
                >
                  {statusLabel(detailStatusOf(selected))}
                </DialogDescription>
                <div className="mt-2 flex flex-wrap gap-2">
                  {!editing ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit gap-1.5"
                      onClick={() => setEditing(true)}
                    >
                      <Pencil className="size-3.5" />
                      {t("editBooking")}
                    </Button>
                  ) : null}
                  <ButtonLink
                    href={`/booking/voucher/?n=${encodeURIComponent(selected.bookingNumber)}`}
                    target="_blank"
                    variant="outline"
                    size="sm"
                    className="w-fit gap-1.5"
                  >
                    <Printer className="size-3.5" />
                    {t("scheduleActionPrint")}
                  </ButtonLink>
                  {selected.customerPhone?.trim() ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-fit gap-1.5 border-emerald-200 text-emerald-800"
                      onClick={() => {
                        const link = voucherUrl(selected.bookingNumber, "th");
                        const text = [
                          `Krabi Links Taxi`,
                          `สวัสดีค่ะ คุณ${selected.customerName}`,
                          `ลิงก์ใบจอง / e-Voucher: ${selected.bookingNumber}`,
                          link,
                        ].join("\n");
                        window.open(
                          `${whatsappHref(selected.customerPhone)}?text=${encodeURIComponent(text)}`,
                          "_blank",
                          "noopener"
                        );
                        toast.success(t("voucherWhatsappOpened"));
                      }}
                    >
                      <MessageCircle className="size-3.5" />
                      {t("sendVoucherWhatsapp")}
                    </Button>
                  ) : null}
                </div>
              </DialogHeader>
              {!editing &&
              selected.status === "pending" &&
              selected.priceStatus !== "pending" ? (
                <div className="shrink-0 space-y-2 border-b border-amber-100 bg-amber-50 px-5 py-3">
                  <p className="text-xs leading-relaxed text-amber-900">
                    {t("approveHint")}
                  </p>
                  <Button
                    type="button"
                    className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={() => approveBooking(selected)}
                  >
                    <Check className="size-4" />
                    {t("approveBooking")}
                  </Button>
                </div>
              ) : null}
              {editing ? (
                <div className="overflow-y-auto px-5 py-4">
                  <BookingEditForm
                    key={selected.id}
                    booking={selected}
                    onDone={() => setEditing(false)}
                  />
                </div>
              ) : (
              <div className="overflow-y-auto px-5 py-3">
                <table className="w-full text-sm">
                  <tbody>
                    {detailRows(selected).map((row) => (
                      <tr key={row.label} className="border-b border-zinc-100">
                        <th className="w-28 py-2.5 pr-3 text-left align-top text-xs font-medium text-zinc-500">
                          {row.label}
                        </th>
                        <td className="py-2.5 whitespace-pre-line text-zinc-950">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selected.payment?.transferProof ? (
                  <div className="pt-4">
                    <p className="mb-1.5 text-xs font-medium text-zinc-500">
                      {t("transferProof")}
                    </p>
                    <TransferProofPreview
                      proof={selected.payment.transferProof}
                    />
                  </div>
                ) : null}
              </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
