import type { BookingLeg } from "@/lib/types";

/** Build a return leg by reversing the outbound route and place names. */
export function createReturnLegFromOutbound(
  outbound: BookingLeg,
  id: string = crypto.randomUUID()
): BookingLeg {
  return {
    id,
    fromId: outbound.toId,
    toId: outbound.fromId,
    date: outbound.date,
    time: "14:00",
    vehicleCode: outbound.vehicleCode,
    price: outbound.price,
    pickupPlace: outbound.hotelName,
    hotelName: outbound.pickupPlace,
  };
}
