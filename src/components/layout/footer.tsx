"use client";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { SiteLogo } from "@/components/shared/site-logo";
import { Link } from "@/i18n/navigation";
import { siteConfig, navItems } from "@/lib/site-config";
import { useSiteContact } from "@/lib/admin/settings-store";
import { telHref, whatsappHref } from "@/lib/contact-links";

export function Footer() {
  const t = useTranslations("Nav");
  const tf = useTranslations("Footer");
  const ts = useTranslations("Site");
  const site = useSiteContact();
  const travelLinks = navItems.filter((n) => n.group === "travel");
  const companyLinks = navItems.filter(
    (n) =>
      !n.group && n.href !== "/" && !["/fleet", "/price-list"].includes(n.href)
  );

  return (
    <footer className="mt-auto border-t bg-muted/30 pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <Link href="/" aria-label={siteConfig.name}>
            <SiteLogo height={72} />
          </Link>
          <p className="text-sm text-muted-foreground">{ts("slogan")}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{tf("services")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {navItems
              .filter((n) => n.group === "transfers")
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{tf("travel")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {travelLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-foreground">
                  {t(item.labelKey)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/articles" className="hover:text-foreground">
                {t("articles")}
              </Link>
            </li>
            <li>
              <Link href="/fleet" className="hover:text-foreground">
                {t("fleet")}
              </Link>
            </li>
            <li>
              <Link href="/price-list" className="hover:text-foreground">
                {t("priceList")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{tf("contact")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {companyLinks
              .filter((n) => n.href !== "/articles")
              .slice(0, 3)
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/booking" className="hover:text-foreground">
                {t("booking")}
              </Link>
            </li>
            <li className="flex items-center gap-2 pt-2">
              <Phone className="size-4 shrink-0" />
              <a href={telHref(site.phone)} className="hover:text-foreground">
                {site.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <a
                href={`mailto:${site.email}`}
                className="hover:text-foreground"
              >
                {site.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4 shrink-0" />
              <a
                href={whatsappHref(site.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                WhatsApp {site.whatsapp}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {site.address}
            </li>
          </ul>
        </div>
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. {tf("rights")}
        </p>
        <p>{siteConfig.domain}</p>
      </div>
    </footer>
  );
}
