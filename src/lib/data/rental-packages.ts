import type { RentalCategory, RentalPackage } from "@/lib/types";
import { getImportedRentalPackages } from "@/lib/admin/catalog-store";

/** Correct stock photos per package — used when catalog has wrong/shared placeholders. */
export const RENTAL_STOCK_IMAGES: Record<string, string> = {
  "toyota-yaris": "/vehicles/toyota/yaris.webp",
  "toyota-ativ": "/vehicles/toyota/yarisativ.webp",
  "toyota-yaris-cross": "/vehicles/toyota/yariscross.webp",
  "toyota-corolla-altis": "/vehicles/toyota/altis.webp",
  "toyota-camry": "/vehicles/toyota/camry.webp",
  "toyota-corolla-cross": "/vehicles/toyota/corollacross.webp",
  "toyota-veloz": "/vehicles/toyota/veloz.webp",
  "toyota-innova-zenix": "/vehicles/toyota/innovazenix.webp",
  "toyota-alphard": "/vehicles/toyota/alphard.webp",
  "toyota-hiace-commuter": "/vehicles/toyota/commuter.webp",
};

function withStockImage(pkg: RentalPackage): RentalPackage {
  const stock = RENTAL_STOCK_IMAGES[pkg.id];
  if (!stock) return pkg;
  // Keep photos staff uploaded in admin (data URLs / remote uploads).
  if (pkg.image?.startsWith("data:") || pkg.image?.startsWith("blob:")) return pkg;
  if (pkg.image?.includes("://") && !pkg.image.includes("/vehicles/toyota/")) {
    return pkg;
  }
  return { ...pkg, image: stock };
}

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
    doors: 4,
    rates: { days1to3: 1000, days4to6: 900, days7to20: 800, days21to30: 700 },
    image: RENTAL_STOCK_IMAGES["toyota-yaris"],
  },
  {
    id: "toyota-ativ",
    category: "Mini Car",
    model: "Toyota Yaris Ativ",
    engine: "1200 CC",
    transmission: "Automatic",
    seats: 5,
    largeBags: 1,
    doors: 4,
    rates: { days1to3: 1000, days4to6: 900, days7to20: 800, days21to30: 700 },
    image: RENTAL_STOCK_IMAGES["toyota-ativ"],
  },
  {
    id: "toyota-yaris-cross",
    category: "Economy",
    model: "Toyota Yaris Cross",
    engine: "1500 CC",
    transmission: "Automatic",
    seats: 5,
    largeBags: 1,
    doors: 4,
    rates: { days1to3: 1200, days4to6: 1100, days7to20: 900, days21to30: 800 },
    image: RENTAL_STOCK_IMAGES["toyota-yaris-cross"],
  },
  {
    id: "toyota-corolla-altis",
    category: "Economy",
    model: "Toyota Corolla Altis",
    engine: "1800 CC",
    transmission: "Automatic",
    seats: 5,
    largeBags: 1,
    doors: 4,
    rates: { days1to3: 1200, days4to6: 1100, days7to20: 900, days21to30: 800 },
    image: RENTAL_STOCK_IMAGES["toyota-corolla-altis"],
  },
  {
    id: "toyota-camry",
    category: "Economy",
    model: "Toyota Camry",
    engine: "2500 CC",
    transmission: "Automatic",
    seats: 5,
    largeBags: 2,
    doors: 4,
    rates: { days1to3: 1100, days4to6: 1000, days7to20: 800, days21to30: 750 },
    image: RENTAL_STOCK_IMAGES["toyota-camry"],
  },
  {
    id: "toyota-corolla-cross",
    category: "Economy",
    model: "Toyota Corolla Cross",
    engine: "1800 CC",
    transmission: "Automatic",
    seats: 5,
    largeBags: 2,
    doors: 4,
    rates: { days1to3: 1400, days4to6: 1300, days7to20: 1200, days21to30: 950 },
    image: RENTAL_STOCK_IMAGES["toyota-corolla-cross"],
  },
  {
    id: "toyota-veloz",
    category: "Compact",
    model: "Toyota Veloz",
    engine: "1500 CC",
    transmission: "Automatic",
    seats: 7,
    largeBags: 2,
    doors: 4,
    rates: { days1to3: 1500, days4to6: 1400, days7to20: 1300, days21to30: 1200 },
    image: RENTAL_STOCK_IMAGES["toyota-veloz"],
  },
  {
    id: "toyota-innova-zenix",
    category: "Compact",
    model: "Toyota Innova Zenix",
    engine: "2000 CC",
    transmission: "Automatic",
    seats: 7,
    largeBags: 2,
    doors: 4,
    rates: { days1to3: 1500, days4to6: 1400, days7to20: 1300, days21to30: 1200 },
    image: RENTAL_STOCK_IMAGES["toyota-innova-zenix"],
  },
  {
    id: "toyota-alphard",
    category: "Full Size",
    model: "Toyota Alphard",
    engine: "2500 CC",
    transmission: "Automatic",
    seats: 7,
    largeBags: 2,
    doors: 4,
    rates: { days1to3: 2000, days4to6: 1900, days7to20: 1700, days21to30: 1550 },
    image: RENTAL_STOCK_IMAGES["toyota-alphard"],
  },
  {
    id: "toyota-hiace-commuter",
    category: "Full Size",
    model: "Toyota Hiace Commuter",
    engine: "2800 CC",
    transmission: "Automatic",
    seats: 13,
    largeBags: 4,
    doors: 4,
    rates: { days1to3: null, days4to6: null, days7to20: null, days21to30: null },
    image: RENTAL_STOCK_IMAGES["toyota-hiace-commuter"],
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

export function getActiveRentalPackages(): RentalPackage[] {
  const rows = getImportedRentalPackages() ?? rentalPackages;
  return rows.map(withStockImage);
}

export function getRentalPackage(id: string): RentalPackage | undefined {
  return getActiveRentalPackages().find((p) => p.id === id);
}

export function getPackagesByCategory(category: RentalCategory): RentalPackage[] {
  return getActiveRentalPackages().filter((p) => p.category === category);
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

export function formatRate(
  rate: number | null,
  onRequestLabel = "On request"
): string {
  if (rate == null) return onRequestLabel;
  return `฿${rate.toLocaleString("en-US")}`;
}
