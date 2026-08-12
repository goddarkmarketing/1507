import { redirect } from "next/navigation";

/**
 * Backward-compatible non-locale URL.
 * Keeps old /price-list links working after locale-prefix migration.
 */
export default function LegacyPriceListPage() {
  redirect("/th/price-list/");
}

