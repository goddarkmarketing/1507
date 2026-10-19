"use client";

import { useState } from "react";
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
import { useAdminStore } from "@/lib/admin/store";
import type { AdminBooking, AdminBookingPatch } from "@/lib/admin/types";
import { isBookingRemoteEnabled, voucherUrl } from "@/lib/booking/remote/config";
import { whatsappHref } from "@/lib/contact-links";
import { getLocation } from "@/lib/data/locations";
import { tariffVehicleCodes } from "@/lib/data/vehicles";
import { useLocationName } from "@/lib/i18n-labels";
import type { BookingLeg, VehicleCode } from "@/lib/types";

function isCashBooking(booking: AdminBooking) {
  return booking.paymentPlan === "pay-driver" || booking.payment?.method === "cash";
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
    total > 0 ? `Total / ราคา: ฿${total.toLocaleString("en-US")}` : "",
    `Voucher: ${voucherUrl(bookingNumber, "en")}`,
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
  const [passengers, setPassengers] = useState(
    booking.passengerCount ? String(booking.passengerCount) : ""
  );
  const [notes, setNotes] = useState(booking.notes ?? "");
  const [legs, setLegs] = useState<BookingLeg[]>(booking.legs ?? []);
  const [price, setPrice] = useState(String(booking.totalPrice ?? ""));
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsapp, setSendWhatsapp] = useState(false);

  const priceEditable =
    booking.priceStatus !== "pending" &&
    booking.payment?.status !== "paid" &&
    isCashBooking(booking);
  const vehicleCodes = [
    ...new Set<VehicleCode>([...tariffVehicleCodes, ...legs.map((leg) => leg.vehicleCode)]),
  ];

  const updateLeg = (id: string, patch: Partial<BookingLeg>) =>
    setLegs((current) => current.map((leg) => (leg.id === id ? { ...leg, ...patch } : leg)));

  const save = () => {
    if (!name.trim() || !phone.trim()) {
      toast.error(t("editRequired"));
      return;
    }
    if (legs.some((leg) => !leg.date || !leg.time)) {
      toast.error(t("editRequired"));
      return;
    }
    const count = Number.parseInt(passengers, 10);
    const patch: AdminBookingPatch = {
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      flightNumber: flight.trim() || undefined,
      passengerCount: count > 0 ? count : undefined,
      notes: notes.trim() || undefined,
      legs: legs.map((leg) => ({
        ...leg,
        pickupPlace: leg.pickupPlace?.trim() || undefined,
        hotelName: leg.hotelName?.trim() || undefined,
      })),
    };

    if (priceEditable) {
      const total = Math.round(Number(price));
      if (!Number.isFinite(total) || total < 0) {
        toast.error(t("editBadPrice"));
        return;
      }
      if (total !== booking.totalPrice) {
        const rest = (patch.legs ?? []).slice(1).reduce((sum, leg) => sum + leg.price, 0);
        patch.legs = (patch.legs ?? []).map((leg, index) =>
          index === 0 ? { ...leg, price: Math.max(0, total - rest) } : leg
        );
        patch.totalPrice = total;
        patch.balanceDue = total;
        patch.payment = booking.payment
          ? { ...booking.payment, balanceDue: total }
          : booking.payment;
      }
    }

    const emailCustomer = sendEmail && Boolean(patch.customerEmail) && isBookingRemoteEnabled();
    updateBooking(booking.id, patch, { emailCustomer });
    if (sendWhatsapp && patch.customerPhone) {
      const text = updateMessage(
        booking.bookingNumber,
        patch.customerName ?? "",
        patch.legs ?? [],
        patch.totalPrice ?? booking.totalPrice,
        (id) => getLocation(id)?.name ?? id
      );
      window.open(
        `${whatsappHref(patch.customerPhone)}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener"
      );
    }
    toast.success(emailCustomer ? t("editSavedEmailed") : t("editSaved"));
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
          {t("passengerCount")}
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            value={passengers}
            onChange={(e) => setPassengers(e.target.value.replace(/\D/g, "").slice(0, 2))}
          />
        </label>
      </section>

      {legs.map((leg, index) => (
        <section key={leg.id} className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/70 p-3">
          <p className="text-xs font-semibold text-zinc-700">
            {legs.length > 1 ? `${index + 1}. ` : ""}
            {locName(getLocation(leg.fromId))} → {locName(getLocation(leg.toId))}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
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

      <section className="grid gap-3">
        <label className={field}>
          {t("detailPrice")} (฿)
          <Input
            type="number"
            inputMode="numeric"
            min={0}
            value={price}
            disabled={!priceEditable}
            onChange={(e) => setPrice(e.target.value)}
          />
          {!priceEditable ? (
            <span className="font-normal text-zinc-400">{t("editPriceLocked")}</span>
          ) : null}
        </label>
        <label className={field}>
          {t("detailCustomerNotes")}
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-16" />
        </label>
      </section>

      <fieldset className="space-y-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
        <legend className="px-1 text-xs font-semibold text-emerald-800">{t("editNotifyTitle")}</legend>
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
