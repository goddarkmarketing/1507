"use client";

import {
  ArrowRight,
  CarFront,
  Check,
  Clock,
  CreditCard,
  Luggage,
  MapPinned,
  MapPin,
  Route,
  ShieldCheck,
  Sparkles,
  Star,
  UserRoundCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { PriceChecker } from "@/components/home/price-checker";
import { PublicImage } from "@/components/shared/public-image";
import { VehicleCard } from "@/components/shared/vehicle-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button-link";
import { Link } from "@/i18n/navigation";
import { reviews } from "@/lib/data/content";
import { getLocation } from "@/lib/data/locations";
import { calculatePrice } from "@/lib/data/pricing";
import { getVehicle } from "@/lib/data/vehicles";
import { useLocationName } from "@/lib/i18n-labels";
import {
  navItems,
  transferPages,
  type TransferPageKey,
} from "@/lib/site-config";
import type { VehicleCode } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TransferPageTemplateProps {
  pageKey: TransferPageKey;
}

const STEPS = [
  { title: "step1Title", body: "step1Body", icon: MapPinned },
  { title: "step2Title", body: "step2Body", icon: CreditCard },
  { title: "step3Title", body: "step3Body", icon: CarFront },
] as const;

const BENEFITS = [
  { key: "benefit1", icon: ShieldCheck },
  { key: "benefit2", icon: UserRoundCheck },
  { key: "benefit3", icon: Luggage },
] as const;
const FAQ_IDS = ["1", "2", "3", "4", "5", "6"] as const;

export function TransferPageTemplate({ pageKey }: TransferPageTemplateProps) {
  const t = useTranslations("Transfer");
  const tp = useTranslations("TransferPages");
  const tn = useTranslations("Nav");
  const tr = useTranslations("Reviews");
  const tc = useTranslations("Common");
  const locName = useLocationName();
  const config = transferPages[pageKey];
  const title = tp(`${pageKey}.title`);
  const categoryLabel = t(
    `categories.${config.category}` as "categories.airport"
  );

  const featuredRoutes = config.featuredRoutes
    .map(([fromId, toId]) => {
      const route = calculatePrice(fromId, toId, "ECO");
      if (!route) return null;
      const from = getLocation(fromId);
      const to = getLocation(toId);
      if (!from || !to) return null;
      return { from, to, ...route };
    })
    .filter((route): route is NonNullable<typeof route> => route !== null);

  const pageVehicles = config.vehicleCodes
    .map((code) => getVehicle(code as VehicleCode))
    .filter((v): v is NonNullable<typeof v> => Boolean(v));

  const short = (loc: (typeof featuredRoutes)[number]["from"]) =>
    locName(loc).split("(")[0].trim();

  const siblings = navItems.filter(
    (item) => item.group === "transfers" && item.href !== `/${pageKey}`
  );

  const pageReviews = config.reviewIds
    .map((id) => reviews.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const defaultFrom = config.featuredRoutes[0]?.[0] ?? "kbv-airport";
  const defaultTo = config.featuredRoutes[0]?.[1] ?? "ao-nang-beach";

  const bookHref = (fromId: string, toId: string) =>
    `/booking?from=${fromId}&to=${toId}&type=one-way`;

  return (
    <div className="pb-16">
      {/* Intro + price checker */}
      <section className="border-b bg-background">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:items-start lg:gap-10 lg:px-8 lg:py-14">
          <div className="space-y-5">
            <p className="text-sm font-medium tracking-wide text-amber-700 uppercase">
              {categoryLabel}
            </p>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {tp(`${pageKey}.intro`)}
            </p>
            <div className="rounded-xl border border-amber-200/70 bg-amber-50/60 px-4 py-3 text-sm text-amber-950/90">
              <span className="font-semibold">{t("tipLabel")}: </span>
              {tp(`${pageKey}.tip`)}
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted/40 sm:aspect-[5/3]">
              <PublicImage
                src={config.coverImage}
                alt=""
                fill
                priority
                unoptimized
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
            <ButtonLink href="/price-list" variant="outline" className="w-fit">
              {t("viewPrices")} <ArrowRight className="size-3.5" />
            </ButtonLink>
          </div>

          <div className="lg:sticky lg:top-24">
            <PriceChecker
              compact
              defaultFrom={defaultFrom}
              defaultTo={defaultTo}
              vehicleCodes={config.vehicleCodes}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b bg-zinc-50/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("howTitle")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("howSubtitle")}</p>
          </div>

          <ol className="relative mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
            {/* Connector line (desktop) */}
            <div
              className="pointer-events-none absolute top-[2.75rem] right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-amber-300/80 to-transparent sm:block"
              aria-hidden
            />

            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title}>
                  <article
                    className={cn(
                      "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-5",
                      "ring-1 ring-zinc-200/90 transition-all duration-300",
                      "hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 hover:ring-amber-200/80",
                      "sm:p-6"
                    )}
                  >
                    <span
                      className="pointer-events-none absolute -top-3 -right-1 text-7xl font-bold leading-none text-zinc-100 select-none transition-colors group-hover:text-amber-50"
                      aria-hidden
                    >
                      {index + 1}
                    </span>

                    <div className="relative flex items-center gap-3">
                      <span className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-800 ring-1 ring-amber-100 transition-colors group-hover:bg-gold-gradient group-hover:text-primary-foreground group-hover:ring-transparent">
                        <Icon className="size-5" strokeWidth={2} />
                      </span>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-zinc-600 uppercase">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="relative mt-4 text-base font-semibold text-zinc-950 sm:text-lg">
                      {t(step.title)}
                    </h3>
                    <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t(step.body)}
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Popular routes */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-6 max-w-2xl sm:mb-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("popularRoutes")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              {t("popularRoutesHint")}
            </p>
          </div>

          <ul className="divide-y rounded-2xl border lg:hidden">
            {featuredRoutes.map((route) => (
              <li
                key={`m-${route.fromId}-${route.toId}`}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
              >
                <div className="min-w-0 space-y-1.5">
                  <p className="font-medium leading-snug">
                    {short(route.from)}
                    <span className="mx-1.5 text-muted-foreground">→</span>
                    {short(route.to)}
                  </p>
                  <p className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Route className="size-3.5" />
                      {t("km", { n: route.distanceKm })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {t("approxMin", { n: route.durationMin })}
                    </span>
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:shrink-0 sm:flex-col sm:items-end sm:justify-center">
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-bold tabular-nums">
                      ฿{route.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {t("fromEco")}
                    </p>
                  </div>
                  <ButtonLink
                    size="sm"
                    href={bookHref(route.fromId, route.toId)}
                  >
                    {t("book")}
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-hidden rounded-2xl border lg:block">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-5 py-3.5 font-medium">{t("route")}</th>
                  <th className="px-5 py-3.5 font-medium">{t("distance")}</th>
                  <th className="px-5 py-3.5 font-medium">{t("duration")}</th>
                  <th className="px-5 py-3.5 font-medium">{t("fromPrice")}</th>
                  <th className="px-5 py-3.5 text-right font-medium" />
                </tr>
              </thead>
              <tbody>
                {featuredRoutes.map((route) => (
                  <tr
                    key={`d-${route.fromId}-${route.toId}`}
                    className="border-t transition-colors hover:bg-muted/30"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-3.5 shrink-0 text-amber-700" />
                        <span>
                          {short(route.from)} → {short(route.to)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground tabular-nums">
                      {t("km", { n: route.distanceKm })}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground tabular-nums">
                      {t("approxMin", { n: route.durationMin })}
                    </td>
                    <td className="px-5 py-4 font-semibold tabular-nums">
                      ฿{route.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ButtonLink
                        variant="ghost"
                        size="sm"
                        href={bookHref(route.fromId, route.toId)}
                      >
                        {t("bookRoute")}{" "}
                        <ArrowRight className="size-3.5" />
                      </ButtonLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Included */}
      <section className="border-y bg-zinc-50/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-amber-700 uppercase">
              <Sparkles className="size-3.5" />
              {categoryLabel}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              {t("includedTitle")}
            </h2>
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
            {BENEFITS.map(({ key, icon: Icon }, index) => (
              <li key={key}>
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-5 sm:p-6",
                    "ring-1 ring-zinc-200/90 transition-all duration-300",
                    "hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10 hover:ring-amber-200/80"
                  )}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-800 ring-1 ring-amber-100 transition-colors group-hover:bg-gold-gradient group-hover:text-primary-foreground group-hover:ring-transparent">
                      <Icon className="size-5" strokeWidth={2} />
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-zinc-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-zinc-800 sm:text-[15px]">
                    {tp(`${pageKey}.${key}`)}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
                    <Check className="size-3.5" strokeWidth={2.5} />
                    {t("includedBadge")}
                  </span>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Vehicles */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t("recommended")}
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                {t("recommendedBody")}
              </p>
            </div>
            <ButtonLink href="/fleet" variant="outline" className="w-fit">
              {tn("fleet")} <ArrowRight className="size-3.5" />
            </ButtonLink>
          </div>
          <div className="grid grid-cols-2 gap-3 overflow-visible sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {pageVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.code} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="border-t bg-zinc-50/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {t("reviewsTitle")}
            </h2>
            <ButtonLink href="/reviews" variant="outline" className="w-fit">
              {t("allReviews")} <ArrowRight className="size-3.5" />
            </ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
            {pageReviews.map((review) => (
              <blockquote
                key={review.id}
                className="flex h-full flex-col rounded-2xl border bg-white px-4 py-5 sm:px-5"
              >
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-700">
                  &ldquo;
                  {tr(
                    `items.${review.id}.comment` as "items.1.comment"
                  )}
                  &rdquo;
                </p>
                <footer className="mt-4 text-xs text-muted-foreground">
                  <span className="font-medium text-zinc-900">
                    {review.name}
                  </span>
                  <span className="mx-1.5">·</span>
                  {tr(`items.${review.id}.country` as "items.1.country")}
                  <p className="mt-1">
                    {tr(`items.${review.id}.route` as "items.1.route")}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {t("faqTitle")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                {t("faqSubtitle")}
              </p>
            </div>
            <ButtonLink href="/faq" variant="outline" className="w-fit">
              {t("allFaq")} <ArrowRight className="size-3.5" />
            </ButtonLink>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <Accordion className="w-full">
              {FAQ_IDS.slice(0, 3).map((id) => (
                <AccordionItem key={id} value={`${pageKey}-faq-${id}`}>
                  <AccordionTrigger>
                    {tp(`${pageKey}.faq.${id}.q`)}
                  </AccordionTrigger>
                  <AccordionContent>
                    {tp(`${pageKey}.faq.${id}.a`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion className="w-full">
              {FAQ_IDS.slice(3, 6).map((id) => (
                <AccordionItem key={id} value={`${pageKey}-faq-${id}`}>
                  <AccordionTrigger>
                    {tp(`${pageKey}.faq.${id}.q`)}
                  </AccordionTrigger>
                  <AccordionContent>
                    {tp(`${pageKey}.faq.${id}.a`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Sibling services */}
      <section className="border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-lg font-semibold sm:text-xl">
            {t("otherServices")}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {siblings.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg border bg-zinc-50 px-3 py-2 text-sm text-zinc-800 transition-colors hover:border-zinc-300 hover:bg-white hover:text-zinc-950"
              >
                {tn(item.labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gold-gradient px-6 py-8 text-primary-foreground shadow-lg shadow-amber-500/25 sm:px-10 sm:py-10">
          <h2 className="text-2xl font-bold sm:text-3xl">
            {t("ctaTitle", { title })}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-primary-foreground/85 sm:text-base">
            {t("ctaBody")}
          </p>
          <ButtonLink variant="secondary" className="mt-5" href="/booking">
            {tc("startBooking")} <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
