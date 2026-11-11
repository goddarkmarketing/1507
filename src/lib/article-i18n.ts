"use client";

import { useLocale, useTranslations } from "next-intl";
import type { Article } from "@/lib/types";
import { getArticleBody } from "@/lib/data/article-bodies";

const CONTENT_KEYS = ["p1", "p2", "p3", "p4"] as const;

/** Localized article fields from Articles.* messages or rich SEO bodies. */
export function useArticleCopy() {
  const t = useTranslations("Articles");
  const locale = useLocale();

  const category = (raw: string) => {
    const key = `categories.${raw}`;
    if (t.has(key as "categories.Airport")) {
      return t(key as "categories.Airport");
    }
    return raw;
  };

  const title = (slug: string) => {
    const body = getArticleBody(slug, locale);
    if (body) return body.title;
    return t(`items.${slug}.title` as "items.krabi-airport-transfer-guide.title");
  };

  const excerpt = (slug: string) => {
    const body = getArticleBody(slug, locale);
    if (body) return body.excerpt;
    return t(
      `items.${slug}.excerpt` as "items.krabi-airport-transfer-guide.excerpt"
    );
  };

  const paragraphs = (slug: string) => {
    const body = getArticleBody(slug, locale);
    if (body) {
      return body.blocks
        .filter((b): b is { type: "p"; text: string } => b.type === "p")
        .map((b) => b.text);
    }
    return CONTENT_KEYS.map((key) =>
      t(`items.${slug}.${key}` as "items.krabi-airport-transfer-guide.p1")
    );
  };

  const localize = (article: Article) => {
    const body = getArticleBody(article.slug, locale);
    if (body) {
      return {
        ...article,
        title: body.title,
        excerpt: body.excerpt,
        categoryLabel: category(article.category),
        paragraphs: body.blocks
          .filter((b): b is { type: "p"; text: string } => b.type === "p")
          .map((b) => b.text),
        blocks: body.blocks,
        faqs: body.faqs,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        coverImageAlt: body.coverAlt,
      };
    }
    return {
      ...article,
      title: title(article.slug),
      excerpt: excerpt(article.slug),
      categoryLabel: category(article.category),
      paragraphs: paragraphs(article.slug),
      blocks: undefined as undefined,
      faqs: undefined as undefined,
      metaTitle: undefined as undefined,
      metaDescription: undefined as undefined,
      coverImageAlt: undefined as undefined,
    };
  };

  return { category, title, excerpt, paragraphs, localize };
}
