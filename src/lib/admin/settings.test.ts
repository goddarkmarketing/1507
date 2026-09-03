import { describe, expect, it } from "vitest";
import { defaultSiteSettings } from "@/lib/admin/settings";

describe("defaultSiteSettings", () => {
  it("enables bank transfer and promptpay only by default", () => {
    const settings = defaultSiteSettings();
    expect(settings.payment.methods["bank-transfer"]).toBe(true);
    expect(settings.payment.methods.promptpay).toBe(true);
    expect(settings.payment.methods.card).toBe(false);
    expect(settings.payment.methods.cash).toBe(false);
  });

  it("includes rental deposit defaults", () => {
    const settings = defaultSiteSettings();
    expect(settings.rentalDeposits).toEqual({
      advanceDeposit: 500,
      smallCarDeposit: 3000,
      largeCarDeposit: 5000,
    });
  });
});
