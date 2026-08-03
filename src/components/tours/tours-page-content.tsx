"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tourCategories, tours } from "@/lib/data/tours";
import { cn } from "@/lib/utils";
import type { TourCategory } from "@/lib/types";

export function ToursPageContent() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TourCategory | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tours.filter((tour) => {
      const categoryMatch = category === "All" || tour.category === category;
      const textMatch =
        !q ||
        tour.title.toLowerCase().includes(q) ||
        tour.excerpt.toLowerCase().includes(q) ||
        tour.fromArea.toLowerCase().includes(q) ||
        tour.toArea.toLowerCase().includes(q);
      return categoryMatch && textMatch;
    });
  }, [query, category]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tours, islands, areas…"
            className="h-9 pl-8"
            aria-label="Search tours"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", ...tourCategories] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                category === item
                  ? "bg-zinc-950 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((tour) => (
            <Link
              key={tour.slug}
              href={`/tours/${tour.slug}`}
              className="group block transition-transform hover:-translate-y-0.5"
            >
              <Card className="h-full gap-0 overflow-hidden pt-0 transition-shadow hover:shadow-md">
                <div className="relative aspect-[16/10] bg-muted/40">
                  <Image
                    src={tour.coverImage}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-2 left-2 bg-white/95 text-[10px] text-zinc-950 hover:bg-white sm:top-3 sm:left-3 sm:text-xs">
                    {tour.category}
                  </Badge>
                </div>
                <CardHeader className="space-y-1 px-4 pt-4">
                  <CardTitle className="text-base leading-snug group-hover:text-amber-700 sm:text-lg">
                    {tour.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {tour.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" />
                      {tour.fromArea}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 px-4 pb-4">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {tour.excerpt}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm">
                      <span className="text-muted-foreground">From </span>
                      <span className="font-semibold">
                        ฿{tour.priceFrom.toLocaleString("en-US")}
                      </span>
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700">
                      Details <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          No tours match your filters.
        </p>
      )}

      <div className="mt-10 rounded-2xl border bg-muted/30 px-6 py-8 text-center">
        <h2 className="text-lg font-bold">Need a ride to the pier?</h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          Tour prices are operator estimates (mock). We handle hotel–pier
          transfers with an instant e-Voucher.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <ButtonLink href="/pier-transfer">Pier Transfer</ButtonLink>
          <ButtonLink variant="outline" href="/contact">
            Inquire about a tour
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
