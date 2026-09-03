"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAdminStore } from "@/lib/admin/store";
import { money } from "@/components/admin/admin-ui";
import { bookingCollectedAmount } from "@/lib/admin/booking-money";

export function AdminCustomersPage() {
  const t = useTranslations("Admin");
  const bookings = useAdminStore((s) => s.bookings);

  const customers = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        email: string;
        phone: string;
        count: number;
        spent: number;
        lastAt: string;
      }
    >();
    for (const b of bookings) {
      const key = b.customerEmail.toLowerCase() || b.customerPhone;
      const prev = map.get(key);
      if (!prev) {
        map.set(key, {
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone,
          count: 1,
          spent: b.status === "cancelled" ? 0 : bookingCollectedAmount(b),
          lastAt: b.createdAt,
        });
      } else {
        prev.count += 1;
        if (b.status !== "cancelled") prev.spent += bookingCollectedAmount(b);
        if (b.createdAt > prev.lastAt) prev.lastAt = b.createdAt;
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      b.lastAt.localeCompare(a.lastAt)
    );
  }, [bookings]);

  return (
    <div className="space-y-8">
      <div className="max-w-xl space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[28px]">
          {t("customersTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-500">
          {t("customersSubtitle")}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-zinc-100 bg-zinc-50/80 text-left text-xs text-zinc-500">
              <tr>
                <th className="px-5 py-3.5 font-medium">{t("colCustomer")}</th>
                <th className="px-5 py-3.5 font-medium">{t("colContact")}</th>
                <th className="px-5 py-3.5 font-medium">{t("colBookings")}</th>
                <th className="px-5 py-3.5 font-medium text-right">
                  {t("colSpent")}
                </th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.email || c.phone} className="border-t border-zinc-100">
                  <td className="px-5 py-4 font-medium text-zinc-950">
                    {c.name}
                  </td>
                  <td className="px-5 py-4 text-zinc-500">
                    <div>{c.phone}</div>
                    <div className="text-xs text-zinc-400">{c.email}</div>
                  </td>
                  <td className="px-5 py-4 tabular-nums text-zinc-700">
                    {c.count}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums text-zinc-950">
                    {money(c.spent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
