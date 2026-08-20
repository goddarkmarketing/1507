"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { getLocaleMeta } from "@/i18n/locales";

/** Keeps <html lang> and dir in sync for static export (no middleware). */
export function HtmlLang() {
  const locale = useLocale();

  useEffect(() => {
    const dir = getLocaleMeta(locale)?.dir ?? "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  return null;
}
