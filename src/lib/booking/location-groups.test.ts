import { describe, expect, it } from "vitest";
import { locations } from "@/lib/data/locations";
import { groupLocations } from "@/lib/booking/location-groups";
import { set1RouteLabel } from "@/lib/data/set1-place-names";

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

  it("locks Price Checker pickup and dropoff to Set 1 places only", () => {
    const pickup = groupLocations(locations, "pickup", {
      tariffScope: "set1",
      query: "",
      getName,
    }).flatMap((g) => g.locations.map((l) => l.id));
    const dropoff = groupLocations(locations, "dropoff", {
      tariffScope: "set1",
      query: "centara",
      getName,
    }).flatMap((g) => g.locations.map((l) => l.id));
    const aoNang = groupLocations(locations, "dropoff", {
      tariffScope: "set1",
      query: "Ao Nang",
      getName,
    }).flatMap((g) => g.locations.map((l) => l.id));

    expect(pickup).toContain("kbv-airport");
    expect(pickup).toContain("krabi-town");
    expect(pickup).toContain("ao-nang-beach");
    expect(pickup.some((id) => id.includes("centara"))).toBe(false);
    expect(dropoff).toEqual([]);
    expect(aoNang).toContain("ao-nang-beach");
  });

  it("finds Krabi Airport from the short price-sheet name", () => {
    const ids = groupLocations(locations, "pickup", {
      tariffScope: "set1",
      query: "Krabi Airport",
      getName,
    }).flatMap((g) => g.locations.map((l) => l.id));
    expect(ids).toContain("kbv-airport");
  });

  it("labels Set 1 rows like the price sheet", () => {
    expect(set1RouteLabel("krabi-town", "en")).toBe(
      "Krabi Airport ↔ Krabi Town"
    );
    expect(set1RouteLabel("krabi-bus-terminal", "en")).toBe(
      "Krabi Airport ↔ Krabi Bus Terminal"
    );
    expect(set1RouteLabel("chao-fah-pier", "en")).toBe(
      "Krabi Airport ↔ Chao Fah Pier"
    );
    expect(set1RouteLabel("krabi-town", "th")).toBe(
      "สนามบินกระบี่ ↔ ตัวเมืองกระบี่"
    );
  });

  it("matches the Thai sheet name for the airport", () => {
    const ids = groupLocations(locations, "pickup", {
      tariffScope: "set1",
      query: "สนามบินกระบี่",
      getName,
    }).flatMap((g) => g.locations.map((l) => l.id));
    expect(ids).toContain("kbv-airport");
  });
});
