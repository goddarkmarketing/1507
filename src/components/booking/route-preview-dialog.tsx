"use client";

import {
  ArrowRight,
  Car,
  Clock,
  MapPin,
  Navigation,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { calculatePrice } from "@/lib/data/pricing";
import { getLocation } from "@/lib/data/locations";
import { useLocationName, useVehicleCopy } from "@/lib/i18n-labels";
import { cn } from "@/lib/utils";
import type { VehicleCode } from "@/lib/types";

type RoutePreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromId: string;
  toId: string;
  vehicleCode: VehicleCode;
};

export function RoutePreviewDialog({
  open,
  onOpenChange,
  fromId,
  toId,
  vehicleCode,
}: RoutePreviewDialogProps) {
  const t = useTranslations("Booking");
  const locName = useLocationName();
  const { name: vehicleName } = useVehicleCopy();

  const from = getLocation(fromId);
  const to = getLocation(toId);
  if (!from || !to) return null;

  const quote = calculatePrice(fromId, toId, vehicleCode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl ring-1 ring-black/5 sm:max-w-[420px] data-open:duration-300 [&_[data-slot=dialog-close]]:top-3.5 [&_[data-slot=dialog-close]]:right-3.5 [&_[data-slot=dialog-close]]:size-8 [&_[data-slot=dialog-close]]:rounded-full [&_[data-slot=dialog-close]]:bg-white/20 [&_[data-slot=dialog-close]]:text-primary-foreground [&_[data-slot=dialog-close]]:backdrop-blur-sm [&_[data-slot=dialog-close]]:hover:bg-white/30">
        {/* Hero header */}
        <div className="relative overflow-hidden bg-gold-gradient px-6 pb-14 pt-6">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
          >
            <div className="absolute -right-6 -top-10 size-36 rounded-full bg-white/50 blur-2xl" />
            <div className="absolute -bottom-16 -left-10 size-44 rounded-full bg-white/40 blur-3xl" />
            <svg
              className="absolute inset-0 size-full text-primary-foreground/10"
              viewBox="0 0 400 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0 80 Q100 20 200 60 T400 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="6 8"
              />
            </svg>
          </div>

          <DialogHeader className="relative z-10 gap-2 text-left">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary-foreground backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              {t("routePreviewTravel")}
            </span>
            <DialogTitle className="text-xl font-bold leading-tight tracking-tight text-primary-foreground">
              {t("routePreviewTitle")}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-primary-foreground/80">
              {t("routePreviewSubtitle")}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Route timeline card */}
        <div className="relative z-10 -mt-9 px-5">
          <div className="animate-in fade-in-0 slide-in-from-bottom-3 rounded-2xl border border-border/60 bg-card p-4 shadow-lg shadow-black/[0.06] duration-500">
            <div className="relative">
              <div
                aria-hidden
                className="absolute bottom-6 left-[17px] top-6 w-0.5 bg-gradient-to-b from-sky-400 via-border to-amber-500"
              />

              <div className="relative flex gap-3.5 pb-4">
                <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-md shadow-sky-500/35 ring-4 ring-card">
                  <MapPin className="size-4" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {t("pickup")}
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold leading-snug">
                    {locName(from)}
                  </p>
                </div>
              </div>

              <div className="relative flex items-center py-1 pl-[5px]">
                <div className="relative z-10 flex size-8 items-center justify-center rounded-full border border-border/80 bg-muted/80 shadow-sm ring-4 ring-card">
                  <Car className="size-3.5 text-amber-700" />
                </div>
                <div className="ml-3 flex-1 rounded-full bg-muted/60 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                  {t("routePreviewTravel")}
                </div>
              </div>

              <div className="relative flex gap-3.5 pt-4">
                <div className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md shadow-amber-500/35 ring-4 ring-card">
                  <Navigation className="size-4" />
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {t("dropoff")}
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold leading-snug">
                    {locName(to)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 px-5 pt-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-75">
          <StatCard
            icon={Route}
            iconClass="text-sky-600"
            label={t("routePreviewDistance")}
            value={t("routePreviewKm", { km: quote.distanceKm })}
          />
          <StatCard
            icon={Clock}
            iconClass="text-amber-600"
            label={t("routePreviewDuration")}
            value={t("routePreviewMins", { mins: quote.durationMin })}
          />
        </div>

        {/* Price */}
        <div className="mx-5 mt-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-150">
          <div className="overflow-hidden rounded-2xl bg-gold-gradient p-px shadow-md shadow-amber-500/20">
            <div className="flex items-center justify-between rounded-[calc(1rem-1px)] bg-gradient-to-br from-amber-50 via-white to-amber-50/80 px-4 py-4">
              <div>
                <p className="text-xs font-medium text-amber-800/70">
                  {vehicleName(vehicleCode)}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-foreground">
                  {t("routePreviewEstimate")}
                </p>
              </div>
              <p className="text-3xl font-bold tracking-tight text-gold-gradient">
                ฿{quote.totalPrice.toLocaleString("en-US")}
              </p>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="mx-5 mt-4 flex items-start gap-2.5 rounded-xl bg-emerald-50/80 px-3.5 py-2.5 text-xs leading-relaxed text-emerald-900/80 ring-1 ring-emerald-200/60 animate-in fade-in-0 duration-500 delay-200">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          {t("routePreviewNote")}
        </p>

        <DialogFooter className="-mx-0 -mb-0 border-0 bg-transparent px-5 pb-5 pt-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-300">
          <Button
            onClick={() => onOpenChange(false)}
            className="btn-shine relative h-12 w-full overflow-hidden rounded-xl bg-gold-gradient text-base font-semibold text-primary-foreground shadow-lg shadow-amber-500/30 transition hover:brightness-105"
          >
            {t("routePreviewContinue")}
            <ArrowRight className="size-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({
  icon: Icon,
  iconClass,
  label,
  value,
}: {
  icon: typeof Route;
  iconClass: string;
  label: string;
  value: string;
}) {
  return (
    <div className="group rounded-2xl bg-muted/35 p-3.5 ring-1 ring-border/50 transition-colors hover:bg-muted/55">
      <div
        className={cn(
          "mb-2.5 flex size-8 items-center justify-center rounded-lg bg-background shadow-sm ring-1 ring-border/40",
          iconClass
        )}
      >
        <Icon className="size-4" />
      </div>
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
