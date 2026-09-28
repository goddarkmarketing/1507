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
    expect(snapshot?.vehicles?.ECO?.image).toBe("data:image/jpeg;base64,abc");
    expect(snapshot?.rentalPackages).toBeNull();
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
