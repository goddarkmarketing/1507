import { describe, expect, it } from "vitest";
import { calculatePrice } from "@/lib/data/pricing";

describe("official Set 1 tariff prices", () => {
  it("uses locked Excel prices for Krabi Airport → Ao Nang", () => {
    const quote = calculatePrice("kbv-airport", "ao-nang-beach", "ECO");
    expect(quote.isOfficial).toBe(true);
    expect(quote.totalPrice).toBe(500);
    expect(calculatePrice("kbv-airport", "ao-nang-beach", "VAN").totalPrice).toBe(
      700
    );
    expect(calculatePrice("kbv-airport", "ao-nang-beach", "VIP").totalPrice).toBe(
      5000
    );
  });

  it("uses locked Excel prices for Krabi Town", () => {
    const quote = calculatePrice("kbv-airport", "krabi-town", "ECO");
    expect(quote.isOfficial).toBe(true);
    expect(quote.totalPrice).toBe(400);
  });

  it("inherits Ao Nang tariff for Railay / Ao Nang Pier / hotels", () => {
    expect(calculatePrice("kbv-airport", "railay-beach", "ECO")).toMatchObject({
      isOfficial: true,
      totalPrice: 500,
    });
    expect(calculatePrice("kbv-airport", "ao-nang-pier", "ECO")).toMatchObject({
      isOfficial: true,
      totalPrice: 500,
    });
    expect(
      calculatePrice("kbv-airport", "centara-ao-nang", "ECO")
    ).toMatchObject({
      isOfficial: true,
      totalPrice: 500,
    });
  });

  it("marks non-tariff attraction routes as unofficial", () => {
    const quote = calculatePrice("krabi-town", "emerald-pool", "ECO");
    expect(quote.isOfficial).toBe(false);
  });
});
