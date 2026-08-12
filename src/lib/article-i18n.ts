"use client";

import { useTranslations } from "next-intl";
import type { Article } from "@/lib/types";

const CONTENT_KEYS = ["p1", "p2", "p3", "p4"] as const;

/** Localized article fields from Articles.* messages */
export function useArticleCopy() {
  const t = useTranslations("Articles");

  const category = (raw: string) => {
    try {
      return t(`categories.${raw}` as "categories.Airport");
    } catch {
      return raw;
    }
  };

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
