"use client";

import { useTranslations } from "next-intl";
import {
  BadgeCheck,
  ChevronDown,
  FileText,
  Phone,
  Plane,
  PlaneTakeoff,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { getActiveRentalDeposits } from "@/lib/admin/settings-store";
import { useSettingsRevision } from "@/lib/admin/settings-store";
import { cn } from "@/lib/utils";

function formatDeposit(amount: number) {
  return `฿${amount.toLocaleString("en-US")}`;
}

const requirementIcons = [FileText, Plane, Phone] as const;

function RentalConditionsHeader() {
  const t = useTranslations("RentalConditions");

  return (
    <>
      <p className="text-xs font-semibold tracking-wide text-amber-900/70 uppercase">
        {t("eyebrow")}
      </p>
      <h3 className="mt-1 text-xl font-bold tracking-tight text-zinc-950 sm:text-2xl">
        {t("title")}
      </h3>
      <p className="mt-1 text-sm text-zinc-600">{t("subtitle")}</p>
    </>
  );
}

function RentalConditionsBody() {
  const t = useTranslations("RentalConditions");
  useSettingsRevision();
  const deposits = getActiveRentalDeposits();

  const requirements = [
    t("reqId"),
    t("reqFlight"),
    t("reqPhone"),
  ] as const;

  const depositSteps = [
    t("stepConfirm", { amount: formatDeposit(deposits.advanceDeposit) }),
    t("stepContract"),
    t("stepRefund"),
  ] as const;

  return (
    <>
      <div className="grid gap-6 px-5 py-5 sm:px-6 lg:grid-cols-2">
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <BadgeCheck className="size-4 text-amber-700" />
            {t("requirementsTitle")}
          </h4>
          <ul className="space-y-2.5">
            {requirements.map((item, index) => {
              const Icon = requirementIcons[index] ?? BadgeCheck;
              return (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl bg-white/80 px-3 py-2.5 text-sm text-zinc-800 ring-1 ring-zinc-200/70"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-amber-700" />
                  <span>{item}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
            <Wallet className="size-4 text-amber-700" />
            {t("depositTitle")}
          </h4>
          <div className="mb-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-zinc-200/70">
              <p className="text-[11px] font-medium text-zinc-500">
                {t("smallCar")}
              </p>
              <p className="mt-1 text-lg font-bold text-zinc-950">
                {formatDeposit(deposits.smallCarDeposit)}
              </p>
            </div>
            <div className="rounded-xl bg-white px-3 py-3 ring-1 ring-zinc-200/70">
              <p className="text-[11px] font-medium text-zinc-500">
                {t("largeCar")}
              </p>
              <p className="mt-1 text-lg font-bold text-zinc-950">
                {formatDeposit(deposits.largeCarDeposit)}
              </p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-zinc-700">
            {depositSteps.map((step) => (
              <li key={step} className="flex gap-2">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-amber-200/70 bg-white/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="inline-flex items-start gap-2 text-sm font-medium text-zinc-800">
          <PlaneTakeoff className="mt-0.5 size-4 shrink-0 text-sky-700" />
          {t("freeAirport")}
        </p>
        <p className="text-sm text-zinc-600">{t("thanks")}</p>
      </div>
    </>
  );
}

export function RentalConditions({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-white to-sky-50",
        className
      )}
    >
      <details className="group md:hidden">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-3 border-b border-amber-200/70 bg-amber-100/50 px-5 py-4 [&::-webkit-details-marker]:hidden">
          <div className="min-w-0">
            <RentalConditionsHeader />
          </div>
          <ChevronDown className="mt-1 size-4 shrink-0 text-amber-800 transition-transform group-open:rotate-180" />
        </summary>
        <RentalConditionsBody />
      </details>

      <div className="hidden md:block">
        <div className="border-b border-amber-200/70 bg-amber-100/50 px-5 py-4 sm:px-6">
          <RentalConditionsHeader />
        </div>
        <RentalConditionsBody />
      </div>
    </aside>
  );
}
