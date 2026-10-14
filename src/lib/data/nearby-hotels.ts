import { getLocation, locations } from "@/lib/data/locations";
import type { Location } from "@/lib/types";

/**
 * Four resorts with photos of the property itself (Wikimedia Commons).
 * Sofitel Krabi — CC BY-SA 3.0, Crystalperido
 * Nakamanda — CC BY-SA 4.0, Kate Branch
 * Pimalai — CC BY 3.0, josef knecht
 * Tubkaak — CC BY-SA 3.0, ::::=UT=::::
 */
const FEATURED_HOTEL_IMAGES: Record<string, string> = {
  "sofitel-krabi": "/images/hotels/sofitel-krabi.jpg",
  "nakamanda-resort": "/images/hotels/nakamanda.jpg",
  "pimalai-resort": "/images/hotels/pimalai.jpg",
  "tubkaak-krabi-resort": "/images/hotels/tubkaak.jpg",
};

const FEATURED_HOTEL_IDS = Object.keys(FEATURED_HOTEL_IMAGES);

const FEATURED_CARD_TITLES: Record<string, { th: string; en: string }> = {
  "sofitel-krabi": { th: "โซฟิเทล กระบี่", en: "Sofitel Krabi" },
  "nakamanda-resort": { th: "นาคามันดา", en: "Nakamanda" },
  "pimalai-resort": { th: "พิมาลัย", en: "Pimalai" },
  "tubkaak-krabi-resort": { th: "เดอะ ทับแค", en: "The Tubkaak" },
};

export function hotelAreaId(locationId: string): string {
  const loc = getLocation(locationId);
  if (!loc) return locationId;
  return loc.pricingAreaId ?? loc.id;
}

export function featuredHotels(): Location[] {
  return FEATURED_HOTEL_IDS.map((id) => locations.find((loc) => loc.id === id)).filter(
    (loc): loc is Location => Boolean(loc)
  );
}

export function catalogHotels(): Location[] {
  const hotels = locations.filter((loc) => loc.type === "hotel");
  const featured = new Set(FEATURED_HOTEL_IDS);
  return [
    ...featuredHotels(),
    ...hotels.filter((hotel) => !featured.has(hotel.id)),
  ];
}

export function hotelImage(hotel: Location): string | null {
  return FEATURED_HOTEL_IMAGES[hotel.id] ?? null;
}

export function hotelCardTitle(hotel: Location, locale: string): string {
  const title = FEATURED_CARD_TITLES[hotel.id];
  if (!title) return locale === "th" && hotel.nameTh ? hotel.nameTh : hotel.name;
  return locale === "th" ? title.th : title.en;
}
