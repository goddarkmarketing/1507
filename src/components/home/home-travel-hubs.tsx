"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight, BookOpen, Map, Ship } from "lucide-react";
import { useTranslations } from "next-intl";

const hubs = [
  { href: "/tours", titleKey: "tours" as const, descKey: "toursDesc" as const, icon: Map },
  {
    href: "/boat-schedules",
    titleKey: "boatSchedules" as const,
    descKey: "boatsDesc" as const,
    icon: Ship,
  },
  {
    href: "/travel-info",
    titleKey: "travelInfo" as const,
    descKey: "travelInfoDesc" as const,
    icon: BookOpen,
  },
];

export function HomeTravelHubs() {
  const t = useTranslations("Home");
  const tn = useTranslations("Nav");
  const tc = useTranslations("Common");

  return (
    <section className="border-y bg-zinc-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-bold">{t("travelHubsTitle")}</h2>
          <p className="mt-2 text-muted-foreground">{t("travelHubsSubtitle")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {hubs.map((hub) => (
            <Link
              key={hub.href}
              href={hub.href}
              className="group flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <hub.icon className="size-8 text-amber-700" />
              <h3 className="mt-4 text-lg font-semibold group-hover:text-amber-800">
                {tn(hub.titleKey)}
              </h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {t(hub.descKey)}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-700">
                {tc("explore")} <ArrowRight className="size-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
