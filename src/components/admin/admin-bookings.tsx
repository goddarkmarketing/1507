"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
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
    return bookings.filter((b) => {
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

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchBookings")}
          className="h-10 rounded-xl border-zinc-200 bg-white sm:max-w-sm"
        />
        <Select
          value={filter}
          onValueChange={(v) => v && setFilter(v as OpsStatus | "all")}
        >
          <SelectTrigger className="h-10 rounded-xl border-zinc-200 bg-white sm:w-48">
            <SelectValue placeholder={t("filterStatus")} />
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
          <SelectTrigger className="h-10 rounded-xl border-zinc-200 bg-white sm:w-44">
            <SelectValue placeholder={t("filterService")} />
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
          <SelectTrigger className="h-10 rounded-xl border-zinc-200 bg-white sm:w-44">
            <SelectValue placeholder={t("filterPayment")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filterAll")}</SelectItem>
            <SelectItem value="bank-transfer">
              {t("settingsMethod.bank-transfer")}
            </SelectItem>
            <SelectItem value="promptpay">
              {t("settingsMethod.promptpay")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/80 text-left text-xs text-zinc-500">
              <tr>
                <th className="px-5 py-3.5 font-medium">{t("colBooking")}</th>
                <th className="px-5 py-3.5 font-medium">{t("colCustomer")}</th>
                <th className="px-5 py-3.5 font-medium">{t("colRoute")}</th>
                <th className="px-5 py-3.5 font-medium">{t("colService")}</th>
                <th className="px-5 py-3.5 font-medium">{t("colWhen")}</th>
                <th className="px-5 py-3.5 font-medium">{t("colStatus")}</th>
                <th className="px-5 py-3.5 font-medium text-right">
                  {t("colAmount")}
                </th>
                <th className="px-5 py-3.5 font-medium text-right">
                  {t("colActions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const leg = b.legs[0];
                return (
                  <tr
                    key={b.id}
                    className="border-t border-zinc-100 transition-colors hover:bg-zinc-50/80"
                  >
                    <td className="px-5 py-4 font-medium text-zinc-950">
                      #{b.bookingNumber}
                    </td>
                    <td className="px-5 py-4 text-zinc-700">{b.customerName}</td>
                    <td className="min-w-[240px] px-5 py-4 text-zinc-500">
                      {routeLabel(b)}
                    </td>
                    <td className="px-5 py-4 text-zinc-600">
                      {b.service === "rental"
                        ? t("serviceRental")
                        : t("serviceTransfer")}
                    </td>
                    <td className="px-5 py-4 text-zinc-500 tabular-nums">
                      {leg ? `${leg.date} ${leg.time}` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <OpsBadge
                        status={b.opsStatus}
                        label={t(`ops.${b.opsStatus}`)}
                      />
                    </td>
                    <td className="px-5 py-4 text-right tabular-nums text-zinc-950">
                      <p className="font-semibold">
                        {money(bookingDisplayAmount(b))}
                      </p>
                      {b.service === "rental" && (
                        <p className="text-xs text-zinc-500">
                          / {money(b.totalPrice)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 rounded-lg border-zinc-200 px-3"
                        onClick={() => openDetail(b.id)}
                      >
                        {t("manageDetail")}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
        <DialogContent className="max-h-[min(90vh,820px)] w-full overflow-y-auto sm:max-w-lg">
          {selected && (
            <div className="space-y-5">
              <DialogHeader>
                <p className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                  {t("detailTitle")}
                </p>
                <DialogTitle className="text-lg font-semibold tracking-tight text-zinc-950">
                  #{selected.bookingNumber}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {t("detailTitle")} #{selected.bookingNumber}
                </DialogDescription>
                <div className="pt-1">
                  <OpsBadge
                    status={selected.opsStatus}
                    label={t(`ops.${selected.opsStatus}`)}
                  />
                </div>
              </DialogHeader>

              <dl className="space-y-4 text-sm">
                <div className="space-y-1">
                  <dt className="text-xs text-zinc-400">{t("colCustomer")}</dt>
                  <dd className="font-medium text-zinc-900">
                    {selected.customerName}
                  </dd>
                  <dd className="text-zinc-500">{selected.customerPhone}</dd>
                  <dd className="text-zinc-500">{selected.customerEmail}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs text-zinc-400">{t("colRoute")}</dt>
                  <dd className="text-zinc-700">{routeLabel(selected)}</dd>
                </div>
                {selected.flightNumber && (
                  <div className="space-y-1">
                    <dt className="text-xs text-zinc-400">{t("flight")}</dt>
                    <dd className="text-zinc-700">{selected.flightNumber}</dd>
                  </div>
                )}
                <div className="space-y-1">
                  <dt className="text-xs text-zinc-400">{t("colService")}</dt>
                  <dd className="text-zinc-700">
                    {selected.service === "rental"
                      ? t("serviceRental")
                      : t("serviceTransfer")}
                  </dd>
                </div>
                {selected.service === "rental" && selected.rentalDays && (
                  <div className="space-y-1">
                    <dt className="text-xs text-zinc-400">{t("rentalDays")}</dt>
                    <dd className="text-zinc-700">
                      {t("rentalDaysValue", { days: selected.rentalDays })}
                    </dd>
                  </div>
                )}
                <div className="space-y-1">
                  <dt className="text-xs text-zinc-400">{t("colAmount")}</dt>
                  <dd className="text-zinc-700">
                    {t("payToday")}: {money(bookingDisplayAmount(selected))}
                    {selected.service === "rental" && (
                      <span className="block text-sm text-zinc-500">
                        {t("estimatedTotal")}: {money(selected.totalPrice)}
                        {selected.balanceDue != null && selected.balanceDue > 0
                          ? ` · ${t("rentalBalanceDue", { amount: money(selected.balanceDue) })}`
                          : ""}
                      </span>
                    )}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-xs text-zinc-400">{t("payment")}</dt>
                  <dd className="text-zinc-700">
                    {selected.payment?.summary ?? "—"}
                    <span className="text-zinc-400">
                      {" "}
                      ({selected.payment?.status ?? "—"})
                    </span>
                  </dd>
                </div>
                <div className="space-y-2">
                  <dt className="text-xs text-zinc-400">{t("transferProof")}</dt>
                  <dd>
                    <TransferProofPreview
                      proof={selected.payment?.transferProof}
                    />
                  </dd>
                </div>
              </dl>

              <div className="space-y-2 border-t border-zinc-100 pt-5">
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
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPS_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`ops.${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
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
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">{t("unassigned")}</SelectItem>
                    {drivers.map((d) => (
                      <SelectItem key={d.id} value={d.id} disabled={!d.active}>
                        {d.name}
                        {!d.active ? ` (${t("offline")})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-500">
                  {t("adminNotes")}
                </label>
                <textarea
                  className="min-h-24 w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-300 focus:ring-2 focus:ring-amber-200/80"
                  defaultValue={selected.adminNotes ?? ""}
                  key={selected.id}
                  onBlur={(e) => {
                    updateBooking(selected.id, {
                      adminNotes: e.target.value,
                    });
                  }}
                />
              </div>

              <Button
                variant="outline"
                className="h-10 w-full rounded-xl border-zinc-200"
                onClick={() => {
                  setOpsStatus(selected.id, "cancelled");
                  toast.message(t("toastCancelled"));
                }}
              >
                {t("cancelBooking")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
