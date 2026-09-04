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

  it("includes live bank and PromptPay receiving accounts", () => {
    const settings = defaultSiteSettings();
    expect(settings.payment.promptPayId).toBe("088-443-3309");
    expect(settings.payment.promptPayAccountName).toContain("จักรภัทร์");
    const kbank = settings.payment.banks.find((b) => b.symbol === "KBANK");
    const bay = settings.payment.banks.find((b) => b.symbol === "BAY");
    expect(kbank?.accountNumber).toBe("032-3-56203-2");
    expect(bay?.accountNumber).toBe("564-1-05371-5");
    expect(kbank?.enabled).toBe(true);
    expect(bay?.enabled).toBe(true);
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
