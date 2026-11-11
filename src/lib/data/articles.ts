import type { Article } from "@/lib/types";

export const articles: Article[] = [
  {
    slug: "krabi-airport-to-ao-nang-taxi",
    title: "Krabi Airport to Ao Nang Taxi: Price, Time & How to Book",
    excerpt:
      "A clear guide to the Krabi Airport (KBV) to Ao Nang route: distance, travel time, starting ECO fare, vehicle choice, and how to book a private transfer.",
    category: "Airport",
    coverImage: "/images/article-airport-ao-nang.jpg",
    publishedAt: "2026-11-08",
    readMinutes: 8,
    content: [],
  },
  {
    slug: "krabi-to-koh-lanta-transfer",
    title: "Krabi to Koh Lanta Transfer: Route Time, Zones & Fares",
    excerpt:
      "Plan your Krabi to Koh Lanta private transfer from the airport or Ao Nang—travel time, zone pricing, and booking tips for the right hotel drop-off.",
    category: "Inter Province",
    coverImage: "/images/article-koh-lanta-transfer.jpg",
    publishedAt: "2026-11-06",
    readMinutes: 8,
    content: [],
  },
  {
    slug: "private-car-with-driver-krabi",
    title: "Private Car with Driver in Krabi: When It Makes Sense",
    excerpt:
      "How charter-by-day or by-hour differs from point-to-point taxis in Krabi, who it suits, and how to book with a driver.",
    category: "Beach",
    coverImage: "/images/article-private-driver-krabi.jpg",
    publishedAt: "2026-11-04",
    readMinutes: 7,
    content: [],
  },
  {
    slug: "krabi-airport-night-transfer",
    title: "Krabi Airport Night Transfer: What to Know Before You Land",
    excerpt:
      "Late arrival at KBV? Learn the night surcharge window, advance booking rule, and how to meet your driver after dark.",
    category: "Airport",
    coverImage: "/images/article-airport-night.jpg",
    publishedAt: "2026-11-02",
    readMinutes: 7,
    content: [],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticle(slug);
  const others = articles.filter((a) => a.slug !== slug);
  if (!current) return others.slice(0, limit);
  const same = others.filter((a) => a.category === current.category);
  const rest = others.filter((a) => a.category !== current.category);
  return [...same, ...rest].slice(0, limit);
}
