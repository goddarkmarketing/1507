"use client";

import { PublicImage } from "@/components/shared/public-image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { articles } from "@/lib/data/articles";
import { useArticleCopy } from "@/lib/article-i18n";
import { getDateLocale } from "@/i18n/locales";

export function HomeArticles() {
  const t = useTranslations("Home");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const { localize } = useArticleCopy();
  const items = articles.slice(0, 4).map(localize);

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-3xl font-bold">{t("articlesTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{t("articlesSubtitle")}</p>
          </div>
          <ButtonLink variant="outline" href="/articles">
            {tc("allArticles")}
          </ButtonLink>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {items.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="group block transition-transform hover:-translate-y-0.5"
            >
              <Card className="h-full gap-0 overflow-hidden pt-0 transition-shadow hover:shadow-md">
                <div className="relative aspect-[16/10] bg-muted/40">
                  <PublicImage
                    src={article.coverImage}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-2 left-2 bg-white/95 text-[10px] text-zinc-950 hover:bg-white sm:top-3 sm:left-3 sm:text-xs">
                    {article.categoryLabel}
                  </Badge>
                </div>
                <CardHeader className="space-y-1 px-3 pt-3 sm:px-4 sm:pt-4">
                  <CardTitle className="text-sm leading-snug group-hover:text-amber-700 sm:text-base">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs">
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString(
                        getDateLocale(locale),
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {article.readMinutes} {tc("min")}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 px-3 pb-3 sm:px-4 sm:pb-4">
                  <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 sm:text-sm">
                    {tc("read")} <ArrowRight className="size-3 sm:size-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
