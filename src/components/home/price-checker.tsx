"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Car, Check, ChevronDown, Clock, MapPin, ShieldCheck } from "lucide-react";
import { LocationSelect } from "@/components/booking/location-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
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
  /** Hide the in-card title below the desktop breakpoint (homepage mobile hero). */
  hideIntro?: boolean;
};

export function PriceChecker({
  defaultFrom = "kbv-airport",
  defaultTo = "krabi-town",
  vehicleCodes,
  className,
  compact = false,
  hideIntro = false,
}: PriceCheckerProps) {
  const t = useTranslations("PriceChecker");
  const { label: vehicleLabel } = useVehicleCopy();
  const router = useRouter();

  const vehiclesRev = useCatalogStore((s) => s.vehiclesImportedAt);
  const transferRev = useCatalogStore((s) => s.transferImportedAt);
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
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [fromId, setFromId] = useState(defaultFrom);
  const [toId, setToId] = useState(defaultTo);
  const [vehicleCode, setVehicleCode] = useState<VehicleCode>(initialVehicle);

  const quote = useMemo(() => {
    if (!fromId || !toId || fromId === toId) return null;
    return calculatePrice(fromId, toId, vehicleCode);
  }, [fromId, toId, vehicleCode, transferRev]);

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
        "w-full min-w-0 max-w-full overflow-hidden rounded-[1.75rem] border border-zinc-100 bg-white shadow-[0_18px_50px_-28px_rgba(0,0,0,0.45)]",
        compact ? "p-4" : "p-5 sm:p-6",
        className
      )}
    >
      <div className={cn("text-center", hideIntro && "hidden lg:block")}>
        <h2
          className={cn(
            "font-extrabold tracking-tight text-zinc-950",
            compact ? "text-xl" : "text-2xl"
          )}
        >
          {t("title")}
        </h2>
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-[#ffd100]" />
        {!compact && (
          <p className="mt-3 text-sm text-zinc-500">{t("subtitle")}</p>
        )}
      </div>

      <div
        className={cn(
          "grid grid-cols-2 gap-1 rounded-full bg-[#f6f1e6] p-1",
          hideIntro ? "mt-0 lg:mt-5" : "mt-5"
        )}
      >
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
              "rounded-full px-3 py-2.5 text-sm font-bold transition-colors",
              tripMode === option.value
                ? "bg-gold-gradient text-zinc-950 shadow-sm"
                : "text-zinc-800"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        <div className="space-y-1.5">
          <Label className="px-1 text-sm font-normal text-zinc-500">
            {t("from")}
          </Label>
          <LocationSelect
            role="pickup"
            value={fromId}
            excludeId={toId}
            placeholder={t("from")}
            onValueChange={setFromId}
            className="h-12 min-h-12 rounded-2xl border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-950"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="px-1 text-sm font-normal text-zinc-500">
            {t("to")}
          </Label>
          <LocationSelect
            role="dropoff"
            value={toId}
            excludeId={fromId}
            placeholder={t("to")}
            onValueChange={setToId}
            className="h-12 min-h-12 rounded-2xl border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-950"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="px-1 text-sm font-normal text-zinc-500">
            {t("vehicle")}
          </Label>
          <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
            <PopoverTrigger
              type="button"
              onPointerDown={(e) => e.preventDefault()}
              className="flex h-12 w-full items-center justify-between gap-2 rounded-2xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-950 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Car className="size-3.5" />
              </span>
              <span className="line-clamp-2 min-w-0 flex-1 text-left leading-snug">
                {(() => {
                  const v = fleet.find((item) => item.code === vehicleCode);
                  return v ? vehicleLabel(v) : t("vehicle");
                })()}
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={4}
              className="w-[var(--anchor-width)] min-w-[min(100vw-2rem,20rem)] rounded-2xl p-1 shadow-lg"
            >
              <ul className="max-h-72 overflow-y-auto overscroll-contain">
                {fleet.map((v) => {
                  const selected = v.code === vehicleCode;
                  return (
                    <li key={v.code}>
                      <button
                        type="button"
                        onClick={() => {
                          setVehicleCode(v.code);
                          setVehicleOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-amber-50/80",
                          selected && "bg-amber-50"
                        )}
                      >
                        <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                          <Car className="size-3.5" />
                        </span>
                        <span className="min-w-0 flex-1 leading-snug font-medium text-zinc-950">
                          {vehicleLabel(v)}
                        </span>
                        {selected ? (
                          <Check className="size-4 shrink-0 text-amber-600" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#fff6d8] px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-zinc-500">
              {hasOfficialPrice ? t("officialPrice") : t("onRequest")}
            </p>
            <p className="text-4xl font-black tracking-tight text-zinc-950">
              {hasOfficialPrice ? (
                <>฿{totalPrice.toLocaleString("en-US")}</>
              ) : quote ? (
                <span className="text-2xl">{t("onRequest")}</span>
              ) : (
                "—"
              )}
            </p>
            {tripMode === "round-trip" && hasOfficialPrice && (
              <p className="mt-1 text-xs text-zinc-500">
                <span className="line-through">
                  ฿{(oneWayPrice * 2).toLocaleString("en-US")}
                </span>
                <span className="ml-1.5 font-semibold text-amber-700">
                  -฿{savings.toLocaleString("en-US")}
                </span>
              </p>
            )}
            {quote && !hasOfficialPrice && (
              <p className="mt-1 text-xs text-zinc-500">{t("onRequestHint")}</p>
            )}
          </div>
          {hasOfficialPrice && quote && (
            <div className="flex shrink-0 items-center gap-3 border-l border-amber-200/80 pl-3 text-sm text-zinc-700">
              <div className="space-y-1.5">
                <p className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-zinc-500" />
                  {t("km", { km: quote.distanceKm })}
                </p>
                <p className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5 text-zinc-500" />
                  {t("mins", { mins: quote.durationMin })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <ul className="mt-4 space-y-2.5 text-sm text-zinc-800">
        <li className="flex items-center gap-2.5">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <ShieldCheck className="size-3.5" />
          </span>
          {t("tolls")}
        </li>
        <li className="flex items-center gap-2.5">
          <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <MapPin className="size-3.5" />
          </span>
          {t("meetGreet")}
        </li>
      </ul>

      <Button
        type="button"
        className="btn-shine relative mt-5 h-12 w-full overflow-hidden rounded-full text-base font-bold tracking-normal text-zinc-950"
        disabled={!quote}
        onClick={handleBook}
      >
        {hasOfficialPrice ? t("bookNow") : t("requestQuote")}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
