import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "th", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];

export const localeLabels: Record<AppLocale, string> = {
  en: "English",
  th: "ไทย",
  zh: "中文",
};
