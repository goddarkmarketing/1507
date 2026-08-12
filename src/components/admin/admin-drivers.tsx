"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/admin/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminDriversPage() {
  const t = useTranslations("Admin");
  const drivers = useAdminStore((s) => s.drivers);
  const bookings = useAdminStore((s) => s.bookings);
  const toggleDriverActive = useAdminStore((s) => s.toggleDriverActive);

  return (
    <div className="space-y-8">
      <div className="max-w-xl space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[28px]">
          {t("driversTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-500">
          {t("driversSubtitle")}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {drivers.map((d) => {
          const assigned = bookings.filter(
            (b) =>
              b.driverId === d.id &&
              !["completed", "cancelled"].includes(b.opsStatus)
          ).length;
          return (
            <article
              key={d.id}
              className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="font-semibold text-zinc-950">{d.name}</h2>
                  <p className="text-sm text-zinc-500">{d.phone}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
                    d.active
                      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                      : "bg-zinc-100 text-zinc-500 ring-zinc-200"
                  )}
                >
                  {d.active ? t("online") : t("offline")}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                {d.note}
              </p>
              <div className="mt-4 space-y-1 text-xs text-zinc-400">
                <p>
                  {t("vehicles")}: {d.vehicleCodes.join(", ")}
                </p>
                <p>
                  {t("openJobs")}: {assigned}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 h-9 w-fit rounded-lg border-zinc-200"
                onClick={() => {
                  toggleDriverActive(d.id);
                  toast.success(t("toastUpdated"));
                }}
              >
                {d.active ? t("setOffline") : t("setOnline")}
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
