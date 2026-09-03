import { describe, expect, it } from "vitest";
import {
  bookingCollectedAmount,
  bookingDisplayAmount,
} from "@/lib/admin/booking-money";
import type { Booking } from "@/lib/types";

function booking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: "b1",
    bookingNumber: "KLTTEST001",
    type: "one-way",
    status: "confirmed",
    service: "transfer",
    legs: [],
    customerName: "A",
    customerEmail: "a@b.c",
    customerPhone: "1",
    totalPrice: 1200,
    amountDueNow: 1200,
    createdAt: "2026-09-01T00:00:00.000Z",
    payment: {
      method: "promptpay",
      status: "paid",
      summary: "PromptPay (verified)",
    },
    ...overrides,
  };
}

describe("bookingCollectedAmount", () => {
  it("returns 0 for cancelled bookings", () => {
    expect(bookingCollectedAmount(booking({ status: "cancelled" }))).toBe(0);
  });

  it("returns 0 when payment is not paid", () => {
    expect(
      bookingCollectedAmount(
        booking({
          payment: {
            method: "promptpay",
            status: "awaiting-transfer",
            summary: "pending",
          },
        })
      )
    ).toBe(0);
  });

  it("uses amountDueNow for paid rental deposits", () => {
    expect(
      bookingCollectedAmount(
        booking({
          service: "rental",
          totalPrice: 5000,
          amountDueNow: 500,
        })
      )
    ).toBe(500);
  });
});

describe("bookingDisplayAmount", () => {
  it("falls back to totalPrice when amountDueNow missing", () => {
    const b = booking({ amountDueNow: undefined, totalPrice: 800 });
    expect(bookingDisplayAmount(b)).toBe(800);
  });
});
