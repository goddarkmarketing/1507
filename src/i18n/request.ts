import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { deepMerge } from "./merge-messages";
import en from "../messages/en.json";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  if (locale === "en") {
    return { locale, messages: en };
  }

  let localized: unknown = {};
  try {
    localized = (await import(`../messages/${locale}.json`)).default;
  } catch {
    localized = {};
  }

  return {
    locale,
    messages: deepMerge(en, localized),
  };
});
