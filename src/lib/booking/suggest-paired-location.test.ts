import { describe, expect, it } from "vitest";
import { suggestPairedLocation } from "@/lib/booking/suggest-paired-location";

describe("suggestPairedLocation", () => {
  it("defaults Krabi Airport to Krabi Town when drop-off empty", () => {
    expect(suggestPairedLocation("kbv-airport", "")).toBe("krabi-town");
  });

  it("keeps a valid priced drop-off", () => {
    expect(suggestPairedLocation("kbv-airport", "ao-nang-beach")).toBeNull();
  });

  it("suggests airport when picking Krabi Town with empty pickup", () => {
    expect(suggestPairedLocation("krabi-town", "")).toBe("kbv-airport");
  });
});
