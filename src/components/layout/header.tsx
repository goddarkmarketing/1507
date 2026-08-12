"use client";

import { Car, Menu, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SiteLogo } from "@/components/shared/site-logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Link } from "@/i18n/navigation";
import { siteConfig, navItems } from "@/lib/site-config";

function NavDropdown({
  label,
  links,
}: {
  label: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="group relative">
      <button className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        {label}
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[220px] rounded-lg border bg-popover p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header() {
  const t = useTranslations("Nav");
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label={siteConfig.name}>
          <SiteLogo height={44} priority className="hidden sm:block" />
          <SiteLogo height={36} priority className="sm:hidden" />
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
            href={`tel:${siteConfig.phone}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden xl:inline-flex"
            )}
          >
            <Phone className="size-4" />
            {siteConfig.phone}
          </a>
          <ButtonLink size="sm" href="/booking">
            <Car className="size-4" />
            <span className="hidden xs:inline sm:inline">{t("bookNow")}</span>
          </ButtonLink>

          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="icon" className="lg:hidden" />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <LocaleSwitcher />
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  >
                    {t(item.labelKey)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
