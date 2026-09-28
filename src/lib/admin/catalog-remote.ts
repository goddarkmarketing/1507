import type { OfficialTransferRoute } from "@/lib/data/transfer-routes";
import { getBookingAdminSecret } from "@/lib/booking/remote/config";
import { getSupabase } from "@/lib/booking/remote/supabase";
import type { RentalPackage, Vehicle, VehicleCode } from "@/lib/types";

const VEHICLE_CODES: VehicleCode[] = [
  "ECO",
  "PREM",
  "SUV",
  "VAN",
  "VIP",
  "SIG",
  "EXE",
  "BUS",
];

export type CatalogSection = "transferRoutes" | "rentalPackages" | "vehicles";

export type SiteCatalogSnapshot = {
  transferRoutes: OfficialTransferRoute[] | null;
  rentalPackages: RentalPackage[] | null;
  vehicles: Partial<Record<VehicleCode, Vehicle>> | null;
  updatedAt: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asRoute(value: unknown): OfficialTransferRoute | null {
  if (!isRecord(value)) return null;
  const fromId = value.fromId;
  const toId = value.toId;
  const prices = value.prices;
  if (typeof fromId !== "string" || typeof toId !== "string" || !isRecord(prices)) {
    return null;
  }
  const num = (key: string) => {
    const n = prices[key];
    return typeof n === "number" && Number.isFinite(n) ? n : null;
  };
  const eco = num("ECO");
  if (eco == null) return null;
  const price = (key: string) => num(key) ?? eco;
  return {
    fromId,
    toId,
    distanceKm: typeof value.distanceKm === "number" ? value.distanceKm : 0,
    durationMin: typeof value.durationMin === "number" ? value.durationMin : 0,
    category:
      typeof value.category === "string"
        ? (value.category as OfficialTransferRoute["category"])
        : "city",
    prices: {
      ECO: eco,
      PREM: price("PREM"),
      SUV: price("SUV"),
      VAN: price("VAN"),
      EXE: price("EXE"),
      VIP: price("VIP"),
      SIG: price("SIG"),
      BUS: price("BUS"),
    },
  };
}

function asRental(value: unknown): RentalPackage | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string" || typeof value.model !== "string") return null;
  if (!isRecord(value.rates) || typeof value.image !== "string") return null;
  const rate = (key: string) => {
    const n = value.rates && isRecord(value.rates) ? value.rates[key] : null;
    return typeof n === "number" && Number.isFinite(n) ? n : null;
  };
  return {
    id: value.id,
    category: value.category as RentalPackage["category"],
    model: value.model,
    engine: typeof value.engine === "string" ? value.engine : "",
    transmission: "Automatic",
    seats: typeof value.seats === "number" ? value.seats : 0,
    largeBags: typeof value.largeBags === "number" ? value.largeBags : 0,
    doors: typeof value.doors === "number" ? value.doors : 4,
    rates: {
      days1to3: rate("days1to3"),
      days4to6: rate("days4to6"),
      days7to20: rate("days7to20"),
      days21to30: rate("days21to30"),
    },
    image: value.image,
  };
}

function asVehicle(code: string, value: unknown): Vehicle | null {
  if (!VEHICLE_CODES.includes(code as VehicleCode) || !isRecord(value)) return null;
  if (typeof value.image !== "string" || value.image.length > 250_000) return null;
  if (typeof value.passengers !== "string") return null;
  if (typeof value.priceMultiplier !== "number") return null;
  const amenityKeys = Array.isArray(value.amenityKeys)
    ? value.amenityKeys.filter((key): key is string => typeof key === "string")
    : [];
  return {
    code: code as VehicleCode,
    passengers: value.passengers,
    amenityKeys,
    priceMultiplier: value.priceMultiplier,
    image: value.image,
  };
}

export function normalizeSiteCatalog(raw: unknown): SiteCatalogSnapshot | null {
  if (!isRecord(raw)) return null;
  const routes = Array.isArray(raw.transferRoutes)
    ? raw.transferRoutes.map(asRoute).filter((row): row is OfficialTransferRoute => Boolean(row))
    : null;
  const rentals = Array.isArray(raw.rentalPackages)
    ? raw.rentalPackages.map(asRental).filter((row): row is RentalPackage => Boolean(row))
    : null;
  const vehicles: Partial<Record<VehicleCode, Vehicle>> = {};
  if (isRecord(raw.vehicles)) {
    for (const [code, value] of Object.entries(raw.vehicles)) {
      const vehicle = asVehicle(code, value);
      if (vehicle) vehicles[vehicle.code] = vehicle;
    }
  }
  const hasVehicles = Object.keys(vehicles).length > 0;
  return {
    transferRoutes: routes && routes.length ? routes : null,
    rentalPackages: rentals && rentals.length ? rentals : null,
    vehicles: hasVehicles ? vehicles : null,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
  };
}

export async function pullSiteCatalog(): Promise<SiteCatalogSnapshot | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_site_catalog");
  if (error || data == null) return null;
  return normalizeSiteCatalog(data);
}

export async function publishCatalogSection(
  section: CatalogSection,
  payload: unknown | null
): Promise<"saved" | "local" | "failed"> {
  const supabase = getSupabase();
  const secret = getBookingAdminSecret();
  if (!supabase || !secret) return "local";
  const { error } = await supabase.rpc("save_site_catalog", {
    p_secret: secret,
    p_section: section,
    p_payload: payload,
  });
  return error ? "failed" : "saved";
}
