"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Building2, ChevronRight, MapPin, Search } from "lucide-react";
import { PublicImage } from "@/components/shared/public-image";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  catalogHotels,
  featuredHotels,
  hotelCardTitle,
  hotelImage,
} from "@/lib/data/nearby-hotels";
import { getLocation } from "@/lib/data/locations";
import { locationShortName, useLocationName } from "@/lib/i18n-labels";
import type { Location } from "@/lib/types";
import { cn } from "@/lib/utils";

export function HotelPicker({
  selectedId,
  customName,
  onSelect,
  onCustomName,
}: {
  selectedId: string;
  customName: string;
  onSelect: (hotelId: string) => void;
  onCustomName: (name: string) => void;
}) {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const locName = useLocationName();
  const hotels = featuredHotels();
  const [open, setOpen] = useState(false);
  if (!hotels.length) return null;

  const choose = (hotelId: string) => {
    onSelect(hotelId);
    setOpen(false);
  };

  return (
    <div className="col-span-2 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex min-w-0 items-center gap-2 text-base font-semibold text-zinc-950 sm:text-lg">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
            <Building2 className="size-4" />
          </span>
          <span className="truncate">{t("hotelPopular")}</span>
        </h2>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex shrink-0 items-center gap-0.5 text-sm text-zinc-500"
        >
          {t("hotelSeeAll")}
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {hotels.map((hotel) => (
          <HotelPhotoCard
            key={hotel.id}
            hotel={hotel}
            name={hotelCardTitle(hotel, locale)}
            alt={locName(hotel)}
            area={areaLabel(hotel, locale)}
            selected={hotel.id === selectedId && !customName.trim()}
            onSelect={() => choose(hotel.id)}
          />
        ))}
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
        <Input
          value={customName}
          onChange={(event) => onCustomName(event.target.value)}
          placeholder={t("hotelCustomPlaceholder")}
          aria-label={t("hotelCustom")}
          className="h-11 rounded-xl border-zinc-200 bg-zinc-50 pl-10"
        />
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="!inset-0 z-[80] !h-auto !max-h-none gap-0 overflow-hidden rounded-none"
        >
          <SheetHeader className="shrink-0 pr-10 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
            <SheetTitle className="text-base font-semibold">
              {t("hotelPopular")}
            </SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(6rem,env(safe-area-inset-bottom,0px))]">
            <ul className="space-y-1">
              {catalogHotels().map((hotel) => {
                const photo = hotelImage(hotel);
                const selected = hotel.id === selectedId && !customName.trim();
                return (
                  <li key={hotel.id}>
                    <button
                      type="button"
                      onClick={() => choose(hotel.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left",
                        selected ? "bg-amber-50" : "hover:bg-zinc-50"
                      )}
                    >
                      {photo ? (
                        <PublicImage
                          src={photo}
                          alt=""
                          width={96}
                          height={72}
                          className="h-14 w-16 shrink-0 rounded-lg object-cover"
                        />
                      ) : (
                        <span className="flex h-14 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500">
                          <MapPin className="size-4" />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="line-clamp-2 block text-sm font-semibold text-zinc-950">
                          {locName(hotel)}
                        </span>
                        <span className="mt-0.5 block text-xs text-zinc-500">
                          {areaLabel(hotel, locale)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function areaLabel(hotel: Location, locale: string) {
  if (hotel.pricingAreaId === "koh-lanta-z1") {
    return locale === "th" ? "เกาะลันตา" : "Koh Lanta";
  }
  const area = hotel.pricingAreaId ? getLocation(hotel.pricingAreaId) : null;
  return locationShortName(area, locale);
}

function HotelPhotoCard({
  hotel,
  name,
  alt,
  area,
  selected,
  onSelect,
}: {
  hotel: Location;
  name: string;
  alt: string;
  area: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const photo = hotelImage(hotel);
  if (!photo) return null;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative aspect-[4/3] overflow-hidden rounded-lg text-left shadow-sm",
        selected && "ring-2 ring-amber-400"
      )}
    >
      <PublicImage
        src={photo}
        alt={alt}
        width={480}
        height={360}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-2.5 pt-10 pb-2.5">
        <span className="flex items-start gap-1 text-white">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold leading-tight">
              {name}
            </span>
            {area ? (
              <span className="mt-0.5 block truncate text-[11px] leading-tight text-white/85">
                {area}
              </span>
            ) : null}
          </span>
        </span>
      </span>
    </button>
  );
}
