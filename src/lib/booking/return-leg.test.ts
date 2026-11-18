import { describe, expect, it } from "vitest";
import { createReturnLegFromOutbound } from "@/lib/booking/return-leg";
import type { BookingLeg } from "@/lib/types";

const outbound: BookingLeg = {
  id: "out",
  fromId: "kbv-airport",
  toId: "ao-nang-beach",
  date: "2026-11-20",
  time: "11:30",
  vehicleCode: "VAN",
  price: 900,
  pickupPlace: "KBV Arrivals",
  hotelName: "Ao Nang Villa",
};

describe("createReturnLegFromOutbound", () => {
  it("reverses route, places, and keeps the vehicle", () => {
    const ret = createReturnLegFromOutbound(outbound, "ret");
    expect(ret).toEqual({
      id: "ret",
      fromId: "ao-nang-beach",
      toId: "kbv-airport",
      date: "2026-11-20",
      time: "14:00",
      vehicleCode: "VAN",
      price: 900,
      pickupPlace: "Ao Nang Villa",
      hotelName: "KBV Arrivals",
    });
  });
});
