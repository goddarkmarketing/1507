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

function placeName(loc: Location | null | undefined, locale: string) {
  if (!loc) return "";
  const full = locale === "th" && loc.nameTh ? loc.nameTh : loc.name;
  return full.split("(")[0].trim();
}

/** Priced area for a dropoff. Hotels use their tariff zone, not the resort name. */
export function dropoffAreaName(toId: string, locale: string): string {
  const loc = getLocation(toId);
  if (!loc) return "";
  const area = loc.pricingAreaId ? (getLocation(loc.pricingAreaId) ?? loc) : loc;
  return placeName(area, locale);
}

/** Resort the guest asked for: a listed hotel, or a name they typed. */
export function dropoffHotelName(
  toId: string,
  hotelName: string | undefined,
  locale: string
): string {
  const custom = hotelName?.trim();
  if (custom) return custom;
  const loc = getLocation(toId);
  if (loc?.type === "hotel") return placeName(loc, locale);
  return "";
}

/** Area, then the hotel when it is a different place. */
export function dropoffDetailLabel(
  toId: string,
  hotelName: string | undefined,
  locale: string
): string {
  const area = dropoffAreaName(toId, locale);
  const hotel = dropoffHotelName(toId, hotelName, locale);
  if (hotel && area && hotel !== area) return `${area} · ${hotel}`;
  return hotel || area;
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
