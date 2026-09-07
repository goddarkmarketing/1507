import { describe, expect, it } from "vitest";
import {
  ADVANCE_BOOKING_HOURS,
  getBangkokHour,
  getNightDriverSurcharge,
  getVoucherHoldReason,
  hasAdvanceBooking,
  isNightClockWindow,
  isNightPickupTime,
  legPickupInstant,
  NIGHT_DRIVER_SURCHARGE_THB,
} from "@/lib/booking/booking-rules";

describe("booking-rules", () => {
  it("detects night pickup times", () => {
    expect(isNightPickupTime("00:00")).toBe(true);
    expect(isNightPickupTime("07:59")).toBe(true);
    expect(isNightPickupTime("08:00")).toBe(false);
    expect(isNightPickupTime("22:30")).toBe(false);
  });

  it("adds one night driver surcharge when any leg is night", () => {
    expect(
      getNightDriverSurcharge([
        { date: "2026-09-10", time: "10:00" },
        { date: "2026-09-11", time: "02:00" },
      ])
    ).toBe(NIGHT_DRIVER_SURCHARGE_THB);
    expect(
      getNightDriverSurcharge([{ date: "2026-09-10", time: "10:00" }])
    ).toBe(0);
  });

  it("requires 24h advance booking", () => {
    const now = new Date("2026-09-07T10:00:00+07:00");
    expect(
      hasAdvanceBooking([{ date: "2026-09-08", time: "09:00" }], now)
    ).toBe(false);
    expect(
      hasAdvanceBooking([{ date: "2026-09-08", time: "11:00" }], now)
    ).toBe(true);
    expect(ADVANCE_BOOKING_HOURS).toBe(24);
  });

  it("detects Bangkok night clock window", () => {
    expect(isNightClockWindow(new Date("2026-09-07T00:30:00+07:00"))).toBe(
      true
    );
    expect(isNightClockWindow(new Date("2026-09-07T07:59:00+07:00"))).toBe(
      true
    );
    expect(isNightClockWindow(new Date("2026-09-07T08:00:00+07:00"))).toBe(
      false
    );
    expect(getBangkokHour(new Date("2026-09-07T15:00:00+07:00"))).toBe(15);
  });

  it("parses Bangkok local pickup instants", () => {
    const d = legPickupInstant("2026-09-10", "02:30");
    expect(d?.toISOString()).toBe("2026-09-09T19:30:00.000Z");
  });

  it("holds voucher overnight until staff confirms", () => {
    const night = new Date("2026-09-07T03:00:00+07:00");
    const legs = [{ date: "2026-09-10", time: "10:00" }];
    expect(
      getVoucherHoldReason(
        { status: "pending", paymentPlan: "full", legs },
        night
      )
    ).toBe("night-hours");
    expect(
      getVoucherHoldReason(
        { status: "confirmed", paymentPlan: "full", legs },
        night
      )
    ).toBe(null);
  });

  it("holds short-notice voucher until staff confirms", () => {
    const now = new Date("2026-09-07T10:00:00+07:00");
    const legs = [{ date: "2026-09-07", time: "18:00" }];
    expect(
      getVoucherHoldReason(
        { status: "pending", paymentPlan: "deposit", legs },
        now
      )
    ).toBe("short-notice");
  });
});
