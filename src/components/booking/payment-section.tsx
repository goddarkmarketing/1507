"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Building2,
  CreditCard,
  QrCode,
  Copy,
  Check,
  Upload,
  X,
  FileText,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  MAX_TRANSFER_PROOF_BYTES,
  TRANSFER_PROOF_ACCEPT,
  mockBankAccounts,
  mockPromptPay,
  paymentMethodOptions,
} from "@/lib/data/payment";
import type {
  CardPaymentDetails,
  PaymentMethod,
  TransferProof,
} from "@/lib/types";

const methodIcons = {
  "bank-transfer": Building2,
  card: CreditCard,
  promptpay: QrCode,
} as const;

interface PaymentSectionProps {
  amount: number;
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
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copied`);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium hover:bg-muted"
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-600" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
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

export function PaymentSection({
  amount,
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const promptPayQr = useMemo(
    () => mockPromptPay.qrPayload(amount, transferRef || "DRAFT"),
    [amount, transferRef]
  );

  const handleProofFile = async (file: File | undefined) => {
    if (!file) return;

    const allowed = TRANSFER_PROOF_ACCEPT.split(",");
    if (!allowed.includes(file.type)) {
      toast.error("Please upload JPG, PNG, WEBP, or PDF only");
      return;
    }
    if (file.size > MAX_TRANSFER_PROOF_BYTES) {
      toast.error("File is too large (max 1.5 MB)");
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
      toast.success("Transfer proof attached");
    } catch {
      toast.error("Could not read file");
    }
  };

  return (
    <div className="space-y-5">
      <RadioGroup
        value={method ?? undefined}
        onValueChange={(v) => v && onMethodChange(v as PaymentMethod)}
        className="grid gap-3"
      >
        {paymentMethodOptions.map((opt) => {
          const Icon = methodIcons[opt.value];
          const selected = method === opt.value;
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
                <Image
                  src={mockPromptPay.icon}
                  alt="PromptPay"
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
                  {opt.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {opt.description}
                </span>
              </span>
            </Label>
          );
        })}
      </RadioGroup>

      {method === "bank-transfer" && (
        <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
          <p className="text-sm font-medium">
            Transfer{" "}
            <span className="text-primary">
              ฿{amount.toLocaleString("en-US")}
            </span>{" "}
            to one of the accounts below, then upload your slip.
          </p>
          <p className="text-xs text-muted-foreground">
            Put this reference in the transfer note:{" "}
            <span className="font-mono font-medium text-foreground">
              {transferRef || "Generated after confirmation"}
            </span>
          </p>
          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">Select transfer account *</p>
            <div className="grid gap-2">
              {mockBankAccounts.map((acc) => {
                const selected = transferBankSymbol === acc.symbol;
                return (
                  <button
                    key={acc.symbol}
                    type="button"
                    onClick={() => onTransferBankChange(acc.symbol)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg border bg-background p-3 text-left text-sm transition-colors",
                      selected
                        ? "border-primary ring-1 ring-primary/30"
                        : "hover:border-primary/40"
                    )}
                  >
                    <Image
                      src={acc.icon}
                      alt={acc.bank}
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-md object-contain"
                      unoptimized
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{acc.bank}</p>
                          <p className="text-xs text-muted-foreground">
                            {acc.symbol}
                          </p>
                        </div>
                        <CopyButton
                          value={acc.accountNumber.replace(/-/g, "")}
                          label="Account number"
                        />
                      </div>
                      <p>
                        <span className="text-muted-foreground">
                          Account name:
                        </span>{" "}
                        {acc.accountName}
                      </p>
                      <p>
                        <span className="text-muted-foreground">
                          Account number:
                        </span>{" "}
                        <span className="font-mono font-semibold">
                          {acc.accountNumber}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Branch: {acc.branch}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">Attach transfer proof *</p>
            <p className="text-xs text-muted-foreground">
              Slip image or PDF (max 1.5 MB) — required before confirming
            </p>

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
                    aria-label="Remove proof"
                  >
                    <X className="size-4" />
                  </button>
                </div>
                {transferProof.fileType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={transferProof.dataUrl}
                    alt="Transfer proof preview"
                    className="max-h-56 w-full bg-zinc-50 object-contain"
                  />
                ) : (
                  <div className="flex items-center gap-2 px-3 py-6 text-sm text-muted-foreground">
                    <FileText className="size-5" />
                    PDF attached — you can open it on the e-Voucher after
                    confirmation
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
                <span className="font-medium">Upload transfer slip</span>
                <span className="text-xs">JPG, PNG, WEBP, or PDF</span>
              </button>
            )}
          </div>
        </div>
      )}

      {method === "card" && (
        <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">
            Card payment — mock data only, no real charge
          </p>
          <div className="space-y-2">
            <Label htmlFor="card-number">Card number</Label>
            <Input
              id="card-number"
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
            <Label htmlFor="card-name">Name on card</Label>
            <Input
              id="card-name"
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
              <Label htmlFor="card-expiry">Expiry</Label>
              <Input
                id="card-expiry"
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
              <Label htmlFor="card-cvv">CVV</Label>
              <Input
                id="card-cvv"
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

      {method === "promptpay" && (
        <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <Image
              src={mockPromptPay.icon}
              alt="PromptPay"
              width={32}
              height={32}
              className="size-8 rounded-md object-contain"
              unoptimized
            />
            <p className="text-sm font-medium">
              Scan PromptPay QR for{" "}
              <span className="text-primary">
                ฿{amount.toLocaleString("en-US")}
              </span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
            <div className="rounded-xl border bg-white p-3 shadow-sm">
              <QRCodeSVG value={promptPayQr} size={160} />
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Account name:</span>{" "}
                {mockPromptPay.accountName}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <p>
                  <span className="text-muted-foreground">PromptPay:</span>{" "}
                  <span className="font-mono font-semibold">
                    {mockPromptPay.id}
                  </span>
                </p>
                <CopyButton value={mockPromptPay.id} label="PromptPay ID" />
              </div>
              <p className="text-xs text-muted-foreground">
                This QR is a demo mock — not connected to a real payment
                gateway.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
