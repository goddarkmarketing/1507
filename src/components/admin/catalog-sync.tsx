"use client";

import { useEffect } from "react";
import { pullSiteCatalog } from "@/lib/admin/catalog-remote";
import { useCatalogStore } from "@/lib/admin/catalog-store";

/** Load the shared price and photo catalog once per page. */
export function CatalogSync() {
  useEffect(() => {
    let cancel = false;

    const load = () => {
      void pullSiteCatalog().then((snapshot) => {
        if (cancel || !snapshot) return;
        useCatalogStore.getState().applyRemoteCatalog(snapshot);
      });
    };

    if (useCatalogStore.persist.hasHydrated()) load();
    const unsub = useCatalogStore.persist.onFinishHydration(load);
    return () => {
      cancel = true;
      unsub();
    };
  }, []);

  return null;
}
