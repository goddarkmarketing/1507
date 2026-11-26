import { getLocation } from "@/lib/data/locations";
import { getImportedTransferRoutes } from "@/lib/admin/catalog-store";
import {
  getOfficialRoute,
  officialTransferRoutes,
  routeHasPositiveFare,
  type OfficialTransferRoute,
} from "@/lib/data/transfer-routes";
import { getVehicle } from "@/lib/data/vehicles";
import type { RoutePrice, TransferCategory, VehicleCode } from "@/lib/types";

export type PricedRoute = RoutePrice & {
  totalPrice: number;
  /** True when price comes from the locked official tariff sheet */
  isOfficial: boolean;
};

const categoryBase: Record<TransferCategory, number> = {
  airport: 800,
  pier: 600,
  city: 400,
  hotel: 500,
  beach: 550,
  attraction: 700,
  "inter-province": 2500,
};

function detectCategory(fromId: string, toId: string): TransferCategory {
  const from = getLocation(fromId);
  const to = getLocation(toId);
  if (!from || !to) return "city";

  if (from.type === "airport" || to.type === "airport") return "airport";
  if (from.province !== to.province) return "inter-province";
  if (from.type === "pier" || to.type === "pier") return "pier";
  if (from.type === "hotel" || to.type === "hotel") return "hotel";
  if (from.type === "beach" || to.type === "beach") return "beach";
  if (
    from.type === "attraction" ||
    to.type === "attraction" ||
    from.type === "temple" ||
    to.type === "temple" ||
    from.type === "park" ||
    to.type === "park" ||
    from.type === "viewpoint" ||
    to.type === "viewpoint"
  ) {
    return "attraction";
  }
  return "city";
}

function estimateRoute(fromId: string, toId: string) {
  const from = getLocation(fromId);
  const to = getLocation(toId);
  const category = detectCategory(fromId, toId);
  const basePrice = categoryBase[category];

  const sameProvince = from && to && from.province === to.province;
  const distanceKm = sameProvince
    ? 15 + Math.abs(fromId.length - toId.length) * 3
    : 120;
  const durationMin = Math.round(distanceKm * (sameProvince ? 2.2 : 1.5));

  return {
    category,
    basePrice: basePrice + Math.round(distanceKm * (sameProvince ? 8 : 12)),
    durationMin,
    distanceKm,
  };
}

function pricingLocationId(id: string): string {
  return getLocation(id)?.pricingAreaId ?? id;
}

export function calculatePrice(
  fromId: string,
  toId: string,
  vehicleCode: VehicleCode
): PricedRoute {
  const priceFromId = pricingLocationId(fromId);
  const priceToId = pricingLocationId(toId);
  const official = getOfficialRoute(priceFromId, priceToId);
  if (official) {
    const fare = official.prices[vehicleCode] ?? 0;
    // Matrix rows with blank Excel prices stay bookable, but fare is admin-quoted.
    if (routeHasPositiveFare(official, vehicleCode)) {
      return {
        fromId,
        toId,
        basePrice: official.prices.ECO,
        durationMin: official.durationMin,
        distanceKm: official.distanceKm,
        category: official.category,
        totalPrice: fare,
        isOfficial: true,
      };
    }
    return {
      fromId,
      toId,
      basePrice: 0,
      durationMin: official.durationMin,
      distanceKm: official.distanceKm,
      category: official.category,
      totalPrice: 0,
      isOfficial: false,
    };
  }

  const route = estimateRoute(priceFromId, priceToId);
  const vehicle = getVehicle(vehicleCode);
  const multiplier = vehicle?.priceMultiplier ?? 1;
  const totalPrice = Math.round(route.basePrice * multiplier);

  return {
    fromId,
    toId,
    basePrice: route.basePrice,
    durationMin: route.durationMin,
    distanceKm: route.distanceKm,
    category: route.category,
    totalPrice,
    isOfficial: false,
  };
}

/**
 * Full Excel matrix in sheet order (incl. blank fares → “on request”).
 * Admin CSV imports overlay matching pairs without dropping unpriced rows.
 */
export function getSampleRoutes(): RoutePrice[] {
  const imported = getImportedTransferRoutes();
  const overlay = new Map<string, OfficialTransferRoute>();
  if (imported?.length) {
    for (const route of imported) {
      overlay.set(`${route.fromId}>${route.toId}`, route);
    }
  }

  return officialTransferRoutes.map((route) => {
    const hit =
      overlay.get(`${route.fromId}>${route.toId}`) ??
      overlay.get(`${route.toId}>${route.fromId}`);
    const src = hit ?? route;
    return {
      fromId: route.fromId,
      toId: route.toId,
      basePrice: src.prices.ECO,
      durationMin: src.durationMin,
      distanceKm: src.distanceKm,
      category: src.category,
    };
  });
}

export function routeHasOfficialPrice(
  fromId: string,
  toId: string,
  vehicleCode: VehicleCode
): boolean {
  return getOfficialVehiclePrice(fromId, toId, vehicleCode) != null;
}

export function getOfficialVehiclePrice(
  fromId: string,
  toId: string,
  vehicleCode: VehicleCode
): number | null {
  const quote = calculatePrice(fromId, toId, vehicleCode);
  return quote.isOfficial ? quote.totalPrice : null;
}

export const charterRates = {
  daily: { base: 3500, label: "Daily Charter (8 hrs)" },
  hourly: { base: 500, label: "Hourly Charter (min 3 hrs)" },
};
