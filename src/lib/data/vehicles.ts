import type { Vehicle, VehicleCode } from "@/lib/types";
import { getImportedVehicleOverrides } from "@/lib/admin/catalog-store";

/** Amenity keys mapped in messages under Vehicles.amenities.* */
export type AmenityKey =
  | "ac"
  | "water"
  | "charger"
  | "legroom"
  | "groupSeating"
  | "leather"
  | "wifi"
  | "snacks"
  | "meetGreet"
  | "luxury"
  | "premium"
  | "priority"
  | "captain"
  | "privacy"
  | "usb"
  | "drinks"
  | "groupTravel"
  | "tourGuide";

export type VehicleData = Vehicle;

/** Official tariff order: 01–07 from KRABI LINKS TAXI price sheets. */
export const tariffVehicleCodes: VehicleCode[] = [
  "ECO",
  "PREM",
  "SUV",
  "VAN",
  "EXE",
  "VIP",
  "BUS",
];

/** Fleet photos provided by KRABI LINKS TAXI */
export const vehicles: VehicleData[] = [
  {
    code: "ECO",
    passengers: "1–3",
    amenityKeys: ["ac", "water"],
    priceMultiplier: 1,
    image: "/vehicles/toyota/altis.webp",
  },
  {
    code: "PREM",
    passengers: "1–4",
    amenityKeys: ["ac", "water", "charger"],
    priceMultiplier: 1.25,
    image: "/vehicles/toyota/camry.webp",
  },
  {
    code: "SUV",
    passengers: "1–4",
    amenityKeys: ["ac", "water", "legroom"],
    priceMultiplier: 1.4,
    image: "/vehicles/toyota/fortuner.webp",
  },
  {
    code: "VAN",
    passengers: "1–6",
    amenityKeys: ["ac", "water", "groupSeating"],
    priceMultiplier: 1.6,
    image: "/vehicles/toyota/hiace.webp",
  },
  {
    code: "EXE",
    passengers: "1–8",
    amenityKeys: ["captain", "privacy", "usb", "drinks"],
    priceMultiplier: 2.2,
    image: "/vehicles/toyota/commuter.webp",
  },
  {
    code: "VIP",
    passengers: "1–4",
    amenityKeys: ["leather", "wifi", "snacks", "meetGreet"],
    priceMultiplier: 2,
    image: "/vehicles/toyota/alphard.webp",
  },
  {
    code: "BUS",
    passengers: "9–20",
    amenityKeys: ["ac", "groupTravel", "tourGuide"],
    priceMultiplier: 3,
    image: "/vehicles/toyota/coaster.webp",
  },
  {
    code: "SIG",
    passengers: "1–4",
    amenityKeys: ["luxury", "premium", "priority"],
    priceMultiplier: 2.5,
    image: "/vehicles/toyota/alphard.webp",
  },
];

export const tariffVehicles: VehicleData[] = tariffVehicleCodes.map(
  (code) => vehicles.find((v) => v.code === code)!
);

export function getActiveVehicles(): VehicleData[] {
  const overrides = getImportedVehicleOverrides();
  if (!overrides) return vehicles;

  return vehicles.map((v) => {
    const ov = overrides[v.code];
    return ov
      ? ({
          ...v,
          ...ov,
          code: v.code,
        } as VehicleData)
      : v;
  });
}

export function getActiveTariffVehicles(): VehicleData[] {
  const active = getActiveVehicles();
  return tariffVehicleCodes.map(
    (code) => active.find((v) => v.code === code)!
  );
}

export function getVehicle(code: string): VehicleData | undefined {
  return getActiveVehicles().find((v) => v.code === code);
}

export function isVehicleCode(code: string): code is VehicleCode {
  return getActiveVehicles().some((v) => v.code === code);
}

export function isTariffVehicleCode(code: string): boolean {
  return tariffVehicleCodes.includes(code as VehicleCode);
}
