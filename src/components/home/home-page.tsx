"use client";

import {
  ArrowRight,
  Building2,
  Car,
  Coins,
  Hotel,
  Map,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Shield,
  ShieldCheck,
  Ship,
  Tag,
  Ticket,
  UserRound,
  Users,
  Waves,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PriceChecker } from "@/components/home/price-checker";
import { HeroCarSlider } from "@/components/home/hero-car-slider";
import { ReviewMarquee } from "@/components/home/review-marquee";
import { HomeFleet } from "@/components/home/home-fleet";
import { HomeArticles } from "@/components/home/home-articles";
import { HomeReviews } from "@/components/home/home-reviews";
import { HomeTravelHubs } from "@/components/home/home-travel-hubs";
import { PublicImage } from "@/components/shared/public-image";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import { useSiteContact } from "@/lib/admin/settings-store";
import { telHref, whatsappHref, OFFICIAL_WHATSAPP_LOCAL, OFFICIAL_WHATSAPP_QR_SRC } from "@/lib/contact-links";
import { assetPath } from "@/lib/utils";
import { faqIds } from "@/lib/data/content";

const serviceDefs = [
  { href: "/airport-transfer", labelKey: "airportTransfer", icon: Plane },
  { href: "/hotel-transfer", labelKey: "hotelTransfer", icon: Hotel },
  { href: "/pier-transfer", labelKey: "pierTransfer", icon: Ship },
  { href: "/beach-transfer", labelKey: "beachTransfer", icon: Waves },
  { href: "/city-transfer", labelKey: "cityTransfer", icon: Building2 },
  { href: "/attraction-transfer", labelKey: "attractionTransfer", icon: Map },
] as const;

const heroPoints = [
  { icon: Tag, key: "bullet1" },
  { icon: Coins, key: "bullet2" },
  { icon: UserRound, key: "bullet3" },
  { icon: Ticket, key: "bullet4" },
] as const;

const featureKeys = [
  { icon: MapPin, title: "feature1Title", desc: "feature1Desc" },
  { icon: Car, title: "feature2Title", desc: "feature2Desc" },
  { icon: Shield, title: "feature3Title", desc: "feature3Desc" },
  { icon: Users, title: "feature4Title", desc: "feature4Desc" },
] as const;

export function HomePage() {
  const t = useTranslations("Home");
  const tPrice = useTranslations("PriceChecker");
  const tn = useTranslations("Nav");
  const tc = useTranslations("Common");
  const tFaq = useTranslations("Faq");
  const site = useSiteContact();

  return (
    <>
      <section className="relative -mt-18 overflow-hidden bg-zinc-100 sm:-mt-20 lg:mt-0 lg:border-b">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 pb-0 pt-0 sm:px-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-10 lg:px-8 lg:py-14">
          <div className="lg:sticky lg:top-24">
            <div className="relative -mx-4 sm:-mx-6 lg:hidden">
              <PublicImage
                src="/images/hero-airport-sunset.png"
                alt=""
                width={1024}
                height={576}
                priority
                className="block h-auto w-full"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 w-[70%] bg-gradient-to-r from-background via-background/75 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-100 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 px-5 pb-14">
                <p className="text-[1.85rem] font-extrabold leading-[1.15] text-zinc-950">
                  {tPrice("title")}
                </p>
                <p className="text-gold-gradient text-[1.85rem] font-extrabold leading-[1.15]">
                  {tPrice("heroLine")}
                </p>
                <p className="mt-2 max-w-[15.5rem] text-[13px] leading-snug text-zinc-600">
                  {tPrice("subtitle")}
                </p>
              </div>
            </div>
            <div className="relative z-10 -mt-12 lg:mt-0">
              <PriceChecker hideIntro />
            </div>
          </div>

          <div className="space-y-5 lg:-mt-6">
            <HeroCarSlider />
            <div className="-mx-4 rounded-t-[1.75rem] rounded-b-none border border-b-0 border-white bg-white p-5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.22)] sm:-mx-6 sm:p-6 lg:mx-0 lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#fff4cc] px-3 py-1.5 text-sm font-semibold text-zinc-950">
                <Car className="size-4 text-amber-500" />
                {t("privateTransfer")}
              </p>
              <h1 className="mt-4 text-[2rem] font-extrabold leading-none tracking-tight text-zinc-950 sm:text-4xl">
                {t("startFrom")}{" "}
                <span className="text-gold-gradient">฿400</span>
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-zinc-800 sm:text-[15px]">
                {t("heroBody")}{" "}
                <span className="font-bold text-red-500">{t("discount")}</span>{" "}
                {t("onReturn")}
              </p>
              <ul className="mt-5 space-y-3.5">
                {heroPoints.map((point) => (
                  <li key={point.key} className="flex items-center gap-3">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#fff6d8] text-amber-500">
                      <point.icon className="size-3.5" />
                    </span>
                    <span className="text-sm font-medium text-zinc-950 sm:text-[15px]">
                      {t(point.key)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-zinc-200 pt-4">
                <p className="flex items-center gap-2 text-sm text-zinc-500">
                  <ShieldCheck className="size-4 shrink-0 text-zinc-400" />
                  {t("slogan")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-zinc-950">{t("servicesTitle")}</h2>
            <p className="mt-2 text-zinc-600">{t("servicesSubtitle")}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {serviceDefs.map((service) => (
              <Link key={service.href} href={service.href}>
                <Card className="h-full border-0 bg-white shadow-sm ring-1 ring-zinc-200/80 transition-all hover:shadow-md hover:ring-zinc-300">
                  <CardHeader>
                    <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 ring-1 ring-zinc-200">
                      <service.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg text-zinc-950">
                      {tn(service.labelKey)}
                    </CardTitle>
                    <CardDescription className="text-zinc-600">
                      {t("serviceCardDesc")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 sm:mt-10">
            <Link
              href="/airport-transfer"
              className="group relative block overflow-hidden rounded-2xl ring-1 ring-zinc-200/80 transition hover:ring-zinc-300 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
            >
              <PublicImage
                src="/banners/airport-transfer-promo.png"
                alt={t("promoAirportAlt")}
                width={1600}
                height={560}
                className="h-auto w-full object-cover object-center transition duration-500 group-hover:scale-[1.01]"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b">
        <PublicImage
          src="/images/home-contact-bg.png"
          alt=""
          fill
          unoptimized
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
          <div className="max-w-xl space-y-3 text-left">
            <p className="text-sm font-semibold tracking-[0.2em] text-white/75 uppercase">
              {siteConfig.name}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {t("contactTitle")}
            </h2>
            <p className="text-sm text-white/85 sm:text-base">
              {t("contactBody")}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
            <ButtonLink
              href={telHref(site.phone)}
              size="lg"
              className="shadow-md"
            >
              <Phone data-icon="inline-start" />
              {tc("callNow")}
            </ButtonLink>
            <ButtonLink
              href={whatsappHref(OFFICIAL_WHATSAPP_LOCAL)}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="bg-white text-zinc-950 shadow-md hover:bg-white/90 hover:brightness-100"
            >
              <MessageCircle data-icon="inline-start" />
              {tc("chatOnWhatsApp")}
            </ButtonLink>
            <ButtonLink
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white shadow-md hover:bg-white/20 hover:text-white"
            >
              {tc("facebook")}
            </ButtonLink>
            <a
              href={whatsappHref(OFFICIAL_WHATSAPP_LOCAL)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white p-2 shadow-md"
              title={`WhatsApp ${OFFICIAL_WHATSAPP_LOCAL}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetPath(OFFICIAL_WHATSAPP_QR_SRC)}
                alt={`WhatsApp ${OFFICIAL_WHATSAPP_LOCAL}`}
                width={72}
                height={72}
                className="size-[72px] object-contain"
              />
            </a>
          </div>
        </div>
      </section>

      <ReviewMarquee />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">{t("whyTitle")}</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {featureKeys.map((feature) => (
              <Card key={feature.title} className="border-0 bg-muted/30 shadow-sm">
                <CardHeader>
                  <feature.icon className="size-8 text-primary" />
                  <CardTitle className="text-base">{t(feature.title)}</CardTitle>
                  <CardDescription>{t(feature.desc)}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <HomeFleet />

      <HomeReviews />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl px-6 py-12 text-center sm:px-10 sm:py-16">
          <PublicImage
            src="/images/home-cta-bg.png"
            alt=""
            fill
            unoptimized
            className="object-cover object-center"
          />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              {t("ctaBody")}
            </p>
            <ButtonLink size="lg" className="mt-6" href="/booking">
              {tc("startBooking")} <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <HomeArticles />

      <HomeTravelHubs />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-3xl font-bold">{t("faqTitle")}</h2>
              <p className="mt-2 text-muted-foreground">{t("faqSubtitle")}</p>
            </div>
            <ButtonLink variant="outline" href="/faq">
              {tc("allFaq")}
            </ButtonLink>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <Accordion className="w-full">
              {faqIds.slice(0, 4).map((id) => (
                <AccordionItem key={id} value={id}>
                  <AccordionTrigger>{tFaq(`items.${id}.q`)}</AccordionTrigger>
                  <AccordionContent>{tFaq(`items.${id}.a`)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion className="w-full">
              {faqIds.slice(4, 8).map((id) => (
                <AccordionItem key={id} value={id}>
                  <AccordionTrigger>{tFaq(`items.${id}.q`)}</AccordionTrigger>
                  <AccordionContent>{tFaq(`items.${id}.a`)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
