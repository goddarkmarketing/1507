import { siteConfig } from "@/lib/site-config";
import type { PaymentMethod, VehicleCode } from "@/lib/types";

export type StaffRole = "admin" | "ops" | "finance" | "driver";

export type BankAccountSettings = {
  symbol: "KBANK" | "SCB" | "BBL";
  bank: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  enabled: boolean;
};

export type ContactSettings = {
  phone: string;
  email: string;
  line: string;
  address: string;
};

export type PaymentSettings = {
  methods: Record<PaymentMethod, boolean>;
  banks: BankAccountSettings[];
  promptPayId: string;
  promptPayAccountName: string;
};

export type CharterSettings = {
  daily: number;
  hourly: number;
  hourlyMinHours: number;
};

export type CancelPolicySettings = {
  freeCancelHours: number;
  lateFeePercent: number;
  noShowPercent: number;
  refundBusinessDays: number;
};

export type StaffAccount = {
  id: string;
  name: string;
  username: string;
  password: string;
  role: StaffRole;
};

export type RentalDepositSettings = {
  advanceDeposit: number;
  smallCarDeposit: number;
  largeCarDeposit: number;
};

export type SiteSettings = {
  contact: ContactSettings;
  payment: PaymentSettings;
  charter: CharterSettings;
  cancelPolicy: CancelPolicySettings;
  rentalDeposits: RentalDepositSettings;
  staff: StaffAccount[];
};

export const BANK_ICONS: Record<BankAccountSettings["symbol"], string> = {
  KBANK: "/banks/KBANK.png",
  SCB: "/banks/SCB.png",
  BBL: "/banks/BBL.png",
};

export const DRIVER_VEHICLE_CODES: VehicleCode[] = [
  "ECO",
  "PREM",
  "SUV",
  "VAN",
  "EXE",
  "VIP",
  "SIG",
  "BUS",
];

export const defaultSiteSettings = (): SiteSettings => ({
  contact: {
    phone: siteConfig.phone,
    email: siteConfig.email,
    line: siteConfig.line,
    address: siteConfig.address,
  },
  payment: {
    methods: {
      "bank-transfer": true,
      card: false,
      promptpay: true,
      cash: false,
    },
    banks: [
      {
        symbol: "KBANK",
        bank: "Kasikorn Bank (KBank)",
        accountName: "KRABI LINKS TAXI CO., LTD.",
        accountNumber: "123-4-56789-0",
        branch: "Ao Nang",
        enabled: true,
      },
      {
        symbol: "SCB",
        bank: "Siam Commercial Bank (SCB)",
        accountName: "KRABI LINKS TAXI CO., LTD.",
        accountNumber: "987-6-54321-0",
        branch: "Krabi Town",
        enabled: true,
      },
      {
        symbol: "BBL",
        bank: "Bangkok Bank",
        accountName: "KRABI LINKS TAXI CO., LTD.",
        accountNumber: "456-7-89123-4",
        branch: "Krabi Airport",
        enabled: true,
      },
    ],
    promptPayId: "0812345678",
    promptPayAccountName: "KRABI LINKS TAXI CO., LTD.",
  },
  charter: {
    daily: 3500,
    hourly: 500,
    hourlyMinHours: 3,
  },
  cancelPolicy: {
    freeCancelHours: 24,
    lateFeePercent: 50,
    noShowPercent: 100,
    refundBusinessDays: 7,
  },
  rentalDeposits: {
    advanceDeposit: 500,
    smallCarDeposit: 3000,
    largeCarDeposit: 5000,
  },
  staff: [],
});
