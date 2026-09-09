import { describe, expect, it } from "vitest";
import { normalizePhoneDigits } from "@/lib/booking/remote/serialize";

describe("normalizePhoneDigits", () => {
  it("keeps Thai local mobiles", () => {
    expect(normalizePhoneDigits("088 443 3309")).toBe("0884433309");
  });

  it("converts +66 to leading 0", () => {
    expect(normalizePhoneDigits("+66 88 443 3309")).toBe("0884433309");
  });
});
