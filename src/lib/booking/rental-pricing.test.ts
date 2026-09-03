import { describe, expect, it } from "vitest";
import {
  calculateRentalTotal,
  getDefaultRentalPackageId,
} from "@/lib/booking/rental-pricing";

describe("rental-pricing", () => {
  it("returns a default package id", () => {
    expect(getDefaultRentalPackageId()).toBeTruthy();
  });

  it("calculates multi-day totals from package rates", () => {
    const id = getDefaultRentalPackageId();
    const three = calculateRentalTotal(id, 3);
    const seven = calculateRentalTotal(id, 7);
    expect(three).toBeGreaterThan(0);
    expect(seven).toBeGreaterThan(three);
  });

  it("returns 0 for invalid inputs", () => {
    expect(calculateRentalTotal("missing-package", 3)).toBe(0);
    expect(calculateRentalTotal(getDefaultRentalPackageId(), 0)).toBe(0);
  });
});
