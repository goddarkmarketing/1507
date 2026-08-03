import { getLocation } from "@/lib/data/locations";
import { getVehicle } from "@/lib/data/vehicles";
import type { RoutePrice, TransferCategory, VehicleCode } from "@/lib/types";

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
  const distanceKm = sameProvince ? 15 + Math.abs(fromId.length - toId.length) * 3 : 120;
  const durationMin = Math.round(distanceKm * (sameProvince ? 2.2 : 1.5));

  return {
    category,
    basePrice: basePrice + Math.round(distanceKm * (sameProvince ? 8 : 12)),
    durationMin,
    distanceKm,
  };
}

export function calculatePrice(
  fromId: string,
  toId: string,
  vehicleCode: VehicleCode
): RoutePrice & { totalPrice: number } {
  const route = estimateRoute(fromId, toId);
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
  };
}

export function getSampleRoutes(): RoutePrice[] {
  const pairs = [
    ["kbv-airport", "ao-nang-beach"],
    ["kbv-airport", "krabi-town"],
    ["kbv-airport", "railay-beach"],
    ["kbv-airport", "centara-ao-nang"],
    ["ao-nang-pier", "railay-beach"],
    ["krabi-town", "emerald-pool"],
    ["krabi-town", "tiger-cave"],
    ["kbv-airport", "phuket-airport"],
    ["kbv-airport", "trang-town"],
  ];

  return pairs.map(([fromId, toId]) => {
    const route = estimateRoute(fromId, toId);
    return {
      fromId,
      toId,
      basePrice: route.basePrice,
      durationMin: route.durationMin,
      distanceKm: route.distanceKm,
      category: route.category,
    };
  });
}

export const charterRates = {
  daily: { base: 3500, label: "Daily Charter (8 hrs)" },
  hourly: { base: 500, label: "Hourly Charter (min 3 hrs)" },
};
