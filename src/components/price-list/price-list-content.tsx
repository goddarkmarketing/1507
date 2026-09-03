"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getLocation } from "@/lib/data/locations";
import { calculatePrice, getSampleRoutes } from "@/lib/data/pricing";
import { getActiveTariffVehicles } from "@/lib/data/vehicles";
import { useLocationName, useVehicleCopy } from "@/lib/i18n-labels";
import {
  formatRate,
  getActiveRentalPackages,
  rentalCategories,
  rentalDurationLabels,
} from "@/lib/data/rental-packages";
import { useCatalogStore } from "@/lib/admin/catalog-store";
import { cn } from "@/lib/utils";
import type { RentalCategory, TransferCategory } from "@/lib/types";
import { PublicImage } from "@/components/shared/public-image";
import { RentalConditions } from "@/components/shared/rental-conditions";

const sectionFilterIds = ["all", "rental", "transfer"] as const;

const transferCategories: Array<TransferCategory | "all"> = [
  "all",
  "airport",
  "hotel",
  "pier",
  "beach",
  "city",
  "attraction",
  "inter-province",
];

const rentalCatKey: Record<
  RentalCategory,
  "catMini" | "catEconomy" | "catCompact" | "catFull"
> = {
  "Mini Car": "catMini",
  Economy: "catEconomy",
  Compact: "catCompact",
  "Full Size": "catFull",
};

const transferCatKey: Record<
  TransferCategory,
  | "catAirport"
  | "catHotel"
  | "catPier"
  | "catBeach"
  | "catCity"
  | "catAttraction"
  | "catInter"
> = {
  airport: "catAirport",
  hotel: "catHotel",
  pier: "catPier",
  beach: "catBeach",
  city: "catCity",
  attraction: "catAttraction",
  "inter-province": "catInter",
};

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors capitalize",
        active
          ? "bg-zinc-950 text-white"
          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function PriceListContent() {
  const t = useTranslations("PriceList");
  const tFleet = useTranslations("FleetUi");
  const locName = useLocationName();
  const { name: vehicleName } = useVehicleCopy();
  const rentalRev = useCatalogStore((s) => s.rentalImportedAt);
  const transferRev = useCatalogStore((s) => s.transferImportedAt);
  const vehiclesRev = useCatalogStore((s) => s.vehiclesImportedAt);
  const routes = useMemo(() => getSampleRoutes(), [transferRev]);
  const packages = useMemo(() => getActiveRentalPackages(), [rentalRev]);
  const vehicles = useMemo(() => getActiveTariffVehicles(), [vehiclesRev]);
  const [query, setQuery] = useState("");
  const [section, setSection] =
    useState<(typeof sectionFilterIds)[number]>("all");
  const [rentalCategory, setRentalCategory] = useState<RentalCategory | "all">(
    "all"
  );
  const [transferCategory, setTransferCategory] = useState<
    TransferCategory | "all"
  >("all");

  const q = query.trim().toLowerCase();
  const onRequest = tFleet("onRequest");

  const sectionLabel = (id: (typeof sectionFilterIds)[number]) => {
    if (id === "all") return t("filterAll");
    if (id === "rental") return t("filterRental");
    return t("filterTransfer");
  };

  const filteredRentals = useMemo(() => {
    return packages.filter((pkg) => {
      const categoryMatch =
        rentalCategory === "all" || pkg.category === rentalCategory;
      const catLabel = tFleet(rentalCatKey[pkg.category]).toLowerCase();
      const textMatch =
        !q ||
        pkg.model.toLowerCase().includes(q) ||
        pkg.category.toLowerCase().includes(q) ||
        catLabel.includes(q) ||
        pkg.engine.toLowerCase().includes(q);
      return categoryMatch && textMatch;
    });
  }, [q, rentalCategory, tFleet, packages]);

  const filteredRoutes = useMemo(() => {
    return routes.filter((route) => {
      const from = getLocation(route.fromId);
      const to = getLocation(route.toId);
      const categoryMatch =
        transferCategory === "all" ||
        (transferCategory === "airport"
          ? from?.type === "airport" || to?.type === "airport"
          : route.category === transferCategory);
      const fromLabel = locName(from).toLowerCase();
      const toLabel = locName(to).toLowerCase();
      const catLabel = t(transferCatKey[route.category]).toLowerCase();
      const textMatch =
        !q ||
        fromLabel.includes(q) ||
        toLabel.includes(q) ||
        from?.name.toLowerCase().includes(q) ||
        to?.name.toLowerCase().includes(q) ||
        route.category.toLowerCase().includes(q) ||
        catLabel.includes(q);
      return categoryMatch && textMatch;
    });
  }, [q, routes, transferCategory, locName, t]);

  const showRental = section === "all" || section === "rental";
  const showTransfer = section === "all" || section === "transfer";

  const shortName = (id: string) => locName(getLocation(id)).split("(")[0].trim();

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 lg:px-8">
      <div className="relative z-30 flex flex-col gap-3 rounded-xl border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="h-9 pl-8"
            aria-label={t("search")}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {sectionFilterIds.map((id) => (
            <FilterChip
              key={id}
              active={section === id}
              onClick={() => setSection(id)}
            >
              {sectionLabel(id)}
            </FilterChip>
          ))}
        </div>
      </div>

      {showRental && (
        <section>
          <RentalConditions className="mb-6" />
          <div className="mb-4 flex justify-center sm:justify-start">
            <ButtonLink href="/booking?service=rental" size="lg">
              {t("bookRental")}
            </ButtonLink>
          </div>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t("rentalTitle")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("rentalSubtitle")}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{t("pricePerDay")}</Badge>
              <FilterChip
                active={rentalCategory === "all"}
                onClick={() => setRentalCategory("all")}
              >
                {t("filterAll")}
              </FilterChip>
              {rentalCategories.map((category) => (
                <FilterChip
                  key={category}
                  active={rentalCategory === category}
                  onClick={() => setRentalCategory(category)}
                >
                  {tFleet(rentalCatKey[category])}
                </FilterChip>
              ))}
            </div>
          </div>

          {filteredRentals.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[800px] text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">
                      {t("category")}
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      {t("model")}
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      {t("details")}
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      {t("capacity")}
                    </th>
                    {rentalDurationLabels.map((tier) => (
                      <th
                        key={tier.key}
                        className="px-3 py-3 text-right font-medium"
                      >
                        {tier.short}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRentals.map((pkg) => (
                    <tr key={pkg.id} className="border-t">
                      <td className="px-4 py-3">
                        <Badge variant="outline">
                          {tFleet(rentalCatKey[pkg.category])}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-background">
                            <PublicImage
                              src={pkg.image}
                              alt=""
                              fill
                              unoptimized
                              className="object-contain"
                              sizes="40px"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{pkg.model}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {pkg.engine}
                        <br />
                        <span className="text-xs">{pkg.transmission}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {t("capacityLine", {
                          seats: pkg.seats,
                          bags: pkg.largeBags,
                          doors: pkg.doors,
                        })}
                      </td>
                      {rentalDurationLabels.map((tier) => {
                        const rate = pkg.rates[tier.key];
                        return (
                          <td
                            key={tier.key}
                            className={`px-3 py-3 text-right font-medium ${
                              rate == null ? "text-muted-foreground" : ""
                            }`}
                          >
                            {formatRate(rate, onRequest)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
              {t("emptyRental")}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {rentalCategories.map((category) => {
              const pkgs = filteredRentals.filter((p) => p.category === category);
              const count = pkgs.length;
              const from = pkgs
                .filter((p) => p.rates.days1to3 != null)
                .map((p) => p.rates.days1to3 as number);
              const min = from.length ? Math.min(...from) : null;
              return (
                <div key={category} className="rounded-xl border p-4">
                  <p className="text-sm font-semibold">
                    {tFleet(rentalCatKey[category])}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("modelsCount", { n: count })}
                  </p>
                  <p className="mt-2 text-lg font-bold text-amber-700">
                    {min != null
                      ? t("fromPerDay", {
                          price: min.toLocaleString("en-US"),
                        })
                      : "—"}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">{t("notes")}</p>
        </section>
      )}

      {showTransfer && (
        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t("transferTitle")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("transferSubtitle")}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {transferCategories.map((category) => (
                <FilterChip
                  key={category}
                  active={transferCategory === category}
                  onClick={() => setTransferCategory(category)}
                >
                  {category === "all"
                    ? t("allRoutes")
                    : t(transferCatKey[category])}
                </FilterChip>
              ))}
            </div>
          </div>

          {filteredRoutes.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-[960px] text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left">{t("route")}</th>
                    <th className="px-4 py-3 text-left">{t("category")}</th>
                    {vehicles.map((v, index) => (
                      <th key={v.code} className="px-3 py-3 text-right">
                        <span className="block text-[10px] font-medium text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {vehicleName(v.code)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map((route) => {
                    return (
                      <tr
                        key={`${route.fromId}-${route.toId}`}
                        className="border-t"
                      >
                        <td className="px-4 py-3 font-medium">
                          {shortName(route.fromId)} → {shortName(route.toId)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary">
                            {t(transferCatKey[route.category])}
                          </Badge>
                        </td>
                        {vehicles.map((v) => {
                          const price = calculatePrice(
                            route.fromId,
                            route.toId,
                            v.code
                          ).totalPrice;
                          return (
                            <td key={v.code} className="px-3 py-3 text-right">
                              ฿{price.toLocaleString("en-US")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
              {t("emptyTransfer")}
            </p>
          )}
        </section>
      )}

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        {showRental && (
          <ButtonLink size="lg" href="/booking?service=rental">
            {t("bookRental")}
          </ButtonLink>
        )}
        {showTransfer && (
          <ButtonLink size="lg" href="/booking" variant={showRental ? "outline" : "default"}>
            {t("bookTransfer")}
          </ButtonLink>
        )}
      </div>
    </div>
  );
}
