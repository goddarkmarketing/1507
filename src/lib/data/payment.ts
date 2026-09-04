import type { PaymentMethod } from "@/lib/types";
import { buildPromptPayQrPayload } from "@/lib/payment/promptpay";
import {
  BANK_ICONS,
  defaultSiteSettings,
  type BankAccountSettings,
} from "@/lib/admin/settings";
import { getActivePaymentSettings } from "@/lib/admin/settings-store";

export type ThaiBankSymbol = "KBANK" | "BAY" | "SCB" | "BBL" | "PromptPay";

export const paymentMethodOptions: {
  value: PaymentMethod;
  label: string;
  description: string;
}[] = [
  {
    value: "bank-transfer",
    label: "Bank Transfer",
    description: "Transfer to our company account, then upload your slip.",
  },
  {
    value: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard — secure card payment.",
  },
  {
    value: "promptpay",
    label: "PromptPay",
    description: "Scan QR or pay to our PromptPay ID.",
  },
  {
    value: "cash",
    label: "Cash to driver",
    description: "Pay in THB when you meet the driver.",
  },
];

export function getEnabledPaymentMethods(): PaymentMethod[] {
  const methods = getActivePaymentSettings().methods;
  return paymentMethodOptions
    .map((opt) => opt.value)
    .filter((value) => methods[value]);
}

export function getBankAccounts(): (BankAccountSettings & { icon: string })[] {
  return getActivePaymentSettings()
    .banks.filter((bank) => bank.enabled)
    .map((bank) => ({ ...bank, icon: BANK_ICONS[bank.symbol] }));
}

export const PROMPTPAY_QR_IMAGE = "/banks/qr-promptpay.png";

export function getPromptPay() {
  const payment = getActivePaymentSettings();
  const defaults = defaultSiteSettings().payment;
  const id = payment.promptPayId || defaults.promptPayId;
  return {
    id,
    idType: "mobile" as const,
    accountName: payment.promptPayAccountName || defaults.promptPayAccountName,
    icon: "/banks/PromptPay.png",
    qrImage: PROMPTPAY_QR_IMAGE,
    qrPayload: (amount: number, _bookingRef: string) =>
      buildPromptPayQrPayload(id, amount),
  };
}

/**
 * Built-in demo accounts — used as the settings default.
 * Icons from https://github.com/casperstack/thai-banks-logo
 */
export const mockBankAccounts = defaultSiteSettings().payment.banks.map(
  (bank) => ({
    ...bank,
    icon: BANK_ICONS[bank.symbol],
  })
);

export const mockPromptPay = {
  id: defaultSiteSettings().payment.promptPayId,
  idType: "mobile" as const,
  accountName: defaultSiteSettings().payment.promptPayAccountName,
  icon: "/banks/PromptPay.png",
  qrPayload: (amount: number, _bookingRef: string) =>
    buildPromptPayQrPayload(defaultSiteSettings().payment.promptPayId, amount),
};

export const MAX_TRANSFER_PROOF_BYTES = 1.5 * 1024 * 1024;
export const TRANSFER_PROOF_ACCEPT =
  "image/jpeg,image/png,image/webp,application/pdf";
