import { getLocation } from "@/lib/data/locations";

/** Show route preview when pickup is an airport and drop-off is a hotel. */
export function shouldShowRoutePreview(fromId: string, toId: string) {
  if (!fromId || !toId || fromId === toId) return false;

  const from = getLocation(fromId);
  const to = getLocation(toId);
  if (!from || !to) return false;

  return from.type === "airport" && to.type === "hotel";
}

export function routePreviewKey(fromId: string, toId: string) {
  return `${fromId}>${toId}`;
}
