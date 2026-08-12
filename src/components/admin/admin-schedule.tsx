"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAdminStore } from "@/lib/admin/store";
import { OpsBadge, money, useRouteLabel } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";

function shiftDate(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function AdminSchedulePage() {
  const t = useTranslations("Admin");
  const bookings = useAdminStore((s) => s.bookings);
  const drivers = useAdminStore((s) => s.drivers);
  const routeLabel = useRouteLabel();
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));

  const jobs = useMemo(() => {
    return bookings
      .flatMap((b) =>
        b.legs
          .filter((l) => l.date === day)
          .map((leg) => ({ booking: b, leg }))
      )
      .sort((a, b) => a.leg.time.localeCompare(b.leg.time));
  }, [bookings, day]);

  const driverName = (id?: string | null) =>
    drivers.find((d) => d.id === id)?.name ?? t("unassigned");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[28px]">
            {t("scheduleTitle")}
          </h1>
          <p className="text-sm leading-relaxed text-zinc-500">
            {t("scheduleSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-zinc-200 bg-white"
            onClick={() => setDay((d) => shiftDate(d, -1))}
          >
            {t("prevDay")}
          </Button>
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="h-9 rounded-lg border border-zinc-200 bg-white px-3 text-sm"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-zinc-200 bg-white"
            onClick={() => setDay((d) => shiftDate(d, 1))}
          >
            {t("nextDay")}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
        {jobs.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-zinc-500">
            {t("emptySchedule")}
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {jobs.map(({ booking, leg }) => (
              <li
                key={`${booking.id}-${leg.id}`}
                className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex items-start gap-5">
                  <p className="w-14 shrink-0 pt-0.5 text-lg font-semibold tabular-nums text-amber-800">
                    {leg.time}
                  </p>
                  <div className="space-y-1">
                    <p className="font-medium text-zinc-950">
                      #{booking.bookingNumber}
                      <span className="mx-1.5 text-zinc-300">·</span>
                      {booking.customerName}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {routeLabel(booking)}
                      <span className="mx-1.5 text-zinc-300">·</span>
                      {leg.vehicleCode}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {t("driver")}: {driverName(booking.driverId)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                  <OpsBadge
                    status={booking.opsStatus}
                    label={t(`ops.${booking.opsStatus}`)}
                  />
                  <p className="text-sm font-semibold tabular-nums text-zinc-950">
                    {money(leg.price)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
