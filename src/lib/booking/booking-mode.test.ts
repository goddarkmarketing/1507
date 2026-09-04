import { describe, expect, it } from "vitest";
import {
  canIssueVoucher,
  getAmountDueNow,
  getBookingAmountDue,
  getBookingService,
  getRemainingBalance,
  getTieredDepositAmount,
  isCarRentalService,
  normalizePaymentPlan,
} from "@/lib/booking/booking-mode";

describe("booking-mode", () => {
  it("parses service query params", () => {
    expect(getBookingService("rental")).toBe("rental");
    expect(getBookingService("transfer")).toBe("transfer");
    expect(getBookingService(null)).toBe("transfer");
    expect(isCarRentalService("rental")).toBe(true);
    expect(isCarRentalService("transfer")).toBe(false);
  });

  it("applies tiered deposit amounts", () => {
    expect(getTieredDepositAmount(800)).toBe(200);
    expect(getTieredDepositAmount(1000)).toBe(200);
    expect(getTieredDepositAmount(1001)).toBe(500);
    expect(getTieredDepositAmount(2999)).toBe(500);
    expect(getTieredDepositAmount(3000)).toBe(1000);
    expect(getTieredDepositAmount(5000)).toBe(1000);
    expect(getTieredDepositAmount(150)).toBe(150);
  });

  it("charges full amount for pay-full plan", () => {
    expect(getAmountDueNow(1500, "transfer", "full")).toBe(1500);
    expect(getRemainingBalance(1500, "transfer", "full")).toBe(0);
    expect(getAmountDueNow(5000, "rental", "full")).toBe(5000);
  });

  it("charges tiered deposit for deposit plan", () => {
    expect(getAmountDueNow(800, "transfer", "deposit")).toBe(200);
    expect(getAmountDueNow(2000, "rental", "deposit")).toBe(500);
    expect(getAmountDueNow(5000, "rental", "deposit")).toBe(1000);
    expect(getRemainingBalance(5000, "rental", "deposit")).toBe(4000);
  });

  it("charges nothing online for pay-driver", () => {
    expect(getAmountDueNow(2500, "transfer", "pay-driver")).toBe(0);
    expect(getRemainingBalance(2500, "transfer", "pay-driver")).toBe(2500);
  });

  it("defaults legacy bookings without plan", () => {
    expect(normalizePaymentPlan(undefined, "transfer")).toBe("full");
    expect(normalizePaymentPlan(undefined, "rental")).toBe("deposit");
    expect(getAmountDueNow(5000, "rental")).toBe(1000);
    expect(getAmountDueNow(1500, "transfer")).toBe(1500);
  });

  it("reads amountDueNow from booking when present", () => {
    expect(getBookingAmountDue({ totalPrice: 5000, amountDueNow: 500 })).toBe(
      500
    );
    expect(getBookingAmountDue({ totalPrice: 900 })).toBe(900);
  });

  it("gates voucher for pay-driver until staff confirms", () => {
    expect(
      canIssueVoucher({
        status: "pending",
        paymentPlan: "pay-driver",
        payment: { method: "cash", status: "awaiting-transfer", summary: "x" },
      })
    ).toBe(false);
    expect(
      canIssueVoucher({
        status: "confirmed",
        paymentPlan: "pay-driver",
        payment: { method: "cash", status: "awaiting-transfer", summary: "x" },
      })
    ).toBe(true);
    expect(
      canIssueVoucher({
        status: "pending",
        paymentPlan: "deposit",
        payment: {
          method: "promptpay",
          status: "awaiting-transfer",
          summary: "x",
        },
      })
    ).toBe(true);
  });
});
