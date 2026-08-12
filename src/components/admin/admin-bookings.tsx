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
import type { OpsStatus } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const statusOk = filter === "all" || b.opsStatus === filter;
      const textOk =
        !q ||
        b.bookingNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.toLowerCase().includes(q) ||
        b.customerEmail.toLowerCase().includes(q);
      return statusOk && textOk;
    });
  }, [bookings, query, filter]);

  const selected =
    bookings.find((b) => b.id === selectedId) ?? filtered[0] ?? null;

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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
          <SelectTrigger className="h-10 rounded-xl border-zinc-200 bg-white sm:w-52">
            <SelectValue />
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
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="border-b border-zinc-100 bg-zinc-50/80 text-left text-xs text-zinc-500">
                <tr>
                  <th className="px-5 py-3.5 font-medium">{t("colBooking")}</th>
                  <th className="px-5 py-3.5 font-medium">{t("colCustomer")}</th>
                  <th className="px-5 py-3.5 font-medium">{t("colRoute")}</th>
                  <th className="px-5 py-3.5 font-medium">{t("colWhen")}</th>
                  <th className="px-5 py-3.5 font-medium">{t("colStatus")}</th>
                  <th className="px-5 py-3.5 font-medium text-right">
                    {t("colAmount")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const leg = b.legs[0];
                  const active = selected?.id === b.id;
                  return (
                    <tr
                      key={b.id}
                      className={cn(
                        "cursor-pointer border-t border-zinc-100 transition-colors",
                        active ? "bg-amber-50/60" : "hover:bg-zinc-50/80"
                      )}
                      onClick={() => setSelectedId(b.id)}
                    >
                      <td className="px-5 py-4 font-medium text-zinc-950">
                        #{b.bookingNumber}
                      </td>
                      <td className="px-5 py-4 text-zinc-700">
                        {b.customerName}
                      </td>
                      <td className="max-w-[200px] truncate px-5 py-4 text-zinc-500">
                        {routeLabel(b)}
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
                      <td className="px-5 py-4 text-right font-semibold tabular-nums text-zinc-950">
                        {money(b.totalPrice)}
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

        <aside className="h-fit rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 xl:sticky xl:top-24">
          {selected ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold tracking-wide text-zinc-400 uppercase">
                  {t("detailTitle")}
                </p>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                  #{selected.bookingNumber}
                </h2>
                <OpsBadge
                  status={selected.opsStatus}
                  label={t(`ops.${selected.opsStatus}`)}
                />
              </div>
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
                  <dt className="text-xs text-zinc-400">{t("payment")}</dt>
                  <dd className="text-zinc-700">
                    {selected.payment?.summary ?? "—"}
                    <span className="text-zinc-400">
                      {" "}
                      ({selected.payment?.status ?? "—"})
                    </span>
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
          ) : (
            <p className="py-8 text-center text-sm text-zinc-500">
              {t("selectBooking")}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
