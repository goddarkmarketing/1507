import type { Article } from "@/lib/types";

export const articles: Article[] = [
  {
    slug: "krabi-airport-transfer-guide",
    title: "Krabi Airport Transfer Guide: Smooth Arrival at KBV",
    excerpt:
      "What to expect after landing at Krabi International Airport, how meet & greet works, and how to book a private transfer with an e-Voucher.",
    category: "Airport",
    coverImage: "/images/article-airport-transfer.png",
    publishedAt: "2026-06-12",
    readMinutes: 5,
    content: [
      "Landing at Krabi International Airport (KBV) is the start of your Southern Thailand trip. A private airport transfer helps you skip taxi queues and go straight to your hotel, beach, or pier.",
      "With Krabi Links Taxi, your driver tracks the flight and includes free waiting time for airport pickups. You receive an e-Voucher with a QR code right after booking — show it at the meeting point.",
      "Popular routes from KBV include Ao Nang Beach, Railay, Centara Grand, and Krabi Town. Choose Economy Sedan for couples or a Van if you travel with family and luggage.",
      "Tip: Share your flight number and hotel name when booking so the driver can prepare a name sign and plan the best route around evening traffic.",
    ],
  },
  {
    slug: "ao-nang-railay-beach-transfer",
    title: "Ao Nang & Railay Beach Transfer Tips",
    excerpt:
      "How to move between Ao Nang, Railay, and nearby resorts with private cars, piers, and the right vehicle for beach bags.",
    category: "Beach",
    coverImage: "/images/article-ao-nang-railay.png",
    publishedAt: "2026-05-28",
    readMinutes: 4,
    content: [
      "Ao Nang is the hub for many Krabi beach stays, while Railay is reached via short pier connections. Planning your transfer in advance keeps the day simple.",
      "From the airport or Krabi Town, book a private drop-off to Ao Nang Beach or your hotel. For Railay, we can take you to the pier and help time your boat connection.",
      "If you carry snorkel gear or large bags, an SUV or Standard Van gives more space than a sedan. Round-trip bookings also save time on checkout day.",
      "Evening returns from the beach can get busy — reserve your pickup time early, especially on weekends and public holidays.",
    ],
  },
  {
    slug: "pier-transfer-to-phi-phi",
    title: "Pier Transfer to Phi Phi: What Travelers Should Know",
    excerpt:
      "A practical checklist for hotel-to-pier transfers, ferry timing, and luggage tips before heading to Phi Phi.",
    category: "Pier",
    coverImage: "/images/article-pier-phi-phi.png",
    publishedAt: "2026-04-20",
    readMinutes: 4,
    content: [
      "Island days start on land. A reliable pier transfer from your hotel or the airport means you reach Ao Nang Pier or other departure points without rushing.",
      "Build in buffer time for check-in and boarding. We recommend arriving at the pier at least 45–60 minutes before ferry departure during peak season.",
      "Private vans are ideal for groups sharing the same ferry. Families can request child seats free of charge when booking.",
      "After your island trip, book a return pier pickup so a driver is ready when the boat docks — especially useful if you arrive after dark.",
    ],
  },
  {
    slug: "krabi-to-phuket-inter-province",
    title: "Krabi to Phuket Inter-Province Transfer",
    excerpt:
      "Compare comfort and timing for the Krabi–Phuket corridor, vehicle options, and when a private transfer beats shared vans.",
    category: "Inter Province",
    coverImage: "/images/article-inter-province.png",
    publishedAt: "2026-03-08",
    readMinutes: 6,
    content: [
      "The Krabi–Phuket route is one of the most requested inter-province transfers in Southern Thailand. Private cars give door-to-door timing without multiple stops.",
      "Typical journeys connect KBV or Krabi Town with Phuket Airport or Patong. Travel time depends on traffic and whether you start from the airport or town.",
      "For longer rides, VIP Van or Mini Bus options offer more space and comfort. Prices are all-inclusive of tolls and parking unless you add waiting time.",
      "Book round-trip if you fly into one province and out of the other — one reservation covers both legs with a single e-Voucher flow.",
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  return articles.filter((a) => a.slug !== slug).slice(0, limit);
}
