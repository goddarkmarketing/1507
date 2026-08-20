import { defineRouting } from "next-intl/routing";
import { localeCodes, localeLabels, type AppLocale } from "@/i18n/locales";

export const routing = defineRouting({
  locales: localeCodes,
  defaultLocale: "en",
  localePrefix: "always",
});

export type { AppLocale };
export { localeLabels };
