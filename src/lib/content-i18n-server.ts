import { getTranslations } from "next-intl/server";
import type { BoatSchedule, Tour, TravelGuide } from "@/lib/types";

function numbered(t: (key: string) => string, base: string, count: number) {
  return Array.from({ length: count }, (_, index) => t(`${base}.${index + 1}`));
}

export async function getTourCopy() {
  const t = await getTranslations("Tours");

  const category = (raw: string) =>
    t(`categories.${raw}` as "categories.Island");

  const localize = (tour: Tour) => ({
    ...tour,
    title: t(`items.${tour.slug}.title` as "items.phi-phi-islands-day-trip.title"),
    excerpt: t(
      `items.${tour.slug}.excerpt` as "items.phi-phi-islands-day-trip.excerpt"
    ),
    duration: t(
      `items.${tour.slug}.duration` as "items.phi-phi-islands-day-trip.duration"
    ),
    fromArea: t(
      `items.${tour.slug}.fromArea` as "items.phi-phi-islands-day-trip.fromArea"
    ),
    toArea: t(
      `items.${tour.slug}.toArea` as "items.phi-phi-islands-day-trip.toArea"
    ),
    categoryLabel: category(tour.category),
    highlights: numbered(
      (key) => t(key as "items.phi-phi-islands-day-trip.highlights.1"),
      `items.${tour.slug}.highlights`,
      tour.highlights.length
    ),
    includes: numbered(
      (key) => t(key as "items.phi-phi-islands-day-trip.includes.1"),
      `items.${tour.slug}.includes`,
      tour.includes.length
    ),
    content: numbered(
      (key) => t(key as "items.phi-phi-islands-day-trip.content.1"),
      `items.${tour.slug}.content`,
      tour.content.length
    ),
  });

  return { category, localize };
}

export async function getTravelGuideCopy() {
  const t = await getTranslations("TravelGuides");

  const category = (raw: string) =>
    t(`categories.${raw}` as "categories.Destination");

  const localize = (guide: TravelGuide) => ({
    ...guide,
    title: t(`items.${guide.slug}.title` as "items.ao-nang-base-guide.title"),
    excerpt: t(
      `items.${guide.slug}.excerpt` as "items.ao-nang-base-guide.excerpt"
    ),
    region: t(`items.${guide.slug}.region` as "items.ao-nang-base-guide.region"),
    categoryLabel: category(guide.category),
    tips: numbered(
      (key) => t(key as "items.ao-nang-base-guide.tips.1"),
      `items.${guide.slug}.tips`,
      guide.tips.length
    ),
    content: numbered(
      (key) => t(key as "items.ao-nang-base-guide.content.1"),
      `items.${guide.slug}.content`,
      guide.content.length
    ),
  });

  return { category, localize };
}

export async function getBoatCopy() {
  const t = await getTranslations("Boats");

  const localize = (boat: BoatSchedule) => ({
    ...boat,
    routeLabel: t(
      `items.${boat.id}.routeLabel` as "items.ao-nang-railay-longtail.routeLabel"
    ),
    operator: t(
      `items.${boat.id}.operator` as "items.ao-nang-railay-longtail.operator"
    ),
    notes: t(`items.${boat.id}.notes` as "items.ao-nang-railay-longtail.notes"),
  });

  return { localize };
}
