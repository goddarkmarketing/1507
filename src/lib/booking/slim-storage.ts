import type { Booking, BookingPayment, TransferProof } from "@/lib/types";
import type { StateStorage } from "zustand/middleware";

/** Keep slip metadata for admin UI; drop base64 payloads that blow localStorage. */
export function slimTransferProof(
  proof: TransferProof | undefined
): TransferProof | undefined {
  if (!proof) return undefined;
  if (!proof.dataUrl) return proof;
  return {
    fileName: proof.fileName,
    fileType: proof.fileType,
    uploadedAt: proof.uploadedAt,
    dataUrl: "",
  };
}

export function slimPayment(
  payment: BookingPayment | undefined
): BookingPayment | undefined {
  if (!payment?.transferProof?.dataUrl) return payment;
  return {
    ...payment,
    transferProof: slimTransferProof(payment.transferProof),
  };
}

export function slimBookingForStorage<T extends Booking>(booking: T): T {
  if (!booking.payment?.transferProof?.dataUrl) return booking;
  return {
    ...booking,
    payment: slimPayment(booking.payment),
  };
}

export function slimBookingsForStorage<T extends Booking>(bookings: T[]): T[] {
  return bookings.map(slimBookingForStorage);
}

/** Prefer the slip that still has a preview payload (e.g. customer store → admin). */
export function preferProofWithData(
  a: TransferProof | undefined,
  b: TransferProof | undefined
): TransferProof | undefined {
  if (a?.dataUrl) return a;
  if (b?.dataUrl) return b;
  return a ?? b;
}

function isQuotaExceeded(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "QuotaExceededError" ||
      error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
      error.code === 22)
  );
}

/**
 * localStorage wrapper that never throws on quota:
 * retries after stripping slip data URLs, then drops bookings as last resort.
 */
export function createQuotaSafeStorage(): StateStorage {
  return {
    getItem: (name) => {
      if (typeof window === "undefined") return null;
      return localStorage.getItem(name);
    },
    setItem: (name, value) => {
      if (typeof window === "undefined") return;
      try {
        localStorage.setItem(name, value);
        return;
      } catch (error) {
        if (!isQuotaExceeded(error)) throw error;
      }

      try {
        const parsed = JSON.parse(value) as {
          state?: { bookings?: Booking[]; confirmedBookings?: Booking[] };
        };
        const state = parsed.state;
        if (state?.bookings) {
          state.bookings = slimBookingsForStorage(state.bookings);
        }
        if (state?.confirmedBookings) {
          state.confirmedBookings = slimBookingsForStorage(
            state.confirmedBookings
          );
        }
        localStorage.setItem(name, JSON.stringify(parsed));
        return;
      } catch {
        /* continue */
      }

      try {
        const parsed = JSON.parse(value) as {
          state?: Record<string, unknown>;
        };
        if (parsed.state) {
          if ("bookings" in parsed.state) parsed.state.bookings = [];
          if ("confirmedBookings" in parsed.state) {
            parsed.state.confirmedBookings = [];
          }
          localStorage.setItem(name, JSON.stringify(parsed));
        }
      } catch {
        console.warn(`[storage] quota exceeded for ${name}; skip persist`);
      }
    },
    removeItem: (name) => {
      if (typeof window === "undefined") return;
      localStorage.removeItem(name);
    },
  };
}

/**
 * Rewrite bloated persisted snapshots + one-time production wipe of demo/QA leftovers.
 * Returns true when a production wipe just ran (caller should clear in-memory stores).
 */
export function reclaimLocalBookingStorage(): boolean {
  if (typeof window === "undefined") return false;

  let wiped = false;
  const wipeKey = "krabi-links-production-wipe-v2";
  if (!localStorage.getItem(wipeKey)) {
    for (const name of ["krabi-links-admin", "krabi-links-bookings"] as const) {
      try {
        const raw = localStorage.getItem(name);
        if (!raw) continue;
        const parsed = JSON.parse(raw) as {
          state?: {
            bookings?: unknown[];
            drivers?: unknown[];
            confirmedBookings?: unknown[];
          };
        };
        if (!parsed.state) continue;
        if ("bookings" in parsed.state) parsed.state.bookings = [];
        if ("drivers" in parsed.state) parsed.state.drivers = [];
        if ("confirmedBookings" in parsed.state) {
          parsed.state.confirmedBookings = [];
        }
        localStorage.setItem(name, JSON.stringify(parsed));
      } catch {
        /* ignore */
      }
    }
    try {
      localStorage.setItem(wipeKey, "1");
      wiped = true;
    } catch {
      /* ignore */
    }
  }

  for (const name of ["krabi-links-admin", "krabi-links-bookings"] as const) {
    try {
      const raw = localStorage.getItem(name);
      if (
        !raw ||
        (!raw.includes("data:image") && !raw.includes("data:application"))
      ) {
        continue;
      }
      const parsed = JSON.parse(raw) as {
        state?: { bookings?: Booking[]; confirmedBookings?: Booking[] };
      };
      const state = parsed.state;
      if (!state) continue;
      let changed = false;
      if (state.bookings?.some((b) => b.payment?.transferProof?.dataUrl)) {
        state.bookings = slimBookingsForStorage(state.bookings);
        changed = true;
      }
      if (
        state.confirmedBookings?.some((b) => b.payment?.transferProof?.dataUrl)
      ) {
        state.confirmedBookings = slimBookingsForStorage(
          state.confirmedBookings
        );
        changed = true;
      }
      if (changed) localStorage.setItem(name, JSON.stringify(parsed));
    } catch (error) {
      if (isQuotaExceeded(error)) {
        try {
          localStorage.removeItem(name);
        } catch {
          /* ignore */
        }
      }
    }
  }

  return wiped;
}
