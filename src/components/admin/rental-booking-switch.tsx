"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  publishCatalogSection,
  rentalCatalogDocument,
} from "@/lib/admin/catalog-remote";
import { useCatalogStore } from "@/lib/admin/catalog-store";
import { cn } from "@/lib/utils";

export function RentalBookingSwitch() {
  const t = useTranslations("Admin");
  const enabled = useCatalogStore((s) => s.rentalBookingEnabled);

  const toggle = async () => {
    const next = !enabled;
    const packages = useCatalogStore.getState().rentalPackages;
    useCatalogStore.setState({ rentalBookingEnabled: next });
    const result = await publishCatalogSection(
      "rentalPackages",
      rentalCatalogDocument(next, packages)
    );
    if (result === "failed") {
      useCatalogStore.setState({ rentalBookingEnabled: enabled });
      toast.error(t("catalogRemoteFailed"));
      return;
    }
    toast.success(next ? t("rentalBookingOn") : t("rentalBookingOff"));
  };

  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white p-6">
      <div className="min-w-0">
        <h2 className="font-semibold text-zinc-950">{t("rentalBookingTitle")}</h2>
        <p className="mt-1 text-sm leading-relaxed text-zinc-500">
          {t("rentalBookingHelp")}
        </p>
        <p className="mt-2 text-sm font-medium text-zinc-800">
          {enabled ? t("rentalBookingStateOn") : t("rentalBookingStateOff")}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => void toggle()}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          enabled ? "bg-zinc-950" : "bg-zinc-300"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-6 rounded-full bg-white transition-all",
            enabled ? "left-5" : "left-0.5"
          )}
        />
      </button>
    </article>
  );
}
