"use client";

import { useMemo, useState } from "react";
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

const sectionFilters = [
  { id: "all", label: "All" },
  { id: "rental", label: "Car Rental" },
  { id: "transfer", label: "Transfer" },
] as const;

const capacityFilters = [
  { id: "all", label: "All seats" },
  { id: "1-3", label: "1–3" },
  { id: "1-4", label: "1–4" },
  { id: "1-8", label: "1–8" },
  { id: "1-20", label: "Group / Bus" },
] as const;

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
  const [query, setQuery] = useState("");
  const [section, setSection] =
    useState<(typeof sectionFilters)[number]["id"]>("all");
  const [rentalCategory, setRentalCategory] = useState<RentalCategory | "all">(
    "all"
  );
  const [capacity, setCapacity] =
    useState<(typeof capacityFilters)[number]["id"]>("all");

  const q = query.trim().toLowerCase();

  const filteredRentals = useMemo(() => {
    return rentalPackages.filter((pkg) => {
      const categoryMatch =
        rentalCategory === "all" || pkg.category === rentalCategory;
      const textMatch =
        !q ||
        pkg.model.toLowerCase().includes(q) ||
        pkg.category.toLowerCase().includes(q) ||
        pkg.engine.toLowerCase().includes(q);
      return categoryMatch && textMatch;
    });
  }, [q, rentalCategory]);

  const filteredTransfers = useMemo(() => {
    return vehicles.filter((v) => {
      const textMatch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        v.amenities.some((a) => a.toLowerCase().includes(q));
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
            placeholder="Search model, category, code…"
            className="h-9 pl-8"
            aria-label="Search fleet"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {sectionFilters.map((f) => (
            <FilterChip
              key={f.id}
              active={section === f.id}
              onClick={() => setSection(f.id)}
            >
              {f.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {showRental && (
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Car Rental Packages</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Daily rates by duration — Mini Car, Economy, Compact & Full Size
              </p>
            </div>
            <div className="relative z-30 flex flex-wrap gap-2">
              <FilterChip
                active={rentalCategory === "all"}
                onClick={() => setRentalCategory("all")}
              >
                All categories
              </FilterChip>
              {rentalCategories.map((category) => (
                <FilterChip
                  key={category}
                  active={rentalCategory === category}
                  onClick={() => setRentalCategory(category)}
                >
                  {category}
                </FilterChip>
              ))}
            </div>
          </div>

          {rentalByCategory.length > 0 ? (
            <div className="space-y-10">
              {rentalByCategory.map(({ category, packages }) => (
                <div key={category}>
                  <h3 className="mb-4 text-lg font-semibold">{category}</h3>
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
                              <Badge variant="outline">{pkg.category}</Badge>
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
                                {pkg.seats} seats
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Luggage className="size-3.5 shrink-0" />
                                {pkg.largeBags} large bag
                                {pkg.largeBags > 1 ? "s" : ""}
                              </span>
                              <span>{pkg.doors} doors</span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4 sm:px-6">
                            <div className="grid grid-cols-2 gap-2 text-sm sm:gap-2.5">
                              <div className="rounded-lg bg-muted/60 px-2.5 py-2 sm:px-3">
                                <p className="text-[11px] text-muted-foreground">
                                  1–3 days
                                </p>
                                <p className="text-sm font-semibold sm:text-base">
                                  {formatRate(pkg.rates.days1to3)}
                                </p>
                              </div>
                              <div className="rounded-lg bg-muted/60 px-2.5 py-2 sm:px-3">
                                <p className="text-[11px] text-muted-foreground">
                                  4–6 days
                                </p>
                                <p className="text-sm font-semibold sm:text-base">
                                  {formatRate(pkg.rates.days4to6)}
                                </p>
                              </div>
                              <div className="rounded-lg bg-muted/60 px-2.5 py-2 sm:px-3">
                                <p className="text-[11px] text-muted-foreground">
                                  7–20 days
                                </p>
                                <p className="text-sm font-semibold sm:text-base">
                                  {formatRate(pkg.rates.days7to20)}
                                </p>
                              </div>
                              <div className="rounded-lg bg-muted/60 px-2.5 py-2 sm:px-3">
                                <p className="text-[11px] text-muted-foreground">
                                  21–30 days
                                </p>
                                <p className="text-sm font-semibold sm:text-base">
                                  {formatRate(pkg.rates.days21to30)}
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
                                Inquire {pkg.model}
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
              No rental packages match your filters.
            </p>
          )}
        </section>
      )}

      {showRental && showTransfer && <Separator />}

      {showTransfer && (
        <section>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Transfer Vehicles</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Private transfer classes for airport, hotel, pier and
                inter-province routes
              </p>
            </div>
            <div className="relative z-30 flex flex-wrap gap-2">
              {capacityFilters.map((f) => (
                <FilterChip
                  key={f.id}
                  active={capacity === f.id}
                  onClick={() => setCapacity(f.id)}
                >
                  {f.label}
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
              No transfer vehicles match your filters.
            </p>
          )}
        </section>
      )}
    </div>
  );
}
