"use client";

import { useLocale, useTranslations } from "next-intl";
import type { AmenityKey, VehicleData } from "@/lib/data/vehicles";
import type { Location } from "@/lib/types";
import type { VehicleCode } from "@/lib/types";

export function useVehicleCopy() {
  const t = useTranslations("Vehicles");

  const name = (code: VehicleCode | string) => t(`${code}.name` as "ECO.name");
  const luggage = (code: VehicleCode | string) =>
    t(`${code}.luggage` as "ECO.luggage");
  const amenity = (key: AmenityKey | string) =>
    t(`amenities.${key}` as "amenities.ac");
  const amenities = (keys: readonly string[]) => keys.map((k) => amenity(k));
  const label = (v: VehicleData) =>
    `${name(v.code)} (${t("pax", { n: v.passengers })})`;
  const selectLabel = (v: VehicleData) =>
    `${v.code} — ${name(v.code)} (${v.passengers})`;

  return { name, luggage, amenity, amenities, label, selectLabel, t };
}

export function useLocationName() {
  const locale = useLocale();
  return (loc: Location | undefined | null) => {
    if (!loc) return "";
    if (locale === "th" && loc.nameTh) return loc.nameTh;
    return loc.name;
  };
}

export function locationShortName(
  loc: Location | undefined | null,
  locale: string
) {
  if (!loc) return "";
  const full = locale === "th" && loc.nameTh ? loc.nameTh : loc.name;
  return full.split("(")[0].trim();
}
