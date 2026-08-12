"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEMO_ADMIN,
  seedAdminBookings,
  seedDrivers,
} from "@/lib/admin/seed";
import {
  markPayment,
  withAdminFields,
  type AdminBooking,
  type AdminBookingPatch,
  type Driver,
  type OpsStatus,
} from "@/lib/admin/types";
import type { Booking } from "@/lib/types";

interface AdminState {
  authenticated: boolean;
  bookings: AdminBooking[];
  drivers: Driver[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  syncCustomerBookings: (customerBookings: Booking[]) => void;
  updateBooking: (id: string, patch: AdminBookingPatch) => void;
  assignDriver: (bookingId: string, driverId: string | null) => void;
  setOpsStatus: (bookingId: string, opsStatus: OpsStatus) => void;
  verifyPayment: (bookingId: string, approve: boolean) => void;
  toggleDriverActive: (driverId: string) => void;
  resetDemoData: () => void;
}

function mergeBookings(
  existing: AdminBooking[],
  incoming: Booking[]
): AdminBooking[] {
  const byId = new Map(existing.map((b) => [b.id, b]));
  for (const raw of incoming) {
    const prev = byId.get(raw.id);
    if (prev) {
      byId.set(raw.id, {
        ...prev,
        ...raw,
        opsStatus: prev.opsStatus,
        driverId: prev.driverId,
        adminNotes: prev.adminNotes,
        updatedAt: prev.updatedAt,
      });
    } else {
      byId.set(raw.id, withAdminFields(raw));
    }
  }
  return Array.from(byId.values()).sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
  );
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      authenticated: false,
      bookings: seedAdminBookings,
      drivers: seedDrivers,

      login: (username, password) => {
        const ok =
          username.trim() === DEMO_ADMIN.username &&
          password === DEMO_ADMIN.password;
        if (ok) set({ authenticated: true });
        return ok;
      },

      logout: () => set({ authenticated: false }),

      syncCustomerBookings: (customerBookings) => {
        set({
          bookings: mergeBookings(get().bookings, customerBookings),
        });
      },

      updateBooking: (id, patch) => {
        set({
          bookings: get().bookings.map((b) =>
            b.id === id
              ? {
                  ...b,
                  ...patch,
                  updatedAt: new Date().toISOString(),
                }
              : b
          ),
        });
      },

      assignDriver: (bookingId, driverId) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking || booking.opsStatus === "cancelled") return;

        if (!driverId) {
          get().updateBooking(bookingId, {
            driverId: null,
            opsStatus:
              booking.opsStatus === "assigned" ||
              booking.opsStatus === "in_progress"
                ? booking.payment?.status === "awaiting-transfer"
                  ? "payment_review"
                  : "new"
                : booking.opsStatus,
          });
          return;
        }

        if (booking.opsStatus === "payment_review") {
          get().updateBooking(bookingId, { driverId });
          return;
        }

        get().updateBooking(bookingId, {
          driverId,
          opsStatus: "assigned",
          status: "confirmed",
        });
      },

      setOpsStatus: (bookingId, opsStatus) => {
        const status =
          opsStatus === "cancelled"
            ? "cancelled"
            : opsStatus === "completed" || opsStatus === "assigned" || opsStatus === "in_progress"
              ? "confirmed"
              : opsStatus === "payment_review"
                ? "pending"
                : "confirmed";
        get().updateBooking(bookingId, {
          opsStatus,
          status,
        });
      },

      verifyPayment: (bookingId, approve) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return;
        if (approve) {
          get().updateBooking(bookingId, {
            payment: markPayment(booking.payment, "paid"),
            status: "confirmed",
            opsStatus: booking.driverId ? "assigned" : "new",
          });
        } else {
          get().updateBooking(bookingId, {
            opsStatus: "cancelled",
            status: "cancelled",
          });
        }
      },

      toggleDriverActive: (driverId) => {
        set({
          drivers: get().drivers.map((d) =>
            d.id === driverId ? { ...d, active: !d.active } : d
          ),
        });
      },

      resetDemoData: () =>
        set({
          bookings: seedAdminBookings,
          drivers: seedDrivers,
        }),
    }),
    {
      name: "krabi-links-admin",
      partialize: (state) => ({
        authenticated: state.authenticated,
        bookings: state.bookings,
        drivers: state.drivers,
      }),
    }
  )
);
