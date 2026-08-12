import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqIds, policyIds } from "@/lib/data/content";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Faq");

  const faqMid = Math.ceil(faqIds.length / 2);
  const policyMid = Math.ceil(policyIds.length / 2);
  const faqLeft = faqIds.slice(0, faqMid);
  const faqRight = faqIds.slice(faqMid);
  const policyLeft = policyIds.slice(0, policyMid);
  const policyRight = policyIds.slice(policyMid);

  return (
    <>
      <PageHeader title={t("pageTitle")} subtitle={t("pageSubtitle")} />
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
            {t("sectionTitle")}
          </h2>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <Accordion className="w-full">
              {faqLeft.map((id) => (
                <AccordionItem key={id} value={id}>
                  <AccordionTrigger>{t(`items.${id}.q`)}</AccordionTrigger>
                  <AccordionContent>{t(`items.${id}.a`)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion className="w-full">
              {faqRight.map((id) => (
                <AccordionItem key={id} value={id}>
                  <AccordionTrigger>{t(`items.${id}.q`)}</AccordionTrigger>
                  <AccordionContent>{t(`items.${id}.a`)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
            {t("policiesTitle")}
          </h2>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <Accordion className="w-full">
              {policyLeft.map((id) => (
                <AccordionItem key={id} value={id}>
                  <AccordionTrigger>
                    {t(`policies.${id}.title`)}
                  </AccordionTrigger>
                  <AccordionContent>
                    {t(`policies.${id}.content`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion className="w-full">
              {policyRight.map((id) => (
                <AccordionItem key={id} value={id}>
                  <AccordionTrigger>
                    {t(`policies.${id}.title`)}
                  </AccordionTrigger>
                  <AccordionContent>
                    {t(`policies.${id}.content`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </div>
    </>
  );
}
