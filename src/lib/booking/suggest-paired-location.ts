import { getLocation } from "@/lib/data/locations";
import {
  getOfficialPartnerIds,
  getOfficialRoute,
} from "@/lib/data/transfer-routes";

/** Preferred drop-off / pair when a priced hub is selected. */
const PREFERRED_PAIR: Record<string, string> = {
  "kbv-airport": "krabi-town",
  "krabi-town": "kbv-airport",
  "krabi-bus-terminal": "kbv-airport",
  "chao-fah-pier": "kbv-airport",
  "ao-nang-beach": "kbv-airport",
  "ao-nam-mao": "kbv-airport",
  "klong-muang": "kbv-airport",
  "railay-beach": "kbv-airport",
};

function pricingId(id: string) {
  return getLocation(id)?.pricingAreaId ?? id;
}

function hasOfficialPrice(fromId: string, toId: string) {
  if (!fromId || !toId || fromId === toId) return false;
  return Boolean(getOfficialRoute(pricingId(fromId), pricingId(toId)));
}

/**
 * When user picks a location, suggest the other end of a priced route.
 * Keeps the current pair if it still has an official tariff price.
 */
export function suggestPairedLocation(
  selectedId: string,
  currentPairId: string
): string | null {
  if (!selectedId) return null;
  if (hasOfficialPrice(selectedId, currentPairId)) return null;

  const partners = getOfficialPartnerIds(selectedId);
  if (!partners.length) return null;

  const area = pricingId(selectedId);
  const preferred =
    PREFERRED_PAIR[selectedId] ?? PREFERRED_PAIR[area] ?? partners[0];

  if (preferred && preferred !== selectedId && partners.includes(preferred)) {
    return preferred;
  }

  return partners.find((id) => id !== selectedId) ?? null;
}
