import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RentalPackage, Vehicle, VehicleCode } from "@/lib/types";
import type { SiteCatalogSnapshot } from "@/lib/admin/catalog-remote";
import type { OfficialTransferRoute } from "@/lib/data/transfer-routes";

interface CatalogState {
  rentalPackages: RentalPackage[] | null;
  rentalBookingEnabled: boolean;
  transferRoutes: OfficialTransferRoute[] | null;
  rentalImportedAt: string | null;
  transferImportedAt: string | null;
  vehicleOverrides: Partial<Record<VehicleCode, Vehicle>> | null;
  vehiclesImportedAt: string | null;
  setRentalPackages: (rows: RentalPackage[]) => void;
  setTransferRoutes: (rows: OfficialTransferRoute[]) => void;
  setVehicleOverrides: (
    overrides: Partial<Record<VehicleCode, Vehicle>>
  ) => void;
  clearRentalPackages: () => void;
  clearTransferRoutes: () => void;
  clearVehicleOverrides: () => void;
  applyRemoteCatalog: (snapshot: SiteCatalogSnapshot) => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      rentalPackages: null,
      rentalBookingEnabled: false,
      transferRoutes: null,
      rentalImportedAt: null,
      transferImportedAt: null,
      vehicleOverrides: null,
      vehiclesImportedAt: null,
      setRentalPackages: (rows) =>
        set({
          rentalPackages: rows,
          rentalImportedAt: new Date().toISOString(),
        }),
      setTransferRoutes: (rows) =>
        set({
          transferRoutes: rows,
          transferImportedAt: new Date().toISOString(),
        }),
      setVehicleOverrides: (overrides) =>
        set({
          vehicleOverrides: overrides,
          vehiclesImportedAt: new Date().toISOString(),
        }),
      clearRentalPackages: () =>
        set({ rentalPackages: null, rentalImportedAt: null }),
      clearTransferRoutes: () =>
        set({ transferRoutes: null, transferImportedAt: null }),
      clearVehicleOverrides: () =>
        set({ vehicleOverrides: null, vehiclesImportedAt: null }),
      applyRemoteCatalog: (snapshot) =>
        set({
          transferRoutes: snapshot.transferRoutes,
          rentalPackages: snapshot.rentalPackages,
          rentalBookingEnabled: snapshot.rentalBookingEnabled,
          vehicleOverrides: snapshot.vehicles,
          transferImportedAt: snapshot.transferRoutes
            ? snapshot.updatedAt
            : null,
          rentalImportedAt: snapshot.rentalPackages
            ? snapshot.updatedAt
            : null,
          vehiclesImportedAt: snapshot.vehicles ? snapshot.updatedAt : null,
        }),
    }),
    { name: "klt-catalog" }
  )
);

export function getImportedRentalPackages(): RentalPackage[] | null {
  if (typeof window === "undefined") return null;
  const rows = useCatalogStore.getState().rentalPackages;
  return rows?.length ? rows : null;
}

export function getImportedTransferRoutes(): OfficialTransferRoute[] | null {
  if (typeof window === "undefined") return null;
  const rows = useCatalogStore.getState().transferRoutes;
  return rows?.length ? rows : null;
}

export function getImportedVehicleOverrides():
  | Partial<Record<VehicleCode, Vehicle>>
  | null {
  if (typeof window === "undefined") return null;
  const overrides = useCatalogStore.getState().vehicleOverrides;
  return overrides && Object.keys(overrides).length ? overrides : null;
}
