"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeLabels, type AppLocale } from "@/i18n/routing";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function LocaleFlag({ locale }: { locale: AppLocale }) {
  return (
    <span
      className="relative inline-flex h-3.5 w-[21px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/15"
      aria-hidden
    >
      {locale === "th" ? (
        <svg viewBox="0 0 6 4" className="size-full">
          <rect width="6" height="4" fill="#A51931" />
          <rect y="0.67" width="6" height="2.66" fill="#F4F5F8" />
          <rect y="1.33" width="6" height="1.34" fill="#2D2A4A" />
        </svg>
      ) : locale === "zh" ? (
        <svg viewBox="0 0 30 20" className="size-full">
          <rect width="30" height="20" fill="#DE2910" />
          <polygon
            fill="#FFDE00"
            points="5,2.2 6.1,5.5 9.6,5.5 6.75,7.55 7.85,10.9 5,8.8 2.15,10.9 3.25,7.55 0.4,5.5 3.9,5.5"
          />
          <polygon
            fill="#FFDE00"
            points="10.2,2.4 10.7,3.9 12.2,3.9 11,4.8 11.45,6.3 10.2,5.4 8.95,6.3 9.4,4.8 8.2,3.9 9.7,3.9"
          />
          <polygon
            fill="#FFDE00"
            points="12.4,4.6 12.75,6.05 14.25,6.05 13.05,6.95 13.4,8.4 12.4,7.5 11.4,8.4 11.75,6.95 10.55,6.05 12.05,6.05"
          />
          <polygon
            fill="#FFDE00"
            points="12.4,8.2 12.75,9.65 14.25,9.65 13.05,10.55 13.4,12 12.4,11.1 11.4,12 11.75,10.55 10.55,9.65 12.05,9.65"
          />
          <polygon
            fill="#FFDE00"
            points="10.2,10.4 10.7,11.85 12.2,11.85 11,12.75 11.45,14.2 10.2,13.3 8.95,14.2 9.4,12.75 8.2,11.85 9.7,11.85"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 60 30" className="size-full">
          <rect width="60" height="30" fill="#012169" />
          <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" />
          <path d="M0,0 60,30 M60,0 0,30" stroke="#C8102E" strokeWidth="2" />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      )}
    </span>
  );
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Select
      value={locale}
      onValueChange={(code) => {
        if (!code || code === locale) return;
        router.replace(pathname, { locale: code as AppLocale });
      }}
    >
      <SelectTrigger
        size="sm"
        aria-label={t("label")}
        className={cn(
          "h-8 min-w-[7.25rem] gap-1.5 border-border/80 bg-background px-2 text-xs font-semibold shadow-none dark:bg-background",
          className
        )}
      >
        <SelectValue>
          <span className="flex items-center gap-1.5">
            <LocaleFlag locale={locale} />
            <span>{t(locale)}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        align="end"
        alignItemWithTrigger={false}
        className="min-w-[11rem]"
      >
        {routing.locales.map((code) => (
          <SelectItem key={code} value={code}>
            <LocaleFlag locale={code} />
            <span>{localeLabels[code]}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
