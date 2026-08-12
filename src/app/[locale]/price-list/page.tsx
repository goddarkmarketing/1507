import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { PriceListContent } from "@/components/price-list/price-list-content";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function PriceListPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Pages");

  return (
    <>
      <PageHeader title={t("priceList")} subtitle={t("priceListSubtitle")} />
      <PriceListContent />
    </>
  );
}
