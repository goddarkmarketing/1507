"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/admin/store";
import { money, useRouteLabel } from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";

export function AdminPaymentsPage() {
  const t = useTranslations("Admin");
  const bookings = useAdminStore((s) => s.bookings);
  const verifyPayment = useAdminStore((s) => s.verifyPayment);
  const routeLabel = useRouteLabel();

  const pending = useMemo(
    () =>
      bookings.filter(
        (b) =>
          b.opsStatus === "payment_review" ||
          b.payment?.status === "awaiting-transfer"
      ),
    [bookings]
  );

  const paid = useMemo(
    () =>
      bookings
        .filter((b) => b.payment?.status === "paid")
        .slice(0, 8),
    [bookings]
  );

  return (
    <div className="space-y-8">
      <div className="max-w-xl space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[28px]">
          {t("paymentsTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-500">
          {t("paymentsSubtitle")}
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h2 className="text-[15px] font-semibold text-zinc-950">
            {t("pendingPayments")}
            <span className="ml-2 text-sm font-normal text-zinc-400">
              ({pending.length})
            </span>
          </h2>
        </div>
        {pending.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-zinc-500">
            {t("emptyPayments")}
          </p>
        ) : (
          <ul className="divide-y divide-zinc-100">
            {pending.map((b) => (
              <li
                key={b.id}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="space-y-1">
                  <p className="font-medium text-zinc-950">
                    #{b.bookingNumber}
                    <span className="mx-1.5 text-zinc-300">·</span>
                    {b.customerName}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {routeLabel(b)}
                    <span className="mx-1.5 text-zinc-300">·</span>
                    {b.payment?.summary}
                  </p>
                  <p className="pt-1 text-sm font-semibold tabular-nums text-zinc-950">
                    {money(b.totalPrice)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="h-9 rounded-lg"
                    onClick={() => {
                      verifyPayment(b.id, true);
                      toast.success(t("toastPaymentOk"));
                    }}
                  >
                    {t("approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 rounded-lg border-zinc-200"
                    onClick={() => {
                      verifyPayment(b.id, false);
                      toast.message(t("toastPaymentReject"));
                    }}
                  >
                    {t("reject")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
        <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
          <h2 className="text-[15px] font-semibold text-zinc-950">
            {t("recentPaid")}
          </h2>
        </div>
        <ul className="divide-y divide-zinc-100">
          {paid.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
            >
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-medium text-zinc-950">
                  #{b.bookingNumber}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {b.payment?.summary}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold tabular-nums text-zinc-950">
                {money(b.totalPrice)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
