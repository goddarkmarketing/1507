import type { TransferCategory, VehicleCode } from "@/lib/types";
import { getImportedTransferRoutes } from "@/lib/admin/catalog-store";
import { getLocation } from "@/lib/data/locations";
import transferRoutesData from "@/lib/data/transfer-routes-data.json";

export type OfficialVehiclePrices = Record<VehicleCode, number>;

export type OfficialTransferRoute = {
  fromId: string;
  toId: string;
  distanceKm: number;
  durationMin: number;
  category: TransferCategory;
  prices: OfficialVehiclePrices;
  /** Optional sheet label edited in admin. Empty keeps the built-in name. */
  name?: string;
};

/** Full directional matrix from KRABI_LINKS_TAXI_3080_Routes_Origin_Category_First.xlsx */
export const officialTransferRoutes: OfficialTransferRoute[] =
  transferRoutesData as OfficialTransferRoute[];

/** Krabi Airport outbound rows, in sheet order. */
const set1OfficialRoutes: OfficialTransferRoute[] =
  officialTransferRoutes.filter((route) => route.fromId === "kbv-airport");

const routeIndex = new Map<string, OfficialTransferRoute>();
for (const route of officialTransferRoutes) {
  // Full matrix already has both directions — index exact legs only.
  routeIndex.set(`${route.fromId}>${route.toId}`, route);
}

export function routeHasPositiveFare(
  route: Pick<OfficialTransferRoute, "prices">,
  vehicleCode?: VehicleCode
): boolean {
  if (vehicleCode) return (route.prices[vehicleCode] ?? 0) > 0;
  return (route.prices.ECO ?? 0) > 0;
}

export function getOfficialRoute(
  fromId: string,
  toId: string
): OfficialTransferRoute | undefined {
  const imported = getImportedTransferRoutes();
  if (imported?.length) {
    const hit = imported.find(
      (route) =>
        (route.fromId === fromId && route.toId === toId) ||
        (route.fromId === toId && route.toId === fromId)
    );
    // Imported sheets may be partial (e.g. airport-only). Keep built-in
    // tariff rows so routes like Ao Nang ↔ Koh Lanta still price.
    if (hit) return hit;
  }
  return (
    routeIndex.get(`${fromId}>${toId}`) ??
    // Fallback when a one-sided import overwrote only one direction.
    routeIndex.get(`${toId}>${fromId}`)
  );
}

export function getActiveOfficialRoutes(): OfficialTransferRoute[] {
  const imported = getImportedTransferRoutes();
  return imported?.length ? imported : officialTransferRoutes;
}

/** Priced rows only — used by public price list / samples. */
export function getPricedOfficialRoutes(): OfficialTransferRoute[] {
  return getActiveOfficialRoutes().filter((route) => routeHasPositiveFare(route));
}

/** Set 1 sheet only: Krabi Airport ↔ destinations, in sheet order. */
export function getSet1OfficialRoutes(): OfficialTransferRoute[] {
  return set1OfficialRoutes;
}

const AIRPORT_HUB = "kbv-airport";

/** Airport routes in file order. Imported rows win, otherwise the Set 1 sheet. */
export function getAirportSheetRoutes(): OfficialTransferRoute[] {
  const imported = getImportedTransferRoutes();
  const source = imported?.length ? imported : set1OfficialRoutes;
  const seen = new Set<string>();
  const rows: OfficialTransferRoute[] = [];
  for (const route of source) {
    const toId =
      route.fromId === AIRPORT_HUB
        ? route.toId
        : route.toId === AIRPORT_HUB
          ? route.fromId
          : null;
    if (!toId || seen.has(toId)) continue;
    seen.add(toId);
    rows.push(
      route.fromId === AIRPORT_HUB
        ? route
        : { ...route, fromId: AIRPORT_HUB, toId }
    );
  }
  return rows;
}

/** Set 1 sheet only: Krabi Airport ↔ destinations. */
export function getSet1LocationIds(): string[] {
  const ids = new Set<string>();
  for (const route of set1OfficialRoutes) {
    ids.add(route.fromId);
    ids.add(route.toId);
  }
  return [...ids];
}

/** Opposite ends of official tariff rows for a location (uses pricingAreaId when set). */
export function getOfficialPartnerIds(locationId: string): string[] {
  if (!locationId) return [];
  const areaId = getLocation(locationId)?.pricingAreaId ?? locationId;
  const partners = new Set<string>();
  for (const route of getActiveOfficialRoutes()) {
    if (route.fromId === areaId) partners.add(route.toId);
    if (route.toId === areaId) partners.add(route.fromId);
  }
  return [...partners];
}
