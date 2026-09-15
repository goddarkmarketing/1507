"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Pencil, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAdminStore } from "@/lib/admin/store";
import { getLocation } from "@/lib/data/locations";
import { locationShortName } from "@/lib/i18n-labels";
import { OpsBadge } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BookingType, VehicleCode } from "@/lib/types";

function shiftDate(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function tripCode(type: BookingType | undefined | null) {
  if (type === "round-trip") return "RT";
  if (type === "one-way") return "OW";
  if (!type) return "—";
  return type.slice(0, 2).toUpperCase();
}

function vehicleShort(code: VehicleCode) {
  const map: Partial<Record<VehicleCode, string>> = {
    ECO: "Eco",
    PREM: "Lux",
    SUV: "SUV",
    VAN: "Van",
    EXE: "VIP",
    VIP: "Alp",
    SIG: "Sig",
    BUS: "Bus",
  };
  return map[code] ?? code;
}

function isScheduleDemoBooking(id: string, bookingNumber: string) {
  return (
    id.startsWith("sched-demo-") || bookingNumber.startsWith("KLT-DEMO-")
  );
}

export function AdminSchedulePage() {
  const t = useTranslations("Admin");
  const locale = useLocale();
  const bookings = useAdminStore((s) => s.bookings);
  const drivers = useAdminStore((s) => s.drivers);
  const [day, setDay] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const current = useAdminStore.getState().bookings;
    const cleaned = current.filter(
      (b) => !isScheduleDemoBooking(b.id, b.bookingNumber)
    );
    if (cleaned.length !== current.length) {
      useAdminStore.setState({ bookings: cleaned });
    }
  }, []);

  const short = (id: string) =>
    locationShortName(getLocation(id), locale) || id;

  const jobs = useMemo(() => {
    return bookings
      .filter((b) => !isScheduleDemoBooking(b.id, b.bookingNumber))
      .flatMap((b) =>
        (b.legs ?? [])
          .filter((l) => l.date === day)
          .map((leg) => ({ booking: b, leg }))
      )
      .sort((a, b) => a.leg.time.localeCompare(b.leg.time));
  }, [bookings, day]);

  const driverName = (id?: string | null) => {
    if (!id) return "—";
    const d = drivers.find((x) => x.id === id);
    return d ? d.name.split(" ")[0] : "—";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl">
            {t("scheduleTitle")}
          </h1>
          <p className="text-xs leading-relaxed text-zinc-500 sm:text-sm">
            {t("scheduleSubtitle")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-md border-zinc-200 bg-white px-2.5 text-xs"
            onClick={() => setDay((d) => shiftDate(d, -1))}
          >
            {t("prevDay")}
          </Button>
          <input
            type="date"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs"
          />
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-md border-zinc-200 bg-white px-2.5 text-xs"
            onClick={() => setDay((d) => shiftDate(d, 1))}
          >
            {t("nextDay")}
          </Button>
        </div>
      </div>

      <div className="-mx-4 overflow-hidden border-y border-zinc-300 bg-white sm:mx-0 sm:rounded-lg sm:border sm:shadow-sm">
        {jobs.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-zinc-500">
            {t("emptySchedule")}
          </p>
        ) : (
          <div className="w-full">
            <table className="w-full table-fixed border-collapse text-left text-[8px] leading-[1.15] sm:text-[11px]">
              <thead>
                <tr className="bg-zinc-100 text-[7px] font-semibold tracking-wide text-zinc-600 uppercase sm:text-[10px]">
                  <th className="w-[14%] border-b border-zinc-300 px-0.5 py-1">
                    {t("scheduleColOrder")}
                  </th>
                  <th className="w-[13%] border-b border-zinc-300 px-0.5 py-1">
                    {t("scheduleColFrom")}
                  </th>
                  <th className="w-[13%] border-b border-zinc-300 px-0.5 py-1">
                    {t("scheduleColTo")}
                  </th>
                  <th className="w-[12%] border-b border-zinc-300 px-0.5 py-1">
                    {t("scheduleColPickup")}
                  </th>
                  <th className="w-[8%] border-b border-zinc-300 px-0.5 py-1">
                    {t("scheduleColFlight")}
                  </th>
                  <th className="w-[7%] border-b border-zinc-300 px-0.5 py-1">
                    {t("scheduleColCar")}
                  </th>
                  <th className="w-[6%] border-b border-zinc-300 px-0.5 py-1">
                    {t("scheduleColTrip")}
                  </th>
                  <th className="w-[9%] border-b border-zinc-300 px-0.5 py-1">
                    {t("scheduleColDriver")}
                  </th>
                  <th className="w-[10%] border-b border-zinc-300 px-0.5 py-1">
                    {t("scheduleColStatus")}
                  </th>
                  <th className="w-[8%] border-b border-zinc-300 px-0.5 py-1 text-center">
                    ·
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(({ booking, leg }, index) => {
                  const toIsAirport =
                    getLocation(leg.toId)?.type === "airport";
                  const when = `${leg.date.slice(8, 10)}/${leg.date.slice(5, 7)} ${leg.time}`;
                  return (
                    <tr
                      key={`${booking.id}-${leg.id}`}
                      className={cn(
                        "border-b border-zinc-200",
                        index % 2 === 0 ? "bg-white" : "bg-zinc-50/80"
                      )}
                    >
                      <td
                        className={cn(
                          "truncate px-0.5 py-0.5 font-semibold",
                          booking.type === "round-trip"
                            ? "text-rose-600"
                            : "text-zinc-900"
                        )}
                      >
                        {booking.bookingNumber}
                      </td>
                      <td className="truncate px-0.5 py-0.5 text-zinc-800">
                        {short(leg.fromId)}
                      </td>
                      <td
                        className={cn(
                          "truncate px-0.5 py-0.5 font-medium",
                          toIsAirport ? "text-rose-600" : "text-zinc-800"
                        )}
                      >
                        {short(leg.toId)}
                      </td>
                      <td className="truncate px-0.5 py-0.5 text-zinc-800 tabular-nums">
                        {when}
                      </td>
                      <td className="truncate px-0.5 py-0.5 text-zinc-700">
                        {booking.flightNumber || "—"}
                      </td>
                      <td className="truncate px-0.5 py-0.5 font-medium text-zinc-800">
                        {vehicleShort(leg.vehicleCode)}
                      </td>
                      <td className="px-0.5 py-0.5 font-semibold text-zinc-800">
                        {tripCode(booking.type)}
                      </td>
                      <td className="truncate px-0.5 py-0.5 text-zinc-700">
                        {driverName(booking.driverId)}
                      </td>
                      <td className="truncate px-0.5 py-0.5">
                        <OpsBadge
                          status={booking.opsStatus}
                          label={t(`ops.${booking.opsStatus}`)}
                          compact
                        />
                      </td>
                      <td className="px-0.5 py-0.5">
                        <div className="flex items-center justify-center gap-0.5">
                          <Link
                            href="/admin/bookings"
                            className="inline-flex size-4 items-center justify-center rounded bg-emerald-600 text-white sm:size-6"
                            title={t("scheduleActionOk")}
                          >
                            <Check className="size-2.5 sm:size-3.5" />
                          </Link>
                          <Link
                            href="/admin/bookings"
                            className="inline-flex size-4 items-center justify-center rounded bg-amber-500 text-white sm:size-6"
                            title={t("scheduleActionEdit")}
                          >
                            <Pencil className="size-2.5 sm:size-3.5" />
                          </Link>
                          <button
                            type="button"
                            className="inline-flex size-4 items-center justify-center rounded bg-rose-600 text-white sm:size-6"
                            title={t("scheduleActionCancel")}
                            onClick={() =>
                              useAdminStore
                                .getState()
                                .setOpsStatus(booking.id, "cancelled")
                            }
                          >
                            <Trash2 className="size-2.5 sm:size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-[11px] text-zinc-400">{t("scheduleHint")}</p>
    </div>
  );
}
