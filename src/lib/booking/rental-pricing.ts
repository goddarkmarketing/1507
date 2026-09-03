import {
  getActiveRentalPackages,
  getDailyRateForDays,
  getRentalPackage,
} from "@/lib/data/rental-packages";

export function calculateRentalTotal(
  packageId: string,
  days: number
): number {
  if (days < 1) return 0;
  const pkg = getRentalPackage(packageId);
  if (!pkg) return 0;
  const daily = getDailyRateForDays(pkg, days);
  if (daily == null) return 0;
  return daily * days;
}

export function getDefaultRentalPackageId(): string {
  return getActiveRentalPackages()[0]?.id ?? "toyota-yaris";
}
