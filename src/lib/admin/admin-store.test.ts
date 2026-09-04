import { beforeEach, describe, expect, it } from "vitest";
import { useAdminStore } from "@/lib/admin/store";
import { useSettingsStore } from "@/lib/admin/settings-store";
import { DEMO_ADMIN, seedAdminBookings, seedDrivers } from "@/lib/admin/seed";
import { withAdminFields } from "@/lib/admin/types";
import type { Booking } from "@/lib/types";

function resetAdmin() {
  useAdminStore.setState({
    authenticated: false,
    staffRole: null,
    staffName: null,
    bookings: structuredClone(seedAdminBookings),
    drivers: structuredClone(seedDrivers),
  });
}

describe("admin store workflows", () => {
  beforeEach(() => {
    resetAdmin();
    useSettingsStore.getState().resetSettings();
  });

  it("logs in demo admin and rejects bad credentials", () => {
    expect(useAdminStore.getState().login("wrong", "pass")).toBe(false);
    expect(useAdminStore.getState().authenticated).toBe(false);

    expect(
      useAdminStore.getState().login(DEMO_ADMIN.username, DEMO_ADMIN.password)
    ).toBe(true);
    expect(useAdminStore.getState().authenticated).toBe(true);
    expect(useAdminStore.getState().staffRole).toBe("admin");

    useAdminStore.getState().logout();
    expect(useAdminStore.getState().authenticated).toBe(false);
  });

  it("logs in staff accounts from settings", () => {
    useSettingsStore.getState().saveStaff([
      {
        id: "staff-1",
        name: "Finance User",
        username: "finance1",
        password: "fin123",
        role: "finance",
      },
    ]);

    expect(useAdminStore.getState().login("finance1", "fin123")).toBe(true);
    expect(useAdminStore.getState().staffRole).toBe("finance");
    expect(useAdminStore.getState().staffName).toBe("Finance User");
  });

  it("approves transfer payment into new/assigned workflow", () => {
    const pending = withAdminFields({
      id: "pay-transfer",
      bookingNumber: "KLTPAY001",
      type: "one-way",
      status: "pending",
      service: "transfer",
      legs: [
        {
          id: "leg1",
          fromId: "kbv-airport",
          toId: "ao-nang",
          date: "2026-09-15",
          time: "11:00",
          vehicleCode: "ECO",
          price: 500,
        },
      ],
      customerName: "Payee",
      customerEmail: "p@example.com",
      customerPhone: "+66813333333",
      totalPrice: 500,
      amountDueNow: 500,
      createdAt: "2026-09-03T00:00:00.000Z",
      payment: {
        method: "promptpay",
        status: "awaiting-transfer",
        summary: "PromptPay (pending verification)",
      },
    } satisfies Booking);

    useAdminStore.setState({
      bookings: [pending],
    });

    useAdminStore.getState().verifyPayment(pending.id, true);
    const approved = useAdminStore
      .getState()
      .bookings.find((b) => b.id === pending.id);

    expect(approved?.payment?.status).toBe("paid");
    expect(approved?.status).toBe("confirmed");
    expect(approved?.opsStatus).toBe("new");
  });

  it("approves rental payment into awaiting_contract", () => {
    const rental = withAdminFields({
      id: "pay-rental",
      bookingNumber: "KLTRENT001",
      type: "one-way",
      status: "pending",
      service: "rental",
      paymentPlan: "deposit",
      rentalPackageId: "toyota-yaris",
      rentalDays: 3,
      legs: [
        {
          id: "leg1",
          fromId: "kbv-airport",
          toId: "kbv-airport",
          date: "2026-09-20",
          time: "12:00",
          vehicleCode: "ECO",
          price: 3000,
        },
      ],
      customerName: "Renter",
      customerEmail: "r@example.com",
      customerPhone: "+66814444444",
      totalPrice: 3000,
      amountDueNow: 1000,
      balanceDue: 2000,
      createdAt: "2026-09-03T00:00:00.000Z",
      payment: {
        method: "bank-transfer",
        status: "awaiting-transfer",
        summary: "Bank transfer (pending verification)",
      },
    } satisfies Booking);

    useAdminStore.setState({ bookings: [rental] });
    useAdminStore.getState().verifyPayment(rental.id, true);

    const approved = useAdminStore
      .getState()
      .bookings.find((b) => b.id === rental.id);
    expect(approved?.opsStatus).toBe("awaiting_contract");
    expect(approved?.payment?.status).toBe("paid");
  });

  it("confirms pay-driver orders without marking cash as paid", () => {
    const cashOrder = withAdminFields({
      id: "pay-driver-1",
      bookingNumber: "KLTDRV001",
      type: "one-way",
      status: "pending",
      service: "transfer",
      paymentPlan: "pay-driver",
      legs: [
        {
          id: "leg1",
          fromId: "kbv-airport",
          toId: "ao-nang",
          date: "2026-09-20",
          time: "10:00",
          vehicleCode: "ECO",
          price: 800,
        },
      ],
      customerName: "Cash Guest",
      customerEmail: "c@example.com",
      customerPhone: "+66815555555",
      totalPrice: 800,
      amountDueNow: 0,
      balanceDue: 800,
      createdAt: "2026-09-03T00:00:00.000Z",
      payment: {
        method: "cash",
        status: "awaiting-transfer",
        summary: "Pay driver in cash (awaiting staff confirmation)",
      },
    } satisfies Booking);

    useAdminStore.setState({ bookings: [cashOrder] });
    useAdminStore.getState().verifyPayment(cashOrder.id, true);

    const approved = useAdminStore
      .getState()
      .bookings.find((b) => b.id === cashOrder.id);
    expect(approved?.status).toBe("confirmed");
    expect(approved?.opsStatus).toBe("new");
    expect(approved?.payment?.status).toBe("awaiting-transfer");
  });

  it("rejects payment and cancels booking", () => {
    const pending = useAdminStore
      .getState()
      .bookings.find((b) => b.opsStatus === "payment_review");
    expect(pending).toBeTruthy();
    if (!pending) return;

    useAdminStore.getState().verifyPayment(pending.id, false);
    const rejected = useAdminStore
      .getState()
      .bookings.find((b) => b.id === pending.id);
    expect(rejected?.opsStatus).toBe("cancelled");
    expect(rejected?.status).toBe("cancelled");
  });

  it("assigns driver and sets assigned status", () => {
    const open = useAdminStore
      .getState()
      .bookings.find(
        (b) => b.opsStatus === "new" || b.opsStatus === "completed"
      );
    const target =
      open ??
      withAdminFields({
        id: "assign-1",
        bookingNumber: "KLTASN001",
        type: "one-way",
        status: "confirmed",
        service: "transfer",
        legs: [],
        customerName: "A",
        customerEmail: "a@b.c",
        customerPhone: "1",
        totalPrice: 500,
        createdAt: "2026-09-03T00:00:00.000Z",
        payment: {
          method: "promptpay",
          status: "paid",
          summary: "ok",
        },
      } satisfies Booking);

    if (!open) {
      useAdminStore.setState({
        bookings: [withAdminFields(target, { opsStatus: "new" })],
      });
    }

    const id = open?.id ?? target.id;
    useAdminStore.getState().assignDriver(id, "drv-01");
    const assigned = useAdminStore.getState().bookings.find((b) => b.id === id);
    expect(assigned?.driverId).toBe("drv-01");
    expect(assigned?.opsStatus).toBe("assigned");
  });

  it("manages drivers and reset demo data", () => {
    useAdminStore.getState().toggleDriverActive("drv-04");
    expect(
      useAdminStore.getState().drivers.find((d) => d.id === "drv-04")?.active
    ).toBe(true);

    useAdminStore.getState().upsertDriver({
      id: "drv-99",
      name: "New Driver",
      phone: "+66819999999",
      vehicleCodes: ["ECO"],
      active: true,
    });
    expect(useAdminStore.getState().drivers.some((d) => d.id === "drv-99")).toBe(
      true
    );

    useAdminStore.getState().removeDriver("drv-99");
    expect(useAdminStore.getState().drivers.some((d) => d.id === "drv-99")).toBe(
      false
    );

    useAdminStore.setState({ bookings: [] });
    useAdminStore.getState().resetDemoData();
    expect(useAdminStore.getState().bookings.length).toBe(
      seedAdminBookings.length
    );
  });

  it("saves rental deposit settings used by booking mode", () => {
    useSettingsStore.getState().saveRentalDeposits({
      advanceDeposit: 700,
      smallCarDeposit: 3500,
      largeCarDeposit: 6000,
    });
    const deposits = useSettingsStore.getState().rentalDeposits;
    expect(deposits.advanceDeposit).toBe(700);
    expect(deposits.smallCarDeposit).toBe(3500);
  });
});
