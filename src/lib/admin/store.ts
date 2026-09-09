"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEMO_ADMIN } from "@/lib/admin/seed";
import { getActiveStaff } from "@/lib/admin/settings-store";
import type { StaffRole } from "@/lib/admin/settings";
import { mergeBookings } from "@/lib/admin/merge-bookings";
import {
  listRemoteBookings,
  patchRemoteBooking,
} from "@/lib/booking/remote/bookings-remote";
import { isBookingRemoteEnabled } from "@/lib/booking/remote/config";
import {
  markPayment,
  type AdminBooking,
  type AdminBookingPatch,
  type Driver,
  type OpsStatus,
} from "@/lib/admin/types";
import type { Booking } from "@/lib/types";
import { useBookingStore } from "@/lib/booking/store";
import {
  createQuotaSafeStorage,
  slimBookingsForStorage,
} from "@/lib/booking/slim-storage";

function bookingPatchFromAdmin(booking: AdminBooking): Partial<Booking> {
  return {
    status: booking.status,
    payment: booking.payment,
    amountDueNow: booking.amountDueNow,
    balanceDue: booking.balanceDue,
    service: booking.service,
    paymentPlan: booking.paymentPlan,
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
  pullRemoteBookings: () => Promise<{ ok: boolean; error?: string }>;
  updateBooking: (id: string, patch: AdminBookingPatch) => void;
  assignDriver: (bookingId: string, driverId: string | null) => void;
  setOpsStatus: (bookingId: string, opsStatus: OpsStatus) => void;
  verifyPayment: (bookingId: string, approve: boolean) => void;
  toggleDriverActive: (driverId: string) => void;
  upsertDriver: (driver: Driver) => void;
  removeDriver: (driverId: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      authenticated: false,
      staffRole: null,
      staffName: null,
      bookings: [],
      drivers: [],

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

      pullRemoteBookings: async () => {
        if (!isBookingRemoteEnabled()) {
          return { ok: false, error: "not_configured" };
        }
        const result = await listRemoteBookings();
        if (!result.ok) return { ok: false, error: result.error };
        set({
          bookings: mergeBookings(get().bookings, result.bookings),
        });
        return { ok: true };
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
        if (updated && (patch.payment || patch.status || patch.opsStatus || patch.driverId !== undefined || patch.adminNotes !== undefined)) {
          syncToCustomerStore(updated);
          if (isBookingRemoteEnabled()) {
            void patchRemoteBooking(updated);
          }
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
          const isPayDriver =
            booking.paymentPlan === "pay-driver" ||
            booking.payment?.method === "cash";

          if (isPayDriver) {
            // Staff confirmed the order — voucher may be issued; cash still at pickup
            get().updateBooking(bookingId, {
              status: "confirmed",
              opsStatus: booking.driverId ? "assigned" : "new",
            });
            return;
          }

          const balance = booking.balanceDue ?? 0;
          const nextOps =
            booking.service === "rental" && balance > 0
              ? "awaiting_contract"
              : booking.paymentPlan === "deposit" && balance > 0
                ? "balance_due"
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
    }),
    {
      name: "krabi-links-admin",
      version: 3,
      migrate: (persisted) => {
        const state = (persisted ?? {}) as Partial<AdminState>;
        // Production cutover: start empty (drop demo + local QA leftovers).
        return {
          ...state,
          bookings: [],
          drivers: [],
        };
      },
      storage: createJSONStorage(createQuotaSafeStorage),
      partialize: (state) => ({
        authenticated: state.authenticated,
        staffRole: state.staffRole,
        staffName: state.staffName,
        // Never persist base64 transfer slips — they exceed localStorage quota.
        bookings: slimBookingsForStorage(state.bookings),
        drivers: state.drivers,
      }),
    }
  )
);
