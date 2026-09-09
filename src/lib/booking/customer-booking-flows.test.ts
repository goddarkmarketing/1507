import { beforeEach, describe, expect, it } from "vitest";
import { useBookingStore } from "@/lib/booking/store";
import { toBangkokDateInput, minPickupInstant } from "@/lib/booking/booking-rules";
import type { BookingType } from "@/lib/types";

const PROOF = {
  fileName: "slip.jpg",
  fileType: "image/jpeg",
  dataUrl: "data:image/jpeg;base64,AAAA",
  uploadedAt: new Date().toISOString(),
};

function pickupDate(daysAhead = 2) {
  const base = minPickupInstant();
  base.setUTCDate(base.getUTCDate() + (daysAhead - 1));
  return toBangkokDateInput(base);
}

function resetAndFillCustomer() {
  useBookingStore.getState().resetDraft();
  const store = useBookingStore.getState();
  store.setCustomer("customerName", "Somchai Test");
  store.setCustomer("customerPhone", "+66881234567");
  store.setCustomer("customerEmail", "somchai.test@example.com");
  store.setCustomer("flightNumber", "TG900");
  store.setCustomer("notes", "Customer booking QA");
  store.setPaymentPlan("full");
  store.setPaymentMethod("bank-transfer");
  store.setTransferBank("KBANK");
  store.setTransferProof(PROOF);
}

describe("customer booking flows (store)", () => {
  beforeEach(() => {
    useBookingStore.setState({ confirmedBookings: [] });
    resetAndFillCustomer();
  });

  it("books one-way transfer", () => {
    const s = useBookingStore.getState();
    s.setBookingType("one-way");
    const leg = s.draft.legs[0];
    s.updateLeg(leg.id, {
      fromId: "kbv-airport",
      toId: "ao-nang-beach",
      date: pickupDate(2),
      time: "10:00",
      vehicleCode: "ECO",
    });
    const booking = useBookingStore.getState().confirmBooking();
    expect(booking).not.toBeNull();
    expect(booking!.type).toBe("one-way");
    expect(booking!.legs).toHaveLength(1);
    expect(booking!.totalPrice).toBeGreaterThan(0);
    expect(booking!.payment?.method).toBe("bank-transfer");
    expect(useBookingStore.getState().confirmedBookings).toHaveLength(1);
  });

  it("books round-trip with return leg reversed", () => {
    const s = useBookingStore.getState();
    s.setBookingType("one-way");
    const first = s.draft.legs[0];
    s.updateLeg(first.id, {
      fromId: "kbv-airport",
      toId: "ao-nang-pier",
      date: pickupDate(2),
      time: "09:00",
    });
    s.setBookingType("round-trip");
    const draft = useBookingStore.getState().draft;
    expect(draft.legs).toHaveLength(2);
    expect(draft.legs[1].fromId).toBe("ao-nang-pier");
    expect(draft.legs[1].toId).toBe("kbv-airport");
    useBookingStore.getState().updateLeg(draft.legs[1].id, {
      date: pickupDate(3),
      time: "16:00",
    });
    const booking = useBookingStore.getState().confirmBooking();
    expect(booking).not.toBeNull();
    expect(booking!.type).toBe("round-trip");
    expect(booking!.legs).toHaveLength(2);
  });

  it("trims extra legs when switching multi-route to round-trip", () => {
    const s = useBookingStore.getState();
    s.setBookingType("multi-route");
    s.addLeg();
    s.addLeg();
    expect(useBookingStore.getState().draft.legs.length).toBeGreaterThanOrEqual(3);
    s.setBookingType("round-trip");
    expect(useBookingStore.getState().draft.legs).toHaveLength(2);
  });

  it("books multi-route with two legs same day", () => {
    const s = useBookingStore.getState();
    s.setBookingType("multi-route");
    s.addLeg();
    const [a, b] = useBookingStore.getState().draft.legs;
    const day = pickupDate(2);
    s.updateLeg(a.id, {
      fromId: "kbv-airport",
      toId: "ao-nang-beach",
      date: day,
      time: "10:00",
    });
    s.updateLeg(b.id, {
      fromId: "ao-nang-beach",
      toId: "chao-fah-pier",
      date: day,
      time: "15:00",
    });
    const booking = useBookingStore.getState().confirmBooking();
    expect(booking).not.toBeNull();
    expect(booking!.type).toBe("multi-route");
    expect(booking!.legs).toHaveLength(2);
  });

  it("books multi-day with different dates", () => {
    const s = useBookingStore.getState();
    s.setBookingType("multi-day");
    s.addLeg();
    const [a, b] = useBookingStore.getState().draft.legs;
    s.updateLeg(a.id, {
      fromId: "kbv-airport",
      toId: "ao-nang-beach",
      date: pickupDate(2),
      time: "11:00",
    });
    s.updateLeg(b.id, {
      fromId: "ao-nang-beach",
      toId: "kbv-airport",
      date: pickupDate(4),
      time: "13:00",
    });
    const booking = useBookingStore.getState().confirmBooking();
    expect(booking).not.toBeNull();
    expect(booking!.type).toBe("multi-day");
    expect(booking!.legs[0].date).not.toBe(booking!.legs[1].date);
  });

  it("books daily charter without pickup/dropoff pricing path", () => {
    const s = useBookingStore.getState();
    s.setBookingType("daily-charter");
    const leg = s.draft.legs[0];
    s.updateLeg(leg.id, {
      date: pickupDate(2),
      time: "09:00",
      vehicleCode: "ECO",
    });
    const booking = useBookingStore.getState().confirmBooking();
    expect(booking).not.toBeNull();
    expect(booking!.type).toBe("daily-charter");
    expect(booking!.totalPrice).toBeGreaterThanOrEqual(3500);
  });

  it("books hourly charter at minimum hours rate", () => {
    const s = useBookingStore.getState();
    s.setBookingType("hourly-charter");
    const leg = s.draft.legs[0];
    s.updateLeg(leg.id, {
      date: pickupDate(2),
      time: "10:00",
      vehicleCode: "ECO",
    });
    const booking = useBookingStore.getState().confirmBooking();
    expect(booking).not.toBeNull();
    expect(booking!.type).toBe("hourly-charter");
    // default hourly 500 × min 3h
    expect(booking!.totalPrice).toBeGreaterThanOrEqual(1500);
  });

  it("rejects pickup sooner than 24 hours", () => {
    const s = useBookingStore.getState();
    s.setBookingType("one-way");
    const leg = s.draft.legs[0];
    const today = toBangkokDateInput(new Date());
    s.updateLeg(leg.id, { date: today, time: "23:59" });
    const booking = useBookingStore.getState().confirmBooking();
    expect(booking).toBeNull();
  });

  it("books pay-driver plan without transfer slip", () => {
    const s = useBookingStore.getState();
    s.setBookingType("one-way");
    const leg = s.draft.legs[0];
    s.updateLeg(leg.id, { date: pickupDate(2), time: "12:00" });
    s.setPaymentPlan("pay-driver");
    s.setTransferProof(null);
    // pay-driver clears bank + proof via setPaymentPlan
    const booking = useBookingStore.getState().confirmBooking();
    expect(booking).not.toBeNull();
    expect(booking!.payment?.method).toBe("cash");
    expect(booking!.paymentPlan).toBe("pay-driver");
  });

  it("can book all six transfer types in sequence like real customers", () => {
    const types: BookingType[] = [
      "one-way",
      "round-trip",
      "multi-route",
      "multi-day",
      "daily-charter",
      "hourly-charter",
    ];

    for (const type of types) {
      resetAndFillCustomer();
      const s = useBookingStore.getState();
      s.setBookingType(type);
      if (type === "multi-route" || type === "multi-day") {
        s.addLeg();
      }
      const legs = useBookingStore.getState().draft.legs;
      legs.forEach((leg, i) => {
        useBookingStore.getState().updateLeg(leg.id, {
          date: pickupDate(2 + i),
          time: i === 0 ? "10:00" : "15:00",
          ...(type.includes("charter")
            ? {}
            : {
                fromId: i === 0 ? "kbv-airport" : "ao-nang-beach",
                toId: i === 0 ? "ao-nang-beach" : "chao-fah-pier",
              }),
        });
      });
      const booking = useBookingStore.getState().confirmBooking();
      expect(booking, `failed type ${type}`).not.toBeNull();
      expect(booking!.type).toBe(type);
      expect(booking!.customerName).toBe("Somchai Test");
    }

    expect(useBookingStore.getState().confirmedBookings.length).toBe(6);
  });
});
