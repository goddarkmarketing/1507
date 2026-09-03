import { describe, expect, it } from "vitest";
import {
  getAmountDueNow,
  getBookingAmountDue,
  getBookingService,
  getRemainingBalance,
  isCarRentalService,
} from "@/lib/booking/booking-mode";

describe("booking-mode", () => {
  it("parses service query params", () => {
    expect(getBookingService("rental")).toBe("rental");
    expect(getBookingService("transfer")).toBe("transfer");
    expect(getBookingService(null)).toBe("transfer");
    expect(isCarRentalService("rental")).toBe(true);
    expect(isCarRentalService("transfer")).toBe(false);
  });

  it("charges full amount for transfer", () => {
    expect(getAmountDueNow(1500, "transfer")).toBe(1500);
    expect(getRemainingBalance(1500, "transfer")).toBe(0);
  });

  it("charges advance deposit for rental", () => {
    expect(getAmountDueNow(5000, "rental")).toBe(500);
    expect(getRemainingBalance(5000, "rental")).toBe(4500);
  });

  it("never charges more than total for cheap rentals", () => {
    expect(getAmountDueNow(300, "rental")).toBe(300);
    expect(getRemainingBalance(300, "rental")).toBe(0);
  });

  it("reads amountDueNow from booking when present", () => {
    expect(getBookingAmountDue({ totalPrice: 5000, amountDueNow: 500 })).toBe(
      500
    );
    expect(getBookingAmountDue({ totalPrice: 900 })).toBe(900);
  });
});
