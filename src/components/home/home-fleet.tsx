"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import { VehicleCard } from "@/components/shared/vehicle-card";
import { vehicles } from "@/lib/data/vehicles";
import { cn } from "@/lib/utils";

const capacityFilters = [
  { id: "all", label: "All" },
  { id: "1-3", label: "1–3 seats" },
  { id: "1-4", label: "1–4 seats" },
  { id: "1-8", label: "1–8 seats" },
  { id: "1-20", label: "Group / Bus" },
] as const;

function matchesCapacity(passengers: string, filterId: string) {
  if (filterId === "all") return true;
  const normalized = passengers.replace(/[–—]/g, "-").replace(/\s/g, "");
  return normalized === filterId;
}

export function HomeFleet() {
  const [query, setQuery] = useState("");
  const [capacity, setCapacity] = useState<(typeof capacityFilters)[number]["id"]>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      const textMatch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        v.amenities.some((a) => a.toLowerCase().includes(q));
      const seatMatch = matchesCapacity(v.passengers, capacity);
      return textMatch && seatMatch;
    });
  }, [query, capacity]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Our Fleet</h2>
          <p className="mt-2 text-muted-foreground">
            {vehicles.length} vehicle classes for every group size
          </p>
        </div>
        <ButtonLink variant="outline" href="/fleet">
          View All
        </ButtonLink>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative z-30 w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, code, amenity…"
            className="h-9 pl-8"
            aria-label="Search vehicles"
          />
        </div>
        <div className="relative z-30 flex flex-wrap gap-2">
          {capacityFilters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setCapacity(f.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                capacity === f.id
                  ? "bg-zinc-950 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {f.label}
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
          No vehicles match your search. Try another keyword or filter.
        </p>
      )}
    </section>
  );
}
