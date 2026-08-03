"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Home, Phone, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

const sideItems = [
  { href: "/", label: "Home", icon: Home, match: (path: string) => path === "/" },
  {
    href: "/fleet",
    label: "Fleet",
    icon: Car,
    match: (path: string) => path.startsWith("/fleet"),
  },
  {
    href: "/price-list",
    label: "Prices",
    icon: Tags,
    match: (path: string) => path.startsWith("/price-list"),
  },
  {
    href: `tel:${siteConfig.phone}`,
    label: "Call",
    icon: Phone,
    match: () => false,
    external: true,
  },
];

export function MobileBottomBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-1 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2">
        {sideItems.slice(0, 2).map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-medium transition-colors",
                active
                  ? "text-amber-700"
                  : "text-muted-foreground active:text-foreground"
              )}
            >
              <item.icon className={cn("size-5", active && "stroke-[2.25px]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <Link
          href="/booking"
          className="flex flex-col items-center gap-1 pb-2 pt-0 text-[10px] font-semibold text-amber-700"
          aria-label="Book Now"
        >
          <span
            className={cn(
              "-mt-5 flex size-[3.5rem] items-center justify-center rounded-full bg-gold-gradient text-primary-foreground shadow-lg shadow-amber-500/35 ring-[3px] ring-background transition-transform active:scale-95",
              pathname.startsWith("/booking") && "ring-amber-200"
            )}
          >
            <Car className="size-6" />
          </span>
          <span>Book</span>
        </Link>

        {sideItems.slice(2).map((item) => {
          const active = item.match(pathname);
          const className = cn(
            "flex flex-col items-center gap-0.5 rounded-lg py-2 text-[10px] font-medium transition-colors",
            active
              ? "text-amber-700"
              : "text-muted-foreground active:text-foreground"
          );

          if ("external" in item && item.external) {
            return (
              <a key={item.href} href={item.href} className={className}>
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </a>
            );
          }

          return (
            <Link key={item.href} href={item.href} className={className}>
              <item.icon className={cn("size-5", active && "stroke-[2.25px]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
