import type { Location, LocationType } from "@/lib/types";

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
  "hotel",
  "beach",
  "city",
  "airport",
  "pier",
  "attraction",
  "temple",
  "park",
  "viewpoint",
  "train_station",
  "bus_station",
  "border",
  "province",
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

export function groupLocations(
  all: Location[],
  role: LocationSelectRole,
  options: {
    excludeId?: string;
    query?: string;
    getName: (loc: Location) => string;
  }
): LocationGroup[] {
  const { excludeId, query = "", getName } = options;
  const typeOrder =
    role === "pickup" ? PICKUP_TYPE_ORDER : DROPOFF_TYPE_ORDER;

  const filtered = all.filter(
    (loc) => loc.id !== excludeId && matchesQuery(loc, query, getName)
  );

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
