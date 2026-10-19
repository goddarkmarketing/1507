import { describe, expect, it } from "vitest";
import { mergeRentalPackages, mergeTransferRoutes } from "@/lib/admin/catalog-csv";
import type { OfficialTransferRoute } from "@/lib/data/transfer-routes";
import type { RentalPackage } from "@/lib/types";

const car = (id: string, model: string, days1to3: number, image = ""): RentalPackage => ({
  id,
  category: "Economy",
  model,
  engine: "1.2",
  transmission: "Automatic",
  seats: 5,
  largeBags: 1,
  doors: 4,
  rates: { days1to3, days4to6: null, days7to20: null, days21to30: null },
  image,
});

const route = (fromId: string, toId: string, eco: number, name?: string): OfficialTransferRoute => ({
  fromId,
  toId,
  distanceKm: 10,
  durationMin: 20,
  category: "city",
  prices: { ECO: eco, PREM: 0, SUV: 0, VAN: 0, EXE: 0, VIP: 0, SIG: 0, BUS: 0 },
  ...(name ? { name } : {}),
});

describe("mergeRentalPackages", () => {
  it("updates matching cars, appends new ones and keeps the rest", () => {
    const existing = [car("yaris", "Toyota Yaris", 900, "/a.webp"), car("city", "Honda City", 1000, "/b.webp")];
    const imported = [car("rental-toyota-yaris", "toyota yaris", 950), car("rental-mazda-2", "Mazda 2", 1100)];
    const merged = mergeRentalPackages(existing, imported);

    expect(merged.updated).toBe(1);
    expect(merged.added).toBe(1);
    expect(merged.rows.map((r) => r.id)).toEqual(["yaris", "city", "rental-mazda-2"]);
    expect(merged.rows[0].rates.days1to3).toBe(950);
    expect(merged.rows[0].image).toBe("/a.webp");
    expect(merged.rows[1].rates.days1to3).toBe(1000);
  });
});

describe("mergeTransferRoutes", () => {
  it("replaces the same pair in either direction and keeps other routes", () => {
    const existing = [route("kbv-airport", "ao-nang", 600, "Airport to Ao Nang"), route("kbv-airport", "krabi-town", 400)];
    const imported = [route("ao-nang", "kbv-airport", 650), route("kbv-airport", "ao-nam-mao", 700)];
    const merged = mergeTransferRoutes(existing, imported);

    expect(merged.updated).toBe(1);
    expect(merged.added).toBe(1);
    expect(merged.rows).toHaveLength(3);
    expect(merged.rows[0].prices.ECO).toBe(650);
    expect(merged.rows[0].name).toBe("Airport to Ao Nang");
    expect(merged.rows[1].prices.ECO).toBe(400);
  });
});
