"use client";

import { useLocationName } from "@/lib/i18n-labels";
import { getLocation } from "@/lib/data/locations";
import type { AdminBooking, OpsStatus } from "@/lib/admin/types";
import { cn } from "@/lib/utils";

export const OPS_STATUSES: OpsStatus[] = [
  "new",
  "payment_review",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
];

export function opsBadgeClass(status: OpsStatus) {
  switch (status) {
    case "new":
      return "bg-sky-50 text-sky-800 ring-sky-200";
    case "payment_review":
      return "bg-amber-50 text-amber-900 ring-amber-200";
    case "assigned":
      return "bg-violet-50 text-violet-800 ring-violet-200";
    case "in_progress":
      return "bg-blue-50 text-blue-800 ring-blue-200";
    case "completed":
      return "bg-emerald-50 text-emerald-800 ring-emerald-200";
    case "cancelled":
      return "bg-zinc-100 text-zinc-600 ring-zinc-200";
  }
}

export function OpsBadge({
  status,
  label,
}: {
  status: OpsStatus;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
        opsBadgeClass(status)
      )}
    >
      {label}
    </span>
  );
}

export function useRouteLabel() {
  const locName = useLocationName();
  return (booking: AdminBooking) => {
    const leg = booking.legs[0];
    if (!leg) return "—";
    const from = getLocation(leg.fromId);
    const to = getLocation(leg.toId);
    const short = (name: string) => name.split("(")[0].trim();
    return `${short(locName(from) || leg.fromId)} → ${short(locName(to) || leg.toId)}`;
  };
}

export function money(n: number) {
  return `฿${n.toLocaleString("en-US")}`;
}
