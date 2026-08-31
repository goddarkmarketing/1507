"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { locations } from "@/lib/data/locations";
import {
  groupLocations,
  type LocationSelectRole,
} from "@/lib/booking/location-groups";
import { useLocationName } from "@/lib/i18n-labels";
import type { Location, LocationType } from "@/lib/types";
import { cn } from "@/lib/utils";

type LocationSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  role: LocationSelectRole;
  excludeId?: string;
  placeholder?: string;
  className?: string;
};

function stopSelectCapture(e: React.SyntheticEvent) {
  e.stopPropagation();
}

export function LocationSelect({
  value,
  onValueChange,
  role,
  excludeId,
  placeholder,
  className,
}: LocationSelectProps) {
  const t = useTranslations("Booking");
  const locName = useLocationName();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = locations.find((loc) => loc.id === value);

  const groups = useMemo(
    () =>
      groupLocations(locations, role, {
        excludeId,
        query,
        getName: locName,
      }),
    [role, excludeId, query, locName]
  );

  const typeLabel = (type: LocationType) => {
    const labels: Partial<Record<LocationType, string>> = {
      airport: t("locationTypes.airport"),
      hotel: t("locationTypes.hotel"),
      beach: t("locationTypes.beach"),
      city: t("locationTypes.city"),
      pier: t("locationTypes.pier"),
      attraction: t("locationTypes.attraction"),
      temple: t("locationTypes.temple"),
      park: t("locationTypes.park"),
      viewpoint: t("locationTypes.viewpoint"),
      train_station: t("locationTypes.train_station"),
      bus_station: t("locationTypes.bus_station"),
      border: t("locationTypes.border"),
      province: t("locationTypes.province"),
    };
    return labels[type] ?? type;
  };

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const handleSelect = (loc: Location) => {
    onValueChange(loc.id);
    setOpen(false);
    setQuery("");
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setQuery("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        type="button"
        onPointerDown={(e) => e.preventDefault()}
        className={cn(
          "flex h-10 w-full min-w-0 items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:h-8 md:text-sm dark:bg-input/30 dark:hover:bg-input/50",
          !selected && "text-muted-foreground",
          className
        )}
      >
        <span className="line-clamp-1 text-left">
          {selected ? locName(selected) : placeholder}
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-[var(--anchor-width)] min-w-[min(100vw-2rem,20rem)] p-0"
        initialFocus={false}
      >
        <div className="border-b p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("locationSearchPlaceholder")}
              className="h-9 pl-8"
              autoComplete="off"
              onKeyDown={stopSelectCapture}
              onPointerDown={stopSelectCapture}
              onClick={stopSelectCapture}
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto overscroll-contain p-1">
          {groups.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {t("locationNoResults")}
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.type} className="py-0.5">
                <p className="sticky top-0 z-10 bg-popover px-2 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {typeLabel(group.type)}
                </p>
                <ul>
                  {group.locations.map((loc) => {
                    const isSelected = loc.id === value;
                    return (
                      <li key={loc.id}>
                        <button
                          type="button"
                          onClick={() => handleSelect(loc)}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                            isSelected && "bg-accent/70"
                          )}
                        >
                          <span className="min-w-0 flex-1 leading-snug">
                            {locName(loc)}
                          </span>
                          {isSelected && (
                            <Check className="size-4 shrink-0 text-primary" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
