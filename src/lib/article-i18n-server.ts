import { getTranslations } from "next-intl/server";
import type { Article } from "@/lib/types";

const CONTENT_KEYS = ["p1", "p2", "p3", "p4"] as const;

export async function getArticleCopy() {
  const t = await getTranslations("Articles");

  const category = (raw: string) =>
    t(`categories.${raw}` as "categories.Airport");

  const title = (slug: string) =>
    t(`items.${slug}.title` as "items.krabi-airport-transfer-guide.title");

  const excerpt = (slug: string) =>
    t(`items.${slug}.excerpt` as "items.krabi-airport-transfer-guide.excerpt");

  const paragraphs = (slug: string) =>
    CONTENT_KEYS.map((key) =>
      t(
        `items.${slug}.${key}` as "items.krabi-airport-transfer-guide.p1"
      )
    );

  const localize = (article: Article) => ({
    ...article,
    title: title(article.slug),
    excerpt: excerpt(article.slug),
    categoryLabel: category(article.category),
    paragraphs: paragraphs(article.slug),
  });

  return { category, title, excerpt, paragraphs, localize };
}
