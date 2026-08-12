"use client";

import { ArrowRight, Luggage, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleHoverImage } from "@/components/shared/vehicle-hover-image";
import { useVehicleCopy } from "@/lib/i18n-labels";
import { cn } from "@/lib/utils";
import type { VehicleData } from "@/lib/data/vehicles";

export function VehicleCard({ vehicle }: { vehicle: VehicleData }) {
  const tc = useTranslations("Common");
  const { name, luggage, amenities } = useVehicleCopy();
  const vehicleName = name(vehicle.code);
  const amenityList = amenities(vehicle.amenityKeys);

  return (
    <Card
      className={cn(
        "group/vehicle relative h-full gap-0 overflow-visible pt-0 transition-shadow duration-300",
        "hover:z-10 hover:shadow-lg"
      )}
    >
      <VehicleHoverImage src={vehicle.image} alt={vehicleName} />
      <div className="flex flex-1 flex-col overflow-hidden rounded-b-xl">
        <CardHeader className="shrink-0 space-y-2 px-4 pt-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{vehicle.code}</Badge>
            <CardTitle className="text-base leading-snug sm:text-lg">
              {vehicleName}
            </CardTitle>
          </div>
          <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5 shrink-0" />
              {vehicle.passengers}
            </span>
            <span className="inline-flex items-center gap-1">
              <Luggage className="size-3.5 shrink-0" />
              {luggage(vehicle.code)}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4 sm:px-6">
          <ul className="flex-1 space-y-1 text-sm text-muted-foreground">
            {amenityList.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
          <ButtonLink
            variant="outline"
            size="sm"
            className="mt-auto w-full"
            href={`/booking?vehicle=${vehicle.code}`}
          >
            <span className="truncate">
              {tc("bookVehicle", { name: vehicleName })}
            </span>
            <ArrowRight className="size-3.5 shrink-0" />
          </ButtonLink>
        </CardContent>
      </div>
    </Card>
  );
}
