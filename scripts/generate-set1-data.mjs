import fs from "fs";

const xml = fs.readFileSync("tmp-xlsx/xl/worksheets/sheet1.xml", "utf8");
const rows = [...xml.matchAll(/<row r="(\d+)"[\s\S]*?<\/row>/g)];

function decode(t) {
  return t
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");
}

const meta = {
  "001": { id: "krabi-town", type: "city", province: "Krabi", km: 15 },
  "002": { id: "krabi-bus-terminal", type: "bus_station", province: "Krabi", km: 16 },
  "003": { id: "chao-fah-pier", type: "pier", province: "Krabi", km: 16 },
  "004": { id: "klong-jilad-pier", type: "pier", province: "Krabi", km: 16 },
  "005": { id: "ao-nam-mao", type: "pier", province: "Krabi", km: 20 },
  "006": { id: "ao-nang-beach", type: "beach", province: "Krabi", km: 24 },
  "007": { id: "klong-muang", type: "beach", province: "Krabi", km: 31 },
  "008": { id: "tubkaak-beach", type: "beach", province: "Krabi", km: 35 },
  "009": { id: "ao-tha-lane", type: "beach", province: "Krabi", km: 40 },
  "010": { id: "had-yao-krabi", type: "beach", province: "Krabi", km: 32 },
  "011": { id: "laem-kruat-pier", type: "pier", province: "Krabi", km: 35 },
  "012": { id: "boat-lagoon-krabi", type: "pier", province: "Krabi", km: 28 },
  "013": { id: "hua-hin-pier", type: "pier", province: "Krabi", km: 70 },
  "014": { id: "koh-lanta-z1", type: "beach", province: "Krabi", km: 78 },
  "015": { id: "koh-lanta-z2", type: "beach", province: "Krabi", km: 82 },
  "016": { id: "koh-lanta-z3", type: "beach", province: "Krabi", km: 85 },
  "017": { id: "pak-meng-pier", type: "pier", province: "Trang", km: 90 },
  "018": { id: "kuan-tung-ku-pier", type: "pier", province: "Trang", km: 110 },
  "019": { id: "hat-yao-pier-trang", type: "pier", province: "Trang", km: 130 },
  "020": { id: "trang-airport", type: "airport", province: "Trang", km: 130 },
  "021": { id: "trang-railway", type: "train_station", province: "Trang", km: 120 },
  "022": { id: "trang-town", type: "city", province: "Trang", km: 120 },
  "023": { id: "ratchaprapha-pier", type: "pier", province: "Surat Thani", km: 150 },
  "024": { id: "khao-sok", type: "park", province: "Surat Thani", km: 140 },
  "025": { id: "thap-lamu-pier", type: "pier", province: "Phang Nga", km: 120 },
  "026": { id: "khao-lak-z1", type: "beach", province: "Phang Nga", km: 90 },
  "027": { id: "khao-lak-z2", type: "beach", province: "Phang Nga", km: 105 },
  "028": { id: "natai-beach", type: "beach", province: "Phang Nga", km: 95 },
  "029": { id: "mai-khao-beach", type: "beach", province: "Phuket", km: 88 },
  "030": { id: "samet-nangshe", type: "viewpoint", province: "Phang Nga", km: 85 },
  "031": { id: "phuket-airport", type: "airport", province: "Phuket", km: 80 },
  "032": { id: "nai-yang-beach", type: "beach", province: "Phuket", km: 90 },
  "033": { id: "laguna-phuket", type: "beach", province: "Phuket", km: 105 },
  "034": { id: "kamala-beach", type: "beach", province: "Phuket", km: 114 },
  "035": { id: "phuket-town", type: "city", province: "Phuket", km: 132 },
  "036": { id: "patong-beach", type: "beach", province: "Phuket", km: 122 },
  "037": { id: "kata-beach", type: "beach", province: "Phuket", km: 128 },
  "038": { id: "karon-beach", type: "beach", province: "Phuket", km: 126 },
  "039": { id: "chalong", type: "city", province: "Phuket", km: 140 },
  "040": { id: "rawai-beach", type: "beach", province: "Phuket", km: 148 },
  "041": { id: "surat-airport", type: "airport", province: "Surat Thani", km: 110 },
  "042": { id: "surat-railway", type: "train_station", province: "Surat Thani", km: 115 },
  "043": { id: "surat-thani", type: "city", province: "Surat Thani", km: 120 },
  "044": { id: "tapee-pier", type: "pier", province: "Surat Thani", km: 125 },
  "045": { id: "lomprayah-donsak", type: "pier", province: "Surat Thani", km: 165 },
  "046": { id: "donsak-pier", type: "pier", province: "Surat Thani", km: 165 },
  "047": { id: "khanom", type: "beach", province: "Nakhon Si Thammarat", km: 180 },
  "048": { id: "pak-bara-pier", type: "pier", province: "Satun", km: 210 },
  "049": { id: "satun-town", type: "city", province: "Satun", km: 230 },
  "050": { id: "tammalang-pier", type: "pier", province: "Satun", km: 240 },
  "051": { id: "wang-prachan", type: "border", province: "Satun", km: 240 },
  "052": { id: "hat-yai-airport", type: "airport", province: "Songkhla", km: 240 },
  "053": { id: "hat-yai-bus", type: "bus_station", province: "Songkhla", km: 240 },
  "054": { id: "hat-yai-town", type: "city", province: "Songkhla", km: 235 },
  "055": { id: "dan-nok", type: "border", province: "Songkhla", km: 270 },
};

const extras = [
  {
    id: "ao-nang-pier",
    name: "Ao Nang Pier",
    nameTh: "ท่าเรืออ่าวนาง",
    type: "pier",
    province: "Krabi",
    pricingAreaId: "ao-nang-beach",
  },
  {
    id: "phi-phi-pier",
    name: "Phi Phi Pier",
    nameTh: "ท่าเรือพีพี",
    type: "pier",
    province: "Krabi",
  },
  {
    id: "railay-beach",
    name: "Railay Beach",
    nameTh: "หาดไร่เลย์",
    type: "beach",
    province: "Krabi",
    pricingAreaId: "ao-nang-beach",
  },
  {
    id: "centara-ao-nang",
    name: "Centara Grand Beach Resort",
    nameTh: "เซนทารา แกรนด์ อ่าวนาง",
    type: "hotel",
    province: "Krabi",
  },
  {
    id: "rayavadee",
    name: "Rayavadee Resort",
    nameTh: "เรยาวาดี",
    type: "hotel",
    province: "Krabi",
  },
  {
    id: "emerald-pool",
    name: "Emerald Pool (Sa Morakot)",
    nameTh: "สระมรกต",
    type: "attraction",
    province: "Krabi",
  },
  {
    id: "tiger-cave",
    name: "Tiger Cave Temple",
    nameTh: "วัดถ้ำเสือ",
    type: "temple",
    province: "Krabi",
  },
  {
    id: "hot-spring",
    name: "Hot Stream (Bo Toh)",
    nameTh: "น้ำตกร้อน บ่อตอ",
    type: "attraction",
    province: "Krabi",
  },
];

const routes = [];
for (const m of rows) {
  const rowXml = m[0];
  const no = rowXml.match(/<c r="A\d+"[^>]*><is><t>(\d+)<\/t>/);
  if (!no) continue;
  const nameCell = rowXml.match(/<c r="B\d+"[^>]*><is><t>([\s\S]*?)<\/t>/);
  const nums = [...rowXml.matchAll(/<c r="[C-I]\d+"[^>]*><v>(\d+)<\/v>/g)].map(
    (x) => Number(x[1])
  );
  if (!nameCell || nums.length < 7) continue;
  const raw = decode(nameCell[1]);
  const lines = raw.split(/\n/).map((s) => s.trim()).filter(Boolean);
  const th = lines[0]?.replace(/^สนามบินกระบี่\s*↔\s*/, "") ?? "";
  const enLine = lines.find((l) => l.startsWith("Krabi Airport")) ?? "";
  const en = enLine.replace(/^Krabi Airport\s*↔\s*/, "");
  const info = meta[no[1]];
  if (!info) throw new Error(`missing meta ${no[1]}`);
  routes.push({
    no: no[1],
    ...info,
    nameTh: th,
    nameEn: en,
    prices: {
      ECO: nums[0],
      PREM: nums[1],
      SUV: nums[2],
      VAN: nums[3],
      EXE: nums[4],
      VIP: nums[5],
      SIG: nums[5],
      BUS: nums[6],
    },
  });
}

const destIds = routes.map((r) => r.id);
const locMap = new Map();

locMap.set("kbv-airport", {
  id: "kbv-airport",
  name: "Krabi International Airport (KBV)",
  nameTh: "ท่าอากาศยานกระบี่",
  type: "airport",
  province: "Krabi",
  connections: destIds,
});

for (const r of routes) {
  locMap.set(r.id, {
    id: r.id,
    name: r.nameEn,
    nameTh: r.nameTh,
    type: r.type,
    province: r.province,
    connections: ["kbv-airport"],
  });
}

for (const extra of extras) {
  if (!locMap.has(extra.id)) {
    locMap.set(extra.id, { ...extra, connections: ["kbv-airport"] });
  }
}

function addLink(a, b) {
  const A = locMap.get(a);
  const B = locMap.get(b);
  if (!A || !B) return;
  if (!A.connections.includes(b)) A.connections.push(b);
  if (!B.connections.includes(a)) B.connections.push(a);
}

for (const dest of ["ao-nang-beach", "koh-lanta-z1", "koh-lanta-z2", "koh-lanta-z3"]) {
  addLink("phuket-airport", dest);
}
for (const dest of ["koh-lanta-z1", "koh-lanta-z2", "koh-lanta-z3"]) {
  addLink("ao-nang-beach", dest);
}

const locations = [...locMap.values()];

function categoryFor(province, type) {
  if (province !== "Krabi") return "inter-province";
  if (type === "airport") return "airport";
  if (type === "pier") return "pier";
  if (type === "beach") return "beach";
  if (type === "hotel") return "hotel";
  if (["attraction", "temple", "park", "viewpoint"].includes(type))
    return "attraction";
  return "city";
}

const routeRecords = routes.map((r) => ({
  fromId: "kbv-airport",
  toId: r.id,
  distanceKm: r.km,
  durationMin: Math.round(r.km * (r.province === "Krabi" ? 2.2 : 1.5)),
  category: categoryFor(r.province, r.type),
  prices: r.prices,
}));

function tariffPrices(eco, luxury, suv, van, vipVan, alphard, miniBus) {
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

const set2Records = [
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

const locTs = `import type { Location } from "@/lib/types";

export const locations: Location[] = ${JSON.stringify(locations, null, 2)};

export function getLocation(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}

export function getLocationsByType(type: Location["type"]): Location[] {
  return locations.filter((l) => l.type === type);
}

export function getConnectedLocations(fromId: string): Location[] {
  const from = getLocation(fromId);
  if (!from) return locations;
  return locations.filter(
    (l) =>
      l.id !== fromId &&
      (from.connections.includes(l.id) || l.connections.includes(fromId))
  );
}

export function searchLocations(query: string): Location[] {
  const q = query.toLowerCase().trim();
  if (!q) return locations;
  return locations.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.nameTh.includes(q) ||
      l.province.toLowerCase().includes(q)
  );
}
`;

const routesTs = `import type { TransferCategory, VehicleCode } from "@/lib/types";

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
const set1OfficialRoutes: OfficialTransferRoute[] = ${JSON.stringify(
  routeRecords,
  null,
  2
)};

/** Official Set 2: Phuket Airport ↔ Ao Nang ↔ Koh Lanta (THB, one way, both directions). */
const set2OfficialRoutes: OfficialTransferRoute[] = ${JSON.stringify(
  set2Records,
  null,
  2
)};

export const officialTransferRoutes: OfficialTransferRoute[] = [
  ...set1OfficialRoutes,
  ...set2OfficialRoutes,
];

const routeIndex = new Map<string, OfficialTransferRoute>();
for (const route of officialTransferRoutes) {
  routeIndex.set(\`\${route.fromId}>\${route.toId}\`, route);
  routeIndex.set(\`\${route.toId}>\${route.fromId}\`, route);
}

export function getOfficialRoute(
  fromId: string,
  toId: string
): OfficialTransferRoute | undefined {
  return routeIndex.get(\`\${fromId}>\${toId}\`);
}
`;

fs.writeFileSync("src/lib/data/locations.ts", locTs);
fs.writeFileSync("src/lib/data/transfer-routes.ts", routesTs);
console.log("wrote locations", locations.length, "routes", routeRecords.length);
