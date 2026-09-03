"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  defaultSiteSettings,
  type CancelPolicySettings,
  type CharterSettings,
  type ContactSettings,
  type PaymentSettings,
  type RentalDepositSettings,
  type SiteSettings,
  type StaffAccount,
} from "@/lib/admin/settings";
import { siteConfig } from "@/lib/site-config";

interface SettingsState extends SiteSettings {
  updatedAt: string | null;
  saveContact: (contact: ContactSettings) => void;
  savePayment: (payment: PaymentSettings) => void;
  saveCharter: (charter: CharterSettings) => void;
  saveCancelPolicy: (cancelPolicy: CancelPolicySettings) => void;
  saveRentalDeposits: (rentalDeposits: RentalDepositSettings) => void;
  saveStaff: (staff: StaffAccount[]) => void;
  resetSettings: () => void;
}

const mark = () => new Date().toISOString();

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSiteSettings(),
      updatedAt: null,
      saveContact: (contact) => set({ contact, updatedAt: mark() }),
      savePayment: (payment) => set({ payment, updatedAt: mark() }),
      saveCharter: (charter) => set({ charter, updatedAt: mark() }),
      saveCancelPolicy: (cancelPolicy) =>
        set({ cancelPolicy, updatedAt: mark() }),
      saveRentalDeposits: (rentalDeposits) =>
        set({ rentalDeposits, updatedAt: mark() }),
      saveStaff: (staff) => set({ staff, updatedAt: mark() }),
      resetSettings: () =>
        set({ ...defaultSiteSettings(), updatedAt: null }),
    }),
    {
      name: "klt-settings",
      partialize: (state) => ({
        contact: state.contact,
        payment: state.payment,
        charter: state.charter,
        cancelPolicy: state.cancelPolicy,
        rentalDeposits: state.rentalDeposits,
        staff: state.staff,
        updatedAt: state.updatedAt,
      }),
    }
  )
);

function live(): SiteSettings {
  if (typeof window === "undefined") return defaultSiteSettings();
  const state = useSettingsStore.getState();
  return {
    contact: state.contact,
    payment: state.payment,
    charter: state.charter,
    cancelPolicy: state.cancelPolicy,
    rentalDeposits: state.rentalDeposits,
    staff: state.staff,
  };
}

export function getActiveContact() {
  const contact = live().contact;
  return {
    ...siteConfig,
    ...contact,
    whatsapp: contact.whatsapp || contact.line || siteConfig.whatsapp,
    facebook: contact.facebook || siteConfig.facebook,
  };
}

export function getActivePaymentSettings() {
  return live().payment;
}

export function getActiveCharterRates() {
  return live().charter;
}

export function getActiveCancelPolicy() {
  return live().cancelPolicy;
}

export function getActiveRentalDeposits() {
  return live().rentalDeposits;
}

export function getActiveStaff() {
  return live().staff;
}

export function useSiteContact() {
  const contact = useSettingsStore((s) => s.contact);
  return {
    ...siteConfig,
    ...contact,
    whatsapp: contact.whatsapp || contact.line || siteConfig.whatsapp,
    facebook: contact.facebook || siteConfig.facebook,
  };
}

export function useSettingsRevision() {
  return useSettingsStore((s) => s.updatedAt);
}
