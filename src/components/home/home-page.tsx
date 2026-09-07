"use client";

import {
  ArrowRight,
  Building2,
  Car,
  Hotel,
  Map,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  Shield,
  Ship,
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

const featureKeys = [
  { icon: MapPin, title: "feature1Title", desc: "feature1Desc" },
  { icon: Car, title: "feature2Title", desc: "feature2Desc" },
  { icon: Shield, title: "feature3Title", desc: "feature3Desc" },
  { icon: Users, title: "feature4Title", desc: "feature4Desc" },
] as const;

export function HomePage() {
  const t = useTranslations("Home");
  const tn = useTranslations("Nav");
  const tc = useTranslations("Common");
  const tFaq = useTranslations("Faq");
  const site = useSiteContact();

  return (
    <>
      <section className="relative overflow-hidden border-b bg-background">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-10 lg:px-8 lg:py-14">
          <div className="lg:sticky lg:top-24">
            <PriceChecker />
          </div>

          <div className="space-y-5 lg:-mt-6">
            <HeroCarSlider />
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-wide text-amber-700 uppercase">
                {t("privateTransfer")}
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {t("startFrom")} <span className="text-gold-gradient">฿400</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t("heroBody")}{" "}
                <span className="font-semibold text-amber-700">
                  {t("discount")}
                </span>{" "}
                {t("onReturn")}
              </p>
              <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li>• {t("bullet1")}</li>
                <li>• {t("bullet2")}</li>
                <li>• {t("bullet3")}</li>
                <li>• {t("bullet4")}</li>
              </ul>
              <p className="text-sm text-muted-foreground">{t("slogan")}</p>
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
