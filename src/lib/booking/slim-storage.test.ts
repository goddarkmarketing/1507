import { describe, expect, it } from "vitest";
import {
  preferProofWithData,
  slimBookingForStorage,
  slimBookingsForStorage,
} from "@/lib/booking/slim-storage";
import type { Booking, TransferProof } from "@/lib/types";

const proof = (dataUrl: string): TransferProof => ({
  fileName: "slip.jpg",
  fileType: "image/jpeg",
  dataUrl,
  uploadedAt: "2026-01-01T00:00:00.000Z",
});

function bookingWithProof(dataUrl: string): Booking {
  return {
    id: "b1",
    bookingNumber: "KL-1",
    type: "one-way",
    legs: [],
    customerName: "A",
    customerEmail: "a@b.c",
    customerPhone: "081",
    totalPrice: 1000,
    createdAt: "2026-01-01T00:00:00.000Z",
    status: "pending",
    payment: {
      method: "bank-transfer",
      summary: "KBANK",
      status: "awaiting-transfer",
      transferProof: proof(dataUrl),
    },
  };
}

describe("slim-storage", () => {
  it("strips transfer proof dataUrl for localStorage", () => {
    const slim = slimBookingForStorage(
      bookingWithProof("data:image/jpeg;base64,AAAA")
    );
    expect(slim.payment?.transferProof?.fileName).toBe("slip.jpg");
    expect(slim.payment?.transferProof?.dataUrl).toBe("");
  });

  it("leaves bookings without proofs unchanged", () => {
    const b = bookingWithProof("");
    b.payment!.transferProof = undefined;
    expect(slimBookingForStorage(b)).toBe(b);
  });

  it("slims a list", () => {
    const list = slimBookingsForStorage([
      bookingWithProof("data:image/jpeg;base64,AAAA"),
    ]);
    expect(list[0]?.payment?.transferProof?.dataUrl).toBe("");
  });

  it("prefers proof that still has a dataUrl", () => {
    const withData = proof("data:image/jpeg;base64,AAAA");
    const empty = proof("");
    expect(preferProofWithData(empty, withData)).toBe(withData);
    expect(preferProofWithData(withData, empty)).toBe(withData);
  });
});
