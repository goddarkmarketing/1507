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
  articles,
  getArticle,
  getRelatedArticles,
} from "@/lib/data/articles";
import { getArticleCopy } from "@/lib/article-i18n-server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
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
  const { localize } = await getArticleCopy();
  const article = localize(raw);
  const related = getRelatedArticles(article.slug, 3).map(localize);

  const dateLocale =
    locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-GB";

  return (
    <article>
      <section className="border-b bg-zinc-50">
        <div className="mx-auto max-w-7xl px-4 py-10 text-left sm:px-6 lg:px-8">
          <Link
            href="/articles"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            {t("allArticles")}
          </Link>
          <Badge variant="outline">{article.categoryLabel}</Badge>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            {article.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
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
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 70vw"
              priority
            />
          </div>

          <div className="space-y-5 text-base leading-relaxed text-foreground/90">
            {article.paragraphs.map((paragraph, index) => (
              <p key={`${article.slug}-p${index}`}>{paragraph}</p>
            ))}
          </div>

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
                          alt=""
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
