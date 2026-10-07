import { describe, expect, it } from "vitest";
import { normalizeSiteCatalog } from "@/lib/admin/catalog-remote";

describe("normalizeSiteCatalog", () => {
  it("keeps a priced route and a vehicle photo", () => {
    const snapshot = normalizeSiteCatalog({
      transferRoutes: [
        {
          fromId: "kbv-airport",
          toId: "krabi-town",
          distanceKm: 15,
          durationMin: 33,
          category: "city",
          name: "สนามบินกระบี่ ↔ ตัวเมืองกระบี่",
          prices: { ECO: 450, PREM: 500, SUV: 500, VAN: 600, EXE: 700, VIP: 4000, SIG: 4000, BUS: 4000 },
        },
      ],
      rentalPackages: null,
      vehicles: {
        ECO: {
          code: "ECO",
          passengers: "1–3",
          amenityKeys: ["ac"],
          priceMultiplier: 1,
          image: "data:image/jpeg;base64,abc",
        },
      },
      updatedAt: "2026-09-28T00:00:00.000Z",
    });

    expect(snapshot?.transferRoutes?.[0].prices.ECO).toBe(450);
    expect(snapshot?.transferRoutes?.[0].name).toBe("สนามบินกระบี่ ↔ ตัวเมืองกระบี่");
    expect(snapshot?.vehicles?.ECO?.image).toBe("data:image/jpeg;base64,abc");
    expect(snapshot?.rentalPackages).toBeNull();
    expect(snapshot?.rentalBookingEnabled).toBe(false);
  });

  it("reads the rental switch from the shared catalog", () => {
    const snapshot = normalizeSiteCatalog({
      rentalPackages: { enabled: true, packages: null },
    });
    expect(snapshot?.rentalBookingEnabled).toBe(true);
    expect(snapshot?.rentalPackages).toBeNull();
  });

  it("keeps an empty rental list after every car is removed", () => {
    const snapshot = normalizeSiteCatalog({
      rentalPackages: { enabled: false, packages: [] },
    });
    expect(snapshot?.rentalPackages).toEqual([]);
  });

  it("drops a vehicle photo that is too large", () => {
    const snapshot = normalizeSiteCatalog({
      vehicles: {
        ECO: {
          passengers: "1–3",
          amenityKeys: [],
          priceMultiplier: 1,
          image: "x".repeat(250_001),
        },
      },
    });
    expect(snapshot?.vehicles).toBeNull();
  });
});
