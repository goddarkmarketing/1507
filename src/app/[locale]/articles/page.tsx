import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ArticlesPageContent } from "@/components/articles/articles-page-content";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Pages");

  return (
    <>
      <PageHeader title={t("articles")} subtitle={t("articlesSubtitle")} />
      <ArticlesPageContent />
    </>
  );
}
