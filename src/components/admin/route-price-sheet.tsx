"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCatalogStore } from "@/lib/admin/catalog-store";
import {
  customPlaceId,
  customPlaceLabel,
  getLocation,
  locations,
} from "@/lib/data/locations";
import { SET1_PLACE_NAMES, routeSheetName } from "@/lib/data/set1-place-names";
import { officialTransferRoutes } from "@/lib/data/transfer-routes";
import type { OfficialTransferRoute } from "@/lib/data/transfer-routes";
import type { Location, VehicleCode } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRICE_KEYS = ["ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "BUS"] as const;

/** Tariff places — hotels/provinces stay out; parks like Khao Sok stay in. */
const EXCLUDED_TYPES = new Set(["hotel", "province"]);

type PlaceOption = {
  id: string;
  label: string;
  search: string;
};

function emptyPrices(): OfficialTransferRoute["prices"] {
  return {
    ECO: 0,
    PREM: 0,
    SUV: 0,
    VAN: 0,
    EXE: 0,
    VIP: 0,
    SIG: 0,
    BUS: 0,
  };
}

function cloneRoutes(rows: OfficialTransferRoute[]): OfficialTransferRoute[] {
  return rows.map((row) => ({
    ...row,
    prices: { ...row.prices },
  }));
}

function sheetSource(): OfficialTransferRoute[] {
  const imported = useCatalogStore.getState().transferRoutes;
  return cloneRoutes(imported?.length ? imported : officialTransferRoutes);
}

function placeDisplayName(loc: Location): string {
  const sheet = SET1_PLACE_NAMES[loc.id];
  if (sheet?.th) return sheet.th;
  return loc.nameTh || loc.name;
}

function buildPlaceOptions(extraIds: string[]): PlaceOption[] {
  const byId = new Map<string, PlaceOption>();

  for (const loc of locations) {
    if (EXCLUDED_TYPES.has(loc.type)) continue;
    const label = placeDisplayName(loc);
    byId.set(loc.id, {
      id: loc.id,
      label,
      search: [label, loc.name, loc.nameTh, loc.province, loc.id]
        .filter(Boolean)
        .join(" ")
        .toLowerCase(),
    });
  }

  for (const id of extraIds) {
    if (byId.has(id)) continue;
    const loc = getLocation(id);
    const label =
      customPlaceLabel(id) ||
      loc?.nameTh ||
      loc?.name ||
      SET1_PLACE_NAMES[id]?.th ||
      id;
    byId.set(id, {
      id,
      label,
      search: `${label} ${id}`.toLowerCase(),
    });
  }

  return [...byId.values()].sort((a, b) =>
    a.label.localeCompare(b.label, "th")
  );
}

function parseMoney(raw: string): number {
  const n = Number(String(raw).replace(/[, ]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function PlaceCombobox({
  label,
  value,
  onChange,
  options,
  excludeId,
  placeholder,
  createLabel,
}: {
  label: string;
  value: string;
  onChange: (id: string) => void;
  options: PlaceOption[];
  excludeId?: string;
  placeholder: string;
  createLabel: (name: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((opt) => opt.id === value);
  const selectedLabel =
    selected?.label ||
    customPlaceLabel(value) ||
    getLocation(value)?.nameTh ||
    getLocation(value)?.name ||
    "";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .filter((opt) => opt.id !== excludeId)
      .filter((opt) => !q || opt.search.includes(q) || opt.label.includes(query.trim()))
      .slice(0, 80);
  }, [options, excludeId, query]);

  const exactMatch = options.some(
    (opt) =>
      opt.id !== excludeId &&
      (opt.label === query.trim() ||
        opt.label.toLowerCase() === query.trim().toLowerCase())
  );
  const canCreate = query.trim().length >= 1 && !exactMatch;

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
    setQuery("");
  };

  return (
    <label className="grid min-w-0 flex-1 gap-1 text-xs font-medium text-zinc-500">
      {label}
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setQuery("");
        }}
      >
        <PopoverTrigger
          type="button"
          className="flex h-9 w-full items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-2 text-left text-sm text-zinc-900 outline-none focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-200"
        >
          <span className={cn("min-w-0 flex-1 truncate", !selectedLabel && "text-zinc-400")}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown className="size-4 shrink-0 text-zinc-400" />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={4}
          className="w-[var(--anchor-width)] max-w-[calc(100vw-1.5rem)] min-w-[16rem] p-0"
          initialFocus={false}
        >
          <div className="border-b p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-400" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="h-9 pl-8"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto overscroll-contain p-1">
            {canCreate ? (
              <button
                type="button"
                onClick={() => pick(customPlaceId(query.trim()))}
                className="mb-1 flex w-full items-center gap-2 rounded-md bg-amber-50 px-2 py-2 text-left text-sm text-amber-950 hover:bg-amber-100"
              >
                <Plus className="size-3.5 shrink-0" />
                <span className="min-w-0 flex-1 leading-snug break-words">
                  {createLabel(query.trim())}
                </span>
              </button>
            ) : null}
            {filtered.length === 0 && !canCreate ? (
              <p className="px-2 py-6 text-center text-sm text-zinc-400">—</p>
            ) : (
              <ul>
                {filtered.map((opt) => {
                  const isSelected = opt.id === value;
                  return (
                    <li key={opt.id}>
                      <button
                        type="button"
                        onClick={() => pick(opt.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm hover:bg-zinc-100",
                          isSelected && "bg-amber-50"
                        )}
                      >
                        <span className="min-w-0 flex-1 leading-snug break-words whitespace-normal">
                          {opt.label}
                        </span>
                        {isSelected ? (
                          <Check className="size-4 shrink-0 text-amber-700" />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </label>
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
  const [fromId, setFromId] = useState("ao-nang-beach");
  const [toId, setToId] = useState("");
  const [distanceKm, setDistanceKm] = useState("");
  const [durationMin, setDurationMin] = useState("");
  const [draftPrices, setDraftPrices] = useState<Record<(typeof PRICE_KEYS)[number], string>>(
    () => Object.fromEntries(PRICE_KEYS.map((k) => [k, ""])) as Record<
      (typeof PRICE_KEYS)[number],
      string
    >
  );
  const [addError, setAddError] = useState("");
  const saving = useRef(false);
  const tableTopRef = useRef<HTMLDivElement>(null);

  const extraIds = useMemo(() => {
    const ids = new Set<string>();
    for (const row of rows) {
      ids.add(row.fromId);
      ids.add(row.toId);
    }
    if (fromId) ids.add(fromId);
    if (toId) ids.add(toId);
    return [...ids];
  }, [rows, fromId, toId]);

  const placeOptions = useMemo(() => buildPlaceOptions(extraIds), [extraIds]);

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

  const labelOf = (id: string) =>
    placeOptions.find((opt) => opt.id === id)?.label ||
    customPlaceLabel(id) ||
    getLocation(id)?.nameTh ||
    getLocation(id)?.name ||
    id;

  const addRoute = () => {
    setAddError("");
    if (!fromId || !toId) {
      setAddError(t("routeSheetNeedEnds"));
      return;
    }
    if (fromId === toId) {
      setAddError(t("routeSheetSameEnds"));
      return;
    }

    const km = parseMoney(distanceKm);
    const mins = parseMoney(durationMin);
    const prices = emptyPrices();
    for (const key of PRICE_KEYS) {
      const n = parseMoney(draftPrices[key]);
      prices[key] = n;
      if (key === "VIP") prices.SIG = n;
    }

    const routeName = `${labelOf(fromId)} ↔ ${labelOf(toId)}`;
    const existingIndex = rows.findIndex(
      (row) =>
        (row.fromId === fromId && row.toId === toId) ||
        (row.fromId === toId && row.toId === fromId)
    );

    if (existingIndex >= 0) {
      setRows((current) =>
        current.map((row, i) =>
          i === existingIndex
            ? {
                ...row,
                distanceKm: km || row.distanceKm,
                durationMin: mins || row.durationMin,
                prices: {
                  ...row.prices,
                  ...Object.fromEntries(
                    PRICE_KEYS.map((key) => [
                      key,
                      parseMoney(draftPrices[key]) || row.prices[key] || 0,
                    ])
                  ),
                  SIG:
                    parseMoney(draftPrices.VIP) ||
                    row.prices.SIG ||
                    row.prices.VIP ||
                    0,
                } as OfficialTransferRoute["prices"],
                name: row.name?.trim() || routeName,
              }
            : row
        )
      );
      setDirty(true);
      setAddError(t("routeSheetUpdated"));
      return;
    }

    setRows((current) => [
      {
        fromId,
        toId,
        distanceKm: km,
        durationMin: mins,
        category: "beach",
        prices,
        name: routeName,
      },
      ...current,
    ]);
    setDirty(true);
    setDistanceKm("");
    setDurationMin("");
    setDraftPrices(
      Object.fromEntries(PRICE_KEYS.map((k) => [k, ""])) as Record<
        (typeof PRICE_KEYS)[number],
        string
      >
    );
    requestAnimationFrame(() => {
      tableTopRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
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

      <div className="mt-4 space-y-3 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/80 p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
          <PlaceCombobox
            label={t("routeSheetFrom")}
            value={fromId}
            onChange={setFromId}
            options={placeOptions}
            excludeId={toId}
            placeholder={t("routeSheetPlaceSearch")}
            createLabel={(name) => t("routeSheetCreatePlace", { name })}
          />
          <PlaceCombobox
            label={t("routeSheetTo")}
            value={toId}
            onChange={setToId}
            options={placeOptions}
            excludeId={fromId}
            placeholder={t("routeSheetPlaceSearch")}
            createLabel={(name) => t("routeSheetCreatePlace", { name })}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-9">
          <label className="grid gap-1 text-[11px] font-medium text-zinc-500">
            {t("routeSheetKm")}
            <Input
              inputMode="decimal"
              className="h-9"
              value={distanceKm}
              onChange={(e) => setDistanceKm(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="0"
            />
          </label>
          <label className="grid gap-1 text-[11px] font-medium text-zinc-500">
            {t("routeSheetMin")}
            <Input
              inputMode="numeric"
              className="h-9"
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
            />
          </label>
          {PRICE_KEYS.map((key) => (
            <label key={key} className="grid gap-1 text-[11px] font-medium text-zinc-500">
              {key}
              <Input
                inputMode="numeric"
                className="h-9 text-right tabular-nums"
                value={draftPrices[key]}
                onChange={(e) =>
                  setDraftPrices((prev) => ({
                    ...prev,
                    [key]: e.target.value.replace(/[^\d]/g, ""),
                  }))
                }
                placeholder="0"
              />
            </label>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant="outline" className="h-9" onClick={addRoute}>
            <Plus className="size-3.5" />
            {t("routeSheetAdd")}
          </Button>
          <p className="text-[11px] text-zinc-500">{t("routeSheetAddHint")}</p>
        </div>
        {addError ? <p className="text-xs text-amber-800">{addError}</p> : null}
      </div>

      <div
        ref={tableTopRef}
        className="mt-4 max-h-[70vh] overflow-auto rounded-lg border border-zinc-300"
      >
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
