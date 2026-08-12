import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ToursPageContent } from "@/components/tours/tours-page-content";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function ToursPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Pages");

  return (
    <>
      <PageHeader title={t("tours")} subtitle={t("toursSubtitle")} />
      <ToursPageContent />
    </>
  );
}
