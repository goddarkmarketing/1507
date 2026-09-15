import { describe, expect, it } from "vitest";
import { locations } from "@/lib/data/locations";
import { groupLocations } from "@/lib/booking/location-groups";

const getName = (loc: { name: string }) => loc.name;

describe("groupLocations priced drop-off list", () => {
  it("shows official tariff destinations (not hotels) when paired to airport", () => {
    const groups = groupLocations(locations, "dropoff", {
      pairedId: "kbv-airport",
      query: "",
      getName,
    });
    const ids = groups.flatMap((g) => g.locations.map((l) => l.id));
    expect(ids.length).toBeGreaterThan(20);
    expect(ids).toContain("ao-nang-beach");
    expect(ids).toContain("krabi-town");
    expect(ids.some((id) => id.includes("centara"))).toBe(false);
    expect(groups.some((g) => g.type === "hotel")).toBe(false);
  });

  it("allows hotel search that maps to a tariff area", () => {
    const groups = groupLocations(locations, "dropoff", {
      pairedId: "kbv-airport",
      query: "centara",
      getName,
    });
    const ids = groups.flatMap((g) => g.locations.map((l) => l.id));
    expect(ids.some((id) => id.includes("centara"))).toBe(true);
  });
});
