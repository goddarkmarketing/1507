"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { PublicImage } from "@/components/shared/public-image";
import {
  Building2,
  CreditCard,
  Banknote,
  QrCode,
  Copy,
  Check,
  Upload,
  X,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  MAX_TRANSFER_PROOF_BYTES,
  TRANSFER_PROOF_ACCEPT,
  getBankAccounts,
  getEnabledPaymentMethods,
  getPromptPay,
  paymentMethodOptions,
} from "@/lib/data/payment";
import { isOmiseConfigured } from "@/lib/payment/omise-client";
import { bookingFieldClass } from "@/lib/booking/form-field-styles";
import { useSettingsRevision } from "@/lib/admin/settings-store";
import type {
  CardPaymentDetails,
  PaymentMethod,
  TransferProof,
} from "@/lib/types";
import type { PaymentPlan } from "@/lib/booking/booking-mode";

const methodIcons = {
  "bank-transfer": Building2,
  card: CreditCard,
  promptpay: QrCode,
  cash: Banknote,
} as const;

const methodCopyKey: Record<
  PaymentMethod,
  {
    label: "bankTransfer" | "card" | "promptpay" | "cash";
    desc: "bankTransferDesc" | "cardDesc" | "promptpayDesc" | "cashDesc";
  }
> = {
  "bank-transfer": { label: "bankTransfer", desc: "bankTransferDesc" },
  card: { label: "card", desc: "cardDesc" },
  promptpay: { label: "promptpay", desc: "promptpayDesc" },
  cash: { label: "cash", desc: "cashDesc" },
};

const PLAN_OPTIONS: {
  value: PaymentPlan;
  label: "planPayDriver" | "planDeposit" | "planFull";
  desc: "planPayDriverDesc" | "planDepositDesc" | "planFullDesc";
}[] = [
  {
    value: "pay-driver",
    label: "planPayDriver",
    desc: "planPayDriverDesc",
  },
  {
    value: "deposit",
    label: "planDeposit",
    desc: "planDepositDesc",
  },
  {
    value: "full",
    label: "planFull",
    desc: "planFullDesc",
  },
];

interface PaymentSectionProps {
  amount: number;
  fullAmount?: number;
  isRentalDeposit?: boolean;
  paymentPlan: PaymentPlan | null;
  onPaymentPlanChange: (plan: PaymentPlan) => void;
  method: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
  card: CardPaymentDetails;
  onCardChange: (field: keyof CardPaymentDetails, value: string) => void;
  transferBankSymbol: string | null;
  onTransferBankChange: (symbol: string) => void;
  transferProof: TransferProof | null;
  onTransferProofChange: (proof: TransferProof | null) => void;
  transferRef: string;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const t = useTranslations("Payment");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(t("copiedToast", { label }));
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error(t("copyFail"));
    }
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void copy();
      }}
      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
      aria-label={`${t("copy")} ${label}`}
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-600" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {copied ? t("copied") : t("copy")}
    </button>
  );
}

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function ProofUpload({
  transferProof,
  onTransferProofChange,
}: {
  transferProof: TransferProof | null;
  onTransferProofChange: (proof: TransferProof | null) => void;
}) {
  const t = useTranslations("Payment");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProofFile = async (file: File | undefined) => {
    if (!file) return;

    const allowed = TRANSFER_PROOF_ACCEPT.split(",");
    if (!allowed.includes(file.type)) {
      toast.error(t("fileTypes"));
      return;
    }
    if (file.size > MAX_TRANSFER_PROOF_BYTES) {
      toast.error(t("toastProofSize"));
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      onTransferProofChange({
        fileName: file.name,
        fileType: file.type,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      });
      toast.success(t("toastProofOk"));
    } catch {
      toast.error(t("toastProofFail"));
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t("attachProof")}</p>
      <p className="text-xs text-muted-foreground">{t("proofHint")}</p>

      <input
        ref={fileInputRef}
        type="file"
        accept={TRANSFER_PROOF_ACCEPT}
        className="hidden"
        onChange={(e) => {
          void handleProofFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {transferProof ? (
        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <FileText className="size-4 shrink-0 text-primary" />
              <span className="truncate font-medium">
                {transferProof.fileName}
              </span>
            </div>
            <button
              type="button"
              className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => onTransferProofChange(null)}
              aria-label={t("attachProof")}
            >
              <X className="size-4" />
            </button>
          </div>
          {transferProof.fileType.startsWith("image/") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={transferProof.dataUrl}
              alt={t("attachProof")}
              className="max-h-56 w-full bg-zinc-50 object-contain"
            />
          ) : (
            <div className="flex items-center gap-2 px-3 py-6 text-sm text-muted-foreground">
              <FileText className="size-5" />
              {t("pdfAttached")}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-background px-4 py-8 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
        >
          <Upload className="size-6" />
          <span className="font-medium">{t("uploadSlip")}</span>
          <span className="text-xs">{t("fileTypes")}</span>
        </button>
      )}
    </div>
  );
}

export function PaymentSection({
  amount,
  fullAmount,
  isRentalDeposit: _isRentalDeposit = false,
  paymentPlan,
  onPaymentPlanChange,
  method,
  onMethodChange,
  card,
  onCardChange,
  transferBankSymbol,
  onTransferBankChange,
  transferProof,
  onTransferProofChange,
  transferRef,
}: PaymentSectionProps) {
  const t = useTranslations("Payment");
  useSettingsRevision();
  const omiseReady = isOmiseConfigured();
  const enabledMethods = getEnabledPaymentMethods().filter(
    (m): m is Exclude<PaymentMethod, "cash"> => m !== "cash"
  );
  const bankAccounts = getBankAccounts();
  const promptPay = getPromptPay();
  const isPayDriver = paymentPlan === "pay-driver";
  const showOnlineChannels =
    paymentPlan === "deposit" || paymentPlan === "full";

  const balanceDue =
    fullAmount != null ? Math.max(0, fullAmount - amount) : 0;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold">{t("planTitle")}</p>
        <RadioGroup
          value={paymentPlan ?? ""}
          onValueChange={(v) => v && onPaymentPlanChange(v as PaymentPlan)}
          className="grid gap-3"
        >
          {PLAN_OPTIONS.map((opt) => {
            const selected = paymentPlan === opt.value;
            return (
              <Label
                key={opt.value}
                htmlFor={`plan-${opt.value}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors",
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                    : "border-border hover:border-primary/40 hover:bg-muted/40"
                )}
              >
                <RadioGroupItem
                  id={`plan-${opt.value}`}
                  value={opt.value}
                  className="mt-1"
                />
                <span className="min-w-0 space-y-0.5">
                  <span className="block text-sm font-semibold leading-none">
                    {t(opt.label)}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {t(opt.desc)}
                  </span>
                </span>
              </Label>
            );
          })}
        </RadioGroup>
      </div>

      {paymentPlan === "deposit" && fullAmount != null && (
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-3 text-sm sm:px-4">
          <p className="font-semibold text-amber-950">
            {t("rentalDepositPayToday", {
              amount: amount.toLocaleString("en-US"),
            })}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-900/80 sm:text-sm">
            {t("depositPlanBalance", {
              total: fullAmount.toLocaleString("en-US"),
              balance: balanceDue.toLocaleString("en-US"),
            })}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-amber-900/70">
            {t("depositTierNote")}
          </p>
        </div>
      )}

      {paymentPlan === "full" && (
        <div className="rounded-xl border bg-muted/40 px-3 py-3 text-sm sm:px-4">
          <p className="font-semibold">
            {t("fullPayToday", {
              amount: amount.toLocaleString("en-US"),
            })}
          </p>
        </div>
      )}

      {isPayDriver && (
        <div className="rounded-xl border border-sky-200/80 bg-sky-50/80 px-3 py-3 text-sm leading-relaxed text-sky-950 sm:px-4">
          {t("payDriverNote")}
        </div>
      )}

      {showOnlineChannels && (
      <>
      <p className="text-sm font-semibold">{t("channelTitle")}</p>
      <RadioGroup
        value={method ?? ""}
        onValueChange={(v) => v && onMethodChange(v as PaymentMethod)}
        className="grid gap-3"
      >
        {paymentMethodOptions
          .filter(
            (opt): opt is (typeof paymentMethodOptions)[number] & {
              value: Exclude<PaymentMethod, "cash">;
            } => enabledMethods.includes(opt.value as Exclude<PaymentMethod, "cash">)
          )
          .map((opt) => {
          const Icon = methodIcons[opt.value];
          const selected = method === opt.value;
          const copy = methodCopyKey[opt.value];
          return (
            <Label
              key={opt.value}
              htmlFor={`pay-${opt.value}`}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-border hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              <RadioGroupItem
                id={`pay-${opt.value}`}
                value={opt.value}
                className="mt-1"
              />
              {opt.value === "promptpay" ? (
                <PublicImage
                  src={promptPay.icon}
                  alt={t("promptpay")}
                  width={28}
                  height={28}
                  className="mt-0.5 size-7 shrink-0 rounded-md object-contain"
                  unoptimized
                />
              ) : (
                <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
              )}
              <span className="min-w-0 space-y-0.5">
                <span className="block text-sm font-semibold leading-none">
                  {t(copy.label)}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {t(copy.desc)}
                </span>
              </span>
            </Label>
          );
        })}
      </RadioGroup>
      </>
      )}


      {showOnlineChannels && method === "bank-transfer" && (
        <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-medium">
            {paymentPlan === "deposit"
              ? t("rentalDepositIntro", {
                  amount: amount.toLocaleString("en-US"),
                })
              : t("transferIntro", {
                  amount: amount.toLocaleString("en-US"),
                })}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("referenceNote", {
              ref: transferRef || t("afterConfirm"),
            })}
          </p>
          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">{t("selectAccount")}</p>
            <div className="grid gap-2">
              {bankAccounts.map((acc) => {
                const selected = transferBankSymbol === acc.symbol;
                return (
                  <div
                    key={acc.symbol}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg border bg-background p-3 text-left text-sm transition-colors",
                      selected
                        ? "border-primary ring-1 ring-primary/30"
                        : "hover:border-primary/40"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onTransferBankChange(acc.symbol)}
                      className="flex min-w-0 flex-1 items-start gap-3 text-left"
                      aria-pressed={selected}
                    >
                      <PublicImage
                        src={acc.icon}
                        alt={acc.bank}
                        width={40}
                        height={40}
                        className="size-10 shrink-0 rounded-md object-contain"
                        unoptimized
                      />
                      <div className="min-w-0 flex-1 space-y-1">
                        <div>
                          <p className="font-medium">{acc.bank}</p>
                          <p className="text-xs text-muted-foreground">
                            {acc.symbol}
                          </p>
                        </div>
                        <p>
                          <span className="text-muted-foreground">
                            {t("accountName")}:
                          </span>{" "}
                          {acc.accountName}
                        </p>
                        <p>
                          <span className="text-muted-foreground">
                            {t("accountNumber")}:
                          </span>{" "}
                          <span className="font-mono font-semibold">
                            {acc.accountNumber}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("branch")}: {acc.branch}
                        </p>
                      </div>
                    </button>
                    <CopyButton
                      value={acc.accountNumber.replace(/-/g, "")}
                      label={t("accountNumber")}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {transferBankSymbol &&
            (() => {
              const selectedBank = bankAccounts.find(
                (b) => b.symbol === transferBankSymbol
              );
              if (!selectedBank?.qrImage) return null;
              return (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{t("scanBankQr")}</p>
                  <div className="mx-auto max-w-[280px] overflow-hidden rounded-xl border bg-white p-2 shadow-sm">
                    <PublicImage
                      src={selectedBank.qrImage}
                      alt={t("scanBankQr")}
                      width={520}
                      height={720}
                      className="h-auto w-full object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              );
            })()}

          <ProofUpload
            transferProof={transferProof}
            onTransferProofChange={onTransferProofChange}
          />
        </div>
      )}

      {showOnlineChannels && method === "card" && (
        <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">
            {omiseReady ? t("cardOmiseNote") : t("cardPendingNote")}
          </p>
          <div className="space-y-2">
            <Label htmlFor="card-number">{t("cardNumber")}</Label>
            <Input
              id="card-number"
              className={bookingFieldClass}
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={card.cardNumber}
              onChange={(e) =>
                onCardChange("cardNumber", formatCardNumber(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-name">{t("nameOnCard")}</Label>
            <Input
              id="card-name"
              className={bookingFieldClass}
              autoComplete="cc-name"
              placeholder="JOHN SMITH"
              value={card.cardName}
              onChange={(e) =>
                onCardChange("cardName", e.target.value.toUpperCase())
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="card-expiry">{t("expiry")}</Label>
              <Input
                id="card-expiry"
                className={bookingFieldClass}
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={card.expiry}
                onChange={(e) =>
                  onCardChange("expiry", formatExpiry(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card-cvv">{t("cvv")}</Label>
              <Input
                id="card-cvv"
                className={bookingFieldClass}
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                maxLength={4}
                value={card.cvv}
                onChange={(e) =>
                  onCardChange(
                    "cvv",
                    e.target.value.replace(/\D/g, "").slice(0, 4)
                  )
                }
              />
            </div>
          </div>
        </div>
      )}

      {showOnlineChannels && method === "promptpay" && (
        <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <PublicImage
              src={promptPay.icon}
              alt={t("promptpay")}
              width={32}
              height={32}
              className="size-8 rounded-md object-contain"
              unoptimized
            />
            <p className="text-sm font-medium">
              {t("scanQr", { amount: amount.toLocaleString("en-US") })}
            </p>
          </div>

          <div className="mx-auto w-full max-w-[280px] space-y-3">
            <div className="overflow-hidden rounded-xl border bg-white p-2 shadow-sm">
              <PublicImage
                src={promptPay.qrImage}
                alt={t("promptpay")}
                width={480}
                height={640}
                className="h-auto w-full object-contain"
                unoptimized
              />
            </div>
            <div className="space-y-1.5 text-sm">
              <p>
                <span className="text-muted-foreground">
                  {t("accountName")}:
                </span>{" "}
                {promptPay.accountName}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p>
                  <span className="text-muted-foreground">
                    {t("promptpayId")}:
                  </span>{" "}
                  <span className="font-mono font-semibold">
                    {promptPay.id}
                  </span>
                </p>
                <CopyButton
                  value={promptPay.id.replace(/\D/g, "")}
                  label={t("promptpayId")}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("promptpayNote")}
              </p>
            </div>
          </div>

          <Separator />

          <ProofUpload
            transferProof={transferProof}
            onTransferProofChange={onTransferProofChange}
          />
        </div>
      )}

    </div>
  );
}
