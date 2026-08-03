import { ArrowRight, Luggage, Users } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/lib/types";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card
      className={cn(
        "group/vehicle relative h-full gap-0 overflow-visible pt-0 transition-shadow duration-300",
        "hover:z-10 hover:shadow-lg"
      )}
    >
      <VehicleHoverImage src={vehicle.image} alt={vehicle.name} />
      <div className="flex flex-1 flex-col overflow-hidden rounded-b-xl">
        <CardHeader className="shrink-0 space-y-2 px-4 pt-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{vehicle.code}</Badge>
            <CardTitle className="text-base leading-snug sm:text-lg">
              {vehicle.name}
            </CardTitle>
          </div>
          <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5 shrink-0" />
              {vehicle.passengers}
            </span>
            <span className="inline-flex items-center gap-1">
              <Luggage className="size-3.5 shrink-0" />
              {vehicle.luggage}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-3 px-4 pb-4 sm:px-6">
          <ul className="flex-1 space-y-1 text-sm text-muted-foreground">
            {vehicle.amenities.map((a) => (
              <li key={a}>• {a}</li>
            ))}
          </ul>
          <ButtonLink
            variant="outline"
            size="sm"
            className="mt-auto w-full"
            href={`/booking?vehicle=${vehicle.code}`}
          >
            <span className="truncate">Book {vehicle.name}</span>
            <ArrowRight className="size-3.5 shrink-0" />
          </ButtonLink>
        </CardContent>
      </div>
    </Card>
  );
}
