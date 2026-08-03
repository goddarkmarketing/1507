"use client";

import Link from "next/link";
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
import { QRCodeSVG } from "qrcode.react";
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
import { siteConfig } from "@/lib/site-config";
import { faqItems } from "@/lib/data/content";

const services = [
  { href: "/airport-transfer", label: "Airport Transfer", icon: Plane },
  { href: "/hotel-transfer", label: "Hotel Transfer", icon: Hotel },
  { href: "/pier-transfer", label: "Pier Transfer", icon: Ship },
  { href: "/beach-transfer", label: "Beach Transfer", icon: Waves },
  { href: "/city-transfer", label: "City Transfer", icon: Building2 },
  { href: "/attraction-transfer", label: "Attraction Transfer", icon: Map },
];

const features = [
  {
    icon: MapPin,
    title: "Complete Route Network",
    desc: "Every airport, pier, hotel, beach & attraction connected across Southern Thailand.",
  },
  {
    icon: Car,
    title: "Real Fleet Photos",
    desc: "7 vehicle classes from Economy Sedan to Mini Bus with full specifications.",
  },
  {
    icon: Shield,
    title: "Transparent Pricing",
    desc: "See exact prices before you book — no hidden fees, tolls included.",
  },
  {
    icon: Users,
    title: "One Booking, All Trips",
    desc: "One-way, round-trip, multi-route, multi-day & charter in a single reservation.",
  },
];

export function HomePage() {
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
                Private Transfer Service
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                START <span className="text-gold-gradient">฿968</span>
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Private transfer from Krabi Airport to hotels, beaches, piers
                and nearby provinces. Special promotion if you book round trip —{" "}
                <span className="font-semibold text-amber-700">
                  Discount 5%
                </span>{" "}
                on return trips.
              </p>
              <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <li>• Instant price estimate</li>
                <li>• All-inclusive (tolls & parking)</li>
                <li>• Professional drivers</li>
                <li>• e-Voucher with QR code</li>
              </ul>
              <p className="text-sm text-muted-foreground">{siteConfig.sloganEn}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-zinc-950">Transfer Services</h2>
            <p className="mt-2 text-zinc-600">
              Professional door-to-door service across Southern Thailand
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {services.map((service) => (
              <Link key={service.href} href={service.href}>
                <Card className="h-full border-0 bg-white shadow-sm ring-1 ring-zinc-200/80 transition-all hover:shadow-md hover:ring-zinc-300">
                  <CardHeader>
                    <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 ring-1 ring-zinc-200">
                      <service.icon className="size-5" />
                    </div>
                    <CardTitle className="text-lg text-zinc-950">
                      {service.label}
                    </CardTitle>
                    <CardDescription className="text-zinc-600">
                      Reliable transfers with instant e-Voucher
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b bg-gold-gradient">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:flex-row lg:items-center lg:gap-10 lg:px-8">
          <div className="max-w-xl space-y-3 text-left">
            <p className="text-sm font-semibold tracking-[0.2em] text-primary-foreground/80 uppercase">
              {siteConfig.name}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
              Contact Us
            </h2>
            <p className="text-sm text-primary-foreground/85 sm:text-base">
              Book a transfer or ask about a custom route. Call, LINE, or email us anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
            <ButtonLink
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              size="lg"
              className="bg-zinc-950 text-white shadow-md hover:bg-zinc-900 hover:brightness-100"
            >
              <Phone data-icon="inline-start" />
              Call Now
            </ButtonLink>
            <ButtonLink
              href={`https://line.me/ti/p/${encodeURIComponent(siteConfig.line)}`}
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
              className="bg-white text-zinc-950 shadow-md hover:bg-white/90 hover:brightness-100"
            >
              <MessageCircle data-icon="inline-start" />
              Chat on LINE
            </ButtonLink>
            <div className="rounded-xl bg-white p-2 shadow-md">
              <QRCodeSVG
                value={`https://line.me/ti/p/${encodeURIComponent(siteConfig.line)}`}
                size={72}
                level="M"
                bgColor="#ffffff"
                fgColor="#09090b"
                title={`LINE ${siteConfig.line}`}
              />
            </div>
          </div>
        </div>
      </section>

      <ReviewMarquee />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold">Why Krabi Links Taxi?</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 bg-muted/30 shadow-sm">
                <CardHeader>
                  <feature.icon className="size-8 text-primary" />
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <HomeFleet />

      <HomeReviews />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-zinc-50 px-6 py-12 text-center ring-1 ring-zinc-200/80 sm:px-10 sm:py-14">
          <h2 className="text-3xl font-bold">Ready to explore Southern Thailand?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Book your transfer now and get an instant e-Voucher with QR code.
          </p>
          <ButtonLink size="lg" className="mt-6" href="/booking">
            Start Booking <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </section>

      <HomeArticles />

      <HomeTravelHubs />

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <h2 className="text-3xl font-bold">FAQ</h2>
              <p className="mt-2 text-muted-foreground">
                Quick answers before you book
              </p>
            </div>
            <ButtonLink variant="outline" href="/faq">
              All FAQ
            </ButtonLink>
          </div>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
            <Accordion className="w-full">
              {faqItems.slice(0, 4).map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Accordion className="w-full">
              {faqItems.slice(4, 8).map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
