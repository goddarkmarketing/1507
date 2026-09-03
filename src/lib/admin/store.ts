"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEMO_ADMIN, seedAdminBookings, seedDrivers } from "@/lib/admin/seed";
import { getActiveStaff } from "@/lib/admin/settings-store";
import type { StaffRole } from "@/lib/admin/settings";
import { mergeBookings } from "@/lib/admin/merge-bookings";
import {
  markPayment,
  type AdminBooking,
  type AdminBookingPatch,
  type Driver,
  type OpsStatus,
} from "@/lib/admin/types";
import type { Booking } from "@/lib/types";
import { useBookingStore } from "@/lib/booking/store";

function bookingPatchFromAdmin(booking: AdminBooking): Partial<Booking> {
  return {
    status: booking.status,
    payment: booking.payment,
    amountDueNow: booking.amountDueNow,
    balanceDue: booking.balanceDue,
    service: booking.service,
    rentalPackageId: booking.rentalPackageId,
    rentalDays: booking.rentalDays,
  };
}

function syncToCustomerStore(booking: AdminBooking) {
  useBookingStore
    .getState()
    .patchConfirmedBooking(booking.id, bookingPatchFromAdmin(booking));
}

interface AdminState {
  authenticated: boolean;
  staffRole: StaffRole | null;
  staffName: string | null;
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
  upsertDriver: (driver: Driver) => void;
  removeDriver: (driverId: string) => void;
  resetDemoData: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      authenticated: false,
      staffRole: null,
      staffName: null,
      bookings: seedAdminBookings,
      drivers: seedDrivers,

      login: (username, password) => {
        const user = username.trim();
        if (user === DEMO_ADMIN.username && password === DEMO_ADMIN.password) {
          set({
            authenticated: true,
            staffRole: "admin",
            staffName: "Admin",
          });
          return true;
        }
        const match = getActiveStaff().find(
          (person) => person.username === user && person.password === password
        );
        if (!match) return false;
        set({
          authenticated: true,
          staffRole: match.role,
          staffName: match.name,
        });
        return true;
      },

      logout: () =>
        set({ authenticated: false, staffRole: null, staffName: null }),

      syncCustomerBookings: (customerBookings) => {
        set({
          bookings: mergeBookings(get().bookings, customerBookings),
        });
      },

      updateBooking: (id, patch) => {
        const next = get().bookings.map((b) =>
          b.id === id
            ? {
                ...b,
                ...patch,
                updatedAt: new Date().toISOString(),
              }
            : b
        );
        set({ bookings: next });
        const updated = next.find((b) => b.id === id);
        if (updated && (patch.payment || patch.status)) {
          syncToCustomerStore(updated);
        }
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
            : opsStatus === "completed"
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
          const nextOps =
            booking.service === "rental"
              ? "awaiting_contract"
              : booking.driverId
                ? "assigned"
                : "new";
          get().updateBooking(bookingId, {
            payment: markPayment(booking.payment, "paid"),
            status: "confirmed",
            opsStatus: nextOps,
          });
        } else {
          get().updateBooking(bookingId, {
            opsStatus: "cancelled",
            status: "cancelled",
            payment: booking.payment
              ? { ...booking.payment, status: "awaiting-transfer" }
              : booking.payment,
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

      upsertDriver: (driver) => {
        const exists = get().drivers.some((d) => d.id === driver.id);
        set({
          drivers: exists
            ? get().drivers.map((d) => (d.id === driver.id ? driver : d))
            : [...get().drivers, driver],
        });
      },

      removeDriver: (driverId) => {
        set({
          drivers: get().drivers.filter((d) => d.id !== driverId),
          bookings: get().bookings.map((b) =>
            b.driverId === driverId ? { ...b, driverId: null } : b
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
        staffRole: state.staffRole,
        staffName: state.staffName,
        bookings: state.bookings,
        drivers: state.drivers,
      }),
    }
  )
);
