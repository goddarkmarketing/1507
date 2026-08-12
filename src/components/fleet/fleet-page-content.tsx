"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Luggage, Search, Users } from "lucide-react";
import { VehicleCard } from "@/components/shared/vehicle-card";
import { VehicleHoverImage } from "@/components/shared/vehicle-hover-image";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { vehicles } from "@/lib/data/vehicles";
import {
  formatRate,
  rentalCategories,
  rentalPackages,
} from "@/lib/data/rental-packages";
import { cn } from "@/lib/utils";
import type { RentalCategory } from "@/lib/types";

const sectionFilterIds = ["all", "rental", "transfer"] as const;
const capacityFilterIds = ["all", "1-3", "1-4", "1-8", "1-20"] as const;

const rentalCatKey: Record<
  RentalCategory,
  "catMini" | "catEconomy" | "catCompact" | "catFull"
> = {
  "Mini Car": "catMini",
  Economy: "catEconomy",
  Compact: "catCompact",
  "Full Size": "catFull",
};

function matchesCapacity(passengers: string, filterId: string) {
  if (filterId === "all") return true;
  const normalized = passengers.replace(/[–—]/g, "-").replace(/\s/g, "");
  return normalized === filterId;
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-zinc-950 text-white"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function FleetPageContent() {
  const t = useTranslations("FleetUi");
  const [query, setQuery] = useState("");
  const [section, setSection] =
    useState<(typeof sectionFilterIds)[number]>("all");
  const [rentalCategory, setRentalCategory] = useState<RentalCategory | "all">(
    "all"
  );
  const [capacity, setCapacity] =
    useState<(typeof capacityFilterIds)[number]>("all");

  const q = query.trim().toLowerCase();
  const onRequest = t("onRequest");

  const sectionLabel = (id: (typeof sectionFilterIds)[number]) => {
    if (id === "all") return t("filterAll");
    if (id === "rental") return t("filterRental");
    return t("filterTransfer");
  };

  const capacityLabel = (id: (typeof capacityFilterIds)[number]) => {
    if (id === "all") return t("seatsAll");
    if (id === "1-20") return t("seatsGroup");
    return id.replace("-", "–");
  };

  const filteredRentals = useMemo(() => {
    return rentalPackages.filter((pkg) => {
      const categoryMatch =
        rentalCategory === "all" || pkg.category === rentalCategory;
      const catLabel = t(rentalCatKey[pkg.category]).toLowerCase();
      const textMatch =
        !q ||
        pkg.model.toLowerCase().includes(q) ||
        pkg.category.toLowerCase().includes(q) ||
        catLabel.includes(q) ||
        pkg.engine.toLowerCase().includes(q);
      return categoryMatch && textMatch;
    });
  }, [q, rentalCategory, t]);

  const filteredTransfers = useMemo(() => {
    return vehicles.filter((v) => {
      const textMatch =
        !q ||
        v.code.toLowerCase().includes(q) ||
        v.passengers.toLowerCase().includes(q) ||
        v.amenityKeys.some((a) => a.toLowerCase().includes(q));
      return textMatch && matchesCapacity(v.passengers, capacity);
    });
  }, [q, capacity]);

  const showRental = section === "all" || section === "rental";
  const showTransfer = section === "all" || section === "transfer";

  const rentalByCategory = rentalCategories
    .map((category) => ({
      category,
      packages: filteredRentals.filter((p) => p.category === category),
    }))
    .filter((group) => group.packages.length > 0);

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 lg:px-8">
      <div className="relative z-30 flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="h-9 pl-8"
            aria-label={t("search")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {sectionFilterIds.map((id) => (
            <FilterChip
              key={id}
              active={section === id}
              onClick={() => setSection(id)}
            >
              {sectionLabel(id)}
            </FilterChip>
          ))}
        </div>
      </div>

      {showRental && (
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t("rentalTitle")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("rentalSubtitle")}
              </p>
            </div>
            <div className="relative z-30 flex flex-wrap gap-2">
              <FilterChip
                active={rentalCategory === "all"}
                onClick={() => setRentalCategory("all")}
              >
                {t("allCategories")}
              </FilterChip>
              {rentalCategories.map((category) => (
                <FilterChip
                  key={category}
                  active={rentalCategory === category}
                  onClick={() => setRentalCategory(category)}
                >
                  {t(rentalCatKey[category])}
                </FilterChip>
              ))}
            </div>
          </div>

          {rentalByCategory.length > 0 ? (
            <div className="space-y-10">
              {rentalByCategory.map(({ category, packages }) => (
                <div key={category}>
                  <h3 className="mb-4 text-lg font-semibold">
                    {t(rentalCatKey[category])}
                  </h3>
                  <div className="grid grid-cols-1 gap-4 overflow-visible pt-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                    {packages.map((pkg) => (
                      <Card
                        key={pkg.id}
                        className={cn(
                          "group/vehicle relative h-full gap-0 overflow-visible pt-0 transition-shadow duration-300",
                          "hover:z-10 hover:shadow-lg"
                        )}
                      >
                        <VehicleHoverImage src={pkg.image} alt={pkg.model} />
                        <div className="flex flex-1 flex-col overflow-hidden rounded-b-xl">
                          <CardHeader className="space-y-2 px-4 pb-2 pt-4 sm:px-6">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {t(rentalCatKey[pkg.category])}
                              </Badge>
                            </div>
                            <CardTitle className="text-base leading-snug sm:text-lg">
                              {pkg.model}
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">
                              {pkg.engine} · {pkg.transmission}
                            </CardDescription>
                            <CardDescription className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-xs sm:text-sm">
                              <span className="inline-flex items-center gap-1">
                                <Users className="size-3.5 shrink-0" />
                                {pkg.seats} {t("seats")}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Luggage className="size-3.5 shrink-0" />
                                {pkg.largeBags} {t("bags")}
                              </span>
                              <span>
                                {pkg.doors} {t("doors")}
                              </span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4 sm:px-6">
                            <div className="grid grid-cols-2 gap-2 text-sm sm:gap-2.5">
                              <div className="rounded-lg bg-muted/60 px-2.5 py-2 sm:px-3">
                                <p className="text-[11px] text-muted-foreground">
                                  {t("days1to3")}
                                </p>
                                <p className="text-sm font-semibold sm:text-base">
                                  {formatRate(pkg.rates.days1to3, onRequest)}
                                </p>
                              </div>
                              <div className="rounded-lg bg-muted/60 px-2.5 py-2 sm:px-3">
                                <p className="text-[11px] text-muted-foreground">
                                  {t("days4to6")}
                                </p>
                                <p className="text-sm font-semibold sm:text-base">
                                  {formatRate(pkg.rates.days4to6, onRequest)}
                                </p>
                              </div>
                              <div className="rounded-lg bg-muted/60 px-2.5 py-2 sm:px-3">
                                <p className="text-[11px] text-muted-foreground">
                                  {t("days7to20")}
                                </p>
                                <p className="text-sm font-semibold sm:text-base">
                                  {formatRate(pkg.rates.days7to20, onRequest)}
                                </p>
                              </div>
                              <div className="rounded-lg bg-muted/60 px-2.5 py-2 sm:px-3">
                                <p className="text-[11px] text-muted-foreground">
                                  {t("days21to30")}
                                </p>
                                <p className="text-sm font-semibold sm:text-base">
                                  {formatRate(pkg.rates.days21to30, onRequest)}
                                </p>
                              </div>
                            </div>
                            <ButtonLink
                              variant="outline"
                              size="sm"
                              className="mt-auto w-full"
                              href="/contact"
                            >
                              <span className="truncate">
                                {t("inquire", { model: pkg.model })}
                              </span>
                              <ArrowRight className="size-3.5 shrink-0" />
                            </ButtonLink>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
              {t("emptyRental")}
            </p>
          )}
        </section>
      )}

      {showRental && showTransfer && <Separator />}

      {showTransfer && (
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t("transferTitle")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("transferSubtitle")}
              </p>
            </div>
            <div className="relative z-30 flex flex-wrap gap-2">
              {capacityFilterIds.map((id) => (
                <FilterChip
                  key={id}
                  active={capacity === id}
                  onClick={() => setCapacity(id)}
                >
                  {capacityLabel(id)}
                </FilterChip>
              ))}
            </div>
          </div>

          {filteredTransfers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 overflow-visible pt-2 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
              {filteredTransfers.map((vehicle) => (
                <VehicleCard key={vehicle.code} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
              {t("emptyTransfer")}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
