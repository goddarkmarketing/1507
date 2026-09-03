"use client";

import { Car, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/button-link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteLogo } from "@/components/shared/site-logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Link } from "@/i18n/navigation";
import { navIcons } from "@/lib/nav-icons";
import { siteConfig, navItems, type NavItem } from "@/lib/site-config";
import { useSiteContact } from "@/lib/admin/settings-store";
import { telHref } from "@/lib/contact-links";

function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: { href: NavItem["href"]; label: string }[];
}) {
  return (
    <div className="group relative">
      <button className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        {label}
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[240px] rounded-xl border bg-popover p-1.5 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
        {links.map((item) => {
          const Icon = navIcons[item.href];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground/90 transition-colors hover:bg-accent"
            >
              {Icon ? (
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-600">
                  <Icon className="size-4" />
                </span>
              ) : null}
              <span className="leading-snug">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function Header() {
  const t = useTranslations("Nav");
  const site = useSiteContact();
  const transferLinks = navItems
    .filter((item) => item.group === "transfers")
    .map((item) => ({ href: item.href, label: t(item.labelKey) }));
  const travelLinks = navItems
    .filter((item) => item.group === "travel")
    .map((item) => ({ href: item.href, label: t(item.labelKey) }));
  const mainLinks = navItems.filter((item) => !item.group);
  const midLinks = mainLinks.filter((item) =>
    ["/fleet", "/price-list"].includes(item.href)
  );
  const endLinks = mainLinks.filter(
    (item) => item.href !== "/" && !["/fleet", "/price-list"].includes(item.href)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label={siteConfig.name}>
          <SiteLogo height={60} priority className="hidden sm:block" />
          <SiteLogo height={48} priority className="sm:hidden" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("home")}
          </Link>
          <NavDropdown label={t("transfers")} links={transferLinks} />
          {midLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.labelKey)}
            </Link>
          ))}
          <NavDropdown label={t("travel")} links={travelLinks} />
          {endLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher className="hidden sm:inline-flex" />
          <a
            href={telHref(site.phone)}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden xl:inline-flex"
            )}
          >
            <Phone className="size-4" />
            {site.phone}
          </a>
          <ButtonLink size="sm" href="/booking">
            <Car className="size-4" />
            <span className="hidden xs:inline sm:inline">{t("bookNow")}</span>
          </ButtonLink>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
