"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCatalogStore } from "@/lib/admin/catalog-store";
import {
  downloadCsv,
  parseRentalCsv,
  parseTransferCsv,
  rentalPackagesToCsv,
  transferRoutesToCsv,
} from "@/lib/admin/catalog-csv";
import {
  getActiveRentalPackages,
  rentalPackages as builtInRentals,
} from "@/lib/data/rental-packages";
import { officialTransferRoutes } from "@/lib/data/transfer-routes";
import { publishCatalogSection } from "@/lib/admin/catalog-remote";
import { compressVehiclePhoto } from "@/lib/admin/catalog-image";
import { PublicImage } from "@/components/shared/public-image";

function formatWhen(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString();
}

export function AdminCatalogPage() {
  const t = useTranslations("Admin");
  const rentalPackages = useCatalogStore((s) => s.rentalPackages);
  const transferRoutes = useCatalogStore((s) => s.transferRoutes);
  const rentalImportedAt = useCatalogStore((s) => s.rentalImportedAt);
  const transferImportedAt = useCatalogStore((s) => s.transferImportedAt);
  const setRentalPackages = useCatalogStore((s) => s.setRentalPackages);
  const setTransferRoutes = useCatalogStore((s) => s.setTransferRoutes);
  const clearRentalPackages = useCatalogStore((s) => s.clearRentalPackages);
  const clearTransferRoutes = useCatalogStore((s) => s.clearTransferRoutes);
  const rentalInput = useRef<HTMLInputElement>(null);
  const transferInput = useRef<HTMLInputElement>(null);
  const rentalRev = useCatalogStore((s) => s.rentalImportedAt);
  const activeRentals = rentalRev ? getActiveRentalPackages() : builtInRentals;

  const changeRentalPhoto = async (id: string, file: File) => {
    try {
      const image = await compressVehiclePhoto(file);
      const rows = (rentalPackages ?? builtInRentals).map((row) =>
        row.id === id ? { ...row, image } : row
      );
      setRentalPackages(rows);
      toast.success(t("catalogPhotoOk"));
      void publish("rentalPackages", rows);
    } catch {
      toast.error(t("catalogPhotoTooLarge"));
    }
  };

  const publish = async (
    section: "rentalPackages" | "transferRoutes",
    payload: unknown | null
  ) => {
    const result = await publishCatalogSection(section, payload);
    if (result === "saved") toast.success(t("catalogSavedRemote"));
    else if (result === "failed") toast.error(t("catalogRemoteFailed"));
  };

  const issueText = (message: string) => {
    const known = [
      "empty",
      "missingModel",
      "badCategory",
      "badLocation",
      "sameLocation",
      "missingPrice",
    ] as const;
    if ((known as readonly string[]).includes(message)) {
      return t(`catalogIssue.${message}` as "catalogIssue.empty");
    }
    return message;
  };

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

  const importRentals = async (file: File) => {
    try {
      const text = await readFile(file);
      const parsed = parseRentalCsv(text);
      if (!parsed.rows.length) {
        toast.error(t("catalogEmpty"));
        return;
      }
      setRentalPackages(parsed.rows);
      toast.success(t("catalogRentalOk", { n: parsed.rows.length }));
      void publish("rentalPackages", parsed.rows);
      if (parsed.issues.length) {
        toast.message(
          t("catalogSkipped", {
            n: parsed.issues.length,
            detail: parsed.issues
              .slice(0, 3)
              .map((i) => t("catalogRowIssue", { row: i.row, reason: issueText(i.message) }))
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

  const importTransfers = async (file: File) => {
    try {
      const text = await readFile(file);
      const parsed = parseTransferCsv(text);
      if (!parsed.rows.length) {
        toast.error(t("catalogEmpty"));
        return;
      }
      setTransferRoutes(parsed.rows);
      toast.success(t("catalogTransferOk", { n: parsed.rows.length }));
      void publish("transferRoutes", parsed.rows);
      if (parsed.issues.length) {
        toast.message(
          t("catalogSkipped", {
            n: parsed.issues.length,
            detail: parsed.issues
              .slice(0, 3)
              .map((i) => t("catalogRowIssue", { row: i.row, reason: issueText(i.message) }))
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
          {t("catalogTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-500">
          {t("catalogSubtitle")}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6">
          <h2 className="font-semibold text-zinc-950">{t("catalogRentalTitle")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">
            {t("catalogRentalHelp")}
          </p>
          <p className="mt-4 text-sm text-zinc-600">
            {rentalPackages
              ? t("catalogUsingImported", {
                  n: rentalPackages.length,
                  when: formatWhen(rentalImportedAt) ?? "—",
                })
              : t("catalogUsingBuiltin", { n: builtInRentals.length })}
          </p>
          <input
            ref={rentalInput}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importRentals(file);
              e.target.value = "";
            }}
          />
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              size="sm"
              className="h-9 rounded-lg"
              onClick={() => rentalInput.current?.click()}
            >
              {t("catalogImport")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-zinc-200"
              onClick={() =>
                downloadCsv(
                  "car-rental-packages.csv",
                  rentalPackagesToCsv(rentalPackages ?? builtInRentals)
                )
              }
            >
              {t("catalogTemplate")}
            </Button>
            {rentalPackages ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-lg"
                onClick={() => {
                  clearRentalPackages();
                  toast.success(t("catalogResetOk"));
                  void publish("rentalPackages", null);
                }}
              >
                {t("catalogReset")}
              </Button>
            ) : null}
          </div>
        </article>

        <article className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6">
          <h2 className="font-semibold text-zinc-950">{t("catalogTransferTitle")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">
            {t("catalogTransferHelp")}
          </p>
          <p className="mt-4 text-sm text-zinc-600">
            {transferRoutes
              ? t("catalogUsingImported", {
                  n: transferRoutes.length,
                  when: formatWhen(transferImportedAt) ?? "—",
                })
              : t("catalogUsingBuiltin", { n: officialTransferRoutes.length })}
          </p>
          <input
            ref={transferInput}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importTransfers(file);
              e.target.value = "";
            }}
          />
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              size="sm"
              className="h-9 rounded-lg"
              onClick={() => transferInput.current?.click()}
            >
              {t("catalogImport")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg border-zinc-200"
              onClick={() =>
                downloadCsv(
                  "transfer-routes.csv",
                  transferRoutesToCsv(transferRoutes ?? officialTransferRoutes)
                )
              }
            >
              {t("catalogTemplate")}
            </Button>
            {transferRoutes ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-lg"
                onClick={() => {
                  clearTransferRoutes();
                  toast.success(t("catalogResetOk"));
                  void publish("transferRoutes", null);
                }}
              >
                {t("catalogReset")}
              </Button>
            ) : null}
          </div>
        </article>
      </div>

      <section className="rounded-2xl border border-zinc-200/80 bg-white p-6">
        <h2 className="font-semibold text-zinc-950">{t("catalogRentalPhotos")}</h2>
        <p className="mt-1 text-sm text-zinc-500">{t("catalogPhotoHelp")}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {activeRentals.map((pkg) => (
            <li
              key={pkg.id}
              className="flex items-center gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50 px-3 py-2"
            >
              <PublicImage
                src={pkg.image}
                alt=""
                width={72}
                height={40}
                className="h-10 w-16 rounded-md object-contain"
              />
              <span className="min-w-0 flex-1 truncate text-sm text-zinc-800">
                {pkg.model}
              </span>
              <label className="shrink-0 cursor-pointer text-xs font-medium text-zinc-950 underline">
                {t("catalogChangePhoto")}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void changeRentalPhoto(pkg.id, file);
                    e.target.value = "";
                  }}
                />
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
