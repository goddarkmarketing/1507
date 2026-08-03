import type { Location } from "@/lib/types";

export const locations: Location[] = [
  {
    id: "kbv-airport",
    name: "Krabi International Airport (KBV)",
    nameTh: "ท่าอากาศยานกระบี่",
    type: "airport",
    province: "Krabi",
    connections: ["ao-nang-pier", "krabi-town", "railay-beach", "phuket-airport"],
  },
  {
    id: "phuket-airport",
    name: "Phuket International Airport (HKT)",
    nameTh: "ท่าอากาศยานภูเก็ต",
    type: "airport",
    province: "Phuket",
    connections: ["kbv-airport", "krabi-town", "patong-beach"],
  },
  {
    id: "ao-nang-pier",
    name: "Ao Nang Pier",
    nameTh: "ท่าเรืออ่าวนาง",
    type: "pier",
    province: "Krabi",
    connections: ["kbv-airport", "railay-beach", "phi-phi-pier"],
  },
  {
    id: "phi-phi-pier",
    name: "Phi Phi Pier",
    nameTh: "ท่าเรือพีพี",
    type: "pier",
    province: "Krabi",
    connections: ["ao-nang-pier", "krabi-town"],
  },
  {
    id: "krabi-town",
    name: "Krabi Town",
    nameTh: "ตัวเมืองกระบี่",
    type: "city",
    province: "Krabi",
    connections: ["kbv-airport", "ao-nang-pier", "emerald-pool", "tiger-cave"],
  },
  {
    id: "ao-nang-beach",
    name: "Ao Nang Beach",
    nameTh: "หาดอ่าวนาง",
    type: "beach",
    province: "Krabi",
    connections: ["kbv-airport", "railay-beach", "centara-ao-nang"],
  },
  {
    id: "railay-beach",
    name: "Railay Beach",
    nameTh: "หาดไร่เลย์",
    type: "beach",
    province: "Krabi",
    connections: ["ao-nang-pier", "ao-nang-beach", "kbv-airport"],
  },
  {
    id: "centara-ao-nang",
    name: "Centara Grand Beach Resort",
    nameTh: "เซนทารา แกรนด์ อ่าวนาง",
    type: "hotel",
    province: "Krabi",
    connections: ["kbv-airport", "ao-nang-beach", "ao-nang-pier"],
  },
  {
    id: "rayavadee",
    name: "Rayavadee Resort",
    nameTh: "เรยาวadee",
    type: "hotel",
    province: "Krabi",
    connections: ["kbv-airport", "railay-beach"],
  },
  {
    id: "emerald-pool",
    name: "Emerald Pool (Sa Morakot)",
    nameTh: "สระมรกต",
    type: "attraction",
    province: "Krabi",
    connections: ["krabi-town", "hot-spring"],
  },
  {
    id: "tiger-cave",
    name: "Tiger Cave Temple",
    nameTh: "วัดถ้ำเสือ",
    type: "temple",
    province: "Krabi",
    connections: ["krabi-town", "kbv-airport"],
  },
  {
    id: "hot-spring",
    name: "Hot Spring Waterfall",
    nameTh: "น้ำตกร้อน",
    type: "attraction",
    province: "Krabi",
    connections: ["emerald-pool", "krabi-town"],
  },
  {
    id: "patong-beach",
    name: "Patong Beach",
    nameTh: "หาดป่าตอง",
    type: "beach",
    province: "Phuket",
    connections: ["phuket-airport"],
  },
  {
    id: "trang-town",
    name: "Trang City",
    nameTh: "ตัวเมืองตรัง",
    type: "city",
    province: "Trang",
    connections: ["krabi-town", "kbv-airport"],
  },
  {
    id: "surat-thani",
    name: "Surat Thani City",
    nameTh: "ตัวเมืองสุราษฎร์ธานี",
    type: "city",
    province: "Surat Thani",
    connections: ["krabi-town", "phuket-airport"],
  },
];

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
    (l) => l.id !== fromId && (from.connections.includes(l.id) || l.connections.includes(fromId))
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
