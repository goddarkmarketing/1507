import type { AdminBooking, Driver } from "@/lib/admin/types";
import { withAdminFields } from "@/lib/admin/types";
import type { Booking } from "@/lib/types";

export const DEMO_ADMIN = {
  username: "admin",
  password: "krabi2026",
} as const;

export const seedDrivers: Driver[] = [
  {
    id: "drv-01",
    name: "Somchai P.",
    phone: "+66 81 234 5678",
    vehicleCodes: ["ECO", "PREM", "SUV"],
    active: true,
    note: "Airport specialist · English",
    lineId: "@somchai.driver",
    plate: "กบ 1234",
  },
  {
    id: "drv-02",
    name: "Nattapong K.",
    phone: "+66 89 111 2233",
    vehicleCodes: ["VAN", "VIP", "SUV"],
    active: true,
    note: "Groups & pier runs",
    lineId: "@nattapong.k",
    plate: "กบ 5566",
  },
  {
    id: "drv-03",
    name: "Anong S.",
    phone: "+66 86 555 7788",
    vehicleCodes: ["ECO", "PREM", "SIG"],
    active: true,
    note: "Hotel & resort drops",
    lineId: "@anong.s",
    plate: "กบ 7788",
  },
  {
    id: "drv-04",
    name: "Wichai T.",
    phone: "+66 82 999 0011",
    vehicleCodes: ["VAN", "VIP", "BUS"],
    active: false,
    note: "Inter-province · offline today",
    lineId: "@wichai.t",
    plate: "กบ 9900",
  },
];

function seedBooking(
  partial: Omit<Booking, "id" | "createdAt" | "status"> & {
    id: string;
    createdAt: string;
    status: Booking["status"];
    opsStatus?: AdminBooking["opsStatus"];
    driverId?: string | null;
    adminNotes?: string;
  }
): AdminBooking {
  const { opsStatus, driverId, adminNotes, ...booking } = partial;
  return withAdminFields(booking, {
    opsStatus,
    driverId,
    adminNotes,
    updatedAt: booking.createdAt,
  });
}

const today = () => new Date().toISOString().slice(0, 10);
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const seedAdminBookings: AdminBooking[] = [
  seedBooking({
    id: "seed-1",
    bookingNumber: "KL26080101",
    type: "one-way",
    legs: [
      {
        id: "seed-1-leg",
        fromId: "kbv-airport",
        toId: "ao-nang-beach",
        date: daysFromNow(1),
        time: "14:30",
        vehicleCode: "ECO",
        price: 968,
      },
    ],
    customerName: "Sarah Mitchell",
    customerEmail: "sarah.m@example.com",
    customerPhone: "+44 7700 900123",
    flightNumber: "TG901",
    totalPrice: 968,
    createdAt: `${today()}T08:12:00.000Z`,
    status: "confirmed",
    payment: {
      method: "promptpay",
      summary: "PromptPay 0812345678",
      paidAt: `${today()}T08:12:00.000Z`,
      status: "paid",
    },
    opsStatus: "assigned",
    driverId: "drv-01",
    adminNotes: "Meet & greet requested",
  }),
  seedBooking({
    id: "seed-2",
    bookingNumber: "KL26080102",
    type: "round-trip",
    legs: [
      {
        id: "seed-2-a",
        fromId: "centara-ao-nang",
        toId: "ao-nang-pier",
        date: daysFromNow(2),
        time: "07:45",
        vehicleCode: "VAN",
        price: 650,
      },
      {
        id: "seed-2-b",
        fromId: "ao-nang-pier",
        toId: "centara-ao-nang",
        date: daysFromNow(2),
        time: "17:30",
        vehicleCode: "VAN",
        price: 650,
      },
    ],
    customerName: "Emily Chen",
    customerEmail: "emily.c@example.com",
    customerPhone: "+61 400 111 222",
    totalPrice: 1235,
    createdAt: `${today()}T09:40:00.000Z`,
    status: "pending",
    payment: {
      method: "bank-transfer",
      summary: "Bank transfer KBANK (pending verification)",
      status: "awaiting-transfer",
      bankSymbol: "KBANK",
    },
    opsStatus: "payment_review",
    driverId: null,
    adminNotes: "Slip uploaded — verify amount",
  }),
  seedBooking({
    id: "seed-3",
    bookingNumber: "KL26073155",
    type: "one-way",
    legs: [
      {
        id: "seed-3-leg",
        fromId: "kbv-airport",
        toId: "phuket-airport",
        date: daysFromNow(3),
        time: "09:00",
        vehicleCode: "VIP",
        price: 4200,
      },
    ],
    customerName: "Marco Rossi",
    customerEmail: "marco.r@example.com",
    customerPhone: "+39 333 444 5555",
    totalPrice: 4200,
    createdAt: `${daysFromNow(-1)}T16:20:00.000Z`,
    status: "confirmed",
    payment: {
      method: "card",
      summary: "Card **** 4242",
      paidAt: `${daysFromNow(-1)}T16:20:00.000Z`,
      status: "paid",
    },
    opsStatus: "new",
    driverId: null,
  }),
  seedBooking({
    id: "seed-4",
    bookingNumber: "KL26073012",
    type: "one-way",
    legs: [
      {
        id: "seed-4-leg",
        fromId: "krabi-town",
        toId: "emerald-pool",
        date: daysFromNow(-1),
        time: "08:30",
        vehicleCode: "SUV",
        price: 1800,
      },
    ],
    customerName: "Yuki Tanaka",
    customerEmail: "yuki.t@example.com",
    customerPhone: "+81 90 1234 5678",
    totalPrice: 1800,
    createdAt: `${daysFromNow(-2)}T11:00:00.000Z`,
    status: "confirmed",
    payment: {
      method: "promptpay",
      summary: "PromptPay 0812345678",
      paidAt: `${daysFromNow(-2)}T11:00:00.000Z`,
      status: "paid",
    },
    opsStatus: "completed",
    driverId: "drv-02",
    adminNotes: "Wait-and-return 3h",
  }),
];
