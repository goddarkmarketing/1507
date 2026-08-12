"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAdminStore } from "@/lib/admin/store";
import { money, OpsBadge, useRouteLabel } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";

export function AdminDashboard() {
  const t = useTranslations("Admin");
  const bookings = useAdminStore((s) => s.bookings);
  const drivers = useAdminStore((s) => s.drivers);
  const resetDemoData = useAdminStore((s) => s.resetDemoData);
  const routeLabel = useRouteLabel();

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const open = bookings.filter(
      (b) => !["completed", "cancelled"].includes(b.opsStatus)
    );
    const payReview = bookings.filter((b) => b.opsStatus === "payment_review");
    const todayJobs = bookings.filter((b) =>
      b.legs.some((l) => l.date === today)
    );
    const revenue = bookings
      .filter((b) => b.payment?.status === "paid" && b.status !== "cancelled")
      .reduce((sum, b) => sum + b.totalPrice, 0);
    return {
      open: open.length,
      payReview: payReview.length,
      todayJobs: todayJobs.length,
      revenue,
      activeDrivers: drivers.filter((d) => d.active).length,
    };
  }, [bookings, drivers]);

  const recent = bookings.slice(0, 5);

  const statItems = [
    { label: t("statOpen"), value: String(stats.open) },
    { label: t("statPayReview"), value: String(stats.payReview) },
    { label: t("statToday"), value: String(stats.todayJobs) },
    { label: t("statDrivers"), value: String(stats.activeDrivers) },
    { label: t("statRevenue"), value: money(stats.revenue) },
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
        <Button
          variant="outline"
          size="sm"
          className="h-9 shrink-0 rounded-lg border-zinc-200 bg-white"
          onClick={() => resetDemoData()}
        >
          {t("resetDemo")}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200/80 bg-white px-5 py-5"
          >
            <p className="text-xs font-medium tracking-wide text-zinc-500">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums text-zinc-950">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h2 className="text-[15px] font-semibold text-zinc-950">
            {t("recentBookings")}
          </h2>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-800 transition hover:text-amber-950"
          >
            {t("viewAll")} <ArrowRight className="size-3.5" />
          </Link>
        </div>
        <ul className="divide-y divide-zinc-100">
          {recent.map((b) => (
            <li
              key={b.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium text-zinc-950">#{b.bookingNumber}</p>
                <p className="truncate text-sm text-zinc-500">
                  {b.customerName}
                  <span className="mx-1.5 text-zinc-300">·</span>
                  {routeLabel(b)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <OpsBadge
                  status={b.opsStatus}
                  label={t(`ops.${b.opsStatus}`)}
                />
                <p className="min-w-[4.5rem] text-right text-sm font-semibold tabular-nums text-zinc-950">
                  {money(b.totalPrice)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
