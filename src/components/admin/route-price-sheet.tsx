"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/lib/admin/catalog-store";
import { routeSheetName } from "@/lib/data/set1-place-names";
import { officialTransferRoutes } from "@/lib/data/transfer-routes";
import type { OfficialTransferRoute } from "@/lib/data/transfer-routes";
import type { VehicleCode } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRICE_KEYS = ["ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "BUS"] as const;

function cloneRoutes(rows: OfficialTransferRoute[]): OfficialTransferRoute[] {
  return rows.map((row) => ({
    ...row,
    prices: { ...row.prices },
  }));
}

function sheetSource(): OfficialTransferRoute[] {
  const imported = useCatalogStore.getState().transferRoutes;
  return cloneRoutes(
    imported?.length ? imported : officialTransferRoutes
  );
}

export function RoutePriceSheet({
  onSave,
}: {
  onSave: (rows: OfficialTransferRoute[]) => boolean | Promise<boolean>;
}) {
  const t = useTranslations("Admin");
  const transferImportedAt = useCatalogStore((s) => s.transferImportedAt);
  const [rows, setRows] = useState<OfficialTransferRoute[]>(sheetSource);
  const [dirty, setDirty] = useState(false);
  const saving = useRef(false);

  useEffect(() => {
    if (saving.current) {
      saving.current = false;
      return;
    }
    setRows(sheetSource());
    setDirty(false);
  }, [transferImportedAt]);

  const patch = (index: number, next: Partial<OfficialTransferRoute>) => {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...next } : row))
    );
    setDirty(true);
  };

  const patchPrice = (index: number, key: (typeof PRICE_KEYS)[number], raw: string) => {
    const n = Number(raw.replace(/[, ]/g, ""));
    if (!Number.isFinite(n)) return;
    setRows((current) =>
      current.map((row, i) => {
        if (i !== index) return row;
        const prices = { ...row.prices, [key]: n } as Record<VehicleCode, number>;
        if (key === "VIP") prices.SIG = n;
        return { ...row, prices };
      })
    );
    setDirty(true);
  };

  return (
    <section className="rounded-2xl border border-zinc-200/80 bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-semibold text-zinc-950">{t("routeSheetTitle")}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-500">
            {t("routeSheetHelp")}
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 rounded-lg"
          disabled={!dirty}
          onClick={() => {
            saving.current = true;
            void Promise.resolve(onSave(rows)).then((ok) => {
              setDirty(!ok);
            });
          }}
        >
          {t("routeSheetSave")}
        </Button>
      </div>

      <div className="mt-4 max-h-[70vh] overflow-auto rounded-lg border border-zinc-300">
        <table className="w-max min-w-full border-collapse text-xs">
          <thead className="sticky top-0 z-20 bg-zinc-100">
            <tr>
              <th className="sticky left-0 z-30 w-10 border border-zinc-300 bg-zinc-100 px-2 py-2 text-center font-semibold">
                #
              </th>
              <th className="sticky left-10 z-30 min-w-64 border border-zinc-300 bg-zinc-100 px-2 py-2 text-left font-semibold">
                {t("routeSheetName")}
              </th>
              <th className="border border-zinc-300 px-2 py-2 font-semibold">
                {t("routeSheetKm")}
              </th>
              <th className="border border-zinc-300 px-2 py-2 font-semibold">
                {t("routeSheetMin")}
              </th>
              {PRICE_KEYS.map((key) => (
                <th
                  key={key}
                  className="min-w-20 border border-zinc-300 px-2 py-2 text-right font-semibold"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.fromId}-${row.toId}-${index}`} className="odd:bg-white even:bg-zinc-50">
                <td className="sticky left-0 z-10 border border-zinc-300 bg-inherit px-2 text-center text-zinc-500">
                  {index + 1}
                </td>
                <td className="sticky left-10 z-10 border border-zinc-300 bg-inherit p-0">
                  <input
                    value={row.name ?? routeSheetName(row, "th")}
                    onChange={(e) => patch(index, { name: e.target.value })}
                    className="h-8 w-full min-w-64 bg-transparent px-2 outline-none focus:bg-amber-50"
                  />
                </td>
                <td className="border border-zinc-300 p-0">
                  <input
                    inputMode="decimal"
                    value={String(row.distanceKm)}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isFinite(n)) patch(index, { distanceKm: n });
                    }}
                    className={cellInput()}
                  />
                </td>
                <td className="border border-zinc-300 p-0">
                  <input
                    inputMode="numeric"
                    value={String(row.durationMin)}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      if (Number.isFinite(n)) patch(index, { durationMin: n });
                    }}
                    className={cellInput()}
                  />
                </td>
                {PRICE_KEYS.map((key) => (
                  <td key={key} className="border border-zinc-300 p-0">
                    <input
                      inputMode="numeric"
                      value={String(row.prices[key] ?? "")}
                      onChange={(e) => patchPrice(index, key, e.target.value)}
                      className={cellInput("text-right")}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function cellInput(extra?: string) {
  return cn(
    "h-8 w-full min-w-16 bg-transparent px-2 text-right tabular-nums outline-none focus:bg-amber-50",
    extra
  );
}
