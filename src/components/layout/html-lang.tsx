"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

/** Keeps <html lang> in sync for static export (no middleware). */
export function HtmlLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
