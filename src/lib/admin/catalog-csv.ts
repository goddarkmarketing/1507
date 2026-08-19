import { locations } from "@/lib/data/locations";
import type { OfficialTransferRoute } from "@/lib/data/transfer-routes";
import type {
  RentalCategory,
  RentalPackage,
  TransferCategory,
  Vehicle,
  VehicleCode,
} from "@/lib/types";

export type ParseIssue = { row: number; message: string };

export type ParseResult<T> = {
  rows: T[];
  issues: ParseIssue[];
};

const RENTAL_CATEGORIES: RentalCategory[] = [
  "Mini Car",
  "Economy",
  "Compact",
  "Full Size",
];

const TRANSFER_CATEGORIES: TransferCategory[] = [
  "airport",
  "hotel",
  "pier",
  "beach",
  "city",
  "attraction",
  "inter-province",
];

function parseCsv(text: string): string[][] {
  const input = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else {
          quoted = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') {
      quoted = true;
      continue;
    }
    if (ch === "," || ch === "\t") {
      row.push(cell.trim());
      cell = "";
      continue;
    }
    if (ch === "\n") {
      row.push(cell.trim());
      if (row.some((v) => v !== "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += ch;
  }
  row.push(cell.trim());
  if (row.some((v) => v !== "")) rows.push(row);
  return rows;
}

function headerMap(header: string[]): Map<string, number> {
  const map = new Map<string, number>();
  header.forEach((h, i) => {
    map.set(normalizeKey(h), i);
  });
  return map;
}

function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[\s_\-]+/g, "");
}

function pick(map: Map<string, number>, cells: string[], aliases: string[]) {
  for (const alias of aliases) {
    const idx = map.get(normalizeKey(alias));
    if (idx != null && cells[idx] != null && cells[idx] !== "") {
      return cells[idx];
    }
  }
  return "";
}

function toNumber(raw: string): number | null {
  if (!raw || /on\s*request|ขอราคา|询价/i.test(raw)) return null;
  const n = Number(String(raw).replace(/[, ]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function slugId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function parseRentalCsv(text: string): ParseResult<RentalPackage> {
  const table = parseCsv(text);
  const issues: ParseIssue[] = [];
  if (table.length < 2) {
    return { rows: [], issues: [{ row: 1, message: "empty" }] };
  }
  const map = headerMap(table[0]);
  const rows: RentalPackage[] = [];

  table.slice(1).forEach((cells, index) => {
    const row = index + 2;
    const model = pick(map, cells, ["model", "car", "name"]);
    if (!model) {
      issues.push({ row, message: "missingModel" });
      return;
    }
    const categoryRaw = pick(map, cells, ["category", "class"]);
    const category = RENTAL_CATEGORIES.find(
      (c) => normalizeKey(c) === normalizeKey(categoryRaw)
    );
    if (!category) {
      issues.push({ row, message: "badCategory" });
      return;
    }
    const id =
      pick(map, cells, ["id"]) ||
      `rental-${slugId(model) || row}`;
    rows.push({
      id,
      category,
      model,
      engine: pick(map, cells, ["engine", "cc"]) || "—",
      transmission: "Automatic",
      seats: toNumber(pick(map, cells, ["seats"])) ?? 5,
      largeBags: toNumber(pick(map, cells, ["largebags", "bags"])) ?? 1,
      doors: toNumber(pick(map, cells, ["doors"])) ?? 4,
      rates: {
        days1to3: toNumber(pick(map, cells, ["days1to3", "1-3", "d1to3"])),
        days4to6: toNumber(pick(map, cells, ["days4to6", "4-6", "d4to6"])),
        days7to20: toNumber(pick(map, cells, ["days7to20", "7-20", "d7to20"])),
        days21to30: toNumber(pick(map, cells, ["days21to30", "21-30", "d21to30"])),
      },
      image: pick(map, cells, ["image"]) || "/vehicles/toyota/altis.webp",
    });
  });

  return { rows, issues };
}

function resolveLocationId(raw: string): string | undefined {
  const token = raw.trim();
  if (!token) return undefined;
  const exact = locations.find((l) => l.id === token);
  if (exact) return exact.id;
  const q = token.toLowerCase();
  return locations.find(
    (l) =>
      l.name.toLowerCase() === q ||
      l.nameTh === token ||
      l.name.toLowerCase().split("(")[0].trim() === q
  )?.id;
}

function money(
  map: Map<string, number>,
  cells: string[],
  aliases: string[]
): number | null {
  return toNumber(pick(map, cells, aliases));
}

export function parseTransferCsv(text: string): ParseResult<OfficialTransferRoute> {
  const table = parseCsv(text);
  const issues: ParseIssue[] = [];
  if (table.length < 2) {
    return { rows: [], issues: [{ row: 1, message: "empty" }] };
  }
  const map = headerMap(table[0]);
  const rows: OfficialTransferRoute[] = [];

  table.slice(1).forEach((cells, index) => {
    const row = index + 2;
    const fromId = resolveLocationId(
      pick(map, cells, ["fromid", "from", "origin"])
    );
    const toId = resolveLocationId(pick(map, cells, ["toid", "to", "destination"]));
    if (!fromId || !toId) {
      issues.push({ row, message: "badLocation" });
      return;
    }
    if (fromId === toId) {
      issues.push({ row, message: "sameLocation" });
      return;
    }
    const eco = money(map, cells, ["eco", "economytaxi", "economy"]);
    const prem = money(map, cells, ["prem", "luxurytaxi", "luxury"]);
    const suv = money(map, cells, ["suv", "suvtaxi"]);
    const van = money(map, cells, ["van", "vantaxi"]);
    const exe = money(map, cells, ["exe", "vipvan"]);
    const alphard = money(map, cells, ["vip", "alphardvip", "alphard"]);
    const bus = money(map, cells, ["bus", "minibus"]);
    const sig = money(map, cells, ["sig"]) ?? alphard;
    if (
      eco == null ||
      prem == null ||
      suv == null ||
      van == null ||
      exe == null ||
      alphard == null ||
      bus == null
    ) {
      issues.push({ row, message: "missingPrice" });
      return;
    }
    const categoryRaw = pick(map, cells, ["category"]);
    const category =
      TRANSFER_CATEGORIES.find((c) => c === categoryRaw) ??
      (locations.find((l) => l.id === fromId)?.province !==
      locations.find((l) => l.id === toId)?.province
        ? "inter-province"
        : "city");
    const distanceKm = toNumber(pick(map, cells, ["distancekm", "km"])) ?? 0;
    const durationMin =
      toNumber(pick(map, cells, ["durationmin", "minutes", "min"])) ??
      Math.round(distanceKm * 1.8);

    const prices: Record<VehicleCode, number> = {
      ECO: eco,
      PREM: prem,
      SUV: suv,
      VAN: van,
      EXE: exe,
      VIP: alphard,
      SIG: sig ?? alphard,
      BUS: bus,
    };

    rows.push({
      fromId,
      toId,
      distanceKm,
      durationMin,
      category,
      prices,
    });
  });

  return { rows, issues };
}

export function rentalPackagesToCsv(rows: RentalPackage[]) {
  const header = [
    "id",
    "category",
    "model",
    "engine",
    "seats",
    "largeBags",
    "doors",
    "days1to3",
    "days4to6",
    "days7to20",
    "days21to30",
    "image",
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.id,
        csvCell(row.category),
        csvCell(row.model),
        csvCell(row.engine),
        row.seats,
        row.largeBags,
        row.doors,
        row.rates.days1to3 ?? "",
        row.rates.days4to6 ?? "",
        row.rates.days7to20 ?? "",
        row.rates.days21to30 ?? "",
        csvCell(row.image),
      ].join(",")
    ),
  ];
  return lines.join("\n");
}

export function transferRoutesToCsv(rows: OfficialTransferRoute[]) {
  const header = [
    "fromId",
    "toId",
    "distanceKm",
    "durationMin",
    "category",
    "ECO",
    "PREM",
    "SUV",
    "VAN",
    "EXE",
    "VIP",
    "SIG",
    "BUS",
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.fromId,
        row.toId,
        row.distanceKm,
        row.durationMin,
        row.category,
        row.prices.ECO,
        row.prices.PREM,
        row.prices.SUV,
        row.prices.VAN,
        row.prices.EXE,
        row.prices.VIP,
        row.prices.SIG,
        row.prices.BUS,
      ].join(",")
    ),
  ];
  return lines.join("\n");
}

const VEHICLE_CODES: VehicleCode[] = [
  "ECO",
  "PREM",
  "SUV",
  "VAN",
  "VIP",
  "SIG",
  "EXE",
  "BUS",
];

export function parseVehiclesCsv(text: string): ParseResult<Vehicle> {
  const table = parseCsv(text);
  const issues: ParseIssue[] = [];

  if (table.length < 2) {
    return { rows: [], issues: [{ row: 1, message: "empty" }] };
  }

  const map = headerMap(table[0]);
  const rows: Vehicle[] = [];

  table.slice(1).forEach((cells, index) => {
    const row = index + 2;

    const codeRaw = pick(map, cells, ["code", "vehiclecode", "vehicle"]);
    if (!codeRaw) {
      issues.push({ row, message: "missingCode" });
      return;
    }

    const code = codeRaw.toUpperCase() as VehicleCode;
    if (!VEHICLE_CODES.includes(code)) {
      issues.push({ row, message: "badCode" });
      return;
    }

    const passengers = pick(map, cells, ["passengers", "pax"]);
    const amenitiesRaw = pick(map, cells, ["amenitykeys", "amenities", "amenity"]);
    const priceMultiplierRaw = pick(map, cells, [
      "pricemultiplier",
      "priceMultiplier",
      "multiplier",
    ]);
    const image = pick(map, cells, ["image", "img"]);

    if (!passengers || !amenitiesRaw || !image) {
      issues.push({ row, message: "missingField" });
      return;
    }
    if (!priceMultiplierRaw) {
      issues.push({ row, message: "missingMultiplier" });
      return;
    }

    const priceMultiplier = toNumber(priceMultiplierRaw);
    if (priceMultiplier == null) {
      issues.push({ row, message: "badMultiplier" });
      return;
    }

    const amenityKeys = amenitiesRaw
      .split(/[|,]/g)
      .map((s) => s.trim())
      .filter(Boolean);

    rows.push({
      code,
      passengers,
      amenityKeys,
      priceMultiplier,
      image,
    });
  });

  return { rows, issues };
}

export function vehiclesToCsv(rows: Vehicle[]) {
  const header = [
    "code",
    "passengers",
    "amenityKeys",
    "priceMultiplier",
    "image",
  ];
  const lines = [
    header.join(","),
    ...rows.map((row) =>
      [
        row.code,
        csvCell(row.passengers),
        csvCell(row.amenityKeys.join("|")),
        row.priceMultiplier,
        csvCell(row.image),
      ].join(",")
    ),
  ];
  return lines.join("\n");
}

function csvCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([`\uFEFF${content}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
