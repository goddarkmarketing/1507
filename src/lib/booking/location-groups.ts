import type { Location, LocationType } from "@/lib/types";
import { getOfficialPartnerIds } from "@/lib/data/transfer-routes";

export type LocationSelectRole = "pickup" | "dropoff";

const PICKUP_TYPE_ORDER: LocationType[] = [
  "airport",
  "pier",
  "train_station",
  "bus_station",
  "city",
  "hotel",
  "beach",
  "attraction",
  "temple",
  "park",
  "viewpoint",
  "border",
  "province",
];

const DROPOFF_TYPE_ORDER: LocationType[] = [
  "city",
  "beach",
  "pier",
  "airport",
  "attraction",
  "temple",
  "park",
  "viewpoint",
  "train_station",
  "bus_station",
  "border",
  "province",
  "hotel",
];

export type LocationGroup = {
  type: LocationType;
  locations: Location[];
};

function matchesQuery(
  loc: Location,
  query: string,
  getName: (loc: Location) => string
) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    getName(loc).toLowerCase().includes(q) ||
    loc.name.toLowerCase().includes(q) ||
    loc.nameTh.includes(query.trim()) ||
    loc.province.toLowerCase().includes(q)
  );
}

function isPricedListLocation(
  loc: Location,
  partnerIds: Set<string>,
  query: string
) {
  // Empty search: only official tariff destinations (not hotels).
  if (!query.trim()) {
    return partnerIds.has(loc.id);
  }

  // Search: tariff destinations + hotels that inherit those areas.
  if (partnerIds.has(loc.id)) return true;
  if (loc.type === "hotel" && loc.pricingAreaId && partnerIds.has(loc.pricingAreaId)) {
    return true;
  }
  return false;
}

export function groupLocations(
  all: Location[],
  role: LocationSelectRole,
  options: {
    excludeId?: string;
    /** Other end of the route — locks the empty list to official tariff places. */
    pairedId?: string;
    query?: string;
    getName: (loc: Location) => string;
  }
): LocationGroup[] {
  const { excludeId, pairedId, query = "", getName } = options;
  const typeOrder =
    role === "pickup" ? PICKUP_TYPE_ORDER : DROPOFF_TYPE_ORDER;

  const partnerIds =
    pairedId && role === "dropoff"
      ? new Set(getOfficialPartnerIds(pairedId))
      : null;

  const filtered = all.filter((loc) => {
    if (loc.id === excludeId) return false;
    if (!matchesQuery(loc, query, getName)) return false;
    if (partnerIds && partnerIds.size > 0) {
      return isPricedListLocation(loc, partnerIds, query);
    }
    return true;
  });

  const byType = new Map<LocationType, Location[]>();
  for (const loc of filtered) {
    const list = byType.get(loc.type) ?? [];
    list.push(loc);
    byType.set(loc.type, list);
  }

  const groups: LocationGroup[] = [];
  const sortByName = (a: Location, b: Location) =>
    getName(a).localeCompare(getName(b), undefined, { sensitivity: "base" });

  for (const type of typeOrder) {
    const locs = byType.get(type);
    if (!locs?.length) continue;
    locs.sort(sortByName);
    groups.push({ type, locations: locs });
    byType.delete(type);
  }

  for (const [type, locs] of byType) {
    if (!locs.length) continue;
    locs.sort(sortByName);
    groups.push({ type, locations: locs });
  }

  return groups;
}
