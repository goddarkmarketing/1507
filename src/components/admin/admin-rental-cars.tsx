"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PublicImage } from "@/components/shared/public-image";
import { useCatalogStore } from "@/lib/admin/catalog-store";
import { compressVehiclePhoto } from "@/lib/admin/catalog-image";
import {
  publishCatalogSection,
  rentalCatalogDocument,
} from "@/lib/admin/catalog-remote";
import {
  getActiveRentalPackages,
  rentalPackages as builtInRentals,
} from "@/lib/data/rental-packages";
import type { RentalCategory, RentalPackage } from "@/lib/types";

export function AdminRentalCarsPage() {
  const t = useTranslations("Admin");
  const rentalPackages = useCatalogStore((s) => s.rentalPackages);
  const setRentalPackages = useCatalogStore((s) => s.setRentalPackages);
  const activeRentals = getActiveRentalPackages();
  const [addOpen, setAddOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftCategory, setDraftCategory] = useState<RentalCategory>("Economy");
  const [draftFile, setDraftFile] = useState<File | null>(null);
  const [pendingDelete, setPendingDelete] = useState<RentalPackage | null>(null);

  const currentRentals = () => rentalPackages ?? builtInRentals;

  const persistRentals = (rows: RentalPackage[]) => {
    setRentalPackages(rows);
    void publish(
      rentalCatalogDocument(
        useCatalogStore.getState().rentalBookingEnabled,
        rows
      )
    );
  };

  const publish = async (payload: unknown | null) => {
    const result = await publishCatalogSection("rentalPackages", payload);
    if (result === "saved") toast.success(t("catalogSavedRemote"));
    else if (result === "failed") toast.error(t("catalogRemoteFailed"));
  };

  const changeRentalPhoto = async (id: string, file: File) => {
    try {
      const image = await compressVehiclePhoto(file);
      const rows = currentRentals().map((row) =>
        row.id === id ? { ...row, image } : row
      );
      setRentalPackages(rows);
      toast.success(t("catalogPhotoOk"));
      void publish(
        rentalCatalogDocument(
          useCatalogStore.getState().rentalBookingEnabled,
          rows
        )
      );
    } catch {
      toast.error(t("catalogPhotoTooLarge"));
    }
  };

  const addCar = async () => {
    const model = draftName.trim();
    if (!model) {
      toast.error(t("catalogCarNameRequired"));
      return;
    }
    let image = "/vehicles/toyota/altis.webp";
    if (draftFile) {
      try {
        image = await compressVehiclePhoto(draftFile);
      } catch {
        toast.error(t("catalogPhotoTooLarge"));
        return;
      }
    }
    const idBase =
      model
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "car";
    persistRentals([
      ...currentRentals(),
      {
        id: `${idBase}-${Date.now().toString(36)}`,
        category: draftCategory,
        model,
        engine: "",
        transmission: "Automatic",
        seats: 5,
        largeBags: 1,
        doors: 4,
        rates: {
          days1to3: null,
          days4to6: null,
          days7to20: null,
          days21to30: null,
        },
        image,
      },
    ]);
    toast.success(t("catalogAddCarOk"));
    setAddOpen(false);
    setDraftName("");
    setDraftCategory("Economy");
    setDraftFile(null);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    persistRentals(
      currentRentals().filter((row) => row.id !== pendingDelete.id)
    );
    toast.success(t("catalogDeleteCarOk"));
    setPendingDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[28px]">
            {t("catalogRentalPhotos")}
          </h1>
          <p className="text-sm leading-relaxed text-zinc-500">
            {t("catalogPhotoHelp")}
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 shrink-0 rounded-lg"
          onClick={() => setAddOpen(true)}
        >
          {t("catalogAddCar")}
        </Button>
      </div>

      <section className="rounded-2xl border border-zinc-200/80 bg-white p-6">
        {activeRentals.length === 0 ? (
          <p className="text-sm text-zinc-500">{t("catalogNoRentalCars")}</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
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
                <button
                  type="button"
                  aria-label={t("catalogDeleteCar")}
                  className="shrink-0 rounded-md p-1.5 text-red-600 hover:bg-red-50"
                  onClick={() => setPendingDelete(pkg)}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) {
            setDraftName("");
            setDraftCategory("Economy");
            setDraftFile(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("catalogAddCarTitle")}</DialogTitle>
            <DialogDescription className="sr-only">
              {t("catalogAddCarTitle")}
            </DialogDescription>
          </DialogHeader>
          <label className="grid gap-1.5 text-sm text-zinc-700">
            {t("catalogCarName")}
            <Input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="grid gap-1.5 text-sm text-zinc-700">
            {t("catalogCarCategory")}
            <select
              value={draftCategory}
              onChange={(e) =>
                setDraftCategory(e.target.value as RentalCategory)
              }
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            >
              <option value="Mini Car">{t("catalogCatMini")}</option>
              <option value="Economy">{t("catalogCatEconomy")}</option>
              <option value="Compact">{t("catalogCatCompact")}</option>
              <option value="Full Size">{t("catalogCatFull")}</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm text-zinc-700">
            {t("catalogCarPhoto")}
            <input
              type="file"
              accept="image/*"
              className="text-sm"
              onChange={(e) => setDraftFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              {t("catalogCancel")}
            </Button>
            <Button onClick={() => void addCar()}>{t("catalogAddCar")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={pendingDelete != null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("catalogDeleteCarTitle")}</DialogTitle>
            <DialogDescription>
              {pendingDelete
                ? t("catalogDeleteCarBody", { model: pendingDelete.model })
                : ""}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingDelete(null)}>
              {t("catalogCancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("catalogDeleteCar")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
