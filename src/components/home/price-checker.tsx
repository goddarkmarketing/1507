"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ArrowLeftRight,
  ArrowRight,
  Clock,
  MapPin,
  Route,
  ShieldCheck,
} from "lucide-react";
import { LocationSelect } from "@/components/booking/location-select";
import { bookingSelectTriggerClass } from "@/lib/booking/form-field-styles";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { locations } from "@/lib/data/locations";
import { getActiveTariffVehicles } from "@/lib/data/vehicles";
import { calculatePrice } from "@/lib/data/pricing";
import { useVehicleCopy } from "@/lib/i18n-labels";
import type { VehicleCode } from "@/lib/types";
import { useCatalogStore } from "@/lib/admin/catalog-store";

type TripMode = "one-way" | "round-trip";

const ROUND_TRIP_DISCOUNT = 0.05;

export type PriceCheckerProps = {
  defaultFrom?: string;
  defaultTo?: string;
  vehicleCodes?: readonly VehicleCode[];
  className?: string;
  compact?: boolean;
};

export function PriceChecker({
  defaultFrom = "kbv-airport",
  defaultTo = "ao-nang-beach",
  vehicleCodes,
  className,
  compact = false,
}: PriceCheckerProps) {
  const t = useTranslations("PriceChecker");
  const { label: vehicleLabel } = useVehicleCopy();
  const router = useRouter();

  const vehiclesRev = useCatalogStore((s) => s.vehiclesImportedAt);
  const fleet = vehiclesRev
    ? vehicleCodes?.length
      ? getActiveTariffVehicles().filter((v) =>
          vehicleCodes.includes(v.code)
        )
      : getActiveTariffVehicles()
    : vehicleCodes?.length
      ? getActiveTariffVehicles().filter((v) =>
          vehicleCodes.includes(v.code)
        )
      : getActiveTariffVehicles();
  const initialVehicle =
    (fleet[0]?.code as VehicleCode | undefined) ?? "ECO";

  const [tripMode, setTripMode] = useState<TripMode>("one-way");
  const [fromId, setFromId] = useState(defaultFrom);
  const [toId, setToId] = useState(
    defaultTo === defaultFrom
      ? (locations.find((l) => l.id !== defaultFrom)?.id ?? defaultTo)
      : defaultTo
  );
  const [vehicleCode, setVehicleCode] = useState<VehicleCode>(initialVehicle);

  const quote = useMemo(() => {
    if (!fromId || !toId || fromId === toId) return null;
    return calculatePrice(fromId, toId, vehicleCode);
  }, [fromId, toId, vehicleCode]);

  const hasOfficialPrice = Boolean(quote?.isOfficial);
  const oneWayPrice = hasOfficialPrice ? (quote?.totalPrice ?? 0) : 0;
  const totalPrice =
    tripMode === "round-trip" && hasOfficialPrice
      ? Math.round(oneWayPrice * 2 * (1 - ROUND_TRIP_DISCOUNT))
      : oneWayPrice;
  const savings =
    tripMode === "round-trip" && hasOfficialPrice
      ? Math.round(oneWayPrice * 2 * ROUND_TRIP_DISCOUNT)
      : 0;

  const swapLocations = () => {
    setFromId(toId);
    setToId(fromId);
  };

  const handleBook = () => {
    if (!quote) return;
    const params = new URLSearchParams({
      from: fromId,
      to: toId,
      vehicle: vehicleCode,
      type: tripMode,
    });
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "w-full rounded-2xl border bg-card shadow-sm",
        compact ? "p-4 sm:p-5" : "p-5 sm:p-6",
        className
      )}
    >
      <div className="text-center">
        <h2
          className={cn(
            "font-bold tracking-tight text-gold-gradient",
            compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
          )}
        >
          {t("title")}
        </h2>
        <div className="mx-auto mt-2 h-0.5 w-16 bg-gold-gradient" />
        {!compact && (
          <p className="mt-2 text-xs text-muted-foreground">{t("subtitle")}</p>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-1">
        {(
          [
            { value: "one-way" as const, label: t("oneWay") },
            { value: "round-trip" as const, label: t("roundTrip") },
          ]
        ).map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setTripMode(option.value)}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              tripMode === option.value
                ? "bg-gold-gradient text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t("from")}</Label>
          <LocationSelect
            role="pickup"
            value={fromId}
            onValueChange={(v) => {
              setFromId(v);
              if (v === toId) {
                const next = locations.find((l) => l.id !== v);
                if (next) setToId(next.id);
              }
            }}
            excludeId={toId}
            placeholder={t("from")}
          />
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={swapLocations}
            aria-label="Swap locations"
            className="rounded-full"
          >
            <ArrowLeftRight className="size-3.5" />
          </Button>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t("to")}</Label>
          <LocationSelect
            role="dropoff"
            value={toId}
            onValueChange={setToId}
            excludeId={fromId}
            placeholder={t("to")}
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t("vehicle")}</Label>
          <Select
            value={vehicleCode}
            onValueChange={(v) => v && setVehicleCode(v as VehicleCode)}
          >
            <SelectTrigger className={bookingSelectTriggerClass}>
              <SelectValue placeholder={t("vehicle")}>
                {(() => {
                  const v = fleet.find((item) => item.code === vehicleCode);
                  return v ? vehicleLabel(v) : t("vehicle");
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="max-h-72">
              {fleet.map((v) => (
                <SelectItem key={v.code} value={v.code}>
                  {vehicleLabel(v)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-muted/70 px-4 py-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              {hasOfficialPrice ? t("officialPrice") : t("estimated")}
            </p>
            <p className="text-3xl font-bold tracking-tight">
              {hasOfficialPrice ? (
                <>฿{totalPrice.toLocaleString("en-US")}</>
              ) : quote ? (
                t("onRequest")
              ) : (
                "—"
              )}
            </p>
            {tripMode === "round-trip" && hasOfficialPrice && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                <span className="line-through">
                  ฿{(oneWayPrice * 2).toLocaleString("en-US")}
                </span>
                <span className="ml-1.5 font-medium text-amber-700">
                  Save ฿{savings.toLocaleString("en-US")} (5%)
                </span>
              </p>
            )}
            {quote && !hasOfficialPrice && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t("onRequestHint")}
              </p>
            )}
          </div>
          {hasOfficialPrice && quote && (
            <div className="space-y-1 text-right text-xs text-muted-foreground">
              <p className="inline-flex items-center gap-1">
                <Route className="size-3.5" />
                {t("km", { km: quote.distanceKm })}
              </p>
              <p className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {t("mins", { mins: quote.durationMin })}
              </p>
            </div>
          )}
        </div>
      </div>

      <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-amber-600" />
          {t("tolls")}
        </li>
        <li className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-amber-600" />
          {t("meetGreet")}
        </li>
      </ul>

      <Separator className="my-4" />

      <Button
        type="button"
        size="lg"
        className="h-11 w-full text-sm font-semibold tracking-wide uppercase"
        disabled={!quote}
        onClick={handleBook}
      >
        {t("bookNow")}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
