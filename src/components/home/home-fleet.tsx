"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { VehicleCard } from "@/components/shared/vehicle-card";
import { tariffVehicles } from "@/lib/data/vehicles";
import { cn } from "@/lib/utils";

const capacityFilterIds = ["all", "1-3", "1-4", "1-6", "1-8", "9-20"] as const;

function matchesCapacity(passengers: string, filterId: string) {
  if (filterId === "all") return true;
  const normalized = passengers.replace(/[–—]/g, "-").replace(/\s/g, "");
  return normalized === filterId;
}

export function HomeFleet() {
  const t = useTranslations("Home");
  const tc = useTranslations("Common");
  const tp = useTranslations("Pages");
  const [query, setQuery] = useState("");
  const [capacity, setCapacity] =
    useState<(typeof capacityFilterIds)[number]>("all");

  const filterLabels: Record<(typeof capacityFilterIds)[number], string> = {
    all: t("fleetFilterAll"),
    "1-3": t("fleetFilter13"),
    "1-4": t("fleetFilter14"),
    "1-6": t("fleetFilter16"),
    "1-8": t("fleetFilter18"),
    "9-20": t("fleetFilterGroup"),
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tariffVehicles.filter((v) => {
      const textMatch =
        !q ||
        v.code.toLowerCase().includes(q) ||
        v.passengers.toLowerCase().includes(q) ||
        v.amenityKeys.some((a) => a.toLowerCase().includes(q));
      const seatMatch = matchesCapacity(v.passengers, capacity);
      return textMatch && seatMatch;
    });
  }, [query, capacity]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">{tp("fleet")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("fleetSubtitle", { count: tariffVehicles.length })}
          </p>
        </div>
        <ButtonLink variant="outline" href="/fleet">
          {tc("viewAll")}
        </ButtonLink>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative z-30 w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("fleetSearch")}
            className="h-9 pl-8"
            aria-label={t("fleetSearch")}
          />
        </div>
        <div className="relative z-30 flex flex-wrap gap-2">
          {capacityFilterIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setCapacity(id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                capacity === id
                  ? "bg-zinc-950 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {filterLabels[id]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 overflow-visible pt-6 sm:gap-6 lg:grid-cols-4">
          {filtered.map((v) => (
            <VehicleCard key={v.code} vehicle={v} />
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          {t("fleetEmpty")}
        </p>
      )}
    </section>
  );
}
