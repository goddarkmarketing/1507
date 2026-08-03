import type { PaymentMethod } from "@/lib/types";

export type ThaiBankSymbol = "KBANK" | "SCB" | "BBL" | "PromptPay";

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
    description: "Visa, Mastercard — mock payment for demo.",
  },
  {
    value: "promptpay",
    label: "PromptPay",
    description: "Scan QR or pay to our PromptPay ID.",
  },
];

/**
 * Mock company bank accounts.
 * Icons from https://github.com/casperstack/thai-banks-logo
 * (copied into /public/banks from thai-banks-logo package)
 */
export const mockBankAccounts: {
  symbol: Exclude<ThaiBankSymbol, "PromptPay">;
  bank: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  icon: string;
}[] = [
  {
    symbol: "KBANK",
    bank: "Kasikorn Bank (KBank)",
    accountName: "KRABI LINKS TAXI CO., LTD.",
    accountNumber: "123-4-56789-0",
    branch: "Ao Nang",
    icon: "/banks/KBANK.png",
  },
  {
    symbol: "SCB",
    bank: "Siam Commercial Bank (SCB)",
    accountName: "KRABI LINKS TAXI CO., LTD.",
    accountNumber: "987-6-54321-0",
    branch: "Krabi Town",
    icon: "/banks/SCB.png",
  },
  {
    symbol: "BBL",
    bank: "Bangkok Bank",
    accountName: "KRABI LINKS TAXI CO., LTD.",
    accountNumber: "456-7-89123-4",
    branch: "Krabi Airport",
    icon: "/banks/BBL.png",
  },
];

/** Mock PromptPay details (demo only) */
const PROMPTPAY_ID = "0812345678";

export const mockPromptPay = {
  id: PROMPTPAY_ID,
  idType: "mobile" as const,
  accountName: "KRABI LINKS TAXI CO., LTD.",
  icon: "/banks/PromptPay.png",
  /** Payload shown in QR — not a real EMVCo string */
  qrPayload: (amount: number, bookingRef: string) =>
    `PROMPTPAY|MOCK|${PROMPTPAY_ID}|THB${amount}|REF:${bookingRef}`,
};

export const MAX_TRANSFER_PROOF_BYTES = 1.5 * 1024 * 1024;
export const TRANSFER_PROOF_ACCEPT = "image/jpeg,image/png,image/webp,application/pdf";
