"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  ArrowRight,
  Clock,
  MapPin,
  Route,
  ShieldCheck,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { locations } from "@/lib/data/locations";
import { vehicles } from "@/lib/data/vehicles";
import { calculatePrice } from "@/lib/data/pricing";
import type { VehicleCode } from "@/lib/types";

type TripMode = "one-way" | "round-trip";

const ROUND_TRIP_DISCOUNT = 0.05;

export function PriceChecker() {
  const router = useRouter();
  const [tripMode, setTripMode] = useState<TripMode>("one-way");
  const [fromId, setFromId] = useState("kbv-airport");
  const [toId, setToId] = useState("ao-nang-beach");
  const [vehicleCode, setVehicleCode] = useState<VehicleCode>("ECO");

  const quote = useMemo(() => {
    if (!fromId || !toId || fromId === toId) return null;
    return calculatePrice(fromId, toId, vehicleCode);
  }, [fromId, toId, vehicleCode]);

  const oneWayPrice = quote?.totalPrice ?? 0;
  const totalPrice =
    tripMode === "round-trip"
      ? Math.round(oneWayPrice * 2 * (1 - ROUND_TRIP_DISCOUNT))
      : oneWayPrice;
  const savings =
    tripMode === "round-trip"
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
    <div className="w-full rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-gold-gradient sm:text-2xl">
          Price Checker
        </h2>
        <div className="mx-auto mt-2 h-0.5 w-16 bg-gold-gradient" />
        <p className="mt-2 text-xs text-muted-foreground">
          Select pickup, destination and vehicle to see the price instantly
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-1">
        {(
          [
            { value: "one-way", label: "One Way" },
            { value: "round-trip", label: "Round Trip" },
          ] as const
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
          <Label className="text-xs text-muted-foreground">Starting Point</Label>
          <Select
            value={fromId}
            onValueChange={(v) => {
              if (!v) return;
              setFromId(v);
              if (v === toId) {
                const next = locations.find((l) => l.id !== v);
                if (next) setToId(next.id);
              }
            }}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Starting Point">
                {locations.find((l) => l.id === fromId)?.name ?? "Starting Point"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="max-h-72">
              {locations.map((loc) => (
                <SelectItem key={loc.id} value={loc.id}>
                  {loc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Label className="text-xs text-muted-foreground">Destination</Label>
          <Select
            value={toId}
            onValueChange={(v) => v && setToId(v)}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select Destination">
                {locations.find((l) => l.id === toId)?.name ?? "Select Destination"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="max-h-72">
              {locations
                .filter((loc) => loc.id !== fromId)
                .map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Vehicle</Label>
          <Select
            value={vehicleCode}
            onValueChange={(v) => v && setVehicleCode(v as VehicleCode)}
          >
            <SelectTrigger className="h-11 w-full">
              <SelectValue placeholder="Select Vehicle">
                {(() => {
                  const v = vehicles.find((item) => item.code === vehicleCode);
                  return v ? `${v.name} (${v.passengers} pax)` : "Select Vehicle";
                })()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent align="start" className="max-h-72">
              {vehicles.map((v) => (
                <SelectItem key={v.code} value={v.code}>
                  {v.name} ({v.passengers} pax)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-muted/70 px-4 py-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Estimated Price</p>
            <p className="text-3xl font-bold tracking-tight">
              {quote ? (
                <>
                  ฿{totalPrice.toLocaleString("en-US")}
                </>
              ) : (
                "—"
              )}
            </p>
            {tripMode === "round-trip" && quote && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                <span className="line-through">
                  ฿{(oneWayPrice * 2).toLocaleString("en-US")}
                </span>
                <span className="ml-1.5 font-medium text-amber-700">
                  Save ฿{savings.toLocaleString("en-US")} (5% round trip)
                </span>
              </p>
            )}
          </div>
          {quote && (
            <div className="space-y-1 text-right text-xs text-muted-foreground">
              <p className="inline-flex items-center gap-1">
                <Route className="size-3.5" />
                {quote.distanceKm} km
              </p>
              <p className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />~{quote.durationMin} min
              </p>
            </div>
          )}
        </div>
      </div>

      <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-amber-600" />
          Tolls & parking included
        </li>
        <li className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-amber-600" />
          Meet & greet · Free waiting at airport (60 min)
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
        Book Now
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
