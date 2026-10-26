import { getActiveCharterRates } from "@/lib/admin/settings-store";
import type { BookingService } from "@/lib/booking/booking-mode";
import { getNightDriverSurcharge } from "@/lib/booking/booking-rules";
import { getOfficialVehiclePrice } from "@/lib/data/pricing";
import type { BookingLeg, BookingType, VehicleCode } from "@/lib/types";

const CHARTER_MULTIPLIERS: Record<VehicleCode, number> = {
  ECO: 1,
  PREM: 1.25,
  SUV: 1.4,
  VAN: 1.6,
  VIP: 2,
  EXE: 2.2,
  SIG: 2.5,
  BUS: 3,
};

/** Tariff for one leg, or null when the route has no official price for that vehicle. */
export function tariffForLeg(
  type: BookingType | undefined,
  service: BookingService | undefined,
  leg: Pick<BookingLeg, "fromId" | "toId" | "vehicleCode">
): number | null {
  if (service === "rental") return null;
  if (type === "daily-charter" || type === "hourly-charter") {
    const rates = getActiveCharterRates();
    const base =
      type === "daily-charter" ? rates.daily : rates.hourly * rates.hourlyMinHours;
    return Math.round(base * (CHARTER_MULTIPLIERS[leg.vehicleCode] ?? 1));
  }
  return getOfficialVehiclePrice(leg.fromId, leg.toId, leg.vehicleCode);
}

/**
 * Official total for these legs, including the night-driver surcharge.
 * Null when any transfer leg has no tariff, so the admin keeps the current price.
 */
export function tariffTotal(
  type: BookingType | undefined,
  service: BookingService | undefined,
  legs: BookingLeg[]
): number | null {
  if (service === "rental" || legs.length === 0) return null;
  let sum = 0;
  for (const leg of legs) {
    const price = tariffForLeg(type, service, leg);
    if (price == null) return null;
    sum += price;
  }
  return sum + getNightDriverSurcharge(legs);
}

export function legsAtTariff(
  type: BookingType | undefined,
  service: BookingService | undefined,
  legs: BookingLeg[]
): BookingLeg[] | null {
  const next = legs.map((leg) => {
    const price = tariffForLeg(type, service, leg);
    return price == null ? null : { ...leg, price };
  });
  if (next.some((leg) => leg == null)) return null;
  return next as BookingLeg[];
}
