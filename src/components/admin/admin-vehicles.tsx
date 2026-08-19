"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { vehicles as builtInVehicles } from "@/lib/data/vehicles";
import type { Vehicle, VehicleCode } from "@/lib/types";
import { useCatalogStore } from "@/lib/admin/catalog-store";
import {
  downloadCsv,
  parseVehiclesCsv,
  vehiclesToCsv,
} from "@/lib/admin/catalog-csv";

function formatWhen(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString();
}

export function AdminVehiclesPage() {
  const t = useTranslations("Admin");
  const vehicleOverrides = useCatalogStore((s) => s.vehicleOverrides);
  const vehiclesImportedAt = useCatalogStore((s) => s.vehiclesImportedAt);
  const setVehicleOverrides = useCatalogStore((s) => s.setVehicleOverrides);
  const clearVehicleOverrides = useCatalogStore(
    (s) => s.clearVehicleOverrides
  );

  const vehiclesInput = useRef<HTMLInputElement>(null);

  const readFile = (file: File) =>
    new Promise<string>((resolve, reject) => {
      if (/\.xlsx$/i.test(file.name)) {
        reject(new Error("xlsx"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });

  const importVehicles = async (file: File) => {
    try {
      const text = await readFile(file);
      const parsed = parseVehiclesCsv(text);
      if (!parsed.rows.length) {
        toast.error(t("catalogEmpty"));
        return;
      }

      const overrides: Partial<
        Record<VehicleCode, Vehicle>
      > = {};

      for (const row of parsed.rows) {
        overrides[row.code] = row;
      }

      setVehicleOverrides(overrides);
      toast.success(t("catalogVehiclesOk", { n: parsed.rows.length }));

      if (parsed.issues.length) {
        toast.message(
          t("catalogSkipped", {
            n: parsed.issues.length,
            detail: parsed.issues
              .slice(0, 3)
              .map((i) => t("catalogRowIssue", { row: i.row, reason: i.message }))
              .join(" · "),
          })
        );
      }
    } catch (err) {
      toast.error(
        err instanceof Error && err.message === "xlsx"
          ? t("catalogXlsxHint")
          : t("catalogEmpty")
      );
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[28px]">
          {t("catalogVehiclesTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-500">
          {t("catalogVehiclesSubtitle")}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6">
          <h2 className="font-semibold text-zinc-950">
            {t("catalogTransferVehiclesTitle")}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">
            {t("catalogVehiclesHelp")}
          </p>

          <p className="mt-4 text-sm text-zinc-600">
            {vehicleOverrides
              ? t("catalogUsingImportedVehicles", {
                  when: formatWhen(vehiclesImportedAt) ?? "—",
                })
              : t("catalogUsingBuiltinVehicles")}
          </p>

          <input
            ref={vehiclesInput}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importVehicles(file);
              e.target.value = "";
            }}
          />

          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              size="sm"
              className="h-9 rounded-lg"
              onClick={() => vehiclesInput.current?.click()}
            >
              {t("catalogImport")}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-zinc-200"
              onClick={() =>
                downloadCsv(
                  "transfer-vehicles.csv",
                  vehiclesToCsv(builtInVehicles)
                )
              }
            >
              {t("catalogTemplate")}
            </Button>

            {vehicleOverrides ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-lg"
                onClick={() => {
                  clearVehicleOverrides();
                  toast.success(t("catalogResetOk"));
                }}
              >
                {t("catalogReset")}
              </Button>
            ) : null}
          </div>
        </article>

        <article className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6">
          <h2 className="font-semibold text-zinc-950">
            {t("catalogVehiclesPreview")}
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            {t("catalogVehiclesPreviewHint")}
          </p>
          <div className="mt-4 space-y-2">
            {builtInVehicles.map((v) => (
              <div
                key={v.code}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-zinc-700">
                    {v.code}
                  </span>
                  <span className="text-sm text-zinc-600">
                    {v.passengers}
                  </span>
                </div>
                <span className="text-sm font-semibold text-zinc-900">
                  ฿x{v.priceMultiplier}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

