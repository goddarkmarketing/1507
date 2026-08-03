import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SiteLogo } from "@/components/shared/site-logo";
import { siteConfig, navItems } from "@/lib/site-config";

export function Footer() {
  const travelLinks = navItems.filter((n) => n.group === "travel");
  const companyLinks = navItems.filter(
    (n) => !n.group && n.href !== "/" && !["/fleet", "/price-list"].includes(n.href)
  );

  return (
    <footer className="mt-auto border-t bg-muted/30 pb-24 md:pb-0">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-3">
          <Link href="/" aria-label={siteConfig.name}>
            <SiteLogo height={48} />
          </Link>
          <p className="text-sm text-muted-foreground">{siteConfig.slogan}</p>
          <p className="text-sm text-muted-foreground">{siteConfig.sloganEn}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Services</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {navItems
              .filter((n) => n.group === "transfers")
              .slice(0, 5)
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Travel</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {travelLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/articles" className="hover:text-foreground">
                Articles
              </Link>
            </li>
            <li>
              <Link href="/fleet" className="hover:text-foreground">
                Fleet
              </Link>
            </li>
            <li>
              <Link href="/price-list" className="hover:text-foreground">
                Price List
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">Contact</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {companyLinks
              .filter((n) => n.href !== "/articles")
              .slice(0, 3)
              .map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            <li>
              <Link href="/booking" className="hover:text-foreground">
                Booking
              </Link>
            </li>
            <li className="flex items-center gap-2 pt-2">
              <Phone className="size-4 shrink-0" />
              {siteConfig.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              {siteConfig.email}
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              {siteConfig.address}
            </li>
          </ul>
        </div>
      </div>
      <Separator />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <p>{siteConfig.domain}</p>
      </div>
    </footer>
  );
}
