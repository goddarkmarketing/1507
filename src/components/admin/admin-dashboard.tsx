"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Banknote,
  CalendarDays,
  ClipboardList,
  Search,
  UserCheck,
  Users,
  WalletCards,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAdminStore } from "@/lib/admin/store";
import type { OpsStatus } from "@/lib/admin/types";
import {
  bookingCollectedAmount,
  bookingDisplayAmount,
} from "@/lib/admin/booking-money";
import { money, OPS_STATUSES, OpsBadge, useRouteLabel } from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type StatTone = "amber" | "rose" | "sky" | "violet" | "emerald" | "gold";

const toneClass: Record<
  StatTone,
  { card: string; icon: string; value: string }
> = {
  amber: {
    card: "border-amber-200/80 bg-gradient-to-br from-amber-50 to-white",
    icon: "bg-amber-100 text-amber-800 ring-amber-200",
    value: "text-amber-950",
  },
  rose: {
    card: "border-rose-200/80 bg-gradient-to-br from-rose-50 to-white",
    icon: "bg-rose-100 text-rose-800 ring-rose-200",
    value: "text-rose-950",
  },
  sky: {
    card: "border-sky-200/80 bg-gradient-to-br from-sky-50 to-white",
    icon: "bg-sky-100 text-sky-800 ring-sky-200",
    value: "text-sky-950",
  },
  violet: {
    card: "border-violet-200/80 bg-gradient-to-br from-violet-50 to-white",
    icon: "bg-violet-100 text-violet-800 ring-violet-200",
    value: "text-violet-950",
  },
  emerald: {
    card: "border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-white",
    icon: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    value: "text-emerald-950",
  },
  gold: {
    card: "border-yellow-200/80 bg-gradient-to-br from-yellow-50 to-white",
    icon: "bg-yellow-100 text-yellow-900 ring-yellow-200",
    value: "text-yellow-950",
  },
};

export function AdminDashboard() {
  const t = useTranslations("Admin");
  const bookings = useAdminStore((s) => s.bookings);
  const drivers = useAdminStore((s) => s.drivers);
  const routeLabel = useRouteLabel();

  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<OpsStatus | "all">("all");

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const open = bookings.filter(
      (b) => !["completed", "cancelled"].includes(b.opsStatus)
    );
    const payReview = bookings.filter((b) => b.opsStatus === "payment_review");
    const todayJobs = bookings.filter((b) =>
      b.legs.some((l) => l.date === today)
    );
    const assigned = bookings.filter((b) =>
      ["assigned", "in_progress"].includes(b.opsStatus)
    );
    const revenue = bookings
      .filter((b) => b.payment?.status === "paid" && b.status !== "cancelled")
      .reduce((sum, b) => sum + bookingCollectedAmount(b), 0);
    return {
      open: open.length,
      payReview: payReview.length,
      todayJobs: todayJobs.length,
      assigned: assigned.length,
      revenue,
      activeDrivers: drivers.filter((d) => d.active).length,
    };
  }, [bookings, drivers]);

  const filteredRecent = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...bookings]
      .sort((a, b) => {
        const ta = Date.parse(a.createdAt || a.updatedAt || "") || 0;
        const tb = Date.parse(b.createdAt || b.updatedAt || "") || 0;
        return tb - ta;
      })
      .filter((b) => {
        if (statusFilter !== "all" && b.opsStatus !== statusFilter) return false;
        if (dateFilter) {
          const hitDate = b.legs.some((l) => l.date === dateFilter);
          const createdDay = b.createdAt?.slice(0, 10) === dateFilter;
          if (!hitDate && !createdDay) return false;
        }
        if (!q) return true;
        return (
          b.bookingNumber.toLowerCase().includes(q) ||
          b.customerName.toLowerCase().includes(q) ||
          b.customerPhone.replace(/\s/g, "").includes(q.replace(/\s/g, "")) ||
          (b.customerEmail ?? "").toLowerCase().includes(q)
        );
      })
      .slice(0, 10);
  }, [bookings, query, dateFilter, statusFilter]);

  const statItems: {
    key: string;
    label: string;
    value: string;
    tone: StatTone;
    icon: typeof ClipboardList;
    href: string;
  }[] = [
    {
      key: "open",
      label: t("statOpen"),
      value: String(stats.open),
      tone: "amber",
      icon: ClipboardList,
      href: "/admin/bookings",
    },
    {
      key: "pay",
      label: t("statPayReview"),
      value: String(stats.payReview),
      tone: "rose",
      icon: WalletCards,
      href: "/admin/payments",
    },
    {
      key: "today",
      label: t("statToday"),
      value: String(stats.todayJobs),
      tone: "sky",
      icon: CalendarDays,
      href: "/admin/schedule",
    },
    {
      key: "assigned",
      label: t("statAssigned"),
      value: String(stats.assigned),
      tone: "violet",
      icon: UserCheck,
      href: "/admin/bookings",
    },
    {
      key: "drivers",
      label: t("statDrivers"),
      value: String(stats.activeDrivers),
      tone: "emerald",
      icon: Users,
      href: "/admin/drivers",
    },
    {
      key: "revenue",
      label: t("statRevenue"),
      value: money(stats.revenue),
      tone: "gold",
      icon: Banknote,
      href: "/admin/payments",
    },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xl space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[28px]">
            {t("dashboardTitle")}
          </h1>
          <p className="text-sm leading-relaxed text-zinc-500">
            {t("dashboardSubtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        {statItems.map((item) => {
          const tone = toneClass[item.tone];
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "group rounded-2xl border px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-md sm:px-5 sm:py-5",
                tone.card
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-semibold tracking-wide text-zinc-600 sm:text-xs">
                  {item.label}
                </p>
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-xl ring-1 sm:size-9",
                    tone.icon
                  )}
                >
                  <Icon className="size-4" />
                </span>
              </div>
              <p
                className={cn(
                  "mt-3 text-xl font-semibold tracking-tight tabular-nums sm:text-2xl",
                  tone.value
                )}
              >
                {item.value}
              </p>
            </Link>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
        <div className="flex flex-col gap-3 border-b border-zinc-100 px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-[15px] font-semibold text-zinc-950">
                {t("recentBookings")}
              </h2>
              <p className="mt-0.5 text-xs text-zinc-500">
                {t("recentBookingsHint")}
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-amber-800 transition hover:text-amber-950"
            >
              {t("viewAllBookings")} <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchBookings")}
                className="h-10 rounded-xl border-zinc-200 bg-zinc-50/80 pl-9"
              />
            </div>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-10 rounded-xl border-zinc-200 bg-zinc-50/80"
              aria-label={t("filterDate")}
            />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as OpsStatus | "all")
              }
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 text-sm text-zinc-800 outline-none focus:border-zinc-300 focus:ring-2 focus:ring-amber-200/70"
              aria-label={t("filterStatus")}
            >
              <option value="all">{t("filterAll")}</option>
              {OPS_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {t(`ops.${status}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredRecent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-zinc-500 sm:px-6">
            {t("recentEmpty")}
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {filteredRecent.map((b) => {
              const leg = b.legs[0];
              const when = leg
                ? `${leg.date}${leg.time ? ` · ${leg.time}` : ""}`
                : b.createdAt?.slice(0, 16).replace("T", " ") || "—";
              return (
                <li
                  key={b.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-zinc-950">
                        #{b.bookingNumber}
                      </p>
                      <OpsBadge
                        status={b.opsStatus}
                        label={t(`ops.${b.opsStatus}`)}
                      />
                    </div>
                    <p className="truncate text-sm text-zinc-500">
                      {b.customerName}
                      <span className="mx-1.5 text-zinc-300">·</span>
                      {routeLabel(b)}
                    </p>
                    <p className="text-xs tabular-nums text-zinc-400">
                      {t("pickupAt")}: {when}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <p className="min-w-[4.5rem] text-right text-sm font-semibold tabular-nums text-zinc-950">
                      {money(bookingDisplayAmount(b))}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
