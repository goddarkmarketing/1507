"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CalendarDays, User, MapPin, Wallet, Landmark, Settings2 } from "lucide-react";
import { useAdminStore } from "@/lib/admin/store";
import {
  money,
  OpsBadge,
  OPS_STATUSES,
  useRouteLabel,
} from "@/components/admin/admin-ui";
import { bookingDisplayAmount } from "@/lib/admin/booking-money";
import { TransferProofPreview } from "@/components/admin/transfer-proof-preview";
import type { OpsStatus } from "@/lib/admin/types";
import type { BookingService } from "@/lib/booking/booking-mode";
import type { PaymentMethod } from "@/lib/types";
import { Button } from "@/components/ui/button";
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

export function AdminBookingsPage() {
  const t = useTranslations("Admin");
  const bookings = useAdminStore((s) => s.bookings);
  const drivers = useAdminStore((s) => s.drivers);
  const assignDriver = useAdminStore((s) => s.assignDriver);
  const setOpsStatus = useAdminStore((s) => s.setOpsStatus);
  const updateBooking = useAdminStore((s) => s.updateBooking);
  const routeLabel = useRouteLabel();

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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...bookings]
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

  const selected = selectedId
    ? (bookings.find((b) => b.id === selectedId) ?? null)
    : null;

  const openDetail = (id: string) => {
    setSelectedId(id);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="max-w-xl space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[28px]">
          {t("bookingsTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-500">
          {t("bookingsSubtitle")}
        </p>
      </div>

      <div className="flex h-10 w-full flex-nowrap items-stretch gap-2.5 overflow-x-auto">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchBookings")}
          className="h-10 min-h-10 min-w-[14rem] flex-[1.6] rounded-xl border-zinc-200 bg-white shadow-none"
        />
        <Select
          value={filter}
          onValueChange={(v) => v && setFilter(v as OpsStatus | "all")}
        >
          <SelectTrigger
            size="default"
            className="h-10 min-h-10 w-auto min-w-[9.5rem] flex-1 rounded-xl border-zinc-200 bg-white data-[size=default]:h-10"
          >
            <SelectValue placeholder={t("filterStatus")}>
              {filter === "all" ? t("filterAll") : t(`ops.${filter}`)}
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
            className="h-10 min-h-10 w-auto min-w-[9.5rem] flex-1 rounded-xl border-zinc-200 bg-white data-[size=default]:h-10"
          >
            <SelectValue placeholder={t("filterService")}>
              {serviceFilter === "all"
                ? t("filterAll")
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
            className="h-10 min-h-10 w-auto min-w-[9.5rem] flex-1 rounded-xl border-zinc-200 bg-white data-[size=default]:h-10"
          >
            <SelectValue placeholder={t("filterPayment")}>
              {paymentFilter === "all"
                ? t("filterAll")
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

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
        <table className="w-full table-fixed text-sm">
          <thead className="border-b border-zinc-100 bg-zinc-50/80 text-left text-[11px] tracking-wide text-zinc-500 uppercase">
            <tr>
              <th className="w-[14%] px-3 py-3 font-medium sm:px-4">
                {t("colBooking")}
              </th>
              <th className="w-[8%] px-2 py-3 text-center font-medium">
                {t("colActions")}
              </th>
              <th className="w-[22%] px-3 py-3 font-medium sm:px-4">
                {t("colRoute")}
              </th>
              <th className="w-[12%] px-3 py-3 font-medium sm:px-4">
                {t("colService")}
              </th>
              <th className="w-[16%] px-3 py-3 font-medium sm:px-4">
                {t("colWhen")}
              </th>
              <th className="w-[16%] px-3 py-3 font-medium sm:px-4">
                {t("colStatus")}
              </th>
              <th className="w-[12%] px-3 py-3 text-right font-medium sm:px-4">
                {t("colAmount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const leg = b.legs[0];
              return (
                <tr
                  key={b.id}
                  className="h-11 border-t border-zinc-100 transition-colors hover:bg-zinc-50/80"
                >
                  <td className="truncate px-3 py-2 font-medium whitespace-nowrap text-zinc-950 sm:px-4">
                    #{b.bookingNumber}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                      onClick={() => openDetail(b.id)}
                      aria-label={t("manageDetail")}
                      title={t("manageDetail")}
                    >
                      <Settings2 className="size-4" />
                    </Button>
                  </td>
                  <td
                    className="truncate px-3 py-2 whitespace-nowrap text-zinc-500 sm:px-4"
                    title={routeLabel(b)}
                  >
                    {routeLabel(b)}
                  </td>
                  <td className="truncate px-3 py-2 whitespace-nowrap text-zinc-600 sm:px-4">
                    {b.service === "rental"
                      ? t("serviceRental")
                      : t("serviceTransfer")}
                  </td>
                  <td className="truncate px-3 py-2 whitespace-nowrap tabular-nums text-zinc-500 sm:px-4">
                    {leg ? `${leg.date} ${leg.time}` : "—"}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap sm:px-4">
                    <OpsBadge
                      status={b.opsStatus}
                      label={t(`ops.${b.opsStatus}`)}
                    />
                  </td>
                  <td className="px-3 py-2 text-right font-semibold whitespace-nowrap tabular-nums text-zinc-950 sm:px-4">
                    {money(bookingDisplayAmount(b))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="px-5 py-12 text-center text-sm text-zinc-500">
            {t("emptyBookings")}
          </p>
        )}
      </div>

      <Dialog
        open={detailOpen && !!selected}
        onOpenChange={(open) => {
          setDetailOpen(open);
          if (!open) setSelectedId(null);
        }}
      >
        <DialogContent className="max-h-[min(88vh,560px)] w-full gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-xl shadow-zinc-900/10 ring-1 ring-zinc-200/80 sm:max-w-[720px]">
          {selected && (
            <div className="flex max-h-[min(88vh,560px)] flex-col bg-white">
              <DialogHeader className="shrink-0 border-b border-zinc-100 px-5 py-3.5 pr-12 text-left">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <CalendarDays className="size-4" />
                  </span>
                  <DialogTitle className="font-mono text-lg font-semibold tracking-tight text-zinc-950">
                    #{selected.bookingNumber}
                  </DialogTitle>
                  <OpsBadge
                    status={selected.opsStatus}
                    label={t(`ops.${selected.opsStatus}`)}
                  />
                  <span
                    aria-hidden
                    className="hidden h-4 w-px bg-zinc-200 sm:block"
                  />
                  <span className="text-sm text-zinc-500">
                    {selected.service === "rental"
                      ? t("serviceRental")
                      : t("serviceTransfer")}
                    {selected.legs[0]
                      ? ` · ${selected.legs[0].date} ${selected.legs[0].time}`
                      : ""}
                  </span>
                </div>
                <DialogDescription className="sr-only">
                  {t("detailTitle")} #{selected.bookingNumber}
                </DialogDescription>
              </DialogHeader>

              <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[1.2fr_0.9fr]">
                <div className="overflow-y-auto px-5 py-4">
                  <div className="space-y-0 divide-y divide-zinc-100">
                    <div className="flex gap-3 pb-4">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                        <User className="size-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-zinc-400">
                          {t("colCustomer")}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-zinc-950">
                          {selected.customerName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-zinc-500">
                          {selected.customerPhone}
                          <span className="text-zinc-300"> · </span>
                          {selected.customerEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 py-4">
                      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <MapPin className="size-3.5" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-zinc-400">
                          {t("colRoute")}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold leading-snug text-zinc-950">
                          {routeLabel(selected)}
                        </p>
                        {selected.flightNumber && (
                          <p className="mt-1 text-xs text-zinc-500">
                            {t("flight")}: {selected.flightNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-4">
                      <div className="rounded-xl bg-violet-50/80 p-3">
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                            <Wallet className="size-3.5" />
                          </span>
                          <p className="text-[11px] font-medium text-zinc-500">
                            {t("colAmount")}
                          </p>
                        </div>
                        <p className="mt-2 text-xl font-semibold tabular-nums tracking-tight text-zinc-950">
                          {money(bookingDisplayAmount(selected))}
                        </p>
                        {selected.service === "rental" &&
                          selected.balanceDue != null &&
                          selected.balanceDue > 0 && (
                            <p className="mt-1 text-[11px] text-zinc-500">
                              {t("rentalBalanceDue", {
                                amount: money(selected.balanceDue),
                              })}
                            </p>
                          )}
                      </div>

                      <div className="rounded-xl bg-orange-50/80 p-3">
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                            <Landmark className="size-3.5" />
                          </span>
                          <p className="text-[11px] font-medium text-zinc-500">
                            {t("payment")}
                          </p>
                        </div>
                        <p className="mt-2 line-clamp-2 text-xs font-medium leading-snug text-zinc-800">
                          {selected.payment?.summary ?? "—"}
                        </p>
                        {selected.payment?.status && (
                          <span
                            className={cn(
                              "mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1",
                              selected.payment.status === "paid"
                                ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                                : "bg-amber-50 text-amber-900 ring-amber-200"
                            )}
                          >
                            {selected.payment.status === "paid"
                              ? t("paymentPaid")
                              : t("paymentAwaiting")}
                          </span>
                        )}
                      </div>
                    </div>

                    {selected.payment?.transferProof && (
                      <div className="pt-4">
                        <p className="mb-1.5 text-[11px] font-medium text-zinc-400">
                          {t("transferProof")}
                        </p>
                        <TransferProofPreview
                          proof={selected.payment.transferProof}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-zinc-100 bg-[#fafafa] px-5 py-4 md:border-t-0 md:border-l">
                  <div className="flex items-center gap-2">
                    <Settings2 className="size-3.5 text-zinc-400" />
                    <p className="text-sm font-semibold text-zinc-800">
                      {t("managePanel")}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500">
                      {t("opsStatus")}
                    </label>
                    <Select
                      value={selected.opsStatus}
                      onValueChange={(v) => {
                        if (!v) return;
                        setOpsStatus(selected.id, v as OpsStatus);
                        toast.success(t("toastUpdated"));
                      }}
                    >
                      <SelectTrigger className="h-10 w-full cursor-pointer rounded-xl border-zinc-200 bg-white px-3 shadow-none hover:bg-white">
                        <SelectValue>
                          <OpsBadge
                            status={selected.opsStatus}
                            label={t(`ops.${selected.opsStatus}`)}
                          />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-72">
                        {OPS_STATUSES.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="cursor-pointer"
                          >
                            <OpsBadge status={s} label={t(`ops.${s}`)} />
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-500">
                      {t("assignDriver")}
                    </label>
                    <Select
                      value={selected.driverId ?? "none"}
                      onValueChange={(v) => {
                        if (!v) return;
                        assignDriver(selected.id, v === "none" ? null : v);
                        toast.success(t("toastUpdated"));
                      }}
                    >
                      <SelectTrigger className="h-10 w-full cursor-pointer rounded-xl border-zinc-200 bg-white px-3 shadow-none hover:bg-white">
                        <SelectValue>
                          {selected.driverId
                            ? (drivers.find((d) => d.id === selected.driverId)
                                ?.name ?? t("unassigned"))
                            : t("unassigned")}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="cursor-pointer">
                          {t("unassigned")}
                        </SelectItem>
                        {drivers.map((d) => (
                          <SelectItem
                            key={d.id}
                            value={d.id}
                            disabled={!d.active}
                            className="cursor-pointer"
                          >
                            {d.name}
                            {!d.active ? ` (${t("offline")})` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col space-y-1">
                    <label className="text-xs font-medium text-zinc-500">
                      {t("adminNotes")}
                    </label>
                    <textarea
                      className="min-h-[72px] w-full flex-1 cursor-text resize-none rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-2 focus:ring-sky-100"
                      defaultValue={selected.adminNotes ?? ""}
                      key={selected.id}
                      placeholder={t("adminNotesHint")}
                      onBlur={(e) => {
                        updateBooking(selected.id, {
                          adminNotes: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <Button
                    variant="outline"
                    className="mt-1 h-10 w-full cursor-pointer rounded-xl border-rose-200 bg-white font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => {
                      setOpsStatus(selected.id, "cancelled");
                      toast.message(t("toastCancelled"));
                    }}
                  >
                    {t("cancelBooking")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
