import type { Location, LocationType } from "@/lib/types";
import { SET1_PLACE_NAMES, set1RouteLabel } from "@/lib/data/set1-place-names";
import { getSet1LocationIds } from "@/lib/data/transfer-routes";

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

/** Short names from the price sheet, so "Krabi Airport" matches the longer airport title. */
const SEARCH_ALIASES: Record<string, string[]> = {
  "kbv-airport": ["krabi airport", "สนามบินกระบี่", "kbv"],
};

function matchesQuery(
  loc: Location,
  query: string,
  getName: (loc: Location) => string
) {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const sheet = SET1_PLACE_NAMES[loc.id];
  const hay = [
    getName(loc),
    loc.name,
    loc.nameTh,
    loc.province,
    sheet?.en ?? "",
    sheet?.th ?? "",
    set1RouteLabel(loc.id, "en") ?? "",
    set1RouteLabel(loc.id, "th") ?? "",
    ...(SEARCH_ALIASES[loc.id] ?? []),
  ]
    .join(" ")
    .toLowerCase();

  if (hay.includes(q)) return true;
  const words = q.split(/\s+/).filter(Boolean);
  return words.length > 0 && words.every((word) => hay.includes(word));
}

export function groupLocations(
  all: Location[],
  role: LocationSelectRole,
  options: {
    excludeId?: string;
    /** Other end of the route — locks the empty list to official tariff places. */
    pairedId?: string;
    /** Price Checker: both ends stay on Set 1 (airport ↔ 55), no hotels. */
    tariffScope?: "set1";
    /** Booking form lists hotels in the dropdown, not only via search. */
    includeHotels?: boolean;
    query?: string;
    getName: (loc: Location) => string;
  }
): LocationGroup[] {
  const { excludeId, tariffScope, includeHotels = false, query = "", getName } =
    options;
  const typeOrder =
    role === "pickup" ? PICKUP_TYPE_ORDER : DROPOFF_TYPE_ORDER;

  const set1Allowed =
    tariffScope === "set1" ? new Set(getSet1LocationIds()) : null;

  const filtered = all.filter((loc) => {
    if (loc.id === excludeId) return false;
    if (!matchesQuery(loc, query, getName)) return false;
    if (set1Allowed) return set1Allowed.has(loc.id);
    // Price checker hides hotels until search. Booking lists them up front.
    if (!includeHotels && !query.trim() && loc.type === "hotel") return false;
    return true;
  });

  if (tariffScope === "set1") {
    const order = getSet1LocationIds();
    const rank = new Map(order.map((id, index) => [id, index]));
    const locations = [...filtered].sort(
      (a, b) => (rank.get(a.id) ?? 999) - (rank.get(b.id) ?? 999)
    );
    return locations.length ? [{ type: "city", locations }] : [];
  }

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
