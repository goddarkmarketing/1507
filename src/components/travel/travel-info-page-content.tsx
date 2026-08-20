"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { PublicImage } from "@/components/shared/public-image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Clock, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  travelGuideCategories,
  travelGuides,
} from "@/lib/data/travel-guides";
import { useTravelGuideCopy } from "@/lib/content-i18n";
import { cn } from "@/lib/utils";
import type { TravelGuideCategory } from "@/lib/types";

export function TravelInfoPageContent() {
  const t = useTranslations("Listing");
  const { localize, category: categoryLabel } = useTravelGuideCopy();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<TravelGuideCategory | "All">("All");
  const localized = useMemo(
    () => travelGuides.map(localize),
    [localize]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return localized.filter((guide) => {
      const categoryMatch =
        category === "All" || guide.category === category;
      const textMatch =
        !q ||
        guide.title.toLowerCase().includes(q) ||
        guide.excerpt.toLowerCase().includes(q) ||
        guide.region.toLowerCase().includes(q) ||
        guide.categoryLabel.toLowerCase().includes(q);
      return categoryMatch && textMatch;
    });
  }, [query, category, localized]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchTravel")}
            className="h-9 pl-8"
            aria-label={t("searchTravel")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(["All", ...travelGuideCategories] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                category === item
                  ? "bg-zinc-950 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {item === "All" ? t("all") : categoryLabel(item)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((guide) => (
            <Link
              key={guide.slug}
              href={`/travel-info/${guide.slug}`}
              className="group block transition-transform hover:-translate-y-0.5"
            >
              <Card className="h-full gap-0 overflow-hidden pt-0 transition-shadow hover:shadow-md">
                <div className="relative aspect-[16/10] bg-muted/40">
                  <PublicImage
                    src={guide.coverImage}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <Badge className="absolute top-2 left-2 bg-white/95 text-[10px] text-zinc-950 hover:bg-white sm:text-xs">
                    {guide.categoryLabel}
                  </Badge>
                </div>
                <CardHeader className="space-y-1 px-4 pt-4">
                  <CardTitle className="text-base leading-snug group-hover:text-amber-700 sm:text-lg">
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    <span>{guide.region}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {guide.readMinutes} {t("min")}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 px-4 pb-4">
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {guide.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-700">
                    {t("readGuide")} <ArrowRight className="size-3.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
          {t("emptyTravel")}
        </p>
      )}
    </div>
  );
}
