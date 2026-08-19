"use client";

import {
  ArrowLeft,
  Globe,
  Luggage,
  MapPinned,
  Plane,
  UserRoundCheck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { PublicImage } from "@/components/shared/public-image";
import { cn } from "@/lib/utils";

const GATES = [
  {
    key: "domestic",
    door: "15",
    icon: Plane,
    image: "/images/kbv-domestic-meeting-point.png",
    imageAlt: "domesticImageAlt",
  },
  {
    key: "international",
    door: "16",
    icon: Globe,
    image: null,
    imageAlt: null,
  },
] as const;

const STEPS = [
  { n: 1, icon: Luggage, title: "step1Title", body: "step1Body" },
  { n: 2, icon: MapPinned, title: "step2Title", body: "step2Body" },
  { n: 3, icon: ArrowLeft, title: "step3Title", body: "step3Body" },
  { n: 4, icon: UserRoundCheck, title: "step4Title", body: "step4Body" },
] as const;

const FEATURES = ["feature1", "feature2", "feature3", "feature4"] as const;

export function AirportMeetingPoint() {
  const t = useTranslations("MeetingPoint");

  return (
    <section className="border-b bg-zinc-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-amber-400 uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-300 sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {GATES.map((gate) => {
            const Icon = gate.icon;
            return (
              <div
                key={gate.key}
                className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-5 py-5"
              >
                <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-amber-300 uppercase">
                  <Icon className="size-3.5" />
                  {t(`${gate.key}Label`)}
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-amber-400 sm:text-5xl">
                  {t("door", { n: gate.door })}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  {t(`${gate.key}Hint`)}
                </p>
              </div>
            );
          })}
        </div>

        <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <li
                key={step.n}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-gold-gradient text-sm font-bold text-primary-foreground">
                    {step.n}
                  </span>
                  <Icon className="size-4 text-amber-400" />
                </div>
                <h3 className="mt-3 text-sm font-semibold">{t(step.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                  {t(step.body)}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {GATES.map((gate) => (
            <article
              key={`${gate.key}-detail`}
              className="overflow-hidden rounded-2xl ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between gap-3 bg-white/5 px-4 py-3">
                <p className="text-sm font-semibold">
                  {t(`${gate.key}Label`)} · {t("door", { n: gate.door })}
                </p>
                <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                  {t("door", { n: gate.door })}
                </span>
              </div>
              {gate.image ? (
                <PublicImage
                  src={gate.image}
                  alt={t(gate.imageAlt)}
                  width={1600}
                  height={900}
                  className="h-auto w-full"
                />
              ) : (
                <div
                  className={cn(
                    "flex min-h-[220px] flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,rgba(245,197,66,0.16),transparent_55%)] px-6 py-10 text-center"
                  )}
                >
                  <Globe className="size-8 text-amber-400" />
                  <p className="text-5xl font-bold text-amber-400">
                    {t("door", { n: gate.door })}
                  </p>
                  <p className="max-w-sm text-sm leading-relaxed text-zinc-300">
                    {t("internationalHint")}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        <ul className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-zinc-300">
          {FEATURES.map((key) => (
            <li
              key={key}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
            >
              {t(key)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
