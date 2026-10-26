import { describe, expect, it } from "vitest";
import { legsAtTariff, tariffTotal } from "@/lib/booking/admin-price";
import type { BookingLeg } from "@/lib/types";

function leg(vehicleCode: BookingLeg["vehicleCode"], time = "10:00"): BookingLeg {
  return {
    id: "l1",
    fromId: "kbv-airport",
    toId: "ao-nam-mao",
    date: "2026-10-25",
    time,
    vehicleCode,
    price: 800,
  };
}

describe("admin tariff repricing", () => {
  it("drops the price when the vehicle changes to a cheaper tariff", () => {
    expect(tariffTotal("one-way", "transfer", [leg("EXE")])).toBe(800);
    expect(tariffTotal("one-way", "transfer", [leg("ECO")])).toBe(500);
  });

  it("adds the night surcharge once for the order", () => {
    expect(tariffTotal("one-way", "transfer", [leg("ECO", "02:00")])).toBe(700);
  });

  it("keeps the current price when the route has no tariff", () => {
    const unknown = { ...leg("ECO"), fromId: "not-a-place", toId: "also-missing" };
    expect(tariffTotal("one-way", "transfer", [unknown])).toBeNull();
    expect(legsAtTariff("one-way", "transfer", [leg("ECO")])?.[0].price).toBe(500);
  });
});
