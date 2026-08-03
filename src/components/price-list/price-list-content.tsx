"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getLocation } from "@/lib/data/locations";
import { calculatePrice, getSampleRoutes } from "@/lib/data/pricing";
import { vehicles } from "@/lib/data/vehicles";
import {
  formatRate,
  rentalCategories,
  rentalDurationLabels,
  rentalPackages,
} from "@/lib/data/rental-packages";
import { cn } from "@/lib/utils";
import type { RentalCategory, TransferCategory } from "@/lib/types";

const sectionFilters = [
  { id: "all", label: "All" },
  { id: "rental", label: "Car Rental" },
  { id: "transfer", label: "Transfer" },
] as const;

const transferCategories: Array<TransferCategory | "all"> = [
  "all",
  "airport",
  "hotel",
  "pier",
  "beach",
  "city",
  "attraction",
  "inter-province",
];

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
        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors capitalize",
        active
          ? "bg-zinc-950 text-white"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function PriceListContent() {
  const routes = useMemo(() => getSampleRoutes(), []);
  const [query, setQuery] = useState("");
  const [section, setSection] =
    useState<(typeof sectionFilters)[number]["id"]>("all");
  const [rentalCategory, setRentalCategory] = useState<RentalCategory | "all">(
    "all"
  );
  const [transferCategory, setTransferCategory] = useState<
    TransferCategory | "all"
  >("all");

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

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      const categoryMatch =
        transferCategory === "all" || route.category === transferCategory;
      const from = getLocation(route.fromId);
      const to = getLocation(route.toId);
      const textMatch =
        !q ||
        from?.name.toLowerCase().includes(q) ||
        to?.name.toLowerCase().includes(q) ||
        route.category.toLowerCase().includes(q);
      return categoryMatch && textMatch;
    });
  }, [q, routes, transferCategory]);

  const showRental = section === "all" || section === "rental";
  const showTransfer = section === "all" || section === "transfer";

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 lg:px-8">
      <div className="relative z-30 flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search model, route, category…"
            className="h-9 pl-8"
            aria-label="Search price list"
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
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Car Rental Packages</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Daily rate (THB) by rental duration — all automatic transmission
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Price per day</Badge>
              <FilterChip
                active={rentalCategory === "all"}
                onClick={() => setRentalCategory("all")}
              >
                All
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

          {filteredRentals.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Category</th>
                    <th className="px-4 py-3 text-left font-medium">Model</th>
                    <th className="px-4 py-3 text-left font-medium">Details</th>
                    <th className="px-4 py-3 text-left font-medium">Capacity</th>
                    {rentalDurationLabels.map((tier) => (
                      <th
                        key={tier.key}
                        className="px-3 py-3 text-right font-medium"
                      >
                        {tier.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRentals.map((pkg) => (
                    <tr key={pkg.id} className="border-t">
                      <td className="px-4 py-3">
                        <Badge variant="outline">{pkg.category}</Badge>
                      </td>
                      <td className="px-4 py-3 font-medium">{pkg.model}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {pkg.engine}
                        <br />
                        <span className="text-xs">{pkg.transmission}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {pkg.seats} seats / {pkg.largeBags} large bag
                        {pkg.largeBags > 1 ? "s" : ""} / {pkg.doors} doors
                      </td>
                      {rentalDurationLabels.map((tier) => {
                        const rate = pkg.rates[tier.key];
                        return (
                          <td
                            key={tier.key}
                            className={`px-3 py-3 text-right font-medium ${
                              rate == null ? "text-muted-foreground" : ""
                            }`}
                          >
                            {formatRate(rate)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
              No rental packages match your filters.
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {rentalCategories.map((category) => {
              const pkgs = filteredRentals.filter((p) => p.category === category);
              const count = pkgs.length;
              const from = pkgs
                .filter((p) => p.rates.days1to3 != null)
                .map((p) => p.rates.days1to3 as number);
              const min = from.length ? Math.min(...from) : null;
              return (
                <div key={category} className="rounded-xl border p-4">
                  <p className="text-sm font-semibold">{category}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {count} model{count !== 1 ? "s" : ""}
                  </p>
                  <p className="mt-2 text-lg font-bold text-amber-700">
                    {min != null
                      ? `From ฿${min.toLocaleString("en-US")}/day`
                      : "—"}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Notes: Prices are per day (THB) based on rental duration. Hyundai H-1
            pricing is on request. Capacity = seats / large bags / doors.
          </p>
        </section>
      )}

      {showTransfer && (
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Transfer Routes</h2>
              <p className="text-sm text-muted-foreground">
                Point-to-point private transfer — tolls & parking included
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {transferCategories.map((category) => (
                <FilterChip
                  key={category}
                  active={transferCategory === category}
                  onClick={() => setTransferCategory(category)}
                >
                  {category === "all"
                    ? "All routes"
                    : category.replace("-", " ")}
                </FilterChip>
              ))}
            </div>
          </div>

          {filteredRoutes.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[640px] text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left">Route</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    {vehicles.map((v) => (
                      <th key={v.code} className="px-3 py-3 text-right">
                        {v.code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map((route) => {
                    const from = getLocation(route.fromId);
                    const to = getLocation(route.toId);
                    return (
                      <tr
                        key={`${route.fromId}-${route.toId}`}
                        className="border-t"
                      >
                        <td className="px-4 py-3 font-medium">
                          {from?.name.split("(")[0].trim()} →{" "}
                          {to?.name.split("(")[0].trim()}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="capitalize">
                            {route.category.replace("-", " ")}
                          </Badge>
                        </td>
                        {vehicles.map((v) => {
                          const price = calculatePrice(
                            route.fromId,
                            route.toId,
                            v.code
                          ).totalPrice;
                          return (
                            <td key={v.code} className="px-3 py-3 text-right">
                              ฿{price.toLocaleString("en-US")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
              No transfer routes match your filters.
            </p>
          )}
        </section>
      )}

      <div className="text-center">
        <ButtonLink size="lg" href="/booking">
          Book Now
        </ButtonLink>
      </div>
    </div>
  );
}
