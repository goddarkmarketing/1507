import { describe, expect, it } from "vitest";
import { getOfficialVehiclePrice } from "@/lib/data/pricing";
import { getOfficialRoute } from "@/lib/data/transfer-routes";

describe("Ao Nang ↔ Koh Lanta Zone 1 tariff", () => {
  it("has official one-way prices both directions for ECO", () => {
    expect(getOfficialRoute("ao-nang-beach", "koh-lanta-z1")).toBeTruthy();
    expect(getOfficialVehiclePrice("ao-nang-beach", "koh-lanta-z1", "ECO")).toBe(2200);
    expect(getOfficialVehiclePrice("koh-lanta-z1", "ao-nang-beach", "ECO")).toBe(2200);
  });

  it("prices the common vehicle classes", () => {
    expect(getOfficialVehiclePrice("ao-nang-beach", "koh-lanta-z1", "PREM")).toBe(2400);
    expect(getOfficialVehiclePrice("ao-nang-beach", "koh-lanta-z1", "SUV")).toBe(2400);
    expect(getOfficialVehiclePrice("ao-nang-beach", "koh-lanta-z1", "VAN")).toBe(2500);
    expect(getOfficialVehiclePrice("ao-nang-beach", "koh-lanta-z1", "EXE")).toBe(2800);
  });
});
