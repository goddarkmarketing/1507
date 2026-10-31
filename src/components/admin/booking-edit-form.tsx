"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookingDatePicker,
  BookingTimePicker,
  formatDayMonthYear,
} from "@/components/booking/date-time-fields";
import { LocationSelect } from "@/components/booking/location-select";
import { useAdminStore } from "@/lib/admin/store";
import type { AdminBooking, AdminBookingPatch } from "@/lib/admin/types";
import { legsAtTariff, tariffTotal } from "@/lib/booking/admin-price";
import { getNightDriverSurcharge } from "@/lib/booking/booking-rules";
import {
  isBookingRemoteEnabled,
  statusUrl,
  voucherUrl,
} from "@/lib/booking/remote/config";
import { whatsappHref } from "@/lib/contact-links";
import { getBankAccounts, getPromptPay } from "@/lib/data/payment";
import { getLocation } from "@/lib/data/locations";
import { tariffVehicleCodes } from "@/lib/data/vehicles";
import { useLocationName } from "@/lib/i18n-labels";
import type { BookingLeg, VehicleCode } from "@/lib/types";

function isCashBooking(booking: AdminBooking) {
  return booking.paymentPlan === "pay-driver" || booking.payment?.method === "cash";
}

function money(n: number) {
  return `฿${n.toLocaleString("en-US")}`;
}

function parseBaht(value: string) {
  const n = Math.round(Number(value));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function updateMessage(
  bookingNumber: string,
  name: string,
  legs: BookingLeg[],
  total: number,
  placeName: (id: string) => string
) {
  const lines = legs.map((leg) => {
    const from = leg.pickupPlace?.trim() || placeName(leg.fromId);
    const to = leg.hotelName?.trim() || placeName(leg.toId);
    return `• ${formatDayMonthYear(leg.date)} ${leg.time} — ${from} → ${to} (${leg.vehicleCode})`;
  });
  return [
    `Krabi Links Taxi`,
    `Hello ${name}, your booking ${bookingNumber} has been updated.`,
    `สวัสดีค่ะ คุณ${name} การจอง ${bookingNumber} ได้รับการแก้ไขแล้ว`,
    ...lines,
    total > 0 ? `Total / ราคา: ${money(total)}` : "",
    `Voucher: ${voucherUrl(bookingNumber, "en")}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function depositMessage(
  bookingNumber: string,
  name: string,
  deposit: number,
  balance: number,
  total: number
) {
  const banks = getBankAccounts()
    .slice(0, 2)
    .map((bank) => `${bank.symbol} ${bank.accountNumber} ${bank.accountName}`)
    .join("\n");
  const promptPay = getPromptPay();
  return [
    `Krabi Links Taxi · Deposit request`,
    `สวัสดีค่ะ คุณ${name}`,
    `การจอง ${bookingNumber}`,
    `ราคาหลังส่วนลด ${money(total)}`,
    `มัดจำที่ต้องโอนตอนนี้ ${money(deposit)}`,
    `ส่วนต่างจ่ายภายหลัง ${money(balance)}`,
    promptPay.id ? `PromptPay: ${promptPay.id} (${promptPay.accountName})` : "",
    banks ? `โอนธนาคาร:\n${banks}` : "",
    `หลังโอนแล้ว แจ้งแอดมิน หรือตรวจสถานะที่ ${statusUrl("th")}`,
    `Booking no. ${bookingNumber}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function BookingEditForm({
  booking,
  onDone,
}: {
  booking: AdminBooking;
  onDone: () => void;
}) {
  const t = useTranslations("Admin");
  const tVehicle = useTranslations("Vehicles");
  const locName = useLocationName();
  const updateBooking = useAdminStore((s) => s.updateBooking);

  const [name, setName] = useState(booking.customerName ?? "");
  const [email, setEmail] = useState(booking.customerEmail ?? "");
  const [phone, setPhone] = useState(booking.customerPhone ?? "");
  const [flight, setFlight] = useState(booking.flightNumber ?? "");
  const [adults, setAdults] = useState(
    String(booking.adultCount ?? (booking.passengerCount || 1))
  );
  const [children, setChildren] = useState(String(booking.childCount ?? 0));
  const [infants, setInfants] = useState(String(booking.infantCount ?? 0));
  const [carSeat, setCarSeat] = useState(Boolean(booking.carSeatRequested));
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [legs, setLegs] = useState<BookingLeg[]>(booking.legs ?? []);
  const [price, setPrice] = useState(
    String((booking.totalPrice ?? 0) + (booking.discountAmount ?? 0))
  );
  const [discount, setDiscount] = useState(
    booking.discountAmount ? String(booking.discountAmount) : ""
  );
  const [deposit, setDeposit] = useState(
    booking.paymentPlan === "deposit" && (booking.amountDueNow ?? 0) > 0
      ? String(booking.amountDueNow)
      : ""
  );
  const [sendEmail, setSendEmail] = useState(false);
  const [sendWhatsapp, setSendWhatsapp] = useState(false);
  const [priceNote, setPriceNote] = useState<"tariff" | "missing" | null>(null);

  const priceEditable =
    booking.priceStatus !== "pending" &&
    booking.payment?.status !== "paid" &&
    (isCashBooking(booking) ||
      booking.paymentPlan === "deposit" ||
      booking.payment?.status === "awaiting-transfer");
  const vehicleCodes = [
    ...new Set<VehicleCode>([...tariffVehicleCodes, ...legs.map((leg) => leg.vehicleCode)]),
  ];

  const listPrice = parseBaht(price) ?? 0;
  const discountAmount = Math.min(parseBaht(discount) ?? 0, listPrice);
  const netPrice = Math.max(0, listPrice - discountAmount);
  const depositAmount = Math.min(parseBaht(deposit) ?? 0, netPrice);
  const balanceAfterDeposit = Math.max(0, netPrice - depositAmount);

  const priceSummary = useMemo(
    () => ({ listPrice, discountAmount, netPrice, depositAmount, balanceAfterDeposit }),
    [listPrice, discountAmount, netPrice, depositAmount, balanceAfterDeposit]
  );

  const reprice = (next: BookingLeg[], changedTariff: boolean) => {
    if (!changedTariff || !priceEditable) {
      setLegs(next);
      return;
    }
    const total = tariffTotal(booking.type, booking.service, next);
    const priced = total == null ? null : legsAtTariff(booking.type, booking.service, next);
    if (total == null || !priced) {
      setLegs(next);
      setPriceNote("missing");
      return;
    }
    setLegs(priced);
    setPrice(String(total));
    setPriceNote("tariff");
  };

  const updateLeg = (id: string, patch: Partial<BookingLeg>) => {
    const next = legs.map((leg) => (leg.id === id ? { ...leg, ...patch } : leg));
    const changedTariff =
      patch.vehicleCode !== undefined ||
      patch.time !== undefined ||
      patch.fromId !== undefined ||
      patch.toId !== undefined;
    reprice(next, changedTariff);
  };

  const buildPatch = (): AdminBookingPatch | null => {
    if (!name.trim() || !phone.trim()) {
      toast.error(t("editRequired"));
      return null;
    }
    if (legs.some((leg) => !leg.date || !leg.time)) {
      toast.error(t("editRequired"));
      return null;
    }
    const adultN = Math.max(1, Number.parseInt(adults, 10) || 1);
    const childN = Math.max(0, Number.parseInt(children, 10) || 0);
    const infantN = Math.max(0, Number.parseInt(infants, 10) || 0);
    const patch: AdminBookingPatch = {
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      flightNumber: flight.trim() || undefined,
      adultCount: adultN,
      childCount: childN || undefined,
      infantCount: infantN || undefined,
      passengerCount: adultN + childN + infantN,
      carSeatRequested: carSeat || undefined,
      notes: notes.trim() || undefined,
      legs: legs.map((leg) => ({
        ...leg,
        pickupPlace: leg.pickupPlace?.trim() || undefined,
        hotelName: leg.hotelName?.trim() || undefined,
      })),
    };

    if (priceEditable) {
      if (parseBaht(price) == null) {
        toast.error(t("editBadPrice"));
        return null;
      }
      const night = getNightDriverSurcharge(patch.legs ?? []);
      const rest = (patch.legs ?? []).slice(1).reduce((sum, leg) => sum + leg.price, 0);
      patch.legs = (patch.legs ?? []).map((leg, index) =>
        index === 0
          ? { ...leg, price: Math.max(0, priceSummary.listPrice - night - rest) }
          : leg
      );
      patch.totalPrice = priceSummary.netPrice;
      patch.discountAmount = priceSummary.discountAmount || undefined;
      patch.serviceCharge = night;

      if (priceSummary.depositAmount > 0) {
        patch.paymentPlan = "deposit";
        patch.amountDueNow = priceSummary.depositAmount;
        patch.balanceDue = priceSummary.balanceAfterDeposit;
        patch.payment = {
          method:
            booking.payment?.method === "cash"
              ? "promptpay"
              : booking.payment?.method ?? "promptpay",
          summary: `Deposit ${money(priceSummary.depositAmount)} · balance ${money(priceSummary.balanceAfterDeposit)}`,
          status: booking.payment?.status === "paid" ? "paid" : "awaiting-transfer",
          amountDue: priceSummary.depositAmount,
          balanceDue: priceSummary.balanceAfterDeposit,
          transferProof: booking.payment?.transferProof,
          bankSymbol: booking.payment?.bankSymbol,
        };
      } else {
        patch.paymentPlan = "pay-driver";
        patch.amountDueNow = 0;
        patch.balanceDue = priceSummary.netPrice;
        patch.payment = {
          method: "cash",
          summary: booking.payment?.summary || "Pay driver in cash",
          status: booking.payment?.status === "paid" ? "paid" : "awaiting-transfer",
          amountDue: 0,
          balanceDue: priceSummary.netPrice,
        };
      }
    }

    return patch;
  };

  const openWhatsApp = (text: string, phoneValue: string) => {
    window.open(
      `${whatsappHref(phoneValue)}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener"
    );
  };

  const save = () => {
    const patch = buildPatch();
    if (!patch) return;
    const emailCustomer = sendEmail && Boolean(patch.customerEmail) && isBookingRemoteEnabled();
    updateBooking(booking.id, patch, { emailCustomer });
    if (sendWhatsapp && patch.customerPhone) {
      openWhatsApp(
        updateMessage(
          booking.bookingNumber,
          patch.customerName ?? "",
          patch.legs ?? [],
          patch.totalPrice ?? booking.totalPrice,
          (id) => getLocation(id)?.name ?? id
        ),
        patch.customerPhone
      );
    }
    toast.success(emailCustomer ? t("editSavedEmailed") : t("editSaved"));
    onDone();
  };

  const sendDepositLink = () => {
    if (priceSummary.depositAmount <= 0) {
      toast.error(t("editDepositRequired"));
      return;
    }
    const patch = buildPatch();
    if (!patch) return;
    updateBooking(booking.id, patch, { emailCustomer: false });
    if (patch.customerPhone) {
      openWhatsApp(
        depositMessage(
          booking.bookingNumber,
          patch.customerName ?? "",
          priceSummary.depositAmount,
          priceSummary.balanceAfterDeposit,
          priceSummary.netPrice
        ),
        patch.customerPhone
      );
    }
    toast.success(t("editDepositSent"));
    onDone();
  };

  const field = "grid gap-1 text-xs font-medium text-zinc-500";

  return (
    <div className="space-y-4">
      <section className="grid gap-3 sm:grid-cols-2">
        <label className={`${field} sm:col-span-2`}>
          {t("editCustomerName")}
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className={field}>
          {t("detailPhone")}
          <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className={field}>
          {t("detailEmail")}
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className={field}>
          {t("flight")}
          <Input value={flight} onChange={(e) => setFlight(e.target.value)} />
        </label>
        <label className={field}>
          {t("adultCount")}
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            value={adults}
            onChange={(e) => setAdults(e.target.value.replace(/\D/g, "").slice(0, 2))}
          />
        </label>
        <label className={field}>
          {t("childCount")}
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={children}
            onChange={(e) => setChildren(e.target.value.replace(/\D/g, "").slice(0, 2) || "0")}
          />
        </label>
        <label className={field}>
          {t("infantCount")}
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={infants}
            onChange={(e) => setInfants(e.target.value.replace(/\D/g, "").slice(0, 2) || "0")}
          />
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 sm:col-span-2">
          <input
            type="checkbox"
            className="size-4 accent-amber-600"
            checked={carSeat}
            onChange={(e) => setCarSeat(e.target.checked)}
          />
          {t("carSeatYes")}
        </label>
      </section>

      {legs.map((leg, index) => (
        <section key={leg.id} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3">
          <p className="text-xs font-semibold text-zinc-700">
            {legs.length > 1 ? `${index + 1}. ` : ""}
            {locName(getLocation(leg.fromId))} → {locName(getLocation(leg.toId))}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className={`${field} sm:col-span-2`}>
              {t("editPickupArea")}
              <LocationSelect
                role="pickup"
                value={leg.fromId}
                excludeId={leg.toId}
                pairedId={leg.toId}
                onValueChange={(fromId) => updateLeg(leg.id, { fromId })}
              />
            </div>
            <div className={`${field} sm:col-span-2`}>
              {t("editDropoffArea")}
              <LocationSelect
                role="dropoff"
                value={leg.toId}
                excludeId={leg.fromId}
                pairedId={leg.fromId}
                onValueChange={(toId) => updateLeg(leg.id, { toId })}
              />
            </div>
            <label className={field}>
              {t("editPickupPlace")}
              <Input
                value={leg.pickupPlace ?? ""}
                onChange={(e) => updateLeg(leg.id, { pickupPlace: e.target.value })}
              />
            </label>
            <label className={field}>
              {t("editDropoffPlace")}
              <Input
                value={leg.hotelName ?? ""}
                onChange={(e) => updateLeg(leg.id, { hotelName: e.target.value })}
              />
            </label>
            <div className={field}>
              {t("editDate")}
              <BookingDatePicker value={leg.date} onChange={(date) => updateLeg(leg.id, { date })} />
            </div>
            <div className={field}>
              {t("editTime")}
              <BookingTimePicker value={leg.time} onChange={(time) => updateLeg(leg.id, { time })} />
            </div>
            <label className={`${field} sm:col-span-2`}>
              {t("detailVehicle")}
              <select
                value={leg.vehicleCode}
                onChange={(e) => updateLeg(leg.id, { vehicleCode: e.target.value as VehicleCode })}
                className="h-9 rounded-lg border border-input bg-white px-2.5 text-sm text-zinc-950"
              >
                {vehicleCodes.map((code) => (
                  <option key={code} value={code}>
                    {code} — {tVehicle(`${code}.name` as "ECO.name")}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>
      ))}

      <section className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={field}>
            {t("editListPrice")} (฿)
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={price}
              disabled={!priceEditable}
              onChange={(e) => {
                setPrice(e.target.value);
                setPriceNote(null);
              }}
            />
          </label>
          <label className={field}>
            {t("editDiscount")} (฿)
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={discount}
              disabled={!priceEditable}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </label>
        </div>
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950">
          {t("editNetPrice")}: {money(priceSummary.netPrice)}
          {priceSummary.discountAmount > 0 ? (
            <span className="ml-2 font-normal text-amber-800">
              ({t("editListPrice")} {money(priceSummary.listPrice)} − {t("editDiscount")}{" "}
              {money(priceSummary.discountAmount)})
            </span>
          ) : null}
        </p>
        {!priceEditable ? (
          <span className="text-xs text-zinc-400">{t("editPriceLocked")}</span>
        ) : priceNote === "tariff" ? (
          <span className="text-xs text-emerald-700">{t("editPriceFromTariff")}</span>
        ) : priceNote === "missing" ? (
          <span className="text-xs text-amber-700">{t("editNoTariff")}</span>
        ) : null}
      </section>

      <fieldset className="space-y-3 rounded-xl border border-sky-200 bg-sky-50/70 p-3">
        <legend className="px-1 text-xs font-semibold text-sky-900">{t("editDepositTitle")}</legend>
        <p className="text-xs leading-relaxed text-sky-900">{t("editDepositHint")}</p>
        <label className={field}>
          {t("editDepositAmount")} (฿)
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={deposit}
            disabled={!priceEditable}
            onChange={(e) => setDeposit(e.target.value)}
          />
        </label>
        {priceSummary.depositAmount > 0 ? (
          <p className="text-sm text-sky-950">
            {t("editDepositBalance")}:{" "}
            <span className="font-semibold">{money(priceSummary.balanceAfterDeposit)}</span>
          </p>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="w-full border-sky-300 bg-white"
          disabled={!priceEditable || priceSummary.depositAmount <= 0 || !phone.trim()}
          onClick={sendDepositLink}
        >
          {t("editDepositSend")}
        </Button>
      </fieldset>

      <section className="grid gap-3">
        <label className={field}>
          {t("detailCustomerNotes")}
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-16" />
        </label>
      </section>

      <fieldset className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
        <legend className="px-1 text-xs font-semibold text-emerald-800">{t("editNotifyTitle")}</legend>
        <p className="text-xs leading-relaxed text-emerald-900">{t("editNotifyKeep")}</p>
        <label className="flex items-center gap-2 text-sm text-zinc-800">
          <input
            type="checkbox"
            className="size-4 accent-emerald-600"
            checked={sendEmail && Boolean(email.trim())}
            disabled={!email.trim()}
            onChange={(e) => setSendEmail(e.target.checked)}
          />
          {t("editNotifyEmail")}
          {email.trim() ? <span className="truncate text-xs text-zinc-500">({email.trim()})</span> : null}
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-800">
          <input
            type="checkbox"
            className="size-4 accent-emerald-600"
            checked={sendWhatsapp && Boolean(phone.trim())}
            disabled={!phone.trim()}
            onChange={(e) => setSendWhatsapp(e.target.checked)}
          />
          {t("editNotifyWhatsapp")}
        </label>
      </fieldset>

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onDone}>
          {t("catalogCancel")}
        </Button>
        <Button type="button" className="flex-1" onClick={save}>
          {t("editSave")}
        </Button>
      </div>
    </div>
  );
}
