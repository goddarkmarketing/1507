import type { Metadata } from "next";
import { PublicImage } from "@/components/shared/public-image";
import { Link } from "@/i18n/navigation";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArticleBlocks,
  ArticleFaqSection,
} from "@/components/articles/article-body";
import {
  articles,
  getArticle,
  getRelatedArticles,
} from "@/lib/data/articles";
import { getArticleBody } from "@/lib/data/article-bodies";
import { getArticleCopy } from "@/lib/article-i18n-server";
import { routing } from "@/i18n/routing";
import { getDateLocale } from "@/i18n/locales";
import { siteConfig } from "@/lib/site-config";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const body = getArticleBody(slug, locale);
  const title = body?.metaTitle ?? body?.title ?? article.title;
  const description =
    body?.metaDescription ?? body?.excerpt ?? article.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: article.coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const raw = getArticle(slug);
  if (!raw) notFound();

  const t = await getTranslations("Listing");
  const tHome = await getTranslations("Home");
  const { localize } = await getArticleCopy();
  const article = localize(raw);
  const related = getRelatedArticles(article.slug, 3).map(localize);

  const dateLocale = getDateLocale(locale);
  const coverAlt = article.coverImageAlt || article.title;
  const faqs = article.faqs ?? [];

  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"),
            },
          })),
        }
      : null;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription ?? article.excerpt,
    datePublished: article.publishedAt,
    image: `https://${siteConfig.domain}${article.coverImage}`,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}

      <section className="border-b bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-10 text-left sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Link
              href="/articles"
              className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              {t("allArticles")}
            </Link>
            <Badge variant="outline">{article.categoryLabel}</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {article.excerpt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>
              {new Date(article.publishedAt).toLocaleDateString(dateLocale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {article.readMinutes} {t("minRead")}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 text-left sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 lg:px-8">
        <div className="min-w-0">
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted/40">
            <PublicImage
              src={article.coverImage}
              alt={coverAlt}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 70vw"
              priority
            />
          </div>

          {article.blocks && article.blocks.length > 0 ? (
            <ArticleBlocks blocks={article.blocks} />
          ) : (
            <div className="space-y-5 text-base leading-relaxed text-foreground/90">
              {article.paragraphs.map((paragraph, index) => (
                <p key={`${article.slug}-p${index}`}>{paragraph}</p>
              ))}
            </div>
          )}

          {faqs.length > 0 ? (
            <ArticleFaqSection faqs={faqs} title={tHome("faqTitle")} />
          ) : null}

          <div className="mt-10 rounded-2xl bg-gold-gradient px-6 py-8 text-primary-foreground shadow-lg shadow-amber-500/20">
            <h2 className="text-xl font-bold">{t("bookRoute")}</h2>
            <p className="mt-2 text-sm text-primary-foreground/85">
              {t("bookRouteBody")}
            </p>
            <ButtonLink variant="secondary" className="mt-4" href="/booking">
              {t("startBooking")} <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>

        {related.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="mb-4 text-lg font-bold">{t("relatedArticles")}</h2>
            <div className="flex flex-col gap-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/articles/${item.slug}`}
                  className="group block"
                >
                  <Card className="gap-0 overflow-hidden py-0 transition-shadow hover:shadow-md">
                    <div className="flex min-h-[108px]">
                      <div className="relative w-28 shrink-0 bg-muted/40 sm:w-32">
                        <PublicImage
                          src={item.coverImage}
                          alt={item.coverImageAlt || item.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="128px"
                        />
                      </div>
                      <CardHeader className="min-w-0 flex-1 gap-1.5 p-3 sm:p-4">
                        <Badge variant="outline" className="w-fit text-[10px]">
                          {item.categoryLabel}
                        </Badge>
                        <CardTitle className="line-clamp-2 text-sm leading-snug group-hover:text-amber-700">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-xs">
                          {item.excerpt}
                        </CardDescription>
                      </CardHeader>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
