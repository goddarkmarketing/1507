"use client";

import { ArrowRight, Clock, MapPin, Route } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleCard } from "@/components/shared/vehicle-card";
import { getLocation } from "@/lib/data/locations";
import { calculatePrice } from "@/lib/data/pricing";
import { getVehicle } from "@/lib/data/vehicles";
import type { TransferPageKey } from "@/lib/site-config";
import { transferPages } from "@/lib/site-config";
import type { VehicleCode } from "@/lib/types";

interface TransferPageTemplateProps {
  pageKey: TransferPageKey;
}

export function TransferPageTemplate({ pageKey }: TransferPageTemplateProps) {
  const config = transferPages[pageKey];

  const featuredRoutes = config.featuredRoutes
    .map(([fromId, toId]) => {
      const route = calculatePrice(fromId, toId, "ECO");
      if (!route) return null;
      const from = getLocation(fromId);
      const to = getLocation(toId);
      if (!from || !to) return null;
      return { from, to, ...route };
    })
    .filter((route): route is NonNullable<typeof route> => route !== null);

  const pageVehicles = config.vehicleCodes
    .map((code) => getVehicle(code as VehicleCode))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const highlightRoutes = featuredRoutes.slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        {highlightRoutes.map((route) => (
          <Card key={`${route.fromId}-${route.toId}`}>
            <CardHeader>
              <Badge variant="secondary" className="w-fit capitalize">
                {config.category.replace("-", " ")}
              </Badge>
              <CardTitle className="text-lg">
                {route.from.name.split("(")[0].trim()} →{" "}
                {route.to.name.split("(")[0].trim()}
              </CardTitle>
              <CardDescription className="flex flex-wrap gap-3 pt-1">
                <span className="inline-flex items-center gap-1">
                  <Route className="size-3.5" />
                  {route.distanceKm} km
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  ~{route.durationMin} min
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  ฿{route.totalPrice.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Economy Sedan from</p>
              </div>
              <ButtonLink
                size="sm"
                href={`/booking?from=${route.fromId}&to=${route.toId}&category=${config.category}`}
              >
                Book
              </ButtonLink>
            </CardContent>
          </Card>
        ))}
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold">Popular {config.title} Routes</h2>
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Route</th>
                <th className="px-4 py-3 text-left font-medium">Distance</th>
                <th className="px-4 py-3 text-left font-medium">Duration</th>
                <th className="px-4 py-3 text-left font-medium">From (ECO)</th>
                <th className="px-4 py-3 text-right font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {featuredRoutes.map((route) => (
                <tr
                  key={`row-${route.fromId}-${route.toId}`}
                  className="border-t"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary" />
                      {route.from.name.split("(")[0].trim()} →{" "}
                      {route.to.name.split("(")[0].trim()}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {route.distanceKm} km
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    ~{route.durationMin} min
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ฿{route.totalPrice.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ButtonLink
                      variant="ghost"
                      size="sm"
                      href={`/booking?from=${route.fromId}&to=${route.toId}&category=${config.category}`}
                    >
                      Book <ArrowRight className="size-3.5" />
                    </ButtonLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">
          Recommended Vehicles for {config.title}
        </h2>
        <div className="grid grid-cols-2 gap-3 overflow-visible sm:gap-6 lg:grid-cols-4">
          {pageVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.code} vehicle={vehicle} />
          ))}
        </div>
      </section>

      <div className="rounded-2xl bg-gold-gradient px-6 py-8 text-primary-foreground shadow-lg shadow-amber-500/25 sm:px-8">
        <h2 className="text-2xl font-bold">
          Ready to book your {config.title.toLowerCase()}?
        </h2>
        <p className="mt-2 max-w-xl text-primary-foreground/80">
          Transparent pricing, professional drivers, and instant e-Voucher with
          QR code.
        </p>
        <ButtonLink variant="secondary" className="mt-4" href="/booking">
          Start Booking <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
