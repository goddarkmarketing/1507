import type { Tour } from "@/lib/types";

export const tours: Tour[] = [
  {
    slug: "phi-phi-islands-day-trip",
    title: "Phi Phi Islands Day Trip",
    excerpt:
      "Classic Andaman day trip with Maya Bay viewpoint, snorkel stops, and lunch on the beach.",
    category: "Island",
    duration: "Full day (~8–9 hrs)",
    fromArea: "Ao Nang / Krabi",
    toArea: "Phi Phi Islands",
    highlights: [
      "Maya Bay viewpoint (subject to park rules)",
      "Snorkel at clear reefs",
      "Beach lunch on Phi Phi Don or nearby bay",
      "Hotel or pier pickup timing support",
    ],
    includes: [
      "Speedboat or ferry seat (operator dependent)",
      "National park fees (where included by operator)",
      "Lunch & drinking water",
      "Life jacket & snorkel gear",
    ],
    priceFrom: 1500,
    coverImage: "/images/tours/phi-phi.jpg",
    pierId: "ao-nang-pier",
    content: [
      "Phi Phi remains one of the most requested day trips from Krabi. Most packages leave early from Ao Nang or nearby piers and return in the late afternoon.",
      "We recommend booking a private pier transfer so you arrive with buffer time before check-in. Evening returns can be busy — reserve your pickup slot when you book the tour.",
      "Tour prices shown are from typical local operators (mock guide prices). Confirm inclusions, boat type, and Maya Bay access rules for your travel date.",
    ],
  },
  {
    slug: "four-islands-tour",
    title: "4 Islands Tour (Chicken, Tup, Poda & Railay)",
    excerpt:
      "Short island hopping near Ao Nang — shallow reefs, iconic rocks, and soft sand beaches.",
    category: "Snorkel",
    duration: "Half / full day",
    fromArea: "Ao Nang",
    toArea: "Chicken · Tup · Poda · Railay",
    highlights: [
      "Chicken Island viewpoint & snorkel",
      "Tup Island sandbar (tide dependent)",
      "Poda Beach swim stop",
      "Optional Railay drop or visit",
    ],
    includes: [
      "Longtail or speedboat",
      "Snorkel mask & life jacket",
      "Fruit / soft drinks (operator dependent)",
      "Guide on board",
    ],
    priceFrom: 900,
    coverImage: "/images/tours/four-islands.jpg",
    pierId: "ao-nang-pier",
    content: [
      "The 4 Islands route is ideal if you want scenery close to Ao Nang without a long crossing to Phi Phi.",
      "Tide affects sandbar visibility at Tup Island — morning departures usually give the best conditions.",
      "Pair this tour with a hotel–pier transfer so you do not rely on last-minute songthaews during peak season.",
    ],
  },
  {
    slug: "hong-island-lagoon",
    title: "Hong Island Lagoon Trip",
    excerpt:
      "Calm lagoons, kayaking options, and powder sand beaches in Than Bok Khorani National Park.",
    category: "Kayak",
    duration: "Full day",
    fromArea: "Ao Nang / Nopparat Thara",
    toArea: "Hong Island",
    highlights: [
      "Emerald lagoon views",
      "Kayak through limestone channels",
      "Quiet beach time",
      "National park scenery",
    ],
    includes: [
      "Boat transfer to Hong Island",
      "Kayak (shared or private — operator dependent)",
      "National park fee (often included)",
      "Lunch on some packages",
    ],
    priceFrom: 1200,
    coverImage: "/images/tours/hong-island.jpg",
    pierId: "ao-nang-pier",
    content: [
      "Hong Island is popular with travelers who prefer lagoons and kayaking over long-distance speedboat days.",
      "Departures are often from Nopparat Thara / Ao Nang side. Allow extra time if your hotel is inland or in Krabi Town.",
      "Ask your operator about park opening rules and whether kayaks are included or rented on site.",
    ],
  },
  {
    slug: "james-bond-island-phang-nga",
    title: "James Bond Island · Phang Nga Bay",
    excerpt:
      "Iconic limestone karsts, canoeing in caves, and the famous Koh Tapu rock needle.",
    category: "Sightseeing",
    duration: "Full day",
    fromArea: "Krabi / Phuket side",
    toArea: "Phang Nga Bay",
    highlights: [
      "Koh Tapu (James Bond Island)",
      "Canoe through mangrove caves",
      "Muslim fishing village stop (operator dependent)",
      "Scenic bay cruise",
    ],
    includes: [
      "Boat & canoe segment",
      "Guide",
      "Lunch",
      "National park fees (package dependent)",
    ],
    priceFrom: 1800,
    coverImage: "/images/tours/james-bond.jpg",
    content: [
      "James Bond Island tours can start from Krabi or Phuket. Travel time on land may be longer than the boat segment itself.",
      "A private transfer between your hotel and the meeting pier keeps the day on schedule — especially for early hotel pickups.",
      "Prices vary widely by canoe quality and group size; use our from-price as a planning guide only.",
    ],
  },
  {
    slug: "emerald-pool-hot-spring-combo",
    title: "Emerald Pool & Hot Spring Combo",
    excerpt:
      "Land-based nature day — emerald jungle pools and mineral hot springs near Krabi Town.",
    category: "Combo",
    duration: "Half day",
    fromArea: "Krabi Town / Ao Nang",
    toArea: "Emerald Pool · Hot Spring",
    highlights: [
      "Swim at Emerald Pool",
      "Relax at natural hot spring",
      "Blue Pool viewpoint option",
      "Easy half-day for families",
    ],
    includes: [
      "Entrance fees (package dependent)",
      "Guide on some packages",
      "Drinking water",
    ],
    priceFrom: 700,
    coverImage: "/images/tours/emerald-pool.jpg",
    content: [
      "This combo is perfect when seas are rough or you want a land day between island trips.",
      "Book an attraction transfer for door-to-door timing without shared van delays.",
      "Bring water shoes — paths can be slippery after rain.",
    ],
  },
  {
    slug: "railay-sunset-longtail",
    title: "Railay Sunset by Longtail",
    excerpt:
      "Short pier hop to Railay for viewpoints, climbing cliffs, and golden-hour photos.",
    category: "Sightseeing",
    duration: "3–5 hrs / evening",
    fromArea: "Ao Nang",
    toArea: "Railay Beach",
    highlights: [
      "Longtail to Railay West / East",
      "Phra Nang Cave Beach walk",
      "Sunset on Railay West",
      "Optional dinner on the beach",
    ],
    includes: [
      "Round-trip longtail (shared or private)",
      "Life jacket",
    ],
    priceFrom: 400,
    coverImage: "/images/tours/railay-sunset.jpg",
    pierId: "ao-nang-pier",
    content: [
      "Railay is only a short boat ride from Ao Nang but feels like a different destination.",
      "Check return boat times if you stay for sunset — private longtails are flexible when public boats slow down.",
      "We can drop you at Ao Nang Pier and wait for your return pickup on request.",
    ],
  },
];

export function getTour(slug: string): Tour | undefined {
  return tours.find((t) => t.slug === slug);
}

export function getRelatedTours(slug: string, limit = 3): Tour[] {
  const current = getTour(slug);
  if (!current) return tours.slice(0, limit);
  return tours
    .filter((t) => t.slug !== slug)
    .sort((a, b) => {
      const aSame = a.category === current.category ? 0 : 1;
      const bSame = b.category === current.category ? 0 : 1;
      return aSame - bSame;
    })
    .slice(0, limit);
}

export const tourCategories = Array.from(
  new Set(tours.map((t) => t.category))
);
