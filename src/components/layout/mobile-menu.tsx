"use client";

import { useState, type ReactNode } from "react";
import { Car, House, Menu, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SiteLogo } from "@/components/shared/site-logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Link, usePathname } from "@/i18n/navigation";
import { navIcons } from "@/lib/nav-icons";
import { navItems, siteConfig, type NavItem } from "@/lib/site-config";
import { useSiteContact } from "@/lib/admin/settings-store";
import { telHref } from "@/lib/contact-links";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MenuLink({
  href,
  label,
  onNavigate,
}: {
  href: NavItem["href"];
  label: string;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  const Icon = navIcons[href] ?? House;
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-amber-50 text-amber-950"
          : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          active
            ? "bg-amber-100 text-amber-800"
            : "bg-zinc-100 text-zinc-500"
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="leading-snug">{label}</span>
    </Link>
  );
}

function MenuSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-1">
      <p className="px-2.5 pb-1 text-xs font-medium text-zinc-400">
        {title}
      </p>
      {children}
    </section>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("Nav");
  const tLang = useTranslations("LocaleSwitcher");
  const ts = useTranslations("Site");
  const slogan = ts("slogan");
  const site = useSiteContact();
  const close = () => setOpen(false);

  const homeItem = navItems.find((item) => item.href === "/");
  const transferItems = navItems.filter((item) => item.group === "transfers");
  const travelItems = navItems.filter((item) => item.group === "travel");
  const serviceItems = navItems.filter((item) =>
    ["/fleet", "/price-list"].includes(item.href)
  );
  const moreItems = navItems.filter((item) =>
    ["/articles", "/faq", "/reviews", "/contact"].includes(item.href)
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="icon" className="lg:hidden" />}
      >
        <Menu className="size-4" />
        <span className="sr-only">{t("menu")}</span>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[min(100%,22rem)] gap-0 p-0 sm:max-w-sm"
      >
        <div className="flex h-full min-h-0 flex-col">
          <SheetHeader className="border-b border-zinc-100 px-4 py-4 pr-12">
            <SiteLogo height={56} />
            <SheetTitle className="sr-only">{siteConfig.name}</SheetTitle>
            <SheetDescription className="text-xs leading-relaxed text-zinc-500">
              {slogan}
            </SheetDescription>
          </SheetHeader>

          <div className="border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
            <p className="mb-2 text-xs font-medium text-zinc-400">
              {tLang("label")}
            </p>
            <LocaleSwitcher className="h-10 w-full min-w-0 justify-between bg-white px-3 text-sm" />
          </div>

          <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
            {homeItem ? (
              <MenuLink
                href={homeItem.href}
                label={t(homeItem.labelKey)}
                onNavigate={close}
              />
            ) : null}

            <MenuSection title={t("transfers")}>
              {transferItems.map((item) => (
                <MenuLink
                  key={item.href}
                  href={item.href}
                  label={t(item.labelKey)}
                  onNavigate={close}
                />
              ))}
            </MenuSection>

            <MenuSection title={t("services")}>
              {serviceItems.map((item) => (
                <MenuLink
                  key={item.href}
                  href={item.href}
                  label={t(item.labelKey)}
                  onNavigate={close}
                />
              ))}
            </MenuSection>

            <MenuSection title={t("travel")}>
              {travelItems.map((item) => (
                <MenuLink
                  key={item.href}
                  href={item.href}
                  label={t(item.labelKey)}
                  onNavigate={close}
                />
              ))}
            </MenuSection>

            <MenuSection title={t("more")}>
              {moreItems.map((item) => (
                <MenuLink
                  key={item.href}
                  href={item.href}
                  label={t(item.labelKey)}
                  onNavigate={close}
                />
              ))}
            </MenuSection>
          </nav>

          <div className="mt-auto space-y-2 border-t border-zinc-100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <ButtonLink href="/booking" size="lg" className="w-full" onClick={close}>
              <Car className="size-4" />
              {t("bookNow")}
            </ButtonLink>
            <a
              href={telHref(site.phone)}
              className="flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              <Phone className="size-4" />
              {site.phone}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
