import type { TransferCategory, VehicleCode } from "@/lib/types";
import { getImportedTransferRoutes } from "@/lib/admin/catalog-store";

export type OfficialVehiclePrices = Record<VehicleCode, number>;

export type OfficialTransferRoute = {
  fromId: string;
  toId: string;
  distanceKm: number;
  durationMin: number;
  category: TransferCategory;
  prices: OfficialVehiclePrices;
};

function tariffPrices(
  eco: number,
  luxury: number,
  suv: number,
  van: number,
  vipVan: number,
  alphard: number,
  miniBus: number
): OfficialVehiclePrices {
  return {
    ECO: eco,
    PREM: luxury,
    SUV: suv,
    VAN: van,
    EXE: vipVan,
    VIP: alphard,
    SIG: alphard,
    BUS: miniBus,
  };
}

/** Official Set 1 prices: Krabi Airport ↔ 55 destinations (THB, one way, both directions). */
const set1OfficialRoutes: OfficialTransferRoute[] = [
  {
    "fromId": "kbv-airport",
    "toId": "krabi-town",
    "distanceKm": 15,
    "durationMin": 33,
    "category": "city",
    "prices": {
      "ECO": 400,
      "PREM": 500,
      "SUV": 500,
      "VAN": 600,
      "EXE": 700,
      "VIP": 4000,
      "SIG": 4000,
      "BUS": 4000
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "krabi-bus-terminal",
    "distanceKm": 16,
    "durationMin": 35,
    "category": "city",
    "prices": {
      "ECO": 400,
      "PREM": 500,
      "SUV": 500,
      "VAN": 600,
      "EXE": 700,
      "VIP": 4000,
      "SIG": 4000,
      "BUS": 4000
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "chao-fah-pier",
    "distanceKm": 16,
    "durationMin": 35,
    "category": "pier",
    "prices": {
      "ECO": 400,
      "PREM": 500,
      "SUV": 500,
      "VAN": 600,
      "EXE": 700,
      "VIP": 4000,
      "SIG": 4000,
      "BUS": 4000
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "klong-jilad-pier",
    "distanceKm": 16,
    "durationMin": 35,
    "category": "pier",
    "prices": {
      "ECO": 400,
      "PREM": 500,
      "SUV": 500,
      "VAN": 600,
      "EXE": 700,
      "VIP": 4000,
      "SIG": 4000,
      "BUS": 4000
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "ao-nam-mao",
    "distanceKm": 20,
    "durationMin": 44,
    "category": "pier",
    "prices": {
      "ECO": 500,
      "PREM": 600,
      "SUV": 600,
      "VAN": 700,
      "EXE": 800,
      "VIP": 5000,
      "SIG": 5000,
      "BUS": 5000
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "ao-nang-beach",
    "distanceKm": 24,
    "durationMin": 53,
    "category": "beach",
    "prices": {
      "ECO": 500,
      "PREM": 600,
      "SUV": 600,
      "VAN": 700,
      "EXE": 800,
      "VIP": 5000,
      "SIG": 5000,
      "BUS": 5000
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "klong-muang",
    "distanceKm": 31,
    "durationMin": 68,
    "category": "beach",
    "prices": {
      "ECO": 600,
      "PREM": 700,
      "SUV": 700,
      "VAN": 800,
      "EXE": 900,
      "VIP": 5500,
      "SIG": 5500,
      "BUS": 5500
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "tubkaak-beach",
    "distanceKm": 35,
    "durationMin": 77,
    "category": "beach",
    "prices": {
      "ECO": 900,
      "PREM": 1000,
      "SUV": 1000,
      "VAN": 1100,
      "EXE": 1200,
      "VIP": 6200,
      "SIG": 6200,
      "BUS": 6200
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "ao-tha-lane",
    "distanceKm": 40,
    "durationMin": 88,
    "category": "beach",
    "prices": {
      "ECO": 1100,
      "PREM": 1200,
      "SUV": 1200,
      "VAN": 1300,
      "EXE": 1400,
      "VIP": 6700,
      "SIG": 6700,
      "BUS": 6700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "had-yao-krabi",
    "distanceKm": 32,
    "durationMin": 70,
    "category": "beach",
    "prices": {
      "ECO": 800,
      "PREM": 900,
      "SUV": 900,
      "VAN": 1000,
      "EXE": 1100,
      "VIP": 5700,
      "SIG": 5700,
      "BUS": 5700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "laem-kruat-pier",
    "distanceKm": 35,
    "durationMin": 77,
    "category": "pier",
    "prices": {
      "ECO": 900,
      "PREM": 1000,
      "SUV": 1000,
      "VAN": 1100,
      "EXE": 1200,
      "VIP": 6200,
      "SIG": 6200,
      "BUS": 6200
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "boat-lagoon-krabi",
    "distanceKm": 28,
    "durationMin": 62,
    "category": "pier",
    "prices": {
      "ECO": 700,
      "PREM": 800,
      "SUV": 800,
      "VAN": 900,
      "EXE": 1000,
      "VIP": 5200,
      "SIG": 5200,
      "BUS": 5200
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "hua-hin-pier",
    "distanceKm": 70,
    "durationMin": 154,
    "category": "pier",
    "prices": {
      "ECO": 1400,
      "PREM": 1500,
      "SUV": 1500,
      "VAN": 1600,
      "EXE": 1700,
      "VIP": 5900,
      "SIG": 5900,
      "BUS": 5900
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "koh-lanta-z1",
    "distanceKm": 78,
    "durationMin": 172,
    "category": "beach",
    "prices": {
      "ECO": 2000,
      "PREM": 2100,
      "SUV": 2100,
      "VAN": 2200,
      "EXE": 2300,
      "VIP": 8000,
      "SIG": 8000,
      "BUS": 8000
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "koh-lanta-z2",
    "distanceKm": 82,
    "durationMin": 180,
    "category": "beach",
    "prices": {
      "ECO": 2200,
      "PREM": 2300,
      "SUV": 2300,
      "VAN": 2400,
      "EXE": 2500,
      "VIP": 8200,
      "SIG": 8200,
      "BUS": 8200
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "koh-lanta-z3",
    "distanceKm": 85,
    "durationMin": 187,
    "category": "beach",
    "prices": {
      "ECO": 2400,
      "PREM": 2500,
      "SUV": 2500,
      "VAN": 2600,
      "EXE": 2700,
      "VIP": 8400,
      "SIG": 8400,
      "BUS": 8400
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "pak-meng-pier",
    "distanceKm": 90,
    "durationMin": 135,
    "category": "inter-province",
    "prices": {
      "ECO": 2000,
      "PREM": 2100,
      "SUV": 2100,
      "VAN": 2200,
      "EXE": 2300,
      "VIP": 7000,
      "SIG": 7000,
      "BUS": 7000
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "kuan-tung-ku-pier",
    "distanceKm": 110,
    "durationMin": 165,
    "category": "inter-province",
    "prices": {
      "ECO": 2500,
      "PREM": 2600,
      "SUV": 2600,
      "VAN": 2700,
      "EXE": 2800,
      "VIP": 7500,
      "SIG": 7500,
      "BUS": 7500
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "hat-yao-pier-trang",
    "distanceKm": 130,
    "durationMin": 195,
    "category": "inter-province",
    "prices": {
      "ECO": 2900,
      "PREM": 3000,
      "SUV": 3000,
      "VAN": 3100,
      "EXE": 3200,
      "VIP": 7900,
      "SIG": 7900,
      "BUS": 7900
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "trang-airport",
    "distanceKm": 130,
    "durationMin": 195,
    "category": "inter-province",
    "prices": {
      "ECO": 2900,
      "PREM": 3000,
      "SUV": 3000,
      "VAN": 3100,
      "EXE": 3200,
      "VIP": 7900,
      "SIG": 7900,
      "BUS": 7900
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "trang-railway",
    "distanceKm": 120,
    "durationMin": 180,
    "category": "inter-province",
    "prices": {
      "ECO": 2700,
      "PREM": 2800,
      "SUV": 2800,
      "VAN": 2900,
      "EXE": 3000,
      "VIP": 7700,
      "SIG": 7700,
      "BUS": 7700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "trang-town",
    "distanceKm": 120,
    "durationMin": 180,
    "category": "inter-province",
    "prices": {
      "ECO": 2700,
      "PREM": 2800,
      "SUV": 2800,
      "VAN": 2900,
      "EXE": 3000,
      "VIP": 7700,
      "SIG": 7700,
      "BUS": 7700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "ratchaprapha-pier",
    "distanceKm": 150,
    "durationMin": 225,
    "category": "inter-province",
    "prices": {
      "ECO": 2700,
      "PREM": 2800,
      "SUV": 2800,
      "VAN": 2900,
      "EXE": 3000,
      "VIP": 7700,
      "SIG": 7700,
      "BUS": 7700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "khao-sok",
    "distanceKm": 140,
    "durationMin": 210,
    "category": "inter-province",
    "prices": {
      "ECO": 2900,
      "PREM": 3000,
      "SUV": 3000,
      "VAN": 3100,
      "EXE": 3200,
      "VIP": 7900,
      "SIG": 7900,
      "BUS": 7900
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "thap-lamu-pier",
    "distanceKm": 120,
    "durationMin": 180,
    "category": "inter-province",
    "prices": {
      "ECO": 2700,
      "PREM": 2800,
      "SUV": 2800,
      "VAN": 2900,
      "EXE": 3000,
      "VIP": 7700,
      "SIG": 7700,
      "BUS": 7700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "khao-lak-z1",
    "distanceKm": 90,
    "durationMin": 135,
    "category": "inter-province",
    "prices": {
      "ECO": 2700,
      "PREM": 2800,
      "SUV": 2800,
      "VAN": 2900,
      "EXE": 3000,
      "VIP": 7700,
      "SIG": 7700,
      "BUS": 7700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "khao-lak-z2",
    "distanceKm": 105,
    "durationMin": 158,
    "category": "inter-province",
    "prices": {
      "ECO": 3000,
      "PREM": 3100,
      "SUV": 3100,
      "VAN": 3200,
      "EXE": 3300,
      "VIP": 8000,
      "SIG": 8000,
      "BUS": 8000
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "natai-beach",
    "distanceKm": 95,
    "durationMin": 143,
    "category": "inter-province",
    "prices": {
      "ECO": 2400,
      "PREM": 2500,
      "SUV": 2500,
      "VAN": 2600,
      "EXE": 2900,
      "VIP": 7600,
      "SIG": 7600,
      "BUS": 7600
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "mai-khao-beach",
    "distanceKm": 88,
    "durationMin": 132,
    "category": "inter-province",
    "prices": {
      "ECO": 2200,
      "PREM": 2300,
      "SUV": 2300,
      "VAN": 2400,
      "EXE": 2700,
      "VIP": 7400,
      "SIG": 7400,
      "BUS": 7400
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "samet-nangshe",
    "distanceKm": 85,
    "durationMin": 128,
    "category": "inter-province",
    "prices": {
      "ECO": 2200,
      "PREM": 2300,
      "SUV": 2300,
      "VAN": 2400,
      "EXE": 2700,
      "VIP": 7400,
      "SIG": 7400,
      "BUS": 7400
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "phuket-airport",
    "distanceKm": 80,
    "durationMin": 120,
    "category": "inter-province",
    "prices": {
      "ECO": 2200,
      "PREM": 2300,
      "SUV": 2300,
      "VAN": 2400,
      "EXE": 2700,
      "VIP": 7400,
      "SIG": 7400,
      "BUS": 7400
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "nai-yang-beach",
    "distanceKm": 90,
    "durationMin": 135,
    "category": "inter-province",
    "prices": {
      "ECO": 2200,
      "PREM": 2300,
      "SUV": 2300,
      "VAN": 2400,
      "EXE": 2700,
      "VIP": 7400,
      "SIG": 7400,
      "BUS": 7400
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "laguna-phuket",
    "distanceKm": 105,
    "durationMin": 158,
    "category": "inter-province",
    "prices": {
      "ECO": 2700,
      "PREM": 2800,
      "SUV": 2800,
      "VAN": 2900,
      "EXE": 3200,
      "VIP": 7900,
      "SIG": 7900,
      "BUS": 7900
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "kamala-beach",
    "distanceKm": 114,
    "durationMin": 171,
    "category": "inter-province",
    "prices": {
      "ECO": 2700,
      "PREM": 2800,
      "SUV": 2800,
      "VAN": 2900,
      "EXE": 3200,
      "VIP": 7900,
      "SIG": 7900,
      "BUS": 7900
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "phuket-town",
    "distanceKm": 132,
    "durationMin": 198,
    "category": "inter-province",
    "prices": {
      "ECO": 2700,
      "PREM": 2800,
      "SUV": 2800,
      "VAN": 2900,
      "EXE": 3200,
      "VIP": 7900,
      "SIG": 7900,
      "BUS": 7900
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "patong-beach",
    "distanceKm": 122,
    "durationMin": 183,
    "category": "inter-province",
    "prices": {
      "ECO": 2900,
      "PREM": 3000,
      "SUV": 3000,
      "VAN": 3100,
      "EXE": 3400,
      "VIP": 8100,
      "SIG": 8100,
      "BUS": 8100
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "kata-beach",
    "distanceKm": 128,
    "durationMin": 192,
    "category": "inter-province",
    "prices": {
      "ECO": 3000,
      "PREM": 3100,
      "SUV": 3100,
      "VAN": 3200,
      "EXE": 3500,
      "VIP": 8200,
      "SIG": 8200,
      "BUS": 8200
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "karon-beach",
    "distanceKm": 126,
    "durationMin": 189,
    "category": "inter-province",
    "prices": {
      "ECO": 3000,
      "PREM": 3100,
      "SUV": 3100,
      "VAN": 3200,
      "EXE": 3500,
      "VIP": 8200,
      "SIG": 8200,
      "BUS": 8200
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "chalong",
    "distanceKm": 140,
    "durationMin": 210,
    "category": "inter-province",
    "prices": {
      "ECO": 3100,
      "PREM": 3200,
      "SUV": 3200,
      "VAN": 3300,
      "EXE": 3600,
      "VIP": 8300,
      "SIG": 8300,
      "BUS": 8300
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "rawai-beach",
    "distanceKm": 148,
    "durationMin": 222,
    "category": "inter-province",
    "prices": {
      "ECO": 3200,
      "PREM": 3300,
      "SUV": 3300,
      "VAN": 3400,
      "EXE": 3700,
      "VIP": 8400,
      "SIG": 8400,
      "BUS": 8400
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "surat-airport",
    "distanceKm": 110,
    "durationMin": 165,
    "category": "inter-province",
    "prices": {
      "ECO": 2700,
      "PREM": 2800,
      "SUV": 2800,
      "VAN": 2900,
      "EXE": 3000,
      "VIP": 7700,
      "SIG": 7700,
      "BUS": 7700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "surat-railway",
    "distanceKm": 115,
    "durationMin": 173,
    "category": "inter-province",
    "prices": {
      "ECO": 2700,
      "PREM": 2800,
      "SUV": 2800,
      "VAN": 2900,
      "EXE": 3000,
      "VIP": 7700,
      "SIG": 7700,
      "BUS": 7700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "surat-thani",
    "distanceKm": 120,
    "durationMin": 180,
    "category": "inter-province",
    "prices": {
      "ECO": 2600,
      "PREM": 2700,
      "SUV": 2700,
      "VAN": 2800,
      "EXE": 2900,
      "VIP": 7600,
      "SIG": 7600,
      "BUS": 7600
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "tapee-pier",
    "distanceKm": 125,
    "durationMin": 188,
    "category": "inter-province",
    "prices": {
      "ECO": 2600,
      "PREM": 2700,
      "SUV": 2700,
      "VAN": 2800,
      "EXE": 2900,
      "VIP": 7600,
      "SIG": 7600,
      "BUS": 7600
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "lomprayah-donsak",
    "distanceKm": 165,
    "durationMin": 248,
    "category": "inter-province",
    "prices": {
      "ECO": 3100,
      "PREM": 3500,
      "SUV": 3500,
      "VAN": 3600,
      "EXE": 3900,
      "VIP": 8600,
      "SIG": 8600,
      "BUS": 8600
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "donsak-pier",
    "distanceKm": 165,
    "durationMin": 248,
    "category": "inter-province",
    "prices": {
      "ECO": 3200,
      "PREM": 3600,
      "SUV": 3600,
      "VAN": 3700,
      "EXE": 4000,
      "VIP": 8700,
      "SIG": 8700,
      "BUS": 8700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "khanom",
    "distanceKm": 180,
    "durationMin": 270,
    "category": "inter-province",
    "prices": {
      "ECO": 3700,
      "PREM": 4100,
      "SUV": 4100,
      "VAN": 4200,
      "EXE": 4500,
      "VIP": 9200,
      "SIG": 9200,
      "BUS": 9200
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "pak-bara-pier",
    "distanceKm": 210,
    "durationMin": 315,
    "category": "inter-province",
    "prices": {
      "ECO": 4200,
      "PREM": 4600,
      "SUV": 4600,
      "VAN": 4700,
      "EXE": 5000,
      "VIP": 9700,
      "SIG": 9700,
      "BUS": 9700
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "satun-town",
    "distanceKm": 230,
    "durationMin": 345,
    "category": "inter-province",
    "prices": {
      "ECO": 4700,
      "PREM": 5100,
      "SUV": 5100,
      "VAN": 5200,
      "EXE": 5500,
      "VIP": 10200,
      "SIG": 10200,
      "BUS": 10200
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "tammalang-pier",
    "distanceKm": 240,
    "durationMin": 360,
    "category": "inter-province",
    "prices": {
      "ECO": 5000,
      "PREM": 5400,
      "SUV": 5400,
      "VAN": 5500,
      "EXE": 5800,
      "VIP": 10500,
      "SIG": 10500,
      "BUS": 10500
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "wang-prachan",
    "distanceKm": 240,
    "durationMin": 360,
    "category": "inter-province",
    "prices": {
      "ECO": 5000,
      "PREM": 5400,
      "SUV": 5400,
      "VAN": 5500,
      "EXE": 5800,
      "VIP": 10500,
      "SIG": 10500,
      "BUS": 10500
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "hat-yai-airport",
    "distanceKm": 240,
    "durationMin": 360,
    "category": "inter-province",
    "prices": {
      "ECO": 5000,
      "PREM": 5400,
      "SUV": 5400,
      "VAN": 5500,
      "EXE": 5800,
      "VIP": 10500,
      "SIG": 10500,
      "BUS": 10500
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "hat-yai-bus",
    "distanceKm": 240,
    "durationMin": 360,
    "category": "inter-province",
    "prices": {
      "ECO": 5000,
      "PREM": 5400,
      "SUV": 5400,
      "VAN": 5500,
      "EXE": 5800,
      "VIP": 10500,
      "SIG": 10500,
      "BUS": 10500
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "hat-yai-town",
    "distanceKm": 235,
    "durationMin": 353,
    "category": "inter-province",
    "prices": {
      "ECO": 5000,
      "PREM": 5100,
      "SUV": 5100,
      "VAN": 5200,
      "EXE": 5500,
      "VIP": 10200,
      "SIG": 10200,
      "BUS": 10200
    }
  },
  {
    "fromId": "kbv-airport",
    "toId": "dan-nok",
    "distanceKm": 270,
    "durationMin": 405,
    "category": "inter-province",
    "prices": {
      "ECO": 6000,
      "PREM": 6400,
      "SUV": 6400,
      "VAN": 6500,
      "EXE": 6800,
      "VIP": 11500,
      "SIG": 11500,
      "BUS": 11500
    }
  }
];

/** Official Set 2: Phuket Airport ↔ Ao Nang ↔ Koh Lanta (THB, one way, both directions). */
const set2OfficialRoutes: OfficialTransferRoute[] = [
  {
    fromId: "phuket-airport",
    toId: "ao-nang-beach",
    distanceKm: 165,
    durationMin: 150,
    category: "inter-province",
    prices: tariffPrices(2000, 2300, 2400, 2500, 2800, 8500, 8500),
  },
  {
    fromId: "phuket-airport",
    toId: "koh-lanta-z1",
    distanceKm: 230,
    durationMin: 240,
    category: "inter-province",
    prices: tariffPrices(4000, 4400, 4400, 4600, 5000, 18000, 18000),
  },
  {
    fromId: "phuket-airport",
    toId: "koh-lanta-z2",
    distanceKm: 240,
    durationMin: 255,
    category: "inter-province",
    prices: tariffPrices(4300, 4600, 4600, 4800, 5500, 18500, 18500),
  },
  {
    fromId: "phuket-airport",
    toId: "koh-lanta-z3",
    distanceKm: 250,
    durationMin: 270,
    category: "inter-province",
    prices: tariffPrices(4500, 4800, 4800, 5000, 5800, 18900, 18900),
  },
  {
    fromId: "ao-nang-beach",
    toId: "koh-lanta-z1",
    distanceKm: 95,
    durationMin: 120,
    category: "beach",
    prices: tariffPrices(2200, 2400, 2400, 2500, 2800, 9500, 10000),
  },
  {
    fromId: "ao-nang-beach",
    toId: "koh-lanta-z2",
    distanceKm: 100,
    durationMin: 130,
    category: "beach",
    prices: tariffPrices(2400, 2600, 2600, 2700, 3000, 9500, 11000),
  },
  {
    fromId: "ao-nang-beach",
    toId: "koh-lanta-z3",
    distanceKm: 105,
    durationMin: 140,
    category: "beach",
    prices: tariffPrices(2600, 2800, 2800, 2900, 3200, 9500, 11000),
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
    return imported.find(
      (route) =>
        (route.fromId === fromId && route.toId === toId) ||
        (route.fromId === toId && route.toId === fromId)
    );
  }
  return routeIndex.get(`${fromId}>${toId}`);
}

export function getActiveOfficialRoutes(): OfficialTransferRoute[] {
  const imported = getImportedTransferRoutes();
  return imported?.length ? imported : officialTransferRoutes;
}
