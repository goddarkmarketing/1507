import type { RentalCategory, RentalPackage } from "@/lib/types";

/** Car rental packages — daily rates (THB) by rental duration */
export const rentalPackages: RentalPackage[] = [
  {
    id: "toyota-yaris",
    category: "Mini Car",
    model: "Toyota Yaris",
    engine: "1200 CC",
    transmission: "Automatic",
    seats: 5,
    largeBags: 1,
    doors: 2,
    rates: { days1to3: 1000, days4to6: 900, days7to20: 800, days21to30: 700 },
    image: "/vehicles/car-4.png",
  },
  {
    id: "toyota-ativ",
    category: "Mini Car",
    model: "Toyota Ativ",
    engine: "1200 CC",
    transmission: "Automatic",
    seats: 5,
    largeBags: 1,
    doors: 2,
    rates: { days1to3: 1000, days4to6: 900, days7to20: 800, days21to30: 700 },
    image: "/vehicles/car-2.png",
  },
  {
    id: "honda-city-hab",
    category: "Economy",
    model: "Honda City HAB",
    engine: "1.0 Turbo",
    transmission: "Automatic",
    seats: 5,
    largeBags: 1,
    doors: 2,
    rates: { days1to3: 1200, days4to6: 1100, days7to20: 900, days21to30: 800 },
    image: "/vehicles/car-8.png",
  },
  {
    id: "honda-city",
    category: "Economy",
    model: "Honda City",
    engine: "1.0 Turbo",
    transmission: "Automatic",
    seats: 5,
    largeBags: 1,
    doors: 2,
    rates: { days1to3: 1200, days4to6: 1100, days7to20: 900, days21to30: 800 },
    image: "/vehicles/car-3.png",
  },
  {
    id: "mg-5",
    category: "Economy",
    model: "MG-5",
    engine: "1500 CC",
    transmission: "Automatic",
    seats: 4,
    largeBags: 1,
    doors: 2,
    rates: { days1to3: 1100, days4to6: 1000, days7to20: 800, days21to30: 750 },
    image: "/vehicles/car-5.png",
  },
  {
    id: "mg-zs",
    category: "Economy",
    model: "MG ZS",
    engine: "1500 CC",
    transmission: "Automatic",
    seats: 5,
    largeBags: 1,
    doors: 2,
    rates: { days1to3: 1400, days4to6: 1300, days7to20: 1200, days21to30: 950 },
    image: "/vehicles/car-6.png",
  },
  {
    id: "toyota-veloz",
    category: "Compact",
    model: "Toyota Veloz",
    engine: "1500 CC",
    transmission: "Automatic",
    seats: 7,
    largeBags: 1,
    doors: 2,
    rates: { days1to3: 1500, days4to6: 1400, days7to20: 1300, days21to30: 1200 },
    image: "/vehicles/car-7.png",
  },
  {
    id: "mitsubishi-xpander",
    category: "Compact",
    model: "Mitsubishi Xpander",
    engine: "1500 CC",
    transmission: "Automatic",
    seats: 7,
    largeBags: 1,
    doors: 2,
    rates: { days1to3: 1500, days4to6: 1400, days7to20: 1300, days21to30: 1200 },
    image: "/vehicles/car-9.png",
  },
  {
    id: "ford-everest",
    category: "Full Size",
    model: "Ford Everest",
    engine: "2000 CC",
    transmission: "Automatic",
    seats: 7,
    largeBags: 2,
    doors: 2,
    rates: { days1to3: 2000, days4to6: 1900, days7to20: 1700, days21to30: 1550 },
    // Image not in current set — use closest full-size look
    image: "/vehicles/car-7.png",
  },
  {
    id: "hyundai-h1",
    category: "Full Size",
    model: "Hyundai H-1",
    engine: "2500 CC",
    transmission: "Automatic",
    seats: 10,
    largeBags: 2,
    doors: 2,
    rates: { days1to3: null, days4to6: null, days7to20: null, days21to30: null },
    image: "/vehicles/car-1.png",
  },
];

export const rentalDurationLabels = [
  { key: "days1to3" as const, label: "1–3 Days", short: "1–3" },
  { key: "days4to6" as const, label: "4–6 Days", short: "4–6" },
  { key: "days7to20" as const, label: "7–20 Days", short: "7–20" },
  { key: "days21to30" as const, label: "21–30 Days", short: "21–30" },
];

export const rentalCategories: RentalCategory[] = [
  "Mini Car",
  "Economy",
  "Compact",
  "Full Size",
];

export function getRentalPackage(id: string): RentalPackage | undefined {
  return rentalPackages.find((p) => p.id === id);
}

export function getPackagesByCategory(category: RentalCategory): RentalPackage[] {
  return rentalPackages.filter((p) => p.category === category);
}

/** Daily rate for a given rental length (number of days). */
export function getDailyRateForDays(
  pkg: RentalPackage,
  days: number
): number | null {
  if (days <= 0) return null;
  if (days <= 3) return pkg.rates.days1to3;
  if (days <= 6) return pkg.rates.days4to6;
  if (days <= 20) return pkg.rates.days7to20;
  if (days <= 30) return pkg.rates.days21to30;
  return pkg.rates.days21to30;
}

export function formatRate(rate: number | null): string {
  if (rate == null) return "On request";
  return `฿${rate.toLocaleString("en-US")}`;
}
