"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Plus, Trash2, CalendarClock, Wallet, PlaneTakeoff, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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
import { LocationSelect } from "@/components/booking/location-select";
import { PaymentSection } from "@/components/booking/payment-section";
import { RoutePreviewDialog } from "@/components/booking/route-preview-dialog";
import { RentalConditions } from "@/components/shared/rental-conditions";
import { cn } from "@/lib/utils";
import {
  getActiveRentalPackages,
  getRentalPackage,
} from "@/lib/data/rental-packages";
import { tariffVehicles, vehicles } from "@/lib/data/vehicles";
import { useBookingStore } from "@/lib/booking/store";
import {
  getAmountDueNow,
  getBookingService,
  getRemainingBalance,
  isCarRentalService,
} from "@/lib/booking/booking-mode";
import {
  getNightDriverSurcharge,
  hasAdvanceBooking,
  isNightPickupTime,
  minPickupInstant,
  NIGHT_DRIVER_SURCHARGE_THB,
  toBangkokDateInput,
} from "@/lib/booking/booking-rules";
import {
  bookingFieldClass,
  bookingSelectTriggerClass,
  bookingSummaryBarClass,
} from "@/lib/booking/form-field-styles";
import {
  shouldShowRoutePreview,
} from "@/lib/booking/route-preview";
import {
  getActiveCancelPolicy,
  getActiveRentalDeposits,
  useSettingsRevision,
} from "@/lib/admin/settings-store";
import { getLocation } from "@/lib/data/locations";
import { useLocationName, useVehicleCopy } from "@/lib/i18n-labels";
import type { BookingType } from "@/lib/types";

const bookingTypeValues: BookingType[] = [
  "one-way",
  "round-trip",
  "multi-route",
  "multi-day",
  "daily-charter",
  "hourly-charter",
];

type WizardStep = 1 | 2 | 3;
const WIZARD_STEPS = 3;

export function BookingForm() {
  const t = useTranslations("Booking");
  const tPay = useTranslations("Payment");
  const locName = useLocationName();
  const { name: vehicleName, selectLabel, luggage } = useVehicleCopy();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    draft,
    setBookingType,
    addLeg,
    removeLeg,
    updateLeg,
    setCustomer,
    setService,
    setRentalPackage,
    setRentalDays,
    setPaymentPlan,
    setPaymentMethod,
    setCardField,
    setTransferBank,
    setTransferProof,
    confirmBooking,
    getLegPrice,
    getTotalPrice,
    ensureTransferRef,
  } = useBookingStore();
  useSettingsRevision();
  const cancelPolicy = getActiveCancelPolicy();
  const rentalDeposits = getActiveRentalDeposits();
  const formatDeposit = (amount: number) =>
    `฿${amount.toLocaleString("en-US")}`;
  const isRentalBooking = isCarRentalService(
    getBookingService(searchParams.get("service"))
  );
  const bookingService = draft.service;

  useEffect(() => {
    setService(isRentalBooking ? "rental" : "transfer");
  }, [isRentalBooking, setService]);

  useEffect(() => {
    ensureTransferRef();
  }, [ensureTransferRef]);

  useEffect(() => {
    if (!isRentalBooking) return;
    const packageId = searchParams.get("package");
    if (packageId && getRentalPackage(packageId)) {
      setRentalPackage(packageId);
    }
  }, [isRentalBooking, searchParams, setRentalPackage]);

  const [paying, setPaying] = useState(false);
  const [step, setStep] = useState<WizardStep>(1);
  const prevDropoffRef = useRef<Map<string, string>>(new Map());
  const [routePreview, setRoutePreview] = useState<{
    fromId: string;
    toId: string;
    vehicleCode: (typeof draft.legs)[number]["vehicleCode"];
  } | null>(null);

  const isCharter =
    draft.type === "daily-charter" || draft.type === "hourly-charter";

  useEffect(() => {
    setStep(1);
  }, [isRentalBooking]);

  useEffect(() => {
    if (isCharter || isRentalBooking) return;

    for (const leg of draft.legs) {
      const prevToId = prevDropoffRef.current.get(leg.id);
      prevDropoffRef.current.set(leg.id, leg.toId);

      if (prevToId === leg.toId) continue;
      if (!shouldShowRoutePreview(leg.fromId, leg.toId)) continue;

      setRoutePreview({
        fromId: leg.fromId,
        toId: leg.toId,
        vehicleCode: leg.vehicleCode,
      });
      break;
    }
  }, [draft.legs, isCharter, isRentalBooking]);

  // Default pickup date = now + 24h (Bangkok), client-only to avoid SSR mismatch
  useEffect(() => {
    const minDate = toBangkokDateInput(minPickupInstant());
    draft.legs.forEach((leg) => {
      if (!leg.date) updateLeg(leg.id, { date: minDate });
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
        ["ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "BUS"].includes(vehicle)
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
      toast.error(t("toastCustomer"));
      setStep(2);
      return;
    }
    if (!draft.paymentPlan) {
      toast.error(t("toastPaymentPlan"));
      return;
    }
    if (!draft.paymentMethod) {
      toast.error(t("toastPayment"));
      return;
    }
    if (draft.paymentPlan !== "pay-driver") {
      if (draft.paymentMethod === "bank-transfer") {
        if (!draft.transferBankSymbol) {
          toast.error(tPay("toastBank"));
          return;
        }
        if (!draft.transferProof) {
          toast.error(tPay("toastProof"));
          return;
        }
      }
      if (draft.paymentMethod === "promptpay") {
        if (!draft.transferProof) {
          toast.error(tPay("toastProof"));
          return;
        }
      }
    }

    if (
      bookingService !== "rental" &&
      !hasAdvanceBooking(draft.legs)
    ) {
      toast.error(t("toastAdvance24h"));
      setStep(1);
      return;
    }

    setPaying(true);
    await new Promise((r) => setTimeout(r, 600));

    const booking = confirmBooking({ service: bookingService });
    setPaying(false);

    if (!booking) {
      toast.error(t("toastFail"));
      return;
    }

    if (booking.paymentPlan === "pay-driver") {
      toast.success(t("confirmPayDriver"));
    } else if (booking.payment?.status === "awaiting-transfer") {
      if (booking.payment.method === "promptpay") {
        toast.success(t("confirmPromptPay"));
      } else {
        toast.success(t("confirmBank"));
      }
    } else {
      toast.success(t("confirmBooking"));
    }
    router.push(`/booking/voucher/?n=${booking.bookingNumber}`);
  };

  const validateTripStep = () => {
    if (isRentalBooking) {
      if (!draft.rentalPackageId) {
        toast.error(t("toastRentalIncomplete"));
        return false;
      }
      for (const leg of draft.legs) {
        if (!leg.date || !leg.time) {
          toast.error(t("toastRentalIncomplete"));
          return false;
        }
      }
      return true;
    }

    for (const leg of draft.legs) {
      if (!isCharter && (!leg.fromId || !leg.toId)) {
        toast.error(t("toastTripIncomplete"));
        return false;
      }
      if (!leg.date || !leg.time || !leg.vehicleCode) {
        toast.error(t("toastTripIncomplete"));
        return false;
      }
    }

    if (!hasAdvanceBooking(draft.legs)) {
      toast.error(t("toastAdvance24h"));
      return false;
    }

    return true;
  };

  const validateCustomerStep = () => {
    if (!draft.customerName || !draft.customerEmail || !draft.customerPhone) {
      toast.error(t("toastCustomer"));
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (step === 1 && !validateTripStep()) return;
    if (step === 2 && !validateCustomerStep()) return;
    if (step < WIZARD_STEPS) {
      setStep((s) => (s + 1) as WizardStep);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as WizardStep);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const stepLabels = [
    t("wizardStepTrip"),
    t("wizardStepCustomer"),
    t("wizardStepPayment"),
  ] as const;

  const total = getTotalPrice();
  const nightSurcharge =
    bookingService === "rental" ? 0 : getNightDriverSurcharge(draft.legs);
  const hasNightPickup = draft.legs.some((leg) => isNightPickupTime(leg.time));
  const minLegDate = toBangkokDateInput(minPickupInstant());
  const amountDue = getAmountDueNow(total, bookingService, draft.paymentPlan);
  const balanceDue = getRemainingBalance(
    total,
    bookingService,
    draft.paymentPlan
  );

  const confirmLabel =
    draft.paymentPlan === "pay-driver"
      ? t("confirmPayDriver")
      : draft.paymentMethod === "bank-transfer"
        ? t("confirmBank")
        : draft.paymentMethod === "promptpay"
          ? t("confirmPromptPay")
          : t("confirmBooking");

  const fieldClass = bookingFieldClass;
  const selectTriggerClass = bookingSelectTriggerClass;

  return (
    <div className="mx-auto max-w-7xl space-y-5 px-3 py-4 pb-[calc(9.5rem+env(safe-area-inset-bottom,0px))] sm:space-y-8 sm:px-4 sm:py-8 md:pb-8 lg:px-8">
      {isRentalBooking && <RentalConditions />}

      <div className="grid gap-5 sm:gap-8 lg:grid-cols-3">
      <div className="space-y-4 sm:space-y-6 lg:col-span-2">
        <nav
          aria-label={t("wizardStepOf", { current: step, total: WIZARD_STEPS })}
          className="rounded-xl border bg-card px-3 py-3 sm:px-4"
        >
          <p className="mb-3 text-xs font-medium text-muted-foreground sm:text-sm">
            {t("wizardStepOf", { current: step, total: WIZARD_STEPS })}
          </p>
          <ol className="flex items-center gap-1.5 sm:gap-2">
            {stepLabels.map((label, index) => {
              const n = (index + 1) as WizardStep;
              const active = step === n;
              const done = step > n;
              return (
                <li
                  key={label}
                  className={cn(
                    "flex min-w-0 items-center gap-1.5 sm:gap-2",
                    n < WIZARD_STEPS && "flex-1"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold sm:size-8 sm:text-sm",
                      active && "bg-primary text-primary-foreground",
                      done && "bg-primary/15 text-primary",
                      !active && !done && "bg-muted text-muted-foreground"
                    )}
                  >
                    {n}
                  </span>
                  <span
                    className={cn(
                      "hidden truncate text-[11px] font-medium sm:inline sm:text-sm",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                  {n < WIZARD_STEPS && (
                    <span
                      className={cn(
                        "mx-0.5 h-px min-w-3 flex-1 sm:min-w-4",
                        done ? "bg-primary/40" : "bg-border"
                      )}
                      aria-hidden
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {step === 1 && (
          <>
        {isRentalBooking ? (
          <Card className="md:[--card-spacing:--spacing(4)]" size="sm">
            <CardHeader className="gap-1">
              <CardTitle className="text-base sm:text-lg">
                {t("rentalBookingTitle")}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("rentalBookingSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="col-span-2 space-y-1.5 sm:space-y-2">
                <Label>{t("rentalModel")}</Label>
                <Select
                  value={draft.rentalPackageId}
                  onValueChange={(v) => v && setRentalPackage(v)}
                >
                  <SelectTrigger className={selectTriggerClass}>
                    <SelectValue placeholder={t("rentalModel")} />
                  </SelectTrigger>
                  <SelectContent>
                    {getActiveRentalPackages().map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.model} ({pkg.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label>{t("rentalDays")}</Label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  className={fieldClass}
                  value={draft.rentalDays}
                  onChange={(e) =>
                    setRentalDays(Number.parseInt(e.target.value, 10) || 1)
                  }
                />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label>{t("estimatedTotal")}</Label>
                <div className={bookingSummaryBarClass}>
                  <span className="text-sm leading-none text-muted-foreground">
                    {getRentalPackage(draft.rentalPackageId)?.model ?? "—"}
                  </span>
                  <span className="text-sm font-bold leading-none">
                    ฿{total.toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
        <Card className="md:[--card-spacing:--spacing(4)]" size="sm">
          <CardHeader className="gap-1">
            <CardTitle className="text-base sm:text-lg">{t("typeTitle")}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {t("typeSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <RadioGroup
              value={draft.type}
              onValueChange={(v) => v && setBookingType(v as BookingType)}
              className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3"
            >
              {bookingTypeValues.map((typeValue) => {
                const selected = draft.type === typeValue;
                return (
                  <Label
                    key={typeValue}
                    htmlFor={`booking-type-${typeValue}`}
                    className={cn(
                      "flex cursor-pointer items-start gap-2 rounded-xl border p-2.5 transition-colors sm:gap-3 sm:p-3.5",
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-muted/40"
                    )}
                  >
                    <RadioGroupItem
                      id={`booking-type-${typeValue}`}
                      value={typeValue}
                      className="mt-0.5"
                    />
                    <span className="min-w-0 space-y-0.5">
                      <span className="block text-[13px] font-semibold leading-tight sm:text-sm sm:leading-none">
                        {t(`types.${typeValue}.label`)}
                      </span>
                      <span className="block text-[11px] leading-snug text-muted-foreground sm:text-xs">
                        {t(`types.${typeValue}.desc`)}
                      </span>
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground sm:text-sm">
              {t(`types.${draft.type}.detail`)}
            </p>
          </CardContent>
        </Card>
        )}

        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold sm:text-lg">
              {isRentalBooking
                ? t("rentalPickupTitle")
                : isCharter
                  ? t("charterDetails")
                  : t("routeDetails")}
            </h2>
            {!isRentalBooking &&
              (draft.type === "multi-route" || draft.type === "multi-day") && (
              <Button variant="outline" size="sm" onClick={addLeg}>
                <Plus className="size-4" />
                {t("addRoute")}
              </Button>
            )}
          </div>

          {draft.legs.map((leg, index) => (
            <Card key={leg.id} size="sm">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                <CardTitle className="text-sm sm:text-base">
                  {isCharter
                    ? t("charterN", { n: index + 1 })
                    : t("routeN", { n: index + 1 })}
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
              <CardContent className="grid grid-cols-2 gap-3 sm:gap-4">
                {!isCharter && (
                  <>
                    <div className="col-span-2 space-y-1.5 sm:space-y-2">
                      <Label>{t("pickup")}</Label>
                      <LocationSelect
                        role="pickup"
                        value={leg.fromId}
                        onValueChange={(v) => updateLeg(leg.id, { fromId: v })}
                        excludeId={leg.toId}
                        placeholder={t("pickup")}
                        className={selectTriggerClass}
                      />
                    </div>
                    <div className="col-span-2 space-y-1.5 sm:space-y-2">
                      <Label>{t("dropoff")}</Label>
                      <LocationSelect
                        role="dropoff"
                        value={leg.toId}
                        onValueChange={(v) => updateLeg(leg.id, { toId: v })}
                        excludeId={leg.fromId}
                        placeholder={t("dropoff")}
                        className={selectTriggerClass}
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5 sm:space-y-2">
                  <Label>{t("date")}</Label>
                  <Input
                    type="date"
                    className={fieldClass}
                    value={leg.date}
                    min={minLegDate}
                    onChange={(e) => updateLeg(leg.id, { date: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label>{t("pickupTime")}</Label>
                  <Input
                    type="time"
                    className={fieldClass}
                    value={leg.time}
                    onChange={(e) => updateLeg(leg.id, { time: e.target.value })}
                  />
                </div>

                {!isRentalBooking && (
                <div className="col-span-2 space-y-1.5 sm:space-y-2">
                  <Label>{t("vehicle")}</Label>
                  <Select
                    value={leg.vehicleCode}
                    onValueChange={(v) =>
                      v &&
                      updateLeg(leg.id, {
                        vehicleCode: v as typeof leg.vehicleCode,
                      })
                    }
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder={t("selectVehicle")}>
                        {(() => {
                          const v = vehicles.find(
                            (item) => item.code === leg.vehicleCode
                          );
                          return v ? selectLabel(v) : t("selectVehicle");
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tariffVehicles.map((v) => (
                        <SelectItem key={v.code} value={v.code}>
                          {selectLabel(v)} · {luggage(v.code)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                )}

                {!isRentalBooking && (
                <div className={bookingSummaryBarClass}>
                  <span className="text-sm leading-none text-muted-foreground">
                    {t("legPrice")}
                  </span>
                  <span className="text-sm font-bold leading-none">
                    ฿{getLegPrice(leg).toLocaleString()}
                  </span>
                </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
          </>
        )}

        {step === 2 && (
        <Card size="sm">
          <CardHeader className="gap-1">
            <CardTitle className="text-base sm:text-lg">{t("customerTitle")}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {isRentalBooking
                ? t("customerSubtitleRental")
                : t("customerSubtitleTransfer")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {isRentalBooking && (
            <div className="space-y-1.5 sm:col-span-2 sm:space-y-2">
              <ul className="space-y-1.5 rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 py-2.5 text-xs text-amber-950 sm:text-sm">
                <li>{t("reqHintId")}</li>
                <li>{t("reqHintFlight")}</li>
                <li>{t("reqHintPhone")}</li>
              </ul>
            </div>
            )}
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="name">{t("fullName")}</Label>
              <Input
                id="name"
                className={fieldClass}
                value={draft.customerName}
                onChange={(e) => setCustomer("customerName", e.target.value)}
                placeholder={t("phName")}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="phone">{t("phone")}</Label>
              <Input
                id="phone"
                className={fieldClass}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={draft.customerPhone}
                onChange={(e) => setCustomer("customerPhone", e.target.value)}
                placeholder={t("phPhone")}
              />
              <p className="text-[11px] text-muted-foreground">{t("phoneHint")}</p>
            </div>
            <div className="space-y-1.5 sm:col-span-2 sm:space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                className={fieldClass}
                type="email"
                inputMode="email"
                autoComplete="email"
                value={draft.customerEmail}
                onChange={(e) => setCustomer("customerEmail", e.target.value)}
                placeholder={t("phEmail")}
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="flight">
                {isRentalBooking ? t("flightLabelRental") : t("flightLabelTransfer")}
              </Label>
              <Input
                id="flight"
                className={fieldClass}
                value={draft.flightNumber}
                onChange={(e) => setCustomer("flightNumber", e.target.value)}
                placeholder={t("phFlight")}
              />
              <p className="text-[11px] text-muted-foreground">
                {isRentalBooking ? t("flightHintRental") : t("flightHintTransfer")}
              </p>
            </div>
            <div className="space-y-1.5 sm:col-span-2 sm:space-y-2">
              <Label htmlFor="notes">{t("specialRequests")}</Label>
              <Textarea
                id="notes"
                className="min-h-20 text-base md:text-sm"
                value={draft.notes}
                onChange={(e) => setCustomer("notes", e.target.value)}
                placeholder={t("phNotes")}
              />
            </div>
          </CardContent>
        </Card>
        )}

        {step === 3 && (
        <Card size="sm">
          <CardHeader className="gap-1">
            <CardTitle className="text-base sm:text-lg">{t("paymentTitle")}</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                {t("paymentSubtitlePlans")}
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <details className="group overflow-hidden rounded-xl border border-amber-200/80 bg-amber-50/80 open:bg-amber-50">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-left sm:px-4 [&::-webkit-details-marker]:hidden">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-amber-950">
                    {isRentalBooking
                      ? t("policyBoxTitle")
                      : t("policyBoxTitleTransfer")}
                  </p>
                  <p className="text-[11px] text-amber-900/70 sm:text-xs">
                    {isRentalBooking
                      ? t("policyBoxHint")
                      : t("policyBoxHintTransfer")}
                  </p>
                </div>
                <ChevronDown className="size-4 shrink-0 text-amber-800 transition-transform group-open:rotate-180" />
              </summary>

              <div className="divide-y divide-amber-200/60 border-t border-amber-200/70">
                <div className="flex gap-3 px-3 py-3 sm:px-4">
                  <CalendarClock className="mt-0.5 size-4 shrink-0 text-amber-800" />
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-semibold text-amber-950 sm:text-sm">
                      {t("cancelTitle")}
                    </p>
                    <p className="text-xs leading-relaxed text-amber-900/90 sm:text-sm">
                      {t("cancelPolicyNote", {
                        hours: cancelPolicy.freeCancelHours,
                        percent: cancelPolicy.lateFeePercent,
                      })}
                    </p>
                    <p className="text-xs leading-relaxed text-amber-900/90 sm:text-sm">
                      {t("noShowPolicyNote", {
                        percent: cancelPolicy.noShowPercent,
                      })}
                    </p>
                    <p className="text-xs leading-relaxed text-amber-900/90 sm:text-sm">
                      {t("refundPolicyNote", {
                        days: cancelPolicy.refundBusinessDays,
                      })}
                    </p>
                  </div>
                </div>

                {isRentalBooking && (
                <>
                <div className="flex gap-3 px-3 py-3 sm:px-4">
                  <Wallet className="mt-0.5 size-4 shrink-0 text-amber-800" />
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <p className="text-xs font-semibold text-amber-950 sm:text-sm">
                      {t("depositTitle")}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-white/90 px-2.5 py-2 ring-1 ring-amber-200/70">
                        <p className="text-[11px] text-amber-900/70">
                          {t("depositSmallLabel")}
                        </p>
                        <p className="text-sm font-bold text-amber-950">
                          {formatDeposit(rentalDeposits.smallCarDeposit)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/90 px-2.5 py-2 ring-1 ring-amber-200/70">
                        <p className="text-[11px] text-amber-900/70">
                          {t("depositLargeLabel")}
                        </p>
                        <p className="text-sm font-bold text-amber-950">
                          {formatDeposit(rentalDeposits.largeCarDeposit)}
                        </p>
                      </div>
                    </div>
                    <ol className="list-decimal space-y-1 pl-4 text-xs leading-relaxed text-amber-900/90 sm:text-sm">
                      <li>{t("depositStepAdvanceTier")}</li>
                      <li>{t("depositStepContract")}</li>
                      <li>{t("depositStepRefund")}</li>
                    </ol>
                  </div>
                </div>

                <div className="flex gap-3 px-3 py-3 sm:px-4">
                  <PlaneTakeoff className="mt-0.5 size-4 shrink-0 text-amber-800" />
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-xs font-semibold text-amber-950 sm:text-sm">
                      {t("airportTitle")}
                    </p>
                    <p className="text-xs leading-relaxed text-amber-900/90 sm:text-sm">
                      {t("airportTransferNote")}
                    </p>
                  </div>
                </div>
                </>
                )}
              </div>
            </details>
            <PaymentSection
              amount={amountDue}
              fullAmount={total}
              isRentalDeposit={draft.paymentPlan === "deposit"}
              paymentPlan={draft.paymentPlan}
              onPaymentPlanChange={setPaymentPlan}
              method={draft.paymentMethod}
              onMethodChange={setPaymentMethod}
              card={draft.card}
              onCardChange={setCardField}
              transferBankSymbol={draft.transferBankSymbol}
              onTransferBankChange={setTransferBank}
              transferProof={draft.transferProof}
              onTransferProofChange={setTransferProof}
              transferRef={draft.transferRef || "KLT-PENDING"}
            />
          </CardContent>
        </Card>
        )}

        <div className="hidden flex-wrap items-center gap-2 pt-1 lg:flex">
          {step > 1 && (
            <Button type="button" variant="outline" size="lg" onClick={goBack}>
              <ChevronLeft className="size-4" />
              {t("wizardBack")}
            </Button>
          )}
          {step < WIZARD_STEPS && (
            <Button type="button" size="lg" className="ml-auto" onClick={goNext}>
              {t("wizardNext")}
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <Card className="md:[--card-spacing:--spacing(4)]" size="sm">
          <CardHeader className="gap-1">
            <CardTitle className="text-base sm:text-lg">{t("summaryTitle")}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {t("summarySubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <Badge variant="secondary" className="capitalize">
              {isRentalBooking
                ? t("serviceRentalBadge")
                : draft.type.replace("-", " ")}
            </Badge>

            {isRentalBooking && (
              <p className="text-sm text-muted-foreground">
                {getRentalPackage(draft.rentalPackageId)?.model} ·{" "}
                {t("rentalDaysValue", { days: draft.rentalDays })}
              </p>
            )}

            {draft.legs.map((leg, i) => {
              const from = getLocation(leg.fromId);
              const to = getLocation(leg.toId);
              const vehicle = vehicles.find((v) => v.code === leg.vehicleCode);
              return (
                <div key={leg.id} className="space-y-1 text-sm">
                  <p className="font-medium">
                    {isCharter
                      ? t("charterN", { n: i + 1 })
                      : `${locName(from).split("(")[0].trim()} → ${locName(to).split("(")[0].trim()}`}
                  </p>
                  <p className="text-muted-foreground">
                    {leg.date} {t("at")} {leg.time}
                    {!isRentalBooking &&
                      ` · ${vehicle ? vehicleName(vehicle.code) : ""}`}
                  </p>
                  {!isRentalBooking && (
                    <p className="font-medium">
                      ฿{getLegPrice(leg).toLocaleString("en-US")}
                    </p>
                  )}
                  {i < draft.legs.length - 1 && <Separator className="my-3" />}
                </div>
              );
            })}

            <Separator />

            {hasNightPickup && nightSurcharge > 0 && (
              <div className="space-y-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                <div className="flex items-center justify-between font-semibold">
                  <span>{t("nightSurchargeLabel")}</span>
                  <span>฿{NIGHT_DRIVER_SURCHARGE_THB.toLocaleString("en-US")}</span>
                </div>
                <p className="text-amber-900/80">{t("nightSurchargeHint")}</p>
              </div>
            )}

            <p className="text-[11px] leading-relaxed text-muted-foreground">
              {t("advanceBookingHint")}
            </p>

            {isRentalBooking ||
            draft.paymentPlan === "deposit" ||
            draft.paymentPlan === "pay-driver" ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t("estimatedTotal")}</span>
                  <span>฿{total.toLocaleString("en-US")}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-primary">
                  <span>
                    {draft.paymentPlan === "pay-driver"
                      ? t("payAtPickup")
                      : t("payToday")}
                  </span>
                  <span className="text-lg sm:text-xl">
                    ฿{amountDue.toLocaleString("en-US")}
                  </span>
                </div>
                {balanceDue > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {draft.paymentPlan === "pay-driver"
                      ? t("balanceDueDriver", {
                          amount: balanceDue.toLocaleString("en-US"),
                        })
                      : t("balanceDue", {
                          amount: balanceDue.toLocaleString("en-US"),
                        })}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold sm:text-lg">
                  {t("total")}
                </span>
                <span className="text-xl font-bold text-primary sm:text-2xl">
                  ฿{total.toLocaleString("en-US")}
                </span>
              </div>
            )}

            {(draft.paymentPlan || draft.paymentMethod) && (
              <p className="rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                {draft.paymentPlan && (
                  <>
                    {t("paymentPlanLabel")}{" "}
                    <span className="font-medium text-foreground">
                      {draft.paymentPlan === "pay-driver" &&
                        tPay("planPayDriver")}
                      {draft.paymentPlan === "deposit" && tPay("planDeposit")}
                      {draft.paymentPlan === "full" && tPay("planFull")}
                    </span>
                  </>
                )}
                {draft.paymentPlan &&
                  draft.paymentPlan !== "pay-driver" &&
                  draft.paymentMethod &&
                  " · "}
                {draft.paymentPlan !== "pay-driver" && draft.paymentMethod && (
                  <>
                    {t("paymentMethod")}{" "}
                    <span className="font-medium text-foreground">
                      {draft.paymentMethod === "bank-transfer" &&
                        t("bankTransfer")}
                      {draft.paymentMethod === "promptpay" && t("promptpay")}
                    </span>
                  </>
                )}
              </p>
            )}

            {step < WIZARD_STEPS ? (
              <Button
                className="hidden w-full lg:inline-flex"
                size="lg"
                onClick={goNext}
              >
                {t("wizardNext")}
                <ChevronRight className="size-4" />
              </Button>
            ) : (
              <Button
                className="hidden w-full lg:inline-flex"
                size="lg"
                onClick={handleConfirm}
                disabled={paying}
              >
                {paying ? t("processing") : confirmLabel}
              </Button>
            )}

            <p className="hidden text-center text-xs text-muted-foreground lg:block">
              {step < WIZARD_STEPS ? t("wizardNextHint") : t("demoNote")}
            </p>
          </CardContent>
        </Card>
      </div>
      </div>

      {/* Sticky confirm bar — only while mobile bottom nav is visible */}
      <div className="fixed inset-x-0 bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] z-40 border-t border-border/70 bg-background/95 px-3 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/90 md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="shrink-0 px-3"
              onClick={goBack}
            >
              <ChevronLeft className="size-4" />
              <span className="sr-only">{t("wizardBack")}</span>
            </Button>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] leading-none text-muted-foreground">
              {draft.paymentPlan === "pay-driver"
                ? t("payAtPickup")
                : draft.paymentPlan === "deposit" || isRentalBooking
                  ? t("payToday")
                  : t("total")}
            </p>
            <p className="truncate text-lg font-bold text-primary">
              ฿{amountDue.toLocaleString("en-US")}
            </p>
          </div>
          {step < WIZARD_STEPS ? (
            <Button
              className="shrink-0 px-5"
              size="lg"
              onClick={goNext}
            >
              {t("wizardNext")}
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              className="shrink-0 px-5"
              size="lg"
              onClick={handleConfirm}
              disabled={paying}
            >
              {paying ? t("processing") : t("confirm")}
            </Button>
          )}
        </div>
      </div>

      {routePreview && (
        <RoutePreviewDialog
          key={`${routePreview.fromId}-${routePreview.toId}`}
          open={Boolean(routePreview)}
          onOpenChange={(open) => {
            if (!open) setRoutePreview(null);
          }}
          fromId={routePreview.fromId}
          toId={routePreview.toId}
          vehicleCode={routePreview.vehicleCode}
        />
      )}
    </div>
  );
}
