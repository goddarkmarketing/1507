"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useAdminStore } from "@/lib/admin/store";
import { money, useRouteLabel } from "@/components/admin/admin-ui";
import { bookingCollectedAmount } from "@/lib/admin/booking-money";
import { getBookingAmountDue } from "@/lib/booking/booking-mode";
import { TransferProofPreview } from "@/components/admin/transfer-proof-preview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ServiceBadge({
  service,
  label,
}: {
  service?: string;
  label: string;
}) {
  const isRental = service === "rental";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        isRental
          ? "bg-violet-100 text-violet-800"
          : "bg-sky-100 text-sky-800"
      )}
    >
      {label}
    </span>
  );
}

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
              <li key={b.id} className="space-y-4 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-zinc-950">
                        #{b.bookingNumber}
                      </p>
                      <ServiceBadge
                        service={b.service}
                        label={
                          b.service === "rental"
                            ? t("serviceRental")
                            : t("serviceTransfer")
                        }
                      />
                    </div>
                    <p className="text-sm text-zinc-700">{b.customerName}</p>
                    <p className="text-sm text-zinc-500">{routeLabel(b)}</p>
                    <p className="text-sm text-zinc-500">{b.payment?.summary}</p>
                    <div className="pt-1 text-sm">
                      <span className="font-semibold tabular-nums text-zinc-950">
                        {t("payToday")}: {money(getBookingAmountDue(b))}
                      </span>
                      {b.service === "rental" && (
                        <span className="mt-1 block text-xs text-zinc-500">
                          {t("estimatedTotal")}: {money(b.totalPrice)}
                          {b.balanceDue != null && b.balanceDue > 0 && (
                            <>
                              {" "}
                              · {t("rentalBalanceDue", { amount: money(b.balanceDue) })}
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
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
                </div>
                <TransferProofPreview proof={b.payment?.transferProof} />
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
                {money(bookingCollectedAmount(b))}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
