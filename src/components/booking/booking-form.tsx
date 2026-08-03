"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { PaymentSection } from "@/components/booking/payment-section";
import { cn } from "@/lib/utils";
import { locations } from "@/lib/data/locations";
import { vehicles } from "@/lib/data/vehicles";
import { useBookingStore } from "@/lib/booking/store";
import { getLocation } from "@/lib/data/locations";
import type { BookingType } from "@/lib/types";

const bookingTypes: {
  value: BookingType;
  label: string;
  desc: string;
  detail: string;
}[] = [
  {
    value: "one-way",
    label: "One Way",
    desc: "Single transfer",
    detail: "Single point-to-point transfer.",
  },
  {
    value: "round-trip",
    label: "Round Trip",
    desc: "Return journey included",
    detail: "We'll automatically create a return leg with reversed route.",
  },
  {
    value: "multi-route",
    label: "Multi Route",
    desc: "Multiple destinations",
    detail: "Add as many route legs as you need for your journey.",
  },
  {
    value: "multi-day",
    label: "Multi Day",
    desc: "Different dates",
    detail: "Schedule transfers on different dates within one booking.",
  },
  {
    value: "daily-charter",
    label: "Daily Charter",
    desc: "8 hours full day",
    detail: "Full day charter (8 hours) — choose your vehicle and start time.",
  },
  {
    value: "hourly-charter",
    label: "Hourly Charter",
    desc: "Min 3 hours",
    detail: "Minimum 3 hours — flexible stops within your charter period.",
  },
];

export function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    draft,
    setBookingType,
    addLeg,
    removeLeg,
    updateLeg,
    setCustomer,
    setPaymentMethod,
    setCardField,
    setTransferBank,
    setTransferProof,
    confirmBooking,
    getLegPrice,
    getTotalPrice,
  } = useBookingStore();

  const [paying, setPaying] = useState(false);

  // Fill today's date client-side only (avoids SSR date mismatch)
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    draft.legs.forEach((leg) => {
      if (!leg.date) updateLeg(leg.id, { date: today });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const vehicle = searchParams.get("vehicle");
    const type = searchParams.get("type");

    if (type === "one-way" || type === "round-trip") {
      setBookingType(type);
    }

    if (draft.legs[0]) {
      const updates: {
        fromId?: string;
        toId?: string;
        vehicleCode?: typeof draft.legs[0]["vehicleCode"];
      } = {};
      if (from) updates.fromId = from;
      if (to) updates.toId = to;
      if (
        vehicle &&
        ["ECO", "PREM", "SUV", "VAN", "VIP", "SIG", "EXE", "BUS"].includes(vehicle)
      ) {
        updates.vehicleCode = vehicle as typeof draft.legs[0]["vehicleCode"];
      }
      if (Object.keys(updates).length > 0) {
        updateLeg(draft.legs[0].id, updates);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleConfirm = async () => {
    if (!draft.customerName || !draft.customerEmail || !draft.customerPhone) {
      toast.error("Please complete all customer details");
      return;
    }
    if (!draft.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (draft.paymentMethod === "bank-transfer") {
      if (!draft.transferBankSymbol) {
        toast.error("Please select the bank account you transferred to");
        return;
      }
      if (!draft.transferProof) {
        toast.error("Please attach your transfer proof");
        return;
      }
    }
    if (draft.paymentMethod === "card") {
      const digits = draft.card.cardNumber.replace(/\s/g, "");
      if (
        digits.length < 15 ||
        !draft.card.cardName.trim() ||
        draft.card.expiry.length < 4 ||
        draft.card.cvv.length < 3
      ) {
        toast.error("Please complete all card details (mock)");
        return;
      }
    }

    setPaying(true);
    await new Promise((r) => setTimeout(r, 900));

    const booking = confirmBooking();
    setPaying(false);

    if (!booking) {
      toast.error("Could not confirm booking. Please check your details.");
      return;
    }

    if (booking.payment?.status === "awaiting-transfer") {
      toast.success("Booking submitted — awaiting transfer verification");
    } else {
      toast.success("Payment successful (mock) — e-Voucher issued");
    }
    router.push(`/booking/voucher/${booking.bookingNumber}`);
  };

  const isCharter =
    draft.type === "daily-charter" || draft.type === "hourly-charter";
  const total = getTotalPrice();

  const confirmLabel =
    draft.paymentMethod === "bank-transfer"
      ? "Confirm booking (awaiting transfer)"
      : draft.paymentMethod === "card"
        ? "Pay by card & confirm"
        : draft.paymentMethod === "promptpay"
          ? "Confirm PromptPay payment"
          : "Confirm Booking";

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-3 lg:px-8">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Type</CardTitle>
            <CardDescription>
              All booking types in one reservation — add routes, days, or charter as needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={draft.type}
              onValueChange={(v) => v && setBookingType(v as BookingType)}
              className="grid grid-cols-2 gap-3 lg:grid-cols-3"
            >
              {bookingTypes.map((type) => {
                const selected = draft.type === type.value;
                return (
                  <Label
                    key={type.value}
                    htmlFor={`booking-type-${type.value}`}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors",
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    <RadioGroupItem
                      id={`booking-type-${type.value}`}
                      value={type.value}
                      className="mt-0.5"
                    />
                    <span className="min-w-0 space-y-0.5">
                      <span className="block text-sm font-semibold leading-none">
                        {type.label}
                      </span>
                      <span className="block text-xs leading-snug text-muted-foreground">
                        {type.desc}
                      </span>
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
              {bookingTypes.find((t) => t.value === draft.type)?.detail}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {isCharter ? "Charter Details" : "Route Details"}
            </h2>
            {(draft.type === "multi-route" || draft.type === "multi-day") && (
              <Button variant="outline" size="sm" onClick={addLeg}>
                <Plus className="size-4" />
                Add Route
              </Button>
            )}
          </div>

          {draft.legs.map((leg, index) => (
            <Card key={leg.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">
                  {isCharter ? "Charter" : "Route"} {index + 1}
                </CardTitle>
                {draft.legs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeLeg(leg.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {!isCharter && (
                  <>
                    <div className="space-y-2">
                      <Label>Pickup Location</Label>
                      <Select
                        value={leg.fromId}
                        onValueChange={(v) => v && updateLeg(leg.id, { fromId: v })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id}>
                              {loc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Drop-off Location</Label>
                      <Select
                        value={leg.toId}
                        onValueChange={(v) => v && updateLeg(leg.id, { toId: v })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id}>
                              {loc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={leg.date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => updateLeg(leg.id, { date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pickup Time</Label>
                  <Input
                    type="time"
                    value={leg.time}
                    onChange={(e) => updateLeg(leg.id, { time: e.target.value })}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Vehicle</Label>
                  <Select
                    value={leg.vehicleCode}
                    onValueChange={(v) =>
                      v &&
                      updateLeg(leg.id, {
                        vehicleCode: v as typeof leg.vehicleCode,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v) => (
                        <SelectItem key={v.code} value={v.code}>
                          {v.code} — {v.name} ({v.passengers} pax, {v.luggage})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <span className="text-sm text-muted-foreground">Leg price</span>
                  <span className="text-lg font-bold">
                    ฿{getLegPrice(leg).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={draft.customerName}
                onChange={(e) => setCustomer("customerName", e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={draft.customerPhone}
                onChange={(e) => setCustomer("customerPhone", e.target.value)}
                placeholder="+66 ..."
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={draft.customerEmail}
                onChange={(e) => setCustomer("customerEmail", e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flight">Flight Number (optional)</Label>
              <Input
                id="flight"
                value={draft.flightNumber}
                onChange={(e) => setCustomer("flightNumber", e.target.value)}
                placeholder="FD1234"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Special Requests</Label>
              <Textarea
                id="notes"
                value={draft.notes}
                onChange={(e) => setCustomer("notes", e.target.value)}
                placeholder="Child seat, extra stops, etc."
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
            <CardDescription>
              Choose how to pay — bank details, QR, and card fields are mock demo data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentSection
              amount={total}
              method={draft.paymentMethod}
              onMethodChange={setPaymentMethod}
              card={draft.card}
              onCardChange={setCardField}
              transferBankSymbol={draft.transferBankSymbol}
              onTransferBankChange={setTransferBank}
              transferProof={draft.transferProof}
              onTransferProofChange={setTransferProof}
              transferRef="KLT-PENDING"
            />
          </CardContent>
        </Card>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
            <CardDescription>Review before confirming</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge variant="secondary" className="capitalize">
              {draft.type.replace("-", " ")}
            </Badge>

            {draft.legs.map((leg, i) => {
              const from = getLocation(leg.fromId);
              const to = getLocation(leg.toId);
              const vehicle = vehicles.find((v) => v.code === leg.vehicleCode);
              return (
                <div key={leg.id} className="space-y-1 text-sm">
                  <p className="font-medium">
                    {isCharter
                      ? `Charter ${i + 1}`
                      : `${from?.name.split("(")[0].trim()} → ${to?.name.split("(")[0].trim()}`}
                  </p>
                  <p className="text-muted-foreground">
                    {leg.date} at {leg.time} · {vehicle?.name}
                  </p>
                  <p className="font-medium">
                    ฿{getLegPrice(leg).toLocaleString("en-US")}
                  </p>
                  {i < draft.legs.length - 1 && <Separator className="my-3" />}
                </div>
              );
            })}

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-2xl font-bold text-primary">
                ฿{total.toLocaleString("en-US")}
              </span>
            </div>

            {draft.paymentMethod && (
              <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                Payment method:{" "}
                <span className="font-medium text-foreground">
                  {draft.paymentMethod === "bank-transfer" && "Bank Transfer"}
                  {draft.paymentMethod === "card" && "Credit / Debit Card"}
                  {draft.paymentMethod === "promptpay" && "PromptPay"}
                </span>
              </p>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleConfirm}
              disabled={paying}
            >
              {paying ? "Processing..." : confirmLabel}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Demo payment — no real charge · e-Voucher issued after confirmation
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
