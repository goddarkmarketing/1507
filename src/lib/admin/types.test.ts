import { describe, expect, it } from "vitest";
import {
  deriveOpsStatus,
  markPayment,
  withAdminFields,
} from "@/lib/admin/types";
import type { Booking, BookingPayment } from "@/lib/types";

function baseBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: "b1",
    bookingNumber: "KLTTEST001",
    type: "one-way",
    status: "pending",
    service: "transfer",
    legs: [
      {
        id: "leg1",
        fromId: "kbv-airport",
        toId: "ao-nang",
        date: "2026-09-10",
        time: "10:00",
        vehicleCode: "ECO",
        price: 500,
      },
    ],
    customerName: "Test User",
    customerEmail: "test@example.com",
    customerPhone: "+66811111111",
    totalPrice: 500,
    createdAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  };
}

const pendingPayment = (summary = "PromptPay (pending verification)"): BookingPayment => ({
  method: "promptpay",
  status: "awaiting-transfer",
  summary,
});

describe("deriveOpsStatus", () => {
  it("marks cancelled bookings", () => {
    expect(deriveOpsStatus(baseBooking({ status: "cancelled" }))).toBe(
      "cancelled"
    );
  });

  it("puts awaiting transfer into payment_review", () => {
    expect(
      deriveOpsStatus(
        baseBooking({
          payment: pendingPayment(),
        })
      )
    ).toBe("payment_review");
  });

  it("puts pending bookings into payment_review", () => {
    expect(deriveOpsStatus(baseBooking({ status: "pending" }))).toBe(
      "payment_review"
    );
  });

  it("puts paid rental with balance into awaiting_contract", () => {
    expect(
      deriveOpsStatus(
        baseBooking({
          status: "confirmed",
          service: "rental",
          balanceDue: 4500,
          amountDueNow: 500,
          payment: {
            method: "bank-transfer",
            status: "paid",
            summary: "Bank transfer (verified)",
          },
        })
      )
    ).toBe("awaiting_contract");
  });

  it("marks confirmed transfer as new", () => {
    expect(
      deriveOpsStatus(
        baseBooking({
          status: "confirmed",
          payment: {
            method: "promptpay",
            status: "paid",
            summary: "PromptPay (verified)",
          },
        })
      )
    ).toBe("new");
  });
});

describe("withAdminFields", () => {
  it("adds ops fields with derived status", () => {
    const admin = withAdminFields(
      baseBooking({ payment: pendingPayment() })
    );
    expect(admin.opsStatus).toBe("payment_review");
    expect(admin.driverId).toBeNull();
    expect(admin.adminNotes).toBe("");
    expect(admin.updatedAt).toBe("2026-09-01T00:00:00.000Z");
  });
});

describe("markPayment", () => {
  it("returns undefined when payment missing", () => {
    expect(markPayment(undefined, "paid")).toBeUndefined();
  });

  it("marks paid and rewrites pending summary", () => {
    const paid = markPayment(pendingPayment(), "paid");
    expect(paid?.status).toBe("paid");
    expect(paid?.summary).toMatch(/verified/i);
    expect(paid?.paidAt).toBeTruthy();
  });
});
