import { hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { BookingForm } from "@/components/booking/booking-form";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BookingPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Booking");
  const tc = await getTranslations("Common");

  return (
    <>
      <PageHeader compact title={t("title")} subtitle={t("subtitle")} />
      <Suspense
        fallback={<div className="p-8 text-center">{tc("loading")}</div>}
      >
        <BookingForm />
      </Suspense>
    </>
  );
}
