"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  localeCatalog,
  matchesLocaleQuery,
  type AppLocale,
} from "@/i18n/locales";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function LocaleFlag({
  region,
  label,
}: {
  region: string;
  label: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${region}.png`}
      alt=""
      width={20}
      height={14}
      className="h-3.5 w-[21px] shrink-0 rounded-[2px] object-cover ring-1 ring-black/15"
      title={label}
    />
  );
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const current = localeCatalog.find((item) => item.code === locale);

  const options = useMemo(
    () => localeCatalog.filter((item) => matchesLocaleQuery(item, query)),
    [query]
  );

  const selectLocale = (code: AppLocale) => {
    setOpen(false);
    setQuery("");
    if (code === locale) return;
    // Keep query string (e.g. voucher ?n=…) when switching language
    const qs =
      typeof window !== "undefined"
        ? window.location.search.replace(/^\?/, "")
        : "";
    const href = qs ? `${pathname}?${qs}` : pathname;
    router.replace(href, { locale: code });
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
    >
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            aria-label={t("label")}
            className={cn(
              "h-8 min-w-[7.5rem] justify-between gap-1.5 border-border/80 bg-background px-2 text-xs font-semibold shadow-none dark:bg-background",
              className
            )}
          />
        }
      >
        <span className="flex min-w-0 items-center gap-1.5">
          {current ? (
            <LocaleFlag region={current.region} label={current.label} />
          ) : null}
          <span className="truncate">{current?.label ?? locale}</span>
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-64 gap-2 p-2"
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search")}
          className="h-8"
          autoComplete="off"
        />
        <div className="max-h-64 overflow-y-auto">
          {options.length ? (
            options.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => selectLocale(item.code)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-accent",
                  item.code === locale && "bg-accent"
                )}
              >
                <LocaleFlag region={item.region} label={item.label} />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="text-[11px] text-muted-foreground">
                  {item.english}
                </span>
              </button>
            ))
          ) : (
            <p className="px-2 py-3 text-xs text-muted-foreground">
              {t("empty")}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
