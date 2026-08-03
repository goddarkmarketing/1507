import type { Vehicle } from "@/lib/types";

export const vehicles: Vehicle[] = [
  {
    code: "ECO",
    name: "Economy Sedan",
    passengers: "1–3",
    luggage: "3 bags",
    amenities: ["Air conditioning", "Bottled water"],
    priceMultiplier: 1,
    image: "/vehicles/car-2.png",
  },
  {
    code: "PREM",
    name: "Premium Sedan",
    passengers: "1–3",
    luggage: "4 bags",
    amenities: ["Air conditioning", "Bottled water", "Phone charger"],
    priceMultiplier: 1.25,
    image: "/vehicles/car-3.png",
  },
  {
    code: "SUV",
    name: "SUV",
    passengers: "1–4",
    luggage: "6 bags",
    amenities: ["Air conditioning", "Bottled water", "Extra legroom"],
    priceMultiplier: 1.4,
    image: "/vehicles/car-6.png",
  },
  {
    code: "VAN",
    name: "Standard Van",
    passengers: "1–8",
    luggage: "8 bags",
    amenities: ["Air conditioning", "Bottled water", "Group seating"],
    priceMultiplier: 1.6,
    image: "/vehicles/car-1.png",
  },
  {
    code: "VIP",
    name: "VIP Van",
    passengers: "1–8",
    luggage: "8 bags",
    amenities: ["Leather seats", "Wi-Fi", "Snacks", "Meet & greet"],
    priceMultiplier: 2,
    image: "/vehicles/car-4.png",
  },
  {
    code: "SIG",
    name: "Signature Class",
    passengers: "1–4",
    luggage: "4 bags",
    amenities: ["Luxury sedan", "Premium amenities", "Priority service"],
    priceMultiplier: 2.5,
    image: "/vehicles/car-7.png",
  },
  {
    code: "EXE",
    name: "Executive Van",
    passengers: "1–8",
    luggage: "10 bags",
    amenities: ["Captain seats", "Privacy glass", "USB charging", "Cold drinks"],
    priceMultiplier: 2.2,
    image: "/vehicles/car-5.png",
  },
  {
    code: "BUS",
    name: "Mini Bus",
    passengers: "1–20",
    luggage: "Large cargo area",
    amenities: ["Air conditioning", "Group travel", "Tour guide space"],
    priceMultiplier: 3,
    image: "/vehicles/car-9.png",
  },
];

export function getVehicle(code: string): Vehicle | undefined {
  return vehicles.find((v) => v.code === code);
}
