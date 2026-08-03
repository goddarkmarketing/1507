import type { TravelGuide } from "@/lib/types";

export const travelGuides: TravelGuide[] = [
  {
    slug: "ao-nang-base-guide",
    title: "Ao Nang as Your Krabi Base",
    excerpt:
      "Where to stay, how to reach the pier, and how to link beaches, Railay, and day trips.",
    region: "Krabi",
    category: "Destination",
    coverImage: "/images/article-ao-nang-railay.png",
    readMinutes: 6,
    tips: [
      "Stay near the beach road for easy longtail access to Railay.",
      "Book pier transfers the night before busy ferry mornings.",
      "Evening traffic between Krabi Town and Ao Nang can add 15–25 minutes.",
    ],
    content: [
      "Ao Nang is the most practical base for first-time visitors: restaurants, tour desks, and boat access sit close together.",
      "Use private transfers from Krabi Airport (KBV) if you arrive with luggage or after dark — metered taxis and shared vans vary in wait time.",
      "From Ao Nang you can reach Railay in about 15 minutes by longtail, join 4 Islands trips, or connect to Phi Phi speedboats.",
      "If your hotel is uphill or inland, add buffer time to every pier departure.",
    ],
    relatedTourSlugs: ["four-islands-tour", "railay-sunset-longtail", "phi-phi-islands-day-trip"],
    relatedBoatRouteIds: ["ao-nang-railay-longtail", "ao-nang-phi-phi-speedboat"],
  },
  {
    slug: "railay-access-tips",
    title: "Getting to Railay Beach Without Stress",
    excerpt:
      "Boat options, luggage tips, and when to book a private longtail vs shared boats.",
    region: "Krabi",
    category: "Destination",
    coverImage: "/images/article-ao-nang-railay.png",
    readMinutes: 5,
    tips: [
      "Large suitcases are easier on private longtails.",
      "Railay East can be muddy at low tide — West is better for sunset.",
      "Confirm return boat plans before dinner.",
    ],
    content: [
      "Railay has no road access. Almost everyone arrives by boat from Ao Nang or by longer routes from Krabi Town.",
      "Shared longtails are cheap and frequent by day. Private boats cost more but help with timing, kids, and bulky bags.",
      "Climbing, kayaking, and Phra Nang Cave Beach are walkable once you arrive — plan footwear for rocky paths.",
      "We can transfer you hotel → Ao Nang Pier and arrange a timed return pickup after sunset.",
    ],
    relatedTourSlugs: ["railay-sunset-longtail", "four-islands-tour"],
    relatedBoatRouteIds: ["ao-nang-railay-longtail", "railay-ao-nang-longtail"],
  },
  {
    slug: "phi-phi-arrival-checklist",
    title: "Phi Phi Arrival Checklist",
    excerpt:
      "Ferry vs speedboat, pier timing, and how to connect hotel transfers before and after the crossing.",
    region: "Phi Phi / Krabi",
    category: "Island",
    coverImage: "/images/article-pier-phi-phi.png",
    readMinutes: 5,
    tips: [
      "Arrive at the pier 45–60 minutes early in high season.",
      "Speedboats are faster; ferries are usually smoother and cheaper.",
      "Pre-book the land transfer so you are not rushing with luggage.",
    ],
    content: [
      "Island days start on land. A reliable hotel-to-pier transfer is as important as the boat ticket itself.",
      "Weather and park rules can change Maya Bay access — check with your operator the day before.",
      "On return evenings, private pier pickups beat waiting for shared vans, especially with wet bags and tired kids.",
      "If you fly out of Phuket or Krabi the next morning, leave buffer time for ferry delays.",
    ],
    relatedTourSlugs: ["phi-phi-islands-day-trip"],
    relatedBoatRouteIds: [
      "ao-nang-phi-phi-speedboat",
      "ao-nang-phi-phi-ferry",
      "phi-phi-ao-nang-speedboat",
    ],
  },
  {
    slug: "krabi-phuket-corridor",
    title: "Krabi–Phuket Corridor: Transfer Tips",
    excerpt:
      "When a private car beats shared vans on the busiest inter-province route in the south.",
    region: "Krabi · Phuket",
    category: "Corridor",
    coverImage: "/images/article-inter-province.png",
    readMinutes: 6,
    tips: [
      "Door-to-door private cars skip multiple hotel stops.",
      "Airport–airport transfers need flight tracking and waiting time.",
      "Toll and parking are usually included in private quotes.",
    ],
    content: [
      "Krabi ↔ Phuket is the most requested inter-province corridor for flight connections and multi-stay trips.",
      "Shared vans are cheaper but add time with stops. Private SUVs or vans suit families and tight flight schedules.",
      "Typical legs connect KBV or Krabi Town with Phuket Airport, Patong, or west-coast hotels.",
      "Book round-trip if you fly into one province and out of the other — one e-Voucher covers both legs.",
    ],
    relatedTourSlugs: ["james-bond-island-phang-nga"],
    relatedBoatRouteIds: ["phi-phi-phuket-ferry"],
  },
];

export function getTravelGuide(slug: string): TravelGuide | undefined {
  return travelGuides.find((g) => g.slug === slug);
}

export function getRelatedGuides(slug: string, limit = 3): TravelGuide[] {
  return travelGuides.filter((g) => g.slug !== slug).slice(0, limit);
}

export const travelGuideCategories = Array.from(
  new Set(travelGuides.map((g) => g.category))
);
