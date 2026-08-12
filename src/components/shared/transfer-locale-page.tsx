import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { TransferPageTemplate } from "@/components/shared/transfer-page-template";
import { routing } from "@/i18n/routing";
import type { TransferPageKey } from "@/lib/site-config";

type Props = {
  pageKey: TransferPageKey;
  params: Promise<{ locale: string }>;
};

export async function TransferLocalePage({ pageKey, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("TransferPages");

  return (
    <>
      <PageHeader
        title={t(`${pageKey}.title`)}
        subtitle={t(`${pageKey}.subtitle`)}
      />
      <TransferPageTemplate pageKey={pageKey} />
    </>
  );
}
