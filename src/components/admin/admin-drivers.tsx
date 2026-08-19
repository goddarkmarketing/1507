"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/admin/store";
import { DRIVER_VEHICLE_CODES } from "@/lib/admin/settings";
import type { Driver } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const emptyDriver = (): Driver => ({
  id: "",
  name: "",
  phone: "",
  lineId: "",
  plate: "",
  note: "",
  vehicleCodes: ["ECO"],
  active: true,
});

export function AdminDriversPage() {
  const t = useTranslations("Admin");
  const drivers = useAdminStore((s) => s.drivers);
  const bookings = useAdminStore((s) => s.bookings);
  const toggleDriverActive = useAdminStore((s) => s.toggleDriverActive);
  const upsertDriver = useAdminStore((s) => s.upsertDriver);
  const removeDriver = useAdminStore((s) => s.removeDriver);
  const [form, setForm] = useState<Driver>(emptyDriver());
  const editing = Boolean(form.id);

  const save = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error(t("settingsRequired"));
      return;
    }
    upsertDriver({
      ...form,
      id: form.id || crypto.randomUUID(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      lineId: form.lineId?.trim() || undefined,
      plate: form.plate?.trim() || undefined,
      note: form.note?.trim() || undefined,
      vehicleCodes: form.vehicleCodes.length ? form.vehicleCodes : ["ECO"],
    });
    setForm(emptyDriver());
    toast.success(t("toastUpdated"));
  };

  return (
    <div className="space-y-8">
      <div className="max-w-xl space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[28px]">
          {t("driversTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-500">
          {t("driversSubtitle")}
        </p>
      </div>

      <article className="rounded-2xl border border-zinc-200/80 bg-white p-6">
        <h2 className="font-semibold text-zinc-950">
          {editing ? t("driversEdit") : t("driversAdd")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-600">{t("settingsStaffName")}</Label>
            <Input
              className="h-10 rounded-xl"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-600">{t("settingsPhone")}</Label>
            <Input
              className="h-10 rounded-xl"
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-600">{t("driversLine")}</Label>
            <Input
              className="h-10 rounded-xl"
              value={form.lineId ?? ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, lineId: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-600">{t("driversPlate")}</Label>
            <Input
              className="h-10 rounded-xl"
              value={form.plate ?? ""}
              onChange={(e) =>
                setForm((s) => ({ ...s, plate: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs text-zinc-600">{t("adminNotes")}</Label>
            <Input
              className="h-10 rounded-xl"
              value={form.note ?? ""}
              onChange={(e) => setForm((s) => ({ ...s, note: e.target.value }))}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {DRIVER_VEHICLE_CODES.map((code) => {
            const checked = form.vehicleCodes.includes(code);
            return (
              <label
                key={code}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs",
                  checked ? "border-zinc-300 bg-zinc-50" : "border-zinc-200"
                )}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={(on) =>
                    setForm((s) => ({
                      ...s,
                      vehicleCodes: on
                        ? [...s.vehicleCodes, code]
                        : s.vehicleCodes.filter((item) => item !== code),
                    }))
                  }
                />
                {code}
              </label>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" className="h-9 rounded-lg" onClick={save}>
            {editing ? t("settingsSave") : t("driversAdd")}
          </Button>
          {editing ? (
            <Button
              variant="outline"
              size="sm"
              className="h-9 rounded-lg"
              onClick={() => setForm(emptyDriver())}
            >
              {t("settingsCancel")}
            </Button>
          ) : null}
        </div>
      </article>

      <div className="grid gap-5 sm:grid-cols-2">
        {drivers.map((d) => {
          const assigned = bookings.filter(
            (b) =>
              b.driverId === d.id &&
              !["completed", "cancelled"].includes(b.opsStatus)
          ).length;
          return (
            <article
              key={d.id}
              className="flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="font-semibold text-zinc-950">{d.name}</h2>
                  <p className="text-sm text-zinc-500">{d.phone}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
                    d.active
                      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                      : "bg-zinc-100 text-zinc-500 ring-zinc-200"
                  )}
                >
                  {d.active ? t("online") : t("offline")}
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-700">
                {d.note}
              </p>
              <div className="mt-4 space-y-1 text-xs text-zinc-400">
                {d.lineId ? <p>LINE {d.lineId}</p> : null}
                {d.plate ? <p>{t("driversPlate")}: {d.plate}</p> : null}
                <p>
                  {t("vehicles")}: {d.vehicleCodes.join(", ")}
                </p>
                <p>
                  {t("openJobs")}: {assigned}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-fit rounded-lg border-zinc-200"
                  onClick={() => {
                    toggleDriverActive(d.id);
                    toast.success(t("toastUpdated"));
                  }}
                >
                  {d.active ? t("setOffline") : t("setOnline")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-fit rounded-lg border-zinc-200"
                  onClick={() => setForm(d)}
                >
                  {t("driversEdit")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-fit rounded-lg"
                  onClick={() => {
                    removeDriver(d.id);
                    toast.success(t("driversRemoved"));
                  }}
                >
                  {t("settingsRemove")}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
