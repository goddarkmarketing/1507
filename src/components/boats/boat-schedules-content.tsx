"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { PublicImage } from "@/components/shared/public-image";
import { ArrowRight, Clock, Ship } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { boatSchedules } from "@/lib/data/boat-schedules";
import { getLocation } from "@/lib/data/locations";
import { useBoatCopy } from "@/lib/content-i18n";
import { useLocationName } from "@/lib/i18n-labels";
import { cn } from "@/lib/utils";
import type { BoatType } from "@/lib/types";

const boatTypeIds = ["all", "ferry", "speedboat", "longtail"] as const;

const boatTypeLabelKey = {
  all: "allBoats",
  ferry: "ferry",
  speedboat: "speedboat",
  longtail: "longtail",
} as const;

export function BoatSchedulesContent() {
  const t = useTranslations("Listing");
  const locName = useLocationName();
  const { localize } = useBoatCopy();
  const [boatType, setBoatType] = useState<BoatType | "all">("all");
  const [routeQuery, setRouteQuery] = useState("all");
  const localized = useMemo(
    () => boatSchedules.map(localize),
    [localize]
  );

  const routes = useMemo(() => {
    return Array.from(new Set(localized.map((s) => s.routeLabel)));
  }, [localized]);

  const filtered = useMemo(() => {
    return localized.filter((s) => {
      const typeMatch = boatType === "all" || s.type === boatType;
      const routeMatch = routeQuery === "all" || s.routeLabel === routeQuery;
      return typeMatch && routeMatch;
    });
  }, [boatType, routeQuery, localized]);

  const pierShort = (pierId: string) => {
    const name = locName(getLocation(pierId));
    return name.split("(")[0].trim() || "pier";
  };

  const typeLabel = (type: BoatType) => t(boatTypeLabelKey[type]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-xl border border-amber-200/80 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        {t("mockBanner")}
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium">{t("boatType")}</p>
          <div className="flex flex-wrap gap-2">
            {boatTypeIds.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setBoatType(id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  boatType === id
                    ? "bg-zinc-950 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {t(boatTypeLabelKey[id])}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">{t("route")}</p>
          <select
            value={routeQuery}
            onChange={(e) => setRouteQuery(e.target.value)}
            className="h-9 w-full min-w-[240px] rounded-lg border bg-background px-3 text-sm lg:w-auto"
            aria-label={t("route")}
          >
            <option value="all">{t("allRoutes")}</option>
            {routes.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto rounded-xl border md:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="w-20 px-4 py-3 font-medium" />
                  <th className="px-4 py-3 font-medium">{t("route")}</th>
                  <th className="px-4 py-3 font-medium">{t("boatType")}</th>
                  <th className="px-4 py-3 font-medium">{t("departures")}</th>
                  <th className="px-4 py-3 font-medium">{t("duration")}</th>
                  <th className="px-4 py-3 font-medium">{t("from")}</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="relative size-14 overflow-hidden rounded-lg bg-muted">
                        <PublicImage
                          src={row.image}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium">{row.routeLabel}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.operator}
                      </p>
                    </td>
                    <td className="px-4 py-4 capitalize">
                      <Badge variant="outline">{typeLabel(row.type)}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {row.departures.map((time) => (
                          <span
                            key={time}
                            className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      ~{row.durationMin} {t("min")}
                    </td>
                    <td className="px-4 py-4 font-semibold">
                      ฿{row.priceFrom.toLocaleString("en-US")}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <ButtonLink
                        size="sm"
                        variant="outline"
                        href={`/booking?to=${row.fromPierId}`}
                      >
                        {t("transferTo", { pier: pierShort(row.fromPierId) })}
                      </ButtonLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="grid gap-3 md:hidden">
            {filtered.map((row) => (
              <Card key={row.id} className="overflow-hidden py-0">
                <div className="flex gap-0">
                  <div className="relative aspect-square w-28 shrink-0 bg-muted sm:w-32">
                    <PublicImage
                      src={row.image}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                  <div className="min-w-0 flex-1 py-3 pr-3 pl-3">
                    <CardHeader className="gap-1 p-0 pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm leading-snug">
                          {row.routeLabel}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className="shrink-0 capitalize text-[10px]"
                        >
                          {typeLabel(row.type)}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        {row.operator}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 p-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3.5" />~{row.durationMin}{" "}
                          {t("min")}
                        </span>
                        <span className="font-semibold text-foreground">
                          {t("from")} ฿{row.priceFrom.toLocaleString("en-US")}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {row.departures.slice(0, 5).map((time) => (
                          <span
                            key={time}
                            className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px]"
                          >
                            {time}
                          </span>
                        ))}
                        {row.departures.length > 5 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{row.departures.length - 5}
                          </span>
                        )}
                      </div>
                      <ButtonLink
                        size="sm"
                        variant="outline"
                        className="w-full"
                        href={`/booking?to=${row.fromPierId}`}
                      >
                        {t("transferTo", { pier: pierShort(row.fromPierId) })}{" "}
                        <ArrowRight className="size-3.5" />
                      </ButtonLink>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          {t("emptyBoats")}
        </p>
      )}

      <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border bg-muted/30 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <Ship className="mt-0.5 size-6 shrink-0 text-primary" />
          <div>
            <h2 className="text-lg font-bold">{t("landTransfer")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("landTransferBody")}
            </p>
          </div>
        </div>
        <ButtonLink href="/pier-transfer">
          {t("pierTransfer")} <ArrowRight className="size-4" />
        </ButtonLink>
      </div>
    </div>
  );
}
