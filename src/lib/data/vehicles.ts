import type { Vehicle, VehicleCode } from "@/lib/types";

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

/** Official Toyota Thailand cutout images — sourced from toyota.co.th */
export const vehicles: VehicleData[] = [
  {
    code: "ECO",
    passengers: "1–3",
    amenityKeys: ["ac", "water"],
    priceMultiplier: 1,
    image: "/vehicles/toyota/yarisativ.webp",
  },
  {
    code: "PREM",
    passengers: "1–3",
    amenityKeys: ["ac", "water", "charger"],
    priceMultiplier: 1.25,
    image: "/vehicles/toyota/camry.webp",
  },
  {
    code: "SUV",
    passengers: "1–4",
    amenityKeys: ["ac", "water", "legroom"],
    priceMultiplier: 1.4,
    image: "/vehicles/toyota/corollacross.webp",
  },
  {
    code: "VAN",
    passengers: "1–8",
    amenityKeys: ["ac", "water", "groupSeating"],
    priceMultiplier: 1.6,
    image: "/vehicles/toyota/hiace.webp",
  },
  {
    code: "VIP",
    passengers: "1–8",
    amenityKeys: ["leather", "wifi", "snacks", "meetGreet"],
    priceMultiplier: 2,
    image: "/vehicles/toyota/alphard.webp",
  },
  {
    code: "SIG",
    passengers: "1–4",
    amenityKeys: ["luxury", "premium", "priority"],
    priceMultiplier: 2.5,
    image: "/vehicles/toyota/majesty.webp",
  },
  {
    code: "EXE",
    passengers: "1–8",
    amenityKeys: ["captain", "privacy", "usb", "drinks"],
    priceMultiplier: 2.2,
    image: "/vehicles/toyota/commuter.webp",
  },
  {
    code: "BUS",
    passengers: "1–20",
    amenityKeys: ["ac", "groupTravel", "tourGuide"],
    priceMultiplier: 3,
    image: "/vehicles/toyota/coaster.webp",
  },
];

export function getVehicle(code: string): VehicleData | undefined {
  return vehicles.find((v) => v.code === code);
}

export function isVehicleCode(code: string): code is VehicleCode {
  return vehicles.some((v) => v.code === code);
}
