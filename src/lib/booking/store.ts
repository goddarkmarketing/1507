"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { calculatePrice } from "@/lib/data/pricing";
import { getPromptPay } from "@/lib/data/payment";
import {
  getAmountDueNow,
  getRemainingBalance,
  type BookingService,
  type PaymentPlan,
} from "@/lib/booking/booking-mode";
import {
  getNightDriverSurcharge,
  hasAdvanceBooking,
} from "@/lib/booking/booking-rules";
import {
  calculateRentalTotal,
  getDefaultRentalPackageId,
} from "@/lib/booking/rental-pricing";
import { getActiveCharterRates } from "@/lib/admin/settings-store";
import type {
  Booking,
  BookingLeg,
  BookingPayment,
  BookingType,
  CardPaymentDetails,
  PaymentMethod,
  TransferProof,
  VehicleCode,
} from "@/lib/types";

interface BookingDraft {
  service: BookingService;
  transferRef: string;
  rentalPackageId: string;
  rentalDays: number;
  type: BookingType;
  legs: Omit<BookingLeg, "price">[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  flightNumber: string;
  notes: string;
  paymentPlan: PaymentPlan | null;
  paymentMethod: PaymentMethod | null;
  card: CardPaymentDetails;
  transferBankSymbol: string | null;
  transferProof: TransferProof | null;
}

interface BookingStore {
  draft: BookingDraft;
  confirmedBookings: Booking[];
  setBookingType: (type: BookingType) => void;
  addLeg: () => void;
  removeLeg: (id: string) => void;
  updateLeg: (id: string, updates: Partial<Omit<BookingLeg, "price">>) => void;
  setCustomer: (
    field: keyof Pick<
      BookingDraft,
      | "customerName"
      | "customerEmail"
      | "customerPhone"
      | "flightNumber"
      | "notes"
    >,
    value: string
  ) => void;
  setService: (service: BookingService) => void;
  setRentalPackage: (packageId: string) => void;
  setRentalDays: (days: number) => void;
  setPaymentPlan: (plan: PaymentPlan) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCardField: (field: keyof CardPaymentDetails, value: string) => void;
  setTransferBank: (symbol: string) => void;
  setTransferProof: (proof: TransferProof | null) => void;
  confirmBooking: (options?: {
    omiseTokenId?: string;
    service?: BookingService;
  }) => Booking | null;
  patchConfirmedBooking: (id: string, patch: Partial<Booking>) => void;
  getLegPrice: (leg: Omit<BookingLeg, "price">) => number;
  getTotalPrice: () => number;
  resetDraft: () => void;
  ensureTransferRef: () => void;
}

/** Stable initial leg — no Date/UUID so SSR and client match */
const INITIAL_LEG: Omit<BookingLeg, "price"> = {
  id: "leg-initial",
  fromId: "kbv-airport",
  toId: "ao-nang-beach",
  date: "",
  time: "10:00",
  vehicleCode: "ECO",
};

const INITIAL_DRAFT: BookingDraft = {
  service: "transfer",
  transferRef: "",
  rentalPackageId: getDefaultRentalPackageId(),
  rentalDays: 1,
  type: "one-way",
  legs: [INITIAL_LEG],
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  flightNumber: "",
  notes: "",
  paymentPlan: null,
  paymentMethod: null,
  card: {
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  },
  transferBankSymbol: null,
  transferProof: null,
};

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function createLeg(
  overrides: Partial<Omit<BookingLeg, "price">> = {}
): Omit<BookingLeg, "price"> {
  return {
    id: crypto.randomUUID(),
    fromId: "kbv-airport",
    toId: "ao-nang-beach",
    date: todayISODate(),
    time: "10:00",
    vehicleCode: "ECO",
    ...overrides,
  };
}

function createDefaultDraft(): BookingDraft {
  return {
    ...INITIAL_DRAFT,
    transferRef: generateBookingNumber(),
    legs: [{ ...INITIAL_LEG, date: todayISODate() }],
    rentalPackageId: getDefaultRentalPackageId(),
  };
}

function generateBookingNumber(): string {
  const date = new Date();
  const prefix = "KLT";
  const stamp = date.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `${prefix}${stamp}${rand}`;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      draft: INITIAL_DRAFT,
      confirmedBookings: [],

      setBookingType: (type) =>
        set((state) => {
          let legs = [...state.draft.legs];
          if (type === "one-way") {
            legs = [legs[0] ?? createLeg()];
          } else if (type === "round-trip" && legs.length === 1) {
            const first = legs[0];
            legs = [
              first,
              createLeg({
                fromId: first.toId,
                toId: first.fromId,
                date: first.date || todayISODate(),
                vehicleCode: first.vehicleCode,
              }),
            ];
          }
          return { draft: { ...state.draft, type, legs } };
        }),

      addLeg: () =>
        set((state) => ({
          draft: {
            ...state.draft,
            legs: [...state.draft.legs, createLeg()],
          },
        })),

      removeLeg: (id) =>
        set((state) => ({
          draft: {
            ...state.draft,
            legs: state.draft.legs.filter((l) => l.id !== id),
          },
        })),

      updateLeg: (id, updates) =>
        set((state) => ({
          draft: {
            ...state.draft,
            legs: state.draft.legs.map((l) =>
              l.id === id ? { ...l, ...updates } : l
            ),
          },
        })),

      setCustomer: (field, value) =>
        set((state) => ({
          draft: { ...state.draft, [field]: value },
        })),

      setService: (service) =>
        set((state) => ({
          draft: { ...state.draft, service },
        })),

      setRentalPackage: (packageId) =>
        set((state) => ({
          draft: { ...state.draft, rentalPackageId: packageId },
        })),

      setRentalDays: (days) =>
        set((state) => ({
          draft: {
            ...state.draft,
            rentalDays: Math.min(30, Math.max(1, days)),
          },
        })),

      setPaymentPlan: (plan) =>
        set((state) => ({
          draft: {
            ...state.draft,
            paymentPlan: plan,
            ...(plan === "pay-driver"
              ? {
                  paymentMethod: "cash" as const,
                  transferBankSymbol: null,
                  transferProof: null,
                }
              : state.draft.paymentMethod === "cash"
                ? { paymentMethod: null }
                : {}),
          },
        })),

      setPaymentMethod: (method) =>
        set((state) => ({
          draft: {
            ...state.draft,
            paymentMethod: method,
            ...(method !== "bank-transfer" ? { transferBankSymbol: null } : {}),
            ...(method !== "bank-transfer" && method !== "promptpay"
              ? { transferProof: null }
              : {}),
          },
        })),

      setCardField: (field, value) =>
        set((state) => ({
          draft: {
            ...state.draft,
            card: { ...state.draft.card, [field]: value },
          },
        })),

      setTransferBank: (symbol) =>
        set((state) => ({
          draft: { ...state.draft, transferBankSymbol: symbol },
        })),

      setTransferProof: (proof) =>
        set((state) => ({
          draft: { ...state.draft, transferProof: proof },
        })),

      getLegPrice: (leg) => {
        if (get().draft.service === "rental") {
          return 0;
        }
        if (
          get().draft.type === "daily-charter" ||
          get().draft.type === "hourly-charter"
        ) {
          const rates = getActiveCharterRates();
          const base =
            get().draft.type === "daily-charter"
              ? rates.daily
              : rates.hourly * rates.hourlyMinHours;
          const multipliers: Record<VehicleCode, number> = {
            ECO: 1,
            PREM: 1.25,
            SUV: 1.4,
            VAN: 1.6,
            VIP: 2,
            EXE: 2.2,
            SIG: 2.5,
            BUS: 3,
          };
          return Math.round(base * (multipliers[leg.vehicleCode] ?? 1));
        }
        return calculatePrice(leg.fromId, leg.toId, leg.vehicleCode).totalPrice;
      },

      getTotalPrice: () => {
        const { draft, getLegPrice } = get();
        if (draft.service === "rental") {
          return calculateRentalTotal(draft.rentalPackageId, draft.rentalDays);
        }
        const legsTotal = draft.legs.reduce(
          (sum, leg) => sum + getLegPrice(leg),
          0
        );
        return legsTotal + getNightDriverSurcharge(draft.legs);
      },

      patchConfirmedBooking: (id, patch) =>
        set((state) => ({
          confirmedBookings: state.confirmedBookings.map((b) =>
            b.id === id ? { ...b, ...patch } : b
          ),
        })),

      confirmBooking: (options) => {
        const { draft, getLegPrice, getTotalPrice } = get();
        if (!draft.customerName || !draft.customerEmail || !draft.customerPhone) {
          return null;
        }
        if (!draft.paymentPlan) {
          return null;
        }
        if (!draft.paymentMethod) {
          return null;
        }

        const isPayDriver = draft.paymentPlan === "pay-driver";

        if (!isPayDriver && draft.paymentMethod === "bank-transfer") {
          if (!draft.transferBankSymbol || !draft.transferProof) {
            return null;
          }
        }

        if (!isPayDriver && draft.paymentMethod === "promptpay") {
          if (!draft.transferProof) {
            return null;
          }
        }

        if (draft.paymentMethod === "card") {
          const digits = draft.card.cardNumber.replace(/\s/g, "");
          if (
            digits.length < 15 ||
            !draft.card.cardName.trim() ||
            draft.card.expiry.length < 4 ||
            draft.card.cvv.length < 3
          ) {
            return null;
          }
        }

        const legs: BookingLeg[] = draft.legs.map((leg) => ({
          ...leg,
          price: getLegPrice(leg),
        }));

        const service = options?.service ?? draft.service;

        if (service !== "rental" && !hasAdvanceBooking(legs)) {
          return null;
        }

        const serviceCharge =
          service === "rental" ? 0 : getNightDriverSurcharge(legs);
        const totalPrice = getTotalPrice();
        const paymentPlan = draft.paymentPlan;
        const amountDueNow = getAmountDueNow(totalPrice, service, paymentPlan);
        const balanceDue = getRemainingBalance(totalPrice, service, paymentPlan);
        const bookingNumber = draft.transferRef || generateBookingNumber();
        const createdAt = new Date().toISOString();

        const paymentBase = {
          amountDue: amountDueNow,
          ...(balanceDue > 0 ? { balanceDue } : {}),
        };

        let payment: BookingPayment;
        if (isPayDriver || draft.paymentMethod === "cash") {
          payment = {
            method: "cash",
            summary: "Pay driver in cash (awaiting staff confirmation)",
            status: "awaiting-transfer",
            ...paymentBase,
          };
        } else if (draft.paymentMethod === "bank-transfer") {
          payment = {
            method: "bank-transfer",
            summary:
              paymentPlan === "deposit"
                ? `Deposit ฿${amountDueNow} via ${draft.transferBankSymbol} (pending verification)`
                : `Bank transfer ${draft.transferBankSymbol} (pending verification)`,
            status: "awaiting-transfer",
            bankSymbol: draft.transferBankSymbol ?? undefined,
            transferProof: draft.transferProof ?? undefined,
            ...paymentBase,
          };
        } else if (draft.paymentMethod === "card") {
          const last4 = draft.card.cardNumber.replace(/\s/g, "").slice(-4);
          payment = {
            method: "card",
            summary: options?.omiseTokenId
              ? `Card **** ${last4} (Omise)`
              : `Card **** ${last4} (pending verification)`,
            status: "awaiting-transfer",
            omiseTokenId: options?.omiseTokenId,
            ...paymentBase,
          };
        } else {
          payment = {
            method: "promptpay",
            summary:
              paymentPlan === "deposit"
                ? `Deposit ฿${amountDueNow} via PromptPay ${getPromptPay().id} (pending verification)`
                : `PromptPay ${getPromptPay().id} (pending verification)`,
            status: "awaiting-transfer",
            transferProof: draft.transferProof ?? undefined,
            ...paymentBase,
          };
        }

        const booking: Booking = {
          id: crypto.randomUUID(),
          bookingNumber,
          type: draft.type,
          service,
          paymentPlan,
          legs,
          customerName: draft.customerName,
          customerEmail: draft.customerEmail,
          customerPhone: draft.customerPhone,
          flightNumber: draft.flightNumber || undefined,
          notes: draft.notes || undefined,
          totalPrice,
          ...(serviceCharge > 0 ? { serviceCharge } : {}),
          amountDueNow,
          ...(balanceDue > 0 ? { balanceDue } : {}),
          ...(service === "rental"
            ? {
                rentalPackageId: draft.rentalPackageId,
                rentalDays: draft.rentalDays,
              }
            : {}),
          createdAt,
          status: "pending",
          payment,
        };

        set((state) => ({
          confirmedBookings: [booking, ...state.confirmedBookings],
          draft: createDefaultDraft(),
        }));

        return booking;
      },

      resetDraft: () => set({ draft: createDefaultDraft() }),

      ensureTransferRef: () =>
        set((state) => {
          if (state.draft.transferRef) return state;
          return {
            draft: {
              ...state.draft,
              transferRef: generateBookingNumber(),
            },
          };
        }),
    }),
    {
      name: "krabi-links-bookings",
      // Draft must not persist — it caused SSR/client price mismatches
      partialize: (state) => ({
        confirmedBookings: state.confirmedBookings,
      }),
    }
  )
);

/** Wait until localStorage rehydration finishes (for voucher page). */
export function useBookingStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const finish = () => setHydrated(true);

    if (useBookingStore.persist.hasHydrated()) {
      finish();
      return;
    }

    return useBookingStore.persist.onFinishHydration(finish);
  }, []);

  return hydrated;
}

export function getBookingByNumber(
  bookingNumber: string,
  bookings: Booking[]
): Booking | undefined {
  return bookings.find((b) => b.bookingNumber === bookingNumber);
}
