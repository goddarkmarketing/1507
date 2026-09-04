import { siteConfig } from "@/lib/site-config";
import type { PaymentMethod, VehicleCode } from "@/lib/types";

export type StaffRole = "admin" | "ops" | "finance" | "driver";

export type BankAccountSettings = {
  symbol: "KBANK" | "BAY" | "SCB" | "BBL";
  bank: string;
  accountName: string;
  accountNumber: string;
  branch: string;
  enabled: boolean;
  /** Optional static QR slip image under /public */
  qrImage?: string;
};

export type ContactSettings = {
  phone: string;
  email: string;
  whatsapp: string;
  facebook: string;
  /** @deprecated kept for older saved settings */
  line?: string;
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
  BAY: "/banks/BAY.png",
  SCB: "/banks/SCB.png",
  BBL: "/banks/BBL.png",
};

/** Real receiving accounts for KRABI LINKS TAXI bookings */
export const DEFAULT_PAYMENT_ACCOUNT_NAME = "นาย จักรภัทร์ สกุลทอง";

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
    whatsapp: siteConfig.whatsapp,
    facebook: siteConfig.facebook,
    line: siteConfig.whatsapp,
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
        bank: "Kasikorn Bank (KBank) / ธนาคารกสิกรไทย",
        accountName: DEFAULT_PAYMENT_ACCOUNT_NAME,
        accountNumber: "032-3-56203-2",
        branch: "-",
        enabled: true,
        qrImage: "/banks/qr-kbank.png",
      },
      {
        symbol: "BAY",
        bank: "Bank of Ayudhya (Krungsri) / ธนาคารกรุงศรีอยุธยา",
        accountName: DEFAULT_PAYMENT_ACCOUNT_NAME,
        accountNumber: "564-1-05371-5",
        branch: "-",
        enabled: true,
      },
    ],
    promptPayId: "088-443-3309",
    promptPayAccountName: DEFAULT_PAYMENT_ACCOUNT_NAME,
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
