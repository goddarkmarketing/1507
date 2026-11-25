import type { TransferCategory, VehicleCode } from "@/lib/types";
import { getImportedTransferRoutes } from "@/lib/admin/catalog-store";
import { getLocation } from "@/lib/data/locations";

export type OfficialVehiclePrices = Record<VehicleCode, number>;

export type OfficialTransferRoute = {
  fromId: string;
  toId: string;
  distanceKm: number;
  durationMin: number;
  category: TransferCategory;
  prices: OfficialVehiclePrices;
  /** Optional sheet label edited in admin. Empty keeps the built-in name. */
  name?: string;
};

/** Official Set 1 prices: Krabi Airport ↔ destinations (THB, one way, both directions). Source: KRABI_LINKS_TAXI_3080_Routes_Origin_Category_First.xlsx */
const set1OfficialRoutes: OfficialTransferRoute[] = [
  {
    fromId: "kbv-airport",
    toId: "krabi-bus-terminal",
    distanceKm: 16,
    durationMin: 35,
    category: "city",
    prices: {
      ECO: 400,
      PREM: 600,
      SUV: 500,
      VAN: 600,
      EXE: 700,
      VIP: 4000,
      SIG: 4000,
      BUS: 4000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "krabi-town",
    distanceKm: 15,
    durationMin: 33,
    category: "city",
    prices: {
      ECO: 400,
      PREM: 600,
      SUV: 500,
      VAN: 600,
      EXE: 700,
      VIP: 4000,
      SIG: 4000,
      BUS: 4000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "klong-jilad-pier",
    distanceKm: 16,
    durationMin: 35,
    category: "pier",
    prices: {
      ECO: 400,
      PREM: 600,
      SUV: 500,
      VAN: 600,
      EXE: 700,
      VIP: 4000,
      SIG: 4000,
      BUS: 4000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "ao-nang-beach",
    distanceKm: 24,
    durationMin: 45,
    category: "beach",
    prices: {
      ECO: 500,
      PREM: 700,
      SUV: 600,
      VAN: 700,
      EXE: 800,
      VIP: 5000,
      SIG: 5000,
      BUS: 5000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "ao-nam-mao",
    distanceKm: 20,
    durationMin: 44,
    category: "pier",
    prices: {
      ECO: 500,
      PREM: 700,
      SUV: 600,
      VAN: 700,
      EXE: 800,
      VIP: 5000,
      SIG: 5000,
      BUS: 5000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "klong-muang",
    distanceKm: 31,
    durationMin: 68,
    category: "beach",
    prices: {
      ECO: 600,
      PREM: 800,
      SUV: 700,
      VAN: 800,
      EXE: 900,
      VIP: 5500,
      SIG: 5500,
      BUS: 5500
    },
  },
  {
    fromId: "kbv-airport",
    toId: "tubkaak-beach",
    distanceKm: 35,
    durationMin: 77,
    category: "beach",
    prices: {
      ECO: 900,
      PREM: 1100,
      SUV: 1000,
      VAN: 1100,
      EXE: 1200,
      VIP: 6200,
      SIG: 6200,
      BUS: 6200
    },
  },
  {
    fromId: "kbv-airport",
    toId: "ao-tha-lane",
    distanceKm: 40,
    durationMin: 88,
    category: "beach",
    prices: {
      ECO: 1100,
      PREM: 1300,
      SUV: 1200,
      VAN: 1300,
      EXE: 1400,
      VIP: 6700,
      SIG: 6700,
      BUS: 6700
    },
  },
  {
    fromId: "kbv-airport",
    toId: "koh-lanta-z1",
    distanceKm: 78,
    durationMin: 172,
    category: "beach",
    prices: {
      ECO: 2000,
      PREM: 2200,
      SUV: 2100,
      VAN: 2200,
      EXE: 2300,
      VIP: 8000,
      SIG: 8000,
      BUS: 8000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "koh-lanta-z2",
    distanceKm: 82,
    durationMin: 180,
    category: "beach",
    prices: {
      ECO: 2200,
      PREM: 2400,
      SUV: 2300,
      VAN: 2400,
      EXE: 2500,
      VIP: 8200,
      SIG: 8200,
      BUS: 8200
    },
  },
  {
    fromId: "kbv-airport",
    toId: "koh-lanta-z3",
    distanceKm: 85,
    durationMin: 187,
    category: "beach",
    prices: {
      ECO: 2400,
      PREM: 2600,
      SUV: 2500,
      VAN: 2600,
      EXE: 2700,
      VIP: 8400,
      SIG: 8400,
      BUS: 8400
    },
  },
  {
    fromId: "kbv-airport",
    toId: "chao-fah-pier",
    distanceKm: 16,
    durationMin: 35,
    category: "pier",
    prices: {
      ECO: 400,
      PREM: 600,
      SUV: 500,
      VAN: 600,
      EXE: 700,
      VIP: 4000,
      SIG: 4000,
      BUS: 4000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "had-yao-krabi",
    distanceKm: 32,
    durationMin: 70,
    category: "beach",
    prices: {
      ECO: 800,
      PREM: 1000,
      SUV: 900,
      VAN: 1000,
      EXE: 1100,
      VIP: 5700,
      SIG: 5700,
      BUS: 5700
    },
  },
  {
    fromId: "kbv-airport",
    toId: "laem-kruat-pier",
    distanceKm: 35,
    durationMin: 77,
    category: "pier",
    prices: {
      ECO: 900,
      PREM: 1100,
      SUV: 1000,
      VAN: 1100,
      EXE: 1200,
      VIP: 6200,
      SIG: 6200,
      BUS: 6200
    },
  },
  {
    fromId: "kbv-airport",
    toId: "boat-lagoon-krabi",
    distanceKm: 28,
    durationMin: 62,
    category: "pier",
    prices: {
      ECO: 700,
      PREM: 900,
      SUV: 800,
      VAN: 900,
      EXE: 1000,
      VIP: 5200,
      SIG: 5200,
      BUS: 5200
    },
  },
  {
    fromId: "kbv-airport",
    toId: "hua-hin-pier",
    distanceKm: 70,
    durationMin: 154,
    category: "pier",
    prices: {
      ECO: 1400,
      PREM: 1600,
      SUV: 1500,
      VAN: 1600,
      EXE: 1700,
      VIP: 5900,
      SIG: 5900,
      BUS: 5900
    },
  },
  {
    fromId: "kbv-airport",
    toId: "pak-meng-pier",
    distanceKm: 90,
    durationMin: 135,
    category: "inter-province",
    prices: {
      ECO: 2000,
      PREM: 2200,
      SUV: 2100,
      VAN: 2200,
      EXE: 2300,
      VIP: 7000,
      SIG: 7000,
      BUS: 7000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "kuan-tung-ku-pier",
    distanceKm: 110,
    durationMin: 165,
    category: "inter-province",
    prices: {
      ECO: 2500,
      PREM: 2700,
      SUV: 2600,
      VAN: 2700,
      EXE: 2800,
      VIP: 8500,
      SIG: 8500,
      BUS: 10000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "hat-yao-pier-trang",
    distanceKm: 130,
    durationMin: 195,
    category: "inter-province",
    prices: {
      ECO: 2900,
      PREM: 3100,
      SUV: 3000,
      VAN: 3100,
      EXE: 3200,
      VIP: 7900,
      SIG: 7900,
      BUS: 7900
    },
  },
  {
    fromId: "kbv-airport",
    toId: "trang-airport",
    distanceKm: 130,
    durationMin: 195,
    category: "inter-province",
    prices: {
      ECO: 2900,
      PREM: 3100,
      SUV: 3000,
      VAN: 3100,
      EXE: 3200,
      VIP: 7900,
      SIG: 7900,
      BUS: 7900
    },
  },
  {
    fromId: "kbv-airport",
    toId: "trang-railway",
    distanceKm: 120,
    durationMin: 180,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3000,
      VIP: 7700,
      SIG: 7700,
      BUS: 7700
    },
  },
  {
    fromId: "kbv-airport",
    toId: "trang-town",
    distanceKm: 120,
    durationMin: 180,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3000,
      VIP: 7700,
      SIG: 7700,
      BUS: 7700
    },
  },
  {
    fromId: "kbv-airport",
    toId: "ratchaprapha-pier",
    distanceKm: 150,
    durationMin: 225,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3000,
      VIP: 7700,
      SIG: 7700,
      BUS: 7700
    },
  },
  {
    fromId: "kbv-airport",
    toId: "khao-sok",
    distanceKm: 140,
    durationMin: 210,
    category: "inter-province",
    prices: {
      ECO: 2900,
      PREM: 3100,
      SUV: 3000,
      VAN: 3100,
      EXE: 3200,
      VIP: 7900,
      SIG: 7900,
      BUS: 7900
    },
  },
  {
    fromId: "kbv-airport",
    toId: "thap-lamu-pier",
    distanceKm: 120,
    durationMin: 180,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3000,
      VIP: 7700,
      SIG: 7700,
      BUS: 7700
    },
  },
  {
    fromId: "kbv-airport",
    toId: "khao-lak-z1",
    distanceKm: 105,
    durationMin: 158,
    category: "inter-province",
    prices: {
      ECO: 3000,
      PREM: 3200,
      SUV: 3100,
      VAN: 3200,
      EXE: 3300,
      VIP: 8000,
      SIG: 8000,
      BUS: 8000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "khao-lak-z2",
    distanceKm: 105,
    durationMin: 158,
    category: "inter-province",
    prices: {
      ECO: 3000,
      PREM: 3200,
      SUV: 3100,
      VAN: 3200,
      EXE: 3300,
      VIP: 8000,
      SIG: 8000,
      BUS: 8000
    },
  },
  {
    fromId: "kbv-airport",
    toId: "natai-beach",
    distanceKm: 95,
    durationMin: 143,
    category: "inter-province",
    prices: {
      ECO: 2400,
      PREM: 2600,
      SUV: 2500,
      VAN: 2600,
      EXE: 2900,
      VIP: 7600,
      SIG: 7600,
      BUS: 7600
    },
  },
  {
    fromId: "kbv-airport",
    toId: "mai-khao-beach",
    distanceKm: 88,
    durationMin: 132,
    category: "inter-province",
    prices: {
      ECO: 2200,
      PREM: 2400,
      SUV: 2300,
      VAN: 2400,
      EXE: 2700,
      VIP: 7400,
      SIG: 7400,
      BUS: 7400
    },
  },
  {
    fromId: "kbv-airport",
    toId: "samet-nangshe",
    distanceKm: 85,
    durationMin: 128,
    category: "inter-province",
    prices: {
      ECO: 2200,
      PREM: 2400,
      SUV: 2300,
      VAN: 2400,
      EXE: 2700,
      VIP: 7400,
      SIG: 7400,
      BUS: 7400
    },
  },
  {
    fromId: "kbv-airport",
    toId: "phuket-airport",
    distanceKm: 80,
    durationMin: 120,
    category: "inter-province",
    prices: {
      ECO: 2200,
      PREM: 2400,
      SUV: 2300,
      VAN: 2400,
      EXE: 2700,
      VIP: 7400,
      SIG: 7400,
      BUS: 7400
    },
  },
  {
    fromId: "kbv-airport",
    toId: "nai-yang-beach",
    distanceKm: 90,
    durationMin: 135,
    category: "inter-province",
    prices: {
      ECO: 2200,
      PREM: 2400,
      SUV: 2300,
      VAN: 2400,
      EXE: 2700,
      VIP: 7400,
      SIG: 7400,
      BUS: 7400
    },
  },
  {
    fromId: "kbv-airport",
    toId: "laguna-phuket",
    distanceKm: 105,
    durationMin: 158,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3200,
      VIP: 7900,
      SIG: 7900,
      BUS: 7900
    },
  },
  {
    fromId: "kbv-airport",
    toId: "kamala-beach",
    distanceKm: 114,
    durationMin: 171,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3200,
      VIP: 7900,
      SIG: 7900,
      BUS: 7900
    },
  },
  {
    fromId: "kbv-airport",
    toId: "phuket-town",
    distanceKm: 132,
    durationMin: 198,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3200,
      VIP: 7900,
      SIG: 7900,
      BUS: 7900
    },
  },
  {
    fromId: "kbv-airport",
    toId: "patong-beach",
    distanceKm: 122,
    durationMin: 183,
    category: "inter-province",
    prices: {
      ECO: 2900,
      PREM: 3100,
      SUV: 3000,
      VAN: 3100,
      EXE: 3400,
      VIP: 8100,
      SIG: 8100,
      BUS: 8100
    },
  },
  {
    fromId: "kbv-airport",
    toId: "kata-beach",
    distanceKm: 128,
    durationMin: 192,
    category: "inter-province",
    prices: {
      ECO: 3000,
      PREM: 3200,
      SUV: 3100,
      VAN: 3200,
      EXE: 3500,
      VIP: 8200,
      SIG: 8200,
      BUS: 8200
    },
  },
  {
    fromId: "kbv-airport",
    toId: "karon-beach",
    distanceKm: 126,
    durationMin: 189,
    category: "inter-province",
    prices: {
      ECO: 3000,
      PREM: 3200,
      SUV: 3100,
      VAN: 3200,
      EXE: 3500,
      VIP: 8200,
      SIG: 8200,
      BUS: 8200
    },
  },
  {
    fromId: "kbv-airport",
    toId: "chalong",
    distanceKm: 140,
    durationMin: 210,
    category: "inter-province",
    prices: {
      ECO: 3100,
      PREM: 3300,
      SUV: 3200,
      VAN: 3300,
      EXE: 3600,
      VIP: 8300,
      SIG: 8300,
      BUS: 8300
    },
  },
  {
    fromId: "kbv-airport",
    toId: "rawai-beach",
    distanceKm: 148,
    durationMin: 222,
    category: "inter-province",
    prices: {
      ECO: 3200,
      PREM: 3400,
      SUV: 3300,
      VAN: 3400,
      EXE: 3700,
      VIP: 8400,
      SIG: 8400,
      BUS: 8400
    },
  },
  {
    fromId: "kbv-airport",
    toId: "surat-airport",
    distanceKm: 110,
    durationMin: 165,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3000,
      VIP: 7700,
      SIG: 7700,
      BUS: 7700
    },
  },
  {
    fromId: "kbv-airport",
    toId: "surat-railway",
    distanceKm: 115,
    durationMin: 173,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3000,
      VIP: 7700,
      SIG: 7700,
      BUS: 7700
    },
  },
  {
    fromId: "kbv-airport",
    toId: "surat-thani",
    distanceKm: 120,
    durationMin: 180,
    category: "inter-province",
    prices: {
      ECO: 2600,
      PREM: 2800,
      SUV: 2700,
      VAN: 2800,
      EXE: 2900,
      VIP: 7600,
      SIG: 7600,
      BUS: 7600
    },
  },
  {
    fromId: "kbv-airport",
    toId: "tapee-pier",
    distanceKm: 125,
    durationMin: 188,
    category: "inter-province",
    prices: {
      ECO: 2600,
      PREM: 2800,
      SUV: 2700,
      VAN: 2800,
      EXE: 2900,
      VIP: 7600,
      SIG: 7600,
      BUS: 7600
    },
  },
  {
    fromId: "kbv-airport",
    toId: "lomprayah-donsak",
    distanceKm: 165,
    durationMin: 248,
    category: "inter-province",
    prices: {
      ECO: 3100,
      PREM: 3600,
      SUV: 3500,
      VAN: 3600,
      EXE: 3900,
      VIP: 8600,
      SIG: 8600,
      BUS: 8600
    },
  },
  {
    fromId: "kbv-airport",
    toId: "donsak-pier",
    distanceKm: 165,
    durationMin: 248,
    category: "inter-province",
    prices: {
      ECO: 3200,
      PREM: 3700,
      SUV: 3600,
      VAN: 3700,
      EXE: 4000,
      VIP: 8700,
      SIG: 8700,
      BUS: 8700
    },
  },
  {
    fromId: "kbv-airport",
    toId: "khanom",
    distanceKm: 180,
    durationMin: 270,
    category: "inter-province",
    prices: {
      ECO: 3700,
      PREM: 4200,
      SUV: 4100,
      VAN: 4200,
      EXE: 4500,
      VIP: 9200,
      SIG: 9200,
      BUS: 9200
    },
  },
  {
    fromId: "kbv-airport",
    toId: "pak-bara-pier",
    distanceKm: 210,
    durationMin: 315,
    category: "inter-province",
    prices: {
      ECO: 4200,
      PREM: 4700,
      SUV: 4600,
      VAN: 4700,
      EXE: 5000,
      VIP: 9700,
      SIG: 9700,
      BUS: 9700
    },
  },
  {
    fromId: "kbv-airport",
    toId: "satun-town",
    distanceKm: 230,
    durationMin: 345,
    category: "inter-province",
    prices: {
      ECO: 4700,
      PREM: 5200,
      SUV: 5100,
      VAN: 5200,
      EXE: 5500,
      VIP: 10200,
      SIG: 10200,
      BUS: 10200
    },
  },
  {
    fromId: "kbv-airport",
    toId: "tammalang-pier",
    distanceKm: 240,
    durationMin: 360,
    category: "inter-province",
    prices: {
      ECO: 5000,
      PREM: 5500,
      SUV: 5400,
      VAN: 5500,
      EXE: 5800,
      VIP: 10500,
      SIG: 10500,
      BUS: 10500
    },
  },
  {
    fromId: "kbv-airport",
    toId: "wang-prachan",
    distanceKm: 240,
    durationMin: 360,
    category: "inter-province",
    prices: {
      ECO: 5000,
      PREM: 5500,
      SUV: 5400,
      VAN: 5500,
      EXE: 5800,
      VIP: 10500,
      SIG: 10500,
      BUS: 10500
    },
  },
  {
    fromId: "kbv-airport",
    toId: "hat-yai-airport",
    distanceKm: 240,
    durationMin: 360,
    category: "inter-province",
    prices: {
      ECO: 5000,
      PREM: 5500,
      SUV: 5400,
      VAN: 5500,
      EXE: 5800,
      VIP: 10500,
      SIG: 10500,
      BUS: 10500
    },
  },
  {
    fromId: "kbv-airport",
    toId: "hat-yai-bus",
    distanceKm: 240,
    durationMin: 360,
    category: "inter-province",
    prices: {
      ECO: 5000,
      PREM: 5500,
      SUV: 5400,
      VAN: 5500,
      EXE: 5800,
      VIP: 10500,
      SIG: 10500,
      BUS: 10500
    },
  },
  {
    fromId: "kbv-airport",
    toId: "hat-yai-town",
    distanceKm: 235,
    durationMin: 353,
    category: "inter-province",
    prices: {
      ECO: 5000,
      PREM: 5200,
      SUV: 5100,
      VAN: 5200,
      EXE: 5500,
      VIP: 10200,
      SIG: 10200,
      BUS: 10200
    },
  },
  {
    fromId: "kbv-airport",
    toId: "dan-nok",
    distanceKm: 270,
    durationMin: 405,
    category: "inter-province",
    prices: {
      ECO: 6000,
      PREM: 6500,
      SUV: 6400,
      VAN: 6500,
      EXE: 6800,
      VIP: 11500,
      SIG: 11500,
      BUS: 11500
    },
  },
];

/** Official non-airport tariff rows (THB, one way, both directions). Source: KRABI_LINKS_TAXI_3080_Routes_Origin_Category_First.xlsx */
const set2OfficialRoutes: OfficialTransferRoute[] = [
  {
    fromId: "phuket-airport",
    toId: "ao-nang-beach",
    distanceKm: 79,
    durationMin: 111,
    category: "beach",
    prices: {
      ECO: 2200,
      PREM: 2500,
      SUV: 2400,
      VAN: 2500,
      EXE: 2800,
      VIP: 8500,
      SIG: 8500,
      BUS: 8500
    },
  },
  {
    fromId: "phuket-airport",
    toId: "patong-beach",
    distanceKm: 34,
    durationMin: 69,
    category: "inter-province",
    prices: {
      ECO: 800,
      PREM: 1200,
      SUV: 1000,
      VAN: 1200,
      EXE: 1500,
      VIP: 4900,
      SIG: 4900,
      BUS: 0
    },
  },
  {
    fromId: "ao-nang-beach",
    toId: "donsak-pier",
    distanceKm: 231,
    durationMin: 255,
    category: "inter-province",
    prices: {
      ECO: 3000,
      PREM: 3500,
      SUV: 3300,
      VAN: 3500,
      EXE: 4000,
      VIP: 11000,
      SIG: 11000,
      BUS: 12000
    },
  },
  {
    fromId: "ao-nang-beach",
    toId: "khanom",
    distanceKm: 227,
    durationMin: 251,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3700,
      SUV: 3500,
      VAN: 3700,
      EXE: 4000,
      VIP: 10000,
      SIG: 10000,
      BUS: 110000
    },
  },
  {
    fromId: "ao-nang-beach",
    toId: "khao-lak-z1",
    distanceKm: 122,
    durationMin: 140,
    category: "inter-province",
    prices: {
      ECO: 2500,
      PREM: 2800,
      SUV: 2700,
      VAN: 2800,
      EXE: 3200,
      VIP: 9500,
      SIG: 9500,
      BUS: 95000
    },
  },
  {
    fromId: "ao-nang-beach",
    toId: "khao-lak-z2",
    distanceKm: 131,
    durationMin: 150,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3500,
      VIP: 9500,
      SIG: 9500,
      BUS: 95000
    },
  },
  {
    fromId: "ao-nang-beach",
    toId: "koh-lanta-z1",
    distanceKm: 71,
    durationMin: 151,
    category: "beach",
    prices: {
      ECO: 2400,
      PREM: 2800,
      SUV: 2600,
      VAN: 2800,
      EXE: 3000,
      VIP: 9500,
      SIG: 9500,
      BUS: 10000
    },
  },
  {
    fromId: "ao-nang-beach",
    toId: "koh-lanta-z2",
    distanceKm: 80,
    durationMin: 162,
    category: "beach",
    prices: {
      ECO: 2500,
      PREM: 2900,
      SUV: 2700,
      VAN: 2900,
      EXE: 3200,
      VIP: 9500,
      SIG: 9500,
      BUS: 11000
    },
  },
  {
    fromId: "ao-nang-beach",
    toId: "koh-lanta-z3",
    distanceKm: 93,
    durationMin: 178,
    category: "beach",
    prices: {
      ECO: 2600,
      PREM: 3000,
      SUV: 2800,
      VAN: 3000,
      EXE: 3400,
      VIP: 9500,
      SIG: 9500,
      BUS: 11000
    },
  },
  {
    fromId: "ao-nang-beach",
    toId: "patong-beach",
    distanceKm: 84,
    durationMin: 117,
    category: "inter-province",
    prices: {
      ECO: 2800,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3500,
      VIP: 9500,
      SIG: 9500,
      BUS: 12000
    },
  },
  {
    fromId: "ao-nang-beach",
    toId: "ratchaprapha-pier",
    distanceKm: 138,
    durationMin: 157,
    category: "inter-province",
    prices: {
      ECO: 2500,
      PREM: 2800,
      SUV: 2700,
      VAN: 2800,
      EXE: 3000,
      VIP: 8500,
      SIG: 8500,
      BUS: 9000
    },
  },
  {
    fromId: "ao-nang-beach",
    toId: "thap-lamu-pier",
    distanceKm: 116,
    durationMin: 134,
    category: "inter-province",
    prices: {
      ECO: 2400,
      PREM: 2700,
      SUV: 2600,
      VAN: 2700,
      EXE: 3100,
      VIP: 9500,
      SIG: 9500,
      BUS: 95000
    },
  },
  {
    fromId: "ao-nam-mao",
    toId: "donsak-pier",
    distanceKm: 231,
    durationMin: 255,
    category: "inter-province",
    prices: {
      ECO: 3000,
      PREM: 3500,
      SUV: 3300,
      VAN: 3500,
      EXE: 4000,
      VIP: 11000,
      SIG: 11000,
      BUS: 12000
    },
  },
  {
    fromId: "ao-nam-mao",
    toId: "khanom",
    distanceKm: 227,
    durationMin: 251,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3700,
      SUV: 3500,
      VAN: 3700,
      EXE: 4000,
      VIP: 10000,
      SIG: 10000,
      BUS: 110000
    },
  },
  {
    fromId: "ao-nam-mao",
    toId: "khao-lak-z1",
    distanceKm: 125,
    durationMin: 144,
    category: "inter-province",
    prices: {
      ECO: 2500,
      PREM: 2800,
      SUV: 2700,
      VAN: 2800,
      EXE: 3200,
      VIP: 9500,
      SIG: 9500,
      BUS: 95000
    },
  },
  {
    fromId: "ao-nam-mao",
    toId: "khao-lak-z2",
    distanceKm: 134,
    durationMin: 153,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3500,
      VIP: 9500,
      SIG: 9500,
      BUS: 95000
    },
  },
  {
    fromId: "ao-nam-mao",
    toId: "koh-lanta-z1",
    distanceKm: 69,
    durationMin: 148,
    category: "beach",
    prices: {
      ECO: 2400,
      PREM: 2800,
      SUV: 2600,
      VAN: 2800,
      EXE: 3000,
      VIP: 9500,
      SIG: 9500,
      BUS: 10000
    },
  },
  {
    fromId: "ao-nam-mao",
    toId: "koh-lanta-z2",
    distanceKm: 77,
    durationMin: 158,
    category: "beach",
    prices: {
      ECO: 2500,
      PREM: 2900,
      SUV: 2700,
      VAN: 2900,
      EXE: 3200,
      VIP: 9500,
      SIG: 9500,
      BUS: 11000
    },
  },
  {
    fromId: "ao-nam-mao",
    toId: "koh-lanta-z3",
    distanceKm: 90,
    durationMin: 174,
    category: "beach",
    prices: {
      ECO: 2600,
      PREM: 3000,
      SUV: 2800,
      VAN: 3000,
      EXE: 3400,
      VIP: 9500,
      SIG: 9500,
      BUS: 11000
    },
  },
  {
    fromId: "ao-nam-mao",
    toId: "patong-beach",
    distanceKm: 87,
    durationMin: 121,
    category: "inter-province",
    prices: {
      ECO: 2800,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3500,
      VIP: 9500,
      SIG: 9500,
      BUS: 12000
    },
  },
  {
    fromId: "ao-nam-mao",
    toId: "ratchaprapha-pier",
    distanceKm: 140,
    durationMin: 159,
    category: "inter-province",
    prices: {
      ECO: 2500,
      PREM: 2800,
      SUV: 2700,
      VAN: 2800,
      EXE: 3000,
      VIP: 8500,
      SIG: 8500,
      BUS: 9000
    },
  },
  {
    fromId: "ao-nam-mao",
    toId: "thap-lamu-pier",
    distanceKm: 119,
    durationMin: 137,
    category: "inter-province",
    prices: {
      ECO: 2400,
      PREM: 2700,
      SUV: 2600,
      VAN: 2700,
      EXE: 3100,
      VIP: 9500,
      SIG: 9500,
      BUS: 95000
    },
  },
  {
    fromId: "klong-muang",
    toId: "donsak-pier",
    distanceKm: 233,
    durationMin: 257,
    category: "inter-province",
    prices: {
      ECO: 3200,
      PREM: 3700,
      SUV: 3500,
      VAN: 3700,
      EXE: 4200,
      VIP: 11500,
      SIG: 11200,
      BUS: 12200
    },
  },
  {
    fromId: "klong-muang",
    toId: "khanom",
    distanceKm: 230,
    durationMin: 254,
    category: "inter-province",
    prices: {
      ECO: 3500,
      PREM: 3900,
      SUV: 3700,
      VAN: 3900,
      EXE: 4200,
      VIP: 10500,
      SIG: 10200,
      BUS: 110200
    },
  },
  {
    fromId: "klong-muang",
    toId: "khao-lak-z2",
    distanceKm: 120,
    durationMin: 138,
    category: "inter-province",
    prices: {
      ECO: 2900,
      PREM: 3200,
      SUV: 3100,
      VAN: 3200,
      EXE: 3700,
      VIP: 10000,
      SIG: 9700,
      BUS: 95200
    },
  },
  {
    fromId: "klong-muang",
    toId: "koh-lanta-z1",
    distanceKm: 83,
    durationMin: 166,
    category: "beach",
    prices: {
      ECO: 2600,
      PREM: 3000,
      SUV: 2800,
      VAN: 3000,
      EXE: 3200,
      VIP: 10000,
      SIG: 9700,
      BUS: 10200
    },
  },
  {
    fromId: "klong-muang",
    toId: "koh-lanta-z2",
    distanceKm: 91,
    durationMin: 176,
    category: "beach",
    prices: {
      ECO: 2700,
      PREM: 3100,
      SUV: 2900,
      VAN: 3100,
      EXE: 3400,
      VIP: 10000,
      SIG: 9700,
      BUS: 11200
    },
  },
  {
    fromId: "klong-muang",
    toId: "koh-lanta-z3",
    distanceKm: 96,
    durationMin: 182,
    category: "beach",
    prices: {
      ECO: 2800,
      PREM: 3200,
      SUV: 3000,
      VAN: 3200,
      EXE: 3600,
      VIP: 10000,
      SIG: 9700,
      BUS: 11200
    },
  },
  {
    fromId: "klong-muang",
    toId: "patong-beach",
    distanceKm: 75,
    durationMin: 106,
    category: "inter-province",
    prices: {
      ECO: 3000,
      PREM: 3200,
      SUV: 3100,
      VAN: 3200,
      EXE: 3700,
      VIP: 10000,
      SIG: 9700,
      BUS: 12200
    },
  },
  {
    fromId: "klong-muang",
    toId: "ratchaprapha-pier",
    distanceKm: 133,
    durationMin: 152,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3200,
      VIP: 9000,
      SIG: 8700,
      BUS: 9200
    },
  },
  {
    fromId: "klong-muang",
    toId: "thap-lamu-pier",
    distanceKm: 104,
    durationMin: 121,
    category: "inter-province",
    prices: {
      ECO: 2600,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3300,
      VIP: 10000,
      SIG: 9700,
      BUS: 95200
    },
  },
  {
    fromId: "tubkaak-beach",
    toId: "donsak-pier",
    distanceKm: 231,
    durationMin: 255,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3800,
      SUV: 3600,
      VAN: 3800,
      EXE: 4300,
      VIP: 11700,
      SIG: 11300,
      BUS: 12300
    },
  },
  {
    fromId: "tubkaak-beach",
    toId: "khanom",
    distanceKm: 229,
    durationMin: 253,
    category: "inter-province",
    prices: {
      ECO: 3600,
      PREM: 4000,
      SUV: 3800,
      VAN: 4000,
      EXE: 4300,
      VIP: 10700,
      SIG: 10300,
      BUS: 110300
    },
  },
  {
    fromId: "tubkaak-beach",
    toId: "khao-lak-z1",
    distanceKm: 106,
    durationMin: 124,
    category: "inter-province",
    prices: {
      ECO: 2800,
      PREM: 3100,
      SUV: 3000,
      VAN: 3100,
      EXE: 3500,
      VIP: 10200,
      SIG: 9800,
      BUS: 95300
    },
  },
  {
    fromId: "tubkaak-beach",
    toId: "khao-lak-z2",
    distanceKm: 116,
    durationMin: 134,
    category: "inter-province",
    prices: {
      ECO: 3000,
      PREM: 3300,
      SUV: 3200,
      VAN: 3300,
      EXE: 3800,
      VIP: 10200,
      SIG: 9800,
      BUS: 95300
    },
  },
  {
    fromId: "tubkaak-beach",
    toId: "koh-lanta-z1",
    distanceKm: 87,
    durationMin: 171,
    category: "beach",
    prices: {
      ECO: 2700,
      PREM: 3100,
      SUV: 2900,
      VAN: 3100,
      EXE: 3300,
      VIP: 10200,
      SIG: 9800,
      BUS: 10300
    },
  },
  {
    fromId: "tubkaak-beach",
    toId: "koh-lanta-z2",
    distanceKm: 95,
    durationMin: 181,
    category: "beach",
    prices: {
      ECO: 2800,
      PREM: 3200,
      SUV: 3000,
      VAN: 3200,
      EXE: 3500,
      VIP: 10200,
      SIG: 9800,
      BUS: 11300
    },
  },
  {
    fromId: "tubkaak-beach",
    toId: "koh-lanta-z3",
    distanceKm: 100,
    durationMin: 167,
    category: "beach",
    prices: {
      ECO: 2900,
      PREM: 3300,
      SUV: 3100,
      VAN: 3300,
      EXE: 3700,
      VIP: 10200,
      SIG: 9800,
      BUS: 11300
    },
  },
  {
    fromId: "tubkaak-beach",
    toId: "patong-beach",
    distanceKm: 75,
    durationMin: 106,
    category: "inter-province",
    prices: {
      ECO: 3100,
      PREM: 3300,
      SUV: 3200,
      VAN: 3300,
      EXE: 3800,
      VIP: 10200,
      SIG: 9800,
      BUS: 12300
    },
  },
  {
    fromId: "tubkaak-beach",
    toId: "ratchaprapha-pier",
    distanceKm: 129,
    durationMin: 148,
    category: "inter-province",
    prices: {
      ECO: 2800,
      PREM: 3100,
      SUV: 3000,
      VAN: 3100,
      EXE: 3300,
      VIP: 9200,
      SIG: 8800,
      BUS: 9300
    },
  },
  {
    fromId: "tubkaak-beach",
    toId: "thap-lamu-pier",
    distanceKm: 100,
    durationMin: 117,
    category: "inter-province",
    prices: {
      ECO: 2700,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3400,
      VIP: 10200,
      SIG: 9800,
      BUS: 95300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "ao-nam-mao",
    distanceKm: 25,
    durationMin: 54,
    category: "pier",
    prices: {
      ECO: 1100,
      PREM: 1300,
      SUV: 1200,
      VAN: 1300,
      EXE: 1400,
      VIP: 6500,
      SIG: 5600,
      BUS: 5600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "ao-nang-beach",
    distanceKm: 29,
    durationMin: 60,
    category: "beach",
    prices: {
      ECO: 1100,
      PREM: 1300,
      SUV: 1200,
      VAN: 1300,
      EXE: 1400,
      VIP: 6500,
      SIG: 5600,
      BUS: 5600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "ao-tha-lane",
    distanceKm: 53,
    durationMin: 78,
    category: "beach",
    prices: {
      ECO: 1700,
      PREM: 1900,
      SUV: 1800,
      VAN: 1900,
      EXE: 2000,
      VIP: 8200,
      SIG: 7300,
      BUS: 7300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "boat-lagoon-krabi",
    distanceKm: 10,
    durationMin: 29,
    category: "pier",
    prices: {
      ECO: 1300,
      PREM: 1500,
      SUV: 1400,
      VAN: 1500,
      EXE: 1600,
      VIP: 6700,
      SIG: 5800,
      BUS: 5800
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "chalong",
    distanceKm: 93,
    durationMin: 128,
    category: "inter-province",
    prices: {
      ECO: 3700,
      PREM: 3900,
      SUV: 3800,
      VAN: 3900,
      EXE: 4200,
      VIP: 9800,
      SIG: 8900,
      BUS: 8900
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "chao-fah-pier",
    distanceKm: 20,
    durationMin: 45,
    category: "pier",
    prices: {
      ECO: 1000,
      PREM: 1200,
      SUV: 1100,
      VAN: 1200,
      EXE: 1300,
      VIP: 5500,
      SIG: 4600,
      BUS: 4600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "dan-nok",
    distanceKm: 294,
    durationMin: 321,
    category: "inter-province",
    prices: {
      ECO: 6600,
      PREM: 7100,
      SUV: 7000,
      VAN: 7100,
      EXE: 7400,
      VIP: 13000,
      SIG: 12100,
      BUS: 12100
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "donsak-pier",
    distanceKm: 230,
    durationMin: 254,
    category: "inter-province",
    prices: {
      ECO: 3800,
      PREM: 4300,
      SUV: 4200,
      VAN: 4300,
      EXE: 4600,
      VIP: 10200,
      SIG: 9300,
      BUS: 9300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "had-yao-krabi",
    distanceKm: 6,
    durationMin: 22,
    category: "beach",
    prices: {
      ECO: 1400,
      PREM: 1600,
      SUV: 1500,
      VAN: 1600,
      EXE: 1700,
      VIP: 7200,
      SIG: 6300,
      BUS: 6300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "hat-yai-airport",
    distanceKm: 253,
    durationMin: 278,
    category: "inter-province",
    prices: {
      ECO: 5600,
      PREM: 6100,
      SUV: 6000,
      VAN: 6100,
      EXE: 6400,
      VIP: 12000,
      SIG: 11100,
      BUS: 11100
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "hat-yai-bus",
    distanceKm: 258,
    durationMin: 284,
    category: "inter-province",
    prices: {
      ECO: 5600,
      PREM: 6100,
      SUV: 6000,
      VAN: 6100,
      EXE: 6400,
      VIP: 12000,
      SIG: 11100,
      BUS: 11100
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "hat-yai-town",
    distanceKm: 256,
    durationMin: 281,
    category: "inter-province",
    prices: {
      ECO: 5600,
      PREM: 5800,
      SUV: 5700,
      VAN: 5800,
      EXE: 6100,
      VIP: 11700,
      SIG: 10800,
      BUS: 10800
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "hat-yao-pier-trang",
    distanceKm: 113,
    durationMin: 131,
    category: "inter-province",
    prices: {
      ECO: 3500,
      PREM: 3700,
      SUV: 3600,
      VAN: 3700,
      EXE: 3800,
      VIP: 9400,
      SIG: 8500,
      BUS: 8500
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "hua-hin-pier",
    distanceKm: 40,
    durationMin: 62,
    category: "pier",
    prices: {
      ECO: 2000,
      PREM: 2200,
      SUV: 2100,
      VAN: 2200,
      EXE: 2300,
      VIP: 7400,
      SIG: 6500,
      BUS: 6500
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "kamala-beach",
    distanceKm: 100,
    durationMin: 117,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3500,
      SUV: 3400,
      VAN: 3500,
      EXE: 3800,
      VIP: 9400,
      SIG: 8500,
      BUS: 8500
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "karon-beach",
    distanceKm: 99,
    durationMin: 136,
    category: "inter-province",
    prices: {
      ECO: 3600,
      PREM: 3800,
      SUV: 3700,
      VAN: 3800,
      EXE: 4100,
      VIP: 9700,
      SIG: 8800,
      BUS: 8800
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "kata-beach",
    distanceKm: 99,
    durationMin: 136,
    category: "inter-province",
    prices: {
      ECO: 3600,
      PREM: 3800,
      SUV: 3700,
      VAN: 3800,
      EXE: 4100,
      VIP: 9700,
      SIG: 8800,
      BUS: 8800
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "khanom",
    distanceKm: 223,
    durationMin: 247,
    category: "inter-province",
    prices: {
      ECO: 4300,
      PREM: 4800,
      SUV: 4700,
      VAN: 4800,
      EXE: 5100,
      VIP: 10700,
      SIG: 9800,
      BUS: 9800
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "khao-lak-z1",
    distanceKm: 146,
    durationMin: 166,
    category: "inter-province",
    prices: {
      ECO: 3600,
      PREM: 3800,
      SUV: 3700,
      VAN: 3800,
      EXE: 3900,
      VIP: 9500,
      SIG: 8600,
      BUS: 8600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "khao-lak-z2",
    distanceKm: 155,
    durationMin: 175,
    category: "inter-province",
    prices: {
      ECO: 3600,
      PREM: 3800,
      SUV: 3700,
      VAN: 3800,
      EXE: 3900,
      VIP: 9500,
      SIG: 8600,
      BUS: 8600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "khao-sok",
    distanceKm: 154,
    durationMin: 174,
    category: "inter-province",
    prices: {
      ECO: 3500,
      PREM: 3700,
      SUV: 3600,
      VAN: 3700,
      EXE: 3800,
      VIP: 9400,
      SIG: 8500,
      BUS: 8500
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "klong-jilad-pier",
    distanceKm: 19,
    durationMin: 44,
    category: "pier",
    prices: {
      ECO: 1000,
      PREM: 1200,
      SUV: 1100,
      VAN: 1200,
      EXE: 1300,
      VIP: 5500,
      SIG: 4600,
      BUS: 4600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "klong-muang",
    distanceKm: 40,
    durationMin: 62,
    category: "beach",
    prices: {
      ECO: 1200,
      PREM: 1400,
      SUV: 1300,
      VAN: 1400,
      EXE: 1500,
      VIP: 7000,
      SIG: 6100,
      BUS: 6100
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "koh-lanta-z1",
    distanceKm: 51,
    durationMin: 126,
    category: "beach",
    prices: {
      ECO: 2600,
      PREM: 2800,
      SUV: 2700,
      VAN: 2800,
      EXE: 2900,
      VIP: 9500,
      SIG: 8600,
      BUS: 8600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "koh-lanta-z2",
    distanceKm: 60,
    durationMin: 137,
    category: "beach",
    prices: {
      ECO: 2800,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3100,
      VIP: 9700,
      SIG: 8800,
      BUS: 8800
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "koh-lanta-z3",
    distanceKm: 74,
    durationMin: 154,
    category: "beach",
    prices: {
      ECO: 3000,
      PREM: 3200,
      SUV: 3100,
      VAN: 3200,
      EXE: 3300,
      VIP: 9900,
      SIG: 9000,
      BUS: 9000
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "krabi-bus-terminal",
    distanceKm: 28,
    durationMin: 59,
    category: "city",
    prices: {
      ECO: 1000,
      PREM: 1200,
      SUV: 1100,
      VAN: 1200,
      EXE: 1300,
      VIP: 5500,
      SIG: 4600,
      BUS: 4600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "krabi-town",
    distanceKm: 22,
    durationMin: 49,
    category: "city",
    prices: {
      ECO: 1000,
      PREM: 1200,
      SUV: 1100,
      VAN: 1200,
      EXE: 1300,
      VIP: 5500,
      SIG: 4600,
      BUS: 4600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "kuan-tung-ku-pier",
    distanceKm: 100,
    durationMin: 117,
    category: "inter-province",
    prices: {
      ECO: 3100,
      PREM: 3300,
      SUV: 3200,
      VAN: 3300,
      EXE: 3400,
      VIP: 10000,
      SIG: 9100,
      BUS: 10600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "laguna-phuket",
    distanceKm: 99,
    durationMin: 136,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3500,
      SUV: 3400,
      VAN: 3500,
      EXE: 3800,
      VIP: 9400,
      SIG: 8500,
      BUS: 8500
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "lomprayah-donsak",
    distanceKm: 229,
    durationMin: 253,
    category: "inter-province",
    prices: {
      ECO: 3700,
      PREM: 4200,
      SUV: 4100,
      VAN: 4200,
      EXE: 4500,
      VIP: 10100,
      SIG: 9200,
      BUS: 9200
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "mai-khao-beach",
    distanceKm: 101,
    durationMin: 118,
    category: "inter-province",
    prices: {
      ECO: 2800,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3300,
      VIP: 8900,
      SIG: 8000,
      BUS: 8000
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "nai-yang-beach",
    distanceKm: 100,
    durationMin: 117,
    category: "inter-province",
    prices: {
      ECO: 2800,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3300,
      VIP: 8900,
      SIG: 8000,
      BUS: 8000
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "natai-beach",
    distanceKm: 113,
    durationMin: 131,
    category: "inter-province",
    prices: {
      ECO: 3000,
      PREM: 3200,
      SUV: 3100,
      VAN: 3200,
      EXE: 3500,
      VIP: 9100,
      SIG: 8200,
      BUS: 8200
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "pak-bara-pier",
    distanceKm: 191,
    durationMin: 213,
    category: "inter-province",
    prices: {
      ECO: 4800,
      PREM: 5300,
      SUV: 5200,
      VAN: 5300,
      EXE: 5600,
      VIP: 11200,
      SIG: 10300,
      BUS: 10300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "pak-meng-pier",
    distanceKm: 89,
    durationMin: 123,
    category: "inter-province",
    prices: {
      ECO: 2600,
      PREM: 2800,
      SUV: 2700,
      VAN: 2800,
      EXE: 2900,
      VIP: 8500,
      SIG: 7600,
      BUS: 7600
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "patong-beach",
    distanceKm: 98,
    durationMin: 134,
    category: "inter-province",
    prices: {
      ECO: 3500,
      PREM: 3700,
      SUV: 3600,
      VAN: 3700,
      EXE: 4000,
      VIP: 9600,
      SIG: 8700,
      BUS: 8700
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "phuket-airport",
    distanceKm: 98,
    durationMin: 134,
    category: "inter-province",
    prices: {
      ECO: 2800,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3300,
      VIP: 8900,
      SIG: 8000,
      BUS: 8000
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "phuket-town",
    distanceKm: 91,
    durationMin: 126,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3500,
      SUV: 3400,
      VAN: 3500,
      EXE: 3800,
      VIP: 9400,
      SIG: 8500,
      BUS: 8500
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "ratchaprapha-pier",
    distanceKm: 152,
    durationMin: 172,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3500,
      SUV: 3400,
      VAN: 3500,
      EXE: 3600,
      VIP: 9200,
      SIG: 8300,
      BUS: 8300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "rawai-beach",
    distanceKm: 97,
    durationMin: 133,
    category: "inter-province",
    prices: {
      ECO: 3800,
      PREM: 4000,
      SUV: 3900,
      VAN: 4000,
      EXE: 4300,
      VIP: 9900,
      SIG: 9000,
      BUS: 9000
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "samet-nangshe",
    distanceKm: 95,
    durationMin: 131,
    category: "inter-province",
    prices: {
      ECO: 2800,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3300,
      VIP: 8900,
      SIG: 8000,
      BUS: 8000
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "satun-town",
    distanceKm: 249,
    durationMin: 274,
    category: "inter-province",
    prices: {
      ECO: 5300,
      PREM: 5800,
      SUV: 5700,
      VAN: 5800,
      EXE: 6100,
      VIP: 11700,
      SIG: 10800,
      BUS: 10800
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "surat-airport",
    distanceKm: 174,
    durationMin: 195,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3500,
      SUV: 3400,
      VAN: 3500,
      EXE: 3600,
      VIP: 9200,
      SIG: 8300,
      BUS: 8300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "surat-railway",
    distanceKm: 172,
    durationMin: 193,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3500,
      SUV: 3400,
      VAN: 3500,
      EXE: 3600,
      VIP: 9200,
      SIG: 8300,
      BUS: 8300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "surat-thani",
    distanceKm: 181,
    durationMin: 203,
    category: "inter-province",
    prices: {
      ECO: 3200,
      PREM: 3400,
      SUV: 3300,
      VAN: 3400,
      EXE: 3500,
      VIP: 9100,
      SIG: 8200,
      BUS: 8200
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "tammalang-pier",
    distanceKm: 259,
    durationMin: 285,
    category: "inter-province",
    prices: {
      ECO: 5600,
      PREM: 6100,
      SUV: 6000,
      VAN: 6100,
      EXE: 6400,
      VIP: 12000,
      SIG: 11100,
      BUS: 11100
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "tapee-pier",
    distanceKm: 182,
    durationMin: 204,
    category: "inter-province",
    prices: {
      ECO: 3200,
      PREM: 3400,
      SUV: 3300,
      VAN: 3400,
      EXE: 3500,
      VIP: 9100,
      SIG: 8200,
      BUS: 8200
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "thap-lamu-pier",
    distanceKm: 141,
    durationMin: 160,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3500,
      SUV: 3400,
      VAN: 3500,
      EXE: 3600,
      VIP: 9200,
      SIG: 8300,
      BUS: 8300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "trang-airport",
    distanceKm: 112,
    durationMin: 130,
    category: "inter-province",
    prices: {
      ECO: 3500,
      PREM: 3700,
      SUV: 3600,
      VAN: 3700,
      EXE: 3800,
      VIP: 9400,
      SIG: 8500,
      BUS: 8500
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "trang-railway",
    distanceKm: 108,
    durationMin: 126,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3500,
      SUV: 3400,
      VAN: 3500,
      EXE: 3600,
      VIP: 9200,
      SIG: 8300,
      BUS: 8300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "trang-town",
    distanceKm: 108,
    durationMin: 126,
    category: "inter-province",
    prices: {
      ECO: 3300,
      PREM: 3500,
      SUV: 3400,
      VAN: 3500,
      EXE: 3600,
      VIP: 9200,
      SIG: 8300,
      BUS: 8300
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "tubkaak-beach",
    distanceKm: 44,
    durationMin: 67,
    category: "beach",
    prices: {
      ECO: 1500,
      PREM: 1700,
      SUV: 1600,
      VAN: 1700,
      EXE: 1800,
      VIP: 7700,
      SIG: 6800,
      BUS: 6800
    },
  },
  {
    fromId: "laem-kruat-pier",
    toId: "wang-prachan",
    distanceKm: 252,
    durationMin: 277,
    category: "inter-province",
    prices: {
      ECO: 5600,
      PREM: 6100,
      SUV: 6000,
      VAN: 6100,
      EXE: 6400,
      VIP: 12000,
      SIG: 11100,
      BUS: 11100
    },
  },
  {
    fromId: "klong-jilad-pier",
    toId: "krabi-town",
    distanceKm: 5,
    durationMin: 20,
    category: "city",
    prices: {
      ECO: 400,
      PREM: 600,
      SUV: 500,
      VAN: 600,
      EXE: 800,
      VIP: 4500,
      SIG: 4500,
      BUS: 4500
    },
  },
  {
    fromId: "kamala-beach",
    toId: "ao-nang-beach",
    distanceKm: 85,
    durationMin: 118,
    category: "beach",
    prices: {
      ECO: 2700,
      PREM: 2900,
      SUV: 2800,
      VAN: 2900,
      EXE: 3400,
      VIP: 9200,
      SIG: 9400,
      BUS: 11900
    },
  },
  {
    fromId: "karon-beach",
    toId: "ao-nang-beach",
    distanceKm: 87,
    durationMin: 121,
    category: "beach",
    prices: {
      ECO: 3000,
      PREM: 3200,
      SUV: 3100,
      VAN: 3200,
      EXE: 3700,
      VIP: 10000,
      SIG: 9700,
      BUS: 12200
    },
  },
  {
    fromId: "kata-beach",
    toId: "ao-nang-beach",
    distanceKm: 88,
    durationMin: 122,
    category: "beach",
    prices: {
      ECO: 3000,
      PREM: 3200,
      SUV: 3100,
      VAN: 3200,
      EXE: 3700,
      VIP: 10000,
      SIG: 9700,
      BUS: 12200
    },
  },
  {
    fromId: "khao-lak-z1",
    toId: "klong-muang",
    distanceKm: 110,
    durationMin: 128,
    category: "beach",
    prices: {
      ECO: 2700,
      PREM: 3000,
      SUV: 2900,
      VAN: 3000,
      EXE: 3400,
      VIP: 9700,
      SIG: 9700,
      BUS: 0
    },
  },
  {
    fromId: "khao-sok",
    toId: "ao-nang-beach",
    distanceKm: 135,
    durationMin: 154,
    category: "beach",
    prices: {
      ECO: 2500,
      PREM: 2800,
      SUV: 2700,
      VAN: 2800,
      EXE: 3000,
      VIP: 8500,
      SIG: 8500,
      BUS: 0
    },
  },
  {
    fromId: "koh-lanta-z1",
    toId: "kata-beach",
    distanceKm: 110,
    durationMin: 178,
    category: "inter-province",
    prices: {
      ECO: 5000,
      PREM: 5600,
      SUV: 5500,
      VAN: 5600,
      EXE: 6000,
      VIP: 0,
      SIG: 0,
      BUS: 0
    },
  },
  {
    fromId: "koh-lanta-z1",
    toId: "phuket-airport",
    distanceKm: 125,
    durationMin: 194,
    category: "inter-province",
    prices: {
      ECO: 4000,
      PREM: 4600,
      SUV: 4400,
      VAN: 4600,
      EXE: 5000,
      VIP: 18000,
      SIG: 18000,
      BUS: 18000
    },
  },
  {
    fromId: "koh-lanta-z2",
    toId: "phuket-airport",
    distanceKm: 131,
    durationMin: 200,
    category: "inter-province",
    prices: {
      ECO: 4300,
      PREM: 4800,
      SUV: 4600,
      VAN: 4800,
      EXE: 5500,
      VIP: 18500,
      SIG: 18500,
      BUS: 18500
    },
  },
  {
    fromId: "koh-lanta-z3",
    toId: "phuket-airport",
    distanceKm: 140,
    durationMin: 209,
    category: "inter-province",
    prices: {
      ECO: 4500,
      PREM: 5000,
      SUV: 4800,
      VAN: 5000,
      EXE: 5800,
      VIP: 18900,
      SIG: 18900,
      BUS: 18900
    },
  },
  {
    fromId: "pak-bara-pier",
    toId: "ao-nang-beach",
    distanceKm: 213,
    durationMin: 236,
    category: "beach",
    prices: {
      ECO: 4700,
      PREM: 5200,
      SUV: 5100,
      VAN: 5200,
      EXE: 5500,
      VIP: 15000,
      SIG: 15000,
      BUS: 15000
    },
  },
];

export const officialTransferRoutes: OfficialTransferRoute[] = [
  ...set1OfficialRoutes,
  ...set2OfficialRoutes,
];

const routeIndex = new Map<string, OfficialTransferRoute>();
for (const route of officialTransferRoutes) {
  routeIndex.set(`${route.fromId}>${route.toId}`, route);
  routeIndex.set(`${route.toId}>${route.fromId}`, route);
}

export function getOfficialRoute(
  fromId: string,
  toId: string
): OfficialTransferRoute | undefined {
  const imported = getImportedTransferRoutes();
  if (imported?.length) {
    const hit = imported.find(
      (route) =>
        (route.fromId === fromId && route.toId === toId) ||
        (route.fromId === toId && route.toId === fromId)
    );
    // Imported sheets may be partial (e.g. airport-only). Keep built-in
    // tariff rows so routes like Ao Nang ↔ Koh Lanta still price.
    if (hit) return hit;
  }
  return routeIndex.get(`${fromId}>${toId}`);
}

export function getActiveOfficialRoutes(): OfficialTransferRoute[] {
  const imported = getImportedTransferRoutes();
  return imported?.length ? imported : officialTransferRoutes;
}

/** Set 1 sheet only: Krabi Airport ↔ 55 destinations, in sheet order. */
export function getSet1OfficialRoutes(): OfficialTransferRoute[] {
  return set1OfficialRoutes;
}

const AIRPORT_HUB = "kbv-airport";

/** Airport routes in file order. Imported rows win, otherwise the Set 1 sheet. */
export function getAirportSheetRoutes(): OfficialTransferRoute[] {
  const imported = getImportedTransferRoutes();
  const source = imported?.length ? imported : set1OfficialRoutes;
  const seen = new Set<string>();
  const rows: OfficialTransferRoute[] = [];
  for (const route of source) {
    const toId =
      route.fromId === AIRPORT_HUB
        ? route.toId
        : route.toId === AIRPORT_HUB
          ? route.fromId
          : null;
    if (!toId || seen.has(toId)) continue;
    seen.add(toId);
    rows.push(
      route.fromId === AIRPORT_HUB
        ? route
        : { ...route, fromId: AIRPORT_HUB, toId }
    );
  }
  return rows;
}

/** Set 1 sheet only: Krabi Airport ↔ 55 destinations. */
export function getSet1LocationIds(): string[] {
  const ids = new Set<string>();
  for (const route of set1OfficialRoutes) {
    ids.add(route.fromId);
    ids.add(route.toId);
  }
  return [...ids];
}

/** Opposite ends of official tariff rows for a location (uses pricingAreaId when set). */
export function getOfficialPartnerIds(locationId: string): string[] {
  if (!locationId) return [];
  const areaId = getLocation(locationId)?.pricingAreaId ?? locationId;
  const partners = new Set<string>();
  for (const route of getActiveOfficialRoutes()) {
    if (route.fromId === areaId) partners.add(route.toId);
    if (route.toId === areaId) partners.add(route.fromId);
  }
  return [...partners];
}
