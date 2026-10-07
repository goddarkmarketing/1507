"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { bookingSelectTriggerClass } from "@/lib/booking/form-field-styles";
import { useCatalogStore } from "@/lib/admin/catalog-store";
import { routeSheetName, set1RouteLabel } from "@/lib/data/set1-place-names";
import { getAirportSheetRoutes } from "@/lib/data/transfer-routes";
import { cn } from "@/lib/utils";

const SET1_HUB = "kbv-airport";

export function resolveSet1ToId(from: string, to: string): string {
  const routes = getAirportSheetRoutes();
  const match = routes.find(
    (route) =>
      (route.fromId === from && route.toId === to) ||
      (route.fromId === to && route.toId === from)
  );
  if (match) return match.fromId === SET1_HUB ? match.toId : match.fromId;
  return routes[0]?.toId ?? "krabi-town";
}

function routeMatchesQuery(label: string, query: string) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const hay = label.toLowerCase();
  return words.every((word) => hay.includes(word));
}

export function Set1RouteSelect({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (toId: string) => void;
}) {
  const t = useTranslations("PriceChecker");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const transferRev = useCatalogStore((s) => s.transferImportedAt);
  const routes = useMemo(() => {
    void transferRev;
    return getAirportSheetRoutes();
  }, [transferRev]);

  const labelOf = (toId: string) => {
    const route = routes.find((item) => item.toId === toId);
    if (route) return routeSheetName(route, locale);
    return set1RouteLabel(toId, locale) ?? toId;
  };

  const visible = routes.filter((route) => {
    const custom = routeSheetName(route, locale);
    const en = set1RouteLabel(route.toId, "en") ?? "";
    const th = set1RouteLabel(route.toId, "th") ?? "";
    return (
      routeMatchesQuery(custom, query) ||
      routeMatchesQuery(en, query) ||
      routeMatchesQuery(th, query)
    );
  });

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger
        type="button"
        onPointerDown={(e) => e.preventDefault()}
        className={cn(
          "transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50",
          bookingSelectTriggerClass,
          "h-auto min-h-11 whitespace-normal py-2"
        )}
      >
        <span className="line-clamp-2 text-left leading-snug">
          {labelOf(value)}
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-[var(--anchor-width)] min-w-[min(100vw-2rem,20rem)] p-0"
        initialFocus={false}
      >
        <div className="border-b p-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("routeSearch")}
              className="h-9 pl-8"
              autoComplete="off"
              onKeyDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="max-h-72 overflow-y-auto overscroll-contain p-1">
          {visible.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">
              {t("routeNoResults")}
            </p>
          ) : (
            <ul>
              {visible.map((route) => {
                const selected = route.toId === value;
                return (
                  <li key={route.toId}>
                    <button
                      type="button"
                      onClick={() => {
                        onValueChange(route.toId);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                        selected && "bg-accent/70"
                      )}
                    >
                      <span className="min-w-0 flex-1 leading-snug">
                        {routeSheetName(route, locale)}
                      </span>
                      {selected && (
                        <Check className="size-4 shrink-0 text-primary" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
