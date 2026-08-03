import type { BoatSchedule } from "@/lib/types";

/** Mock boat / ferry timetable — times are illustrative and change by season. */
export const boatSchedules: BoatSchedule[] = [
  {
    id: "ao-nang-railay-longtail",
    routeLabel: "Ao Nang Pier → Railay Beach",
    fromPierId: "ao-nang-pier",
    toPierId: "railay-beach",
    operator: "Local longtail (shared)",
    type: "longtail",
    departures: [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ],
    durationMin: 15,
    priceFrom: 100,
    notes:
      "Frequent shared longtails; private charter available. Evening boats thin out after sunset.",
    image: "/images/boats/ao-nang-railay.jpg",
  },
  {
    id: "railay-ao-nang-longtail",
    routeLabel: "Railay Beach → Ao Nang Pier",
    fromPierId: "railay-beach",
    toPierId: "ao-nang-pier",
    operator: "Local longtail (shared)",
    type: "longtail",
    departures: [
      "08:30",
      "09:30",
      "10:30",
      "11:30",
      "12:30",
      "13:30",
      "14:30",
      "15:30",
      "16:30",
      "17:30",
    ],
    durationMin: 15,
    priceFrom: 100,
    notes:
      "Return boats from Railay West / East depending on tide and luggage.",
    image: "/images/boats/railay-ao-nang.jpg",
  },
  {
    id: "ao-nang-phi-phi-speedboat",
    routeLabel: "Ao Nang / Tonsai → Phi Phi",
    fromPierId: "ao-nang-pier",
    toPierId: "phi-phi-pier",
    operator: "Speedboat operators (mock)",
    type: "speedboat",
    departures: ["08:00", "09:00", "13:00"],
    durationMin: 45,
    priceFrom: 700,
    notes:
      "Exact pier (Ao Nang vs Tonsai) depends on operator. Arrive 30–45 min early in peak season.",
    image: "/images/boats/ao-nang-phi-phi-speed.jpg",
  },
  {
    id: "phi-phi-ao-nang-speedboat",
    routeLabel: "Phi Phi → Ao Nang / Tonsai",
    fromPierId: "phi-phi-pier",
    toPierId: "ao-nang-pier",
    operator: "Speedboat operators (mock)",
    type: "speedboat",
    departures: ["11:30", "14:30", "16:00"],
    durationMin: 45,
    priceFrom: 700,
    notes: "Book return pier pickup in advance if you arrive after dark.",
    image: "/images/boats/phi-phi-ao-nang-speed.jpg",
  },
  {
    id: "ao-nang-phi-phi-ferry",
    routeLabel: "Ao Nang area → Phi Phi (Ferry)",
    fromPierId: "ao-nang-pier",
    toPierId: "phi-phi-pier",
    operator: "Ferry / combined transfer (mock)",
    type: "ferry",
    departures: ["09:00", "13:30"],
    durationMin: 90,
    priceFrom: 450,
    notes:
      "Slower and usually cheaper than speedboat. May include van to a larger ferry pier.",
    image: "/images/boats/ao-nang-phi-phi-ferry.jpg",
  },
  {
    id: "krabi-lanta-ferry",
    routeLabel: "Krabi → Koh Lanta",
    fromPierId: "ao-nang-pier",
    toPierId: "phi-phi-pier",
    operator: "Ferry + van combo (mock)",
    type: "ferry",
    departures: ["08:30", "11:00", "13:30"],
    durationMin: 150,
    priceFrom: 550,
    notes:
      "Many packages use Krabi Town or nearby piers; confirm meeting point. Duration includes road + sea.",
    image: "/images/boats/krabi-lanta.jpg",
  },
  {
    id: "phi-phi-phuket-ferry",
    routeLabel: "Phi Phi → Phuket",
    fromPierId: "phi-phi-pier",
    toPierId: "phuket-airport",
    operator: "Ferry operators (mock)",
    type: "ferry",
    departures: ["09:00", "14:00", "17:00"],
    durationMin: 120,
    priceFrom: 500,
    notes:
      "Connect with a Phuket Airport or Patong private transfer after arrival.",
    image: "/images/boats/phi-phi-phuket.jpg",
  },
  {
    id: "railay-hong-island-speedboat",
    routeLabel: "Ao Nang → Hong Island",
    fromPierId: "ao-nang-pier",
    toPierId: "ao-nang-pier",
    operator: "Day-trip speedboat (mock)",
    type: "speedboat",
    departures: ["08:30", "09:30"],
    durationMin: 40,
    priceFrom: 1100,
    notes:
      "Usually sold as a round-trip day package rather than one-way tickets.",
    image: "/images/boats/ao-nang-hong.jpg",
  },
];

export function getBoatSchedule(id: string): BoatSchedule | undefined {
  return boatSchedules.find((s) => s.id === id);
}

export function getBoatSchedulesByPier(pierId: string): BoatSchedule[] {
  return boatSchedules.filter(
    (s) => s.fromPierId === pierId || s.toPierId === pierId
  );
}

export const boatRouteLabels = Array.from(
  new Set(boatSchedules.map((s) => s.routeLabel.split("→")[0].trim()))
);
