import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { TravelInfoPageContent } from "@/components/travel/travel-info-page-content";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function TravelInfoPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Pages");

  return (
    <>
      <PageHeader title={t("travelInfo")} subtitle={t("travelInfoSubtitle")} />
      <TravelInfoPageContent />
    </>
  );
}
