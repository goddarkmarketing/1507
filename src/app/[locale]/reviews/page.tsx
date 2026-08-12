import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { reviews } from "@/lib/data/content";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function ReviewsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Reviews");

  return (
    <>
      <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-12 sm:gap-6 lg:px-8">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <CardTitle className="text-base">{review.name}</CardTitle>
              <CardDescription>
                {t(`items.${review.id}.country` as "items.1.country")} ·{" "}
                {t(`items.${review.id}.route` as "items.1.route")} · {review.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                &ldquo;{t(`items.${review.id}.comment` as "items.1.comment")}&rdquo;
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
