import { describe, expect, it } from "vitest";
import { mergeBookings } from "@/lib/admin/merge-bookings";
import { withAdminFields } from "@/lib/admin/types";
import type { Booking } from "@/lib/types";

function customerBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: "cust-1",
    bookingNumber: "KLTCUST001",
    type: "one-way",
    status: "pending",
    service: "transfer",
    legs: [
      {
        id: "leg1",
        fromId: "kbv-airport",
        toId: "ao-nang",
        date: "2026-09-12",
        time: "09:00",
        vehicleCode: "ECO",
        price: 500,
      },
    ],
    customerName: "Guest",
    customerEmail: "g@example.com",
    customerPhone: "+66812222222",
    totalPrice: 500,
    createdAt: "2026-09-02T00:00:00.000Z",
    payment: {
      method: "promptpay",
      status: "awaiting-transfer",
      summary: "PromptPay (pending verification)",
    },
    ...overrides,
  };
}

describe("mergeBookings", () => {
  it("adds new customer bookings with derived ops status", () => {
    const merged = mergeBookings([], [customerBooking()]);
    expect(merged).toHaveLength(1);
    expect(merged[0].opsStatus).toBe("payment_review");
    expect(merged[0].bookingNumber).toBe("KLTCUST001");
  });

  it("preserves admin ops notes and paid payment when syncing", () => {
    const existing = withAdminFields(customerBooking(), {
      opsStatus: "assigned",
      driverId: "drv-01",
      adminNotes: "VIP guest",
      payment: {
        method: "promptpay",
        status: "paid",
        summary: "PromptPay (verified)",
      },
      status: "confirmed",
    });

    const incoming = customerBooking({
      customerName: "Guest Updated",
      status: "pending",
      payment: {
        method: "promptpay",
        status: "awaiting-transfer",
        summary: "PromptPay (pending verification)",
      },
    });

    const [merged] = mergeBookings([existing], [incoming]);
    expect(merged.customerName).toBe("Guest Updated");
    expect(merged.opsStatus).toBe("assigned");
    expect(merged.driverId).toBe("drv-01");
    expect(merged.adminNotes).toBe("VIP guest");
    expect(merged.payment?.status).toBe("paid");
    expect(merged.status).toBe("confirmed");
  });

  it("keeps slip preview from customer when admin copy has metadata only", () => {
    const existing = withAdminFields(customerBooking(), {
      opsStatus: "payment_review",
      payment: {
        method: "bank-transfer",
        status: "awaiting-transfer",
        summary: "Bank transfer (pending verification)",
        transferProof: {
          fileName: "slip.jpg",
          fileType: "image/jpeg",
          dataUrl: "",
          uploadedAt: "2026-09-02T00:00:00.000Z",
        },
      },
    });

    const incoming = customerBooking({
      payment: {
        method: "bank-transfer",
        status: "awaiting-transfer",
        summary: "Bank transfer (pending verification)",
        transferProof: {
          fileName: "slip.jpg",
          fileType: "image/jpeg",
          dataUrl: "data:image/jpeg;base64,AAAA",
          uploadedAt: "2026-09-02T00:00:00.000Z",
        },
      },
    });

    const [merged] = mergeBookings([existing], [incoming]);
    expect(merged.payment?.transferProof?.dataUrl).toBe(
      "data:image/jpeg;base64,AAAA"
    );
  });
});
