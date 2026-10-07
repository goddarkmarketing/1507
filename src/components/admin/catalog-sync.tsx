"use client";

import { useEffect } from "react";
import { pullSiteCatalog } from "@/lib/admin/catalog-remote";
import { useCatalogStore } from "@/lib/admin/catalog-store";

function revealSavedCatalog() {
  const state = useCatalogStore.getState();
  const stamp = new Date().toISOString();
  useCatalogStore.setState({
    catalogReady: true,
    transferImportedAt: state.transferRoutes?.length
      ? stamp
      : state.transferImportedAt,
    rentalImportedAt:
      state.rentalPackages != null ? stamp : state.rentalImportedAt,
    vehiclesImportedAt: state.vehicleOverrides ? stamp : state.vehiclesImportedAt,
  });
}

/** Load the shared price and photo catalog, then let the public pages redraw. */
export function CatalogSync() {
  useEffect(() => {
    let cancel = false;

    const load = () => {
      void pullSiteCatalog().then((snapshot) => {
        if (cancel) return;
        if (snapshot) useCatalogStore.getState().applyRemoteCatalog(snapshot);
        revealSavedCatalog();
      });
    };

    if (useCatalogStore.persist.hasHydrated()) load();
    const unsub = useCatalogStore.persist.onFinishHydration(load);

    const onVisible = () => {
      if (document.visibilityState !== "visible") return;
      if (window.location.pathname.includes("/admin")) return;
      void pullSiteCatalog().then((snapshot) => {
        if (cancel || !snapshot) return;
        useCatalogStore.getState().applyRemoteCatalog(snapshot);
        revealSavedCatalog();
      });
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancel = true;
      unsub();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return null;
}
