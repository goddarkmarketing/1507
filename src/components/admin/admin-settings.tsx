"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BANK_ICONS,
  defaultSiteSettings,
  type BankAccountSettings,
  type CancelPolicySettings,
  type CharterSettings,
  type ContactSettings,
  type PaymentSettings,
  type StaffAccount,
  type StaffRole,
} from "@/lib/admin/settings";
import { useSettingsStore } from "@/lib/admin/settings-store";
import type { PaymentMethod } from "@/lib/types";
import { cn } from "@/lib/utils";

const METHOD_KEYS: PaymentMethod[] = [
  "bank-transfer",
  "card",
  "promptpay",
  "cash",
];

const ROLE_KEYS: StaffRole[] = ["admin", "ops", "finance", "driver"];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-zinc-600">{label}</Label>
      {children}
    </div>
  );
}

function fieldClass() {
  return "h-10 rounded-xl border-zinc-200 bg-zinc-50/50 px-3.5 text-sm";
}

function Section({
  title,
  help,
  children,
  onSave,
  saveLabel,
}: {
  title: string;
  help: string;
  children: React.ReactNode;
  onSave: () => void;
  saveLabel: string;
}) {
  return (
    <article className="rounded-2xl border border-zinc-200/80 bg-white p-6">
      <h2 className="font-semibold text-zinc-950">{title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-zinc-500">{help}</p>
      <div className="mt-5 space-y-4">{children}</div>
      <Button
        size="sm"
        className="mt-6 h-9 rounded-lg"
        onClick={onSave}
      >
        {saveLabel}
      </Button>
    </article>
  );
}

export function AdminSettingsPage() {
  const t = useTranslations("Admin");
  const stored = useSettingsStore();
  const [contact, setContact] = useState<ContactSettings>(stored.contact);
  const [payment, setPayment] = useState<PaymentSettings>(stored.payment);
  const [charter, setCharter] = useState<CharterSettings>(stored.charter);
  const [policy, setPolicy] = useState<CancelPolicySettings>(
    stored.cancelPolicy
  );
  const [staff, setStaff] = useState<StaffAccount[]>(stored.staff);
  const [newStaff, setNewStaff] = useState({
    name: "",
    username: "",
    password: "",
    role: "ops" as StaffRole,
  });

  const saveOk = () => toast.success(t("settingsSaved"));

  const patchBank = (
    symbol: BankAccountSettings["symbol"],
    patch: Partial<BankAccountSettings>
  ) => {
    setPayment((prev) => ({
      ...prev,
      banks: prev.banks.map((bank) =>
        bank.symbol === symbol ? { ...bank, ...patch } : bank
      ),
    }));
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-[28px]">
          {t("settingsTitle")}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-500">
          {t("settingsSubtitle")}
        </p>
      </div>

      <div className="grid gap-5">
        <Section
          title={t("settingsContactTitle")}
          help={t("settingsContactHelp")}
          saveLabel={t("settingsSave")}
          onSave={() => {
            if (!contact.phone.trim() || !contact.email.trim()) {
              toast.error(t("settingsRequired"));
              return;
            }
            stored.saveContact({
              phone: contact.phone.trim(),
              email: contact.email.trim(),
              line: contact.line.trim(),
              address: contact.address.trim(),
            });
            saveOk();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("settingsPhone")}>
              <Input
                className={fieldClass()}
                value={contact.phone}
                onChange={(e) =>
                  setContact((s) => ({ ...s, phone: e.target.value }))
                }
              />
            </Field>
            <Field label={t("settingsEmail")}>
              <Input
                type="email"
                className={fieldClass()}
                value={contact.email}
                onChange={(e) =>
                  setContact((s) => ({ ...s, email: e.target.value }))
                }
              />
            </Field>
            <Field label={t("settingsLine")}>
              <Input
                className={fieldClass()}
                value={contact.line}
                onChange={(e) =>
                  setContact((s) => ({ ...s, line: e.target.value }))
                }
              />
            </Field>
            <Field label={t("settingsAddress")}>
              <Input
                className={fieldClass()}
                value={contact.address}
                onChange={(e) =>
                  setContact((s) => ({ ...s, address: e.target.value }))
                }
              />
            </Field>
          </div>
        </Section>

        <Section
          title={t("settingsPaymentTitle")}
          help={t("settingsPaymentHelp")}
          saveLabel={t("settingsSave")}
          onSave={() => {
            const enabled = METHOD_KEYS.filter((key) => payment.methods[key]);
            if (!enabled.length) {
              toast.error(t("settingsNeedMethod"));
              return;
            }
            if (
              payment.methods["bank-transfer"] &&
              !payment.banks.some((bank) => bank.enabled)
            ) {
              toast.error(t("settingsNeedBank"));
              return;
            }
            if (payment.methods.promptpay && !payment.promptPayId.trim()) {
              toast.error(t("settingsNeedPromptPay"));
              return;
            }
            stored.savePayment({
              ...payment,
              promptPayId: payment.promptPayId.trim(),
              promptPayAccountName: payment.promptPayAccountName.trim(),
            });
            saveOk();
          }}
        >
          <div className="grid gap-2 sm:grid-cols-2">
            {METHOD_KEYS.map((method) => (
              <label
                key={method}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm",
                  payment.methods[method]
                    ? "border-zinc-300 bg-zinc-50"
                    : "border-zinc-200"
                )}
              >
                <Checkbox
                  checked={payment.methods[method]}
                  onCheckedChange={(checked) =>
                    setPayment((prev) => ({
                      ...prev,
                      methods: { ...prev.methods, [method]: Boolean(checked) },
                    }))
                  }
                />
                {t(`settingsMethod.${method}`)}
              </label>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("settingsPromptPayId")}>
              <Input
                className={fieldClass()}
                value={payment.promptPayId}
                onChange={(e) =>
                  setPayment((s) => ({ ...s, promptPayId: e.target.value }))
                }
              />
            </Field>
            <Field label={t("settingsPromptPayName")}>
              <Input
                className={fieldClass()}
                value={payment.promptPayAccountName}
                onChange={(e) =>
                  setPayment((s) => ({
                    ...s,
                    promptPayAccountName: e.target.value,
                  }))
                }
              />
            </Field>
          </div>

          <div className="space-y-3">
            {payment.banks.map((bank) => (
              <div
                key={bank.symbol}
                className="rounded-xl border border-zinc-200 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={BANK_ICONS[bank.symbol]}
                      alt=""
                      className="size-8 rounded-md object-contain"
                    />
                    <p className="text-sm font-semibold text-zinc-900">
                      {bank.symbol}
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-zinc-600">
                    <Checkbox
                      checked={bank.enabled}
                      onCheckedChange={(checked) =>
                        patchBank(bank.symbol, { enabled: Boolean(checked) })
                      }
                    />
                    {t("settingsEnabled")}
                  </label>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={t("settingsBankName")}>
                    <Input
                      className={fieldClass()}
                      value={bank.bank}
                      onChange={(e) =>
                        patchBank(bank.symbol, { bank: e.target.value })
                      }
                    />
                  </Field>
                  <Field label={t("settingsAccountName")}>
                    <Input
                      className={fieldClass()}
                      value={bank.accountName}
                      onChange={(e) =>
                        patchBank(bank.symbol, { accountName: e.target.value })
                      }
                    />
                  </Field>
                  <Field label={t("settingsAccountNumber")}>
                    <Input
                      className={fieldClass()}
                      value={bank.accountNumber}
                      onChange={(e) =>
                        patchBank(bank.symbol, {
                          accountNumber: e.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label={t("settingsBranch")}>
                    <Input
                      className={fieldClass()}
                      value={bank.branch}
                      onChange={(e) =>
                        patchBank(bank.symbol, { branch: e.target.value })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title={t("settingsCharterTitle")}
          help={t("settingsCharterHelp")}
          saveLabel={t("settingsSave")}
          onSave={() => {
            if (
              charter.daily < 1 ||
              charter.hourly < 1 ||
              charter.hourlyMinHours < 1
            ) {
              toast.error(t("settingsRequired"));
              return;
            }
            stored.saveCharter(charter);
            saveOk();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={t("settingsDailyRate")}>
              <Input
                type="number"
                min={1}
                className={fieldClass()}
                value={charter.daily}
                onChange={(e) =>
                  setCharter((s) => ({ ...s, daily: Number(e.target.value) }))
                }
              />
            </Field>
            <Field label={t("settingsHourlyRate")}>
              <Input
                type="number"
                min={1}
                className={fieldClass()}
                value={charter.hourly}
                onChange={(e) =>
                  setCharter((s) => ({ ...s, hourly: Number(e.target.value) }))
                }
              />
            </Field>
            <Field label={t("settingsMinHours")}>
              <Input
                type="number"
                min={1}
                className={fieldClass()}
                value={charter.hourlyMinHours}
                onChange={(e) =>
                  setCharter((s) => ({
                    ...s,
                    hourlyMinHours: Number(e.target.value),
                  }))
                }
              />
            </Field>
          </div>
        </Section>

        <Section
          title={t("settingsPolicyTitle")}
          help={t("settingsPolicyHelp")}
          saveLabel={t("settingsSave")}
          onSave={() => {
            stored.saveCancelPolicy(policy);
            saveOk();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t("settingsFreeHours")}>
              <Input
                type="number"
                min={0}
                className={fieldClass()}
                value={policy.freeCancelHours}
                onChange={(e) =>
                  setPolicy((s) => ({
                    ...s,
                    freeCancelHours: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label={t("settingsLatePercent")}>
              <Input
                type="number"
                min={0}
                max={100}
                className={fieldClass()}
                value={policy.lateFeePercent}
                onChange={(e) =>
                  setPolicy((s) => ({
                    ...s,
                    lateFeePercent: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label={t("settingsNoShowPercent")}>
              <Input
                type="number"
                min={0}
                max={100}
                className={fieldClass()}
                value={policy.noShowPercent}
                onChange={(e) =>
                  setPolicy((s) => ({
                    ...s,
                    noShowPercent: Number(e.target.value),
                  }))
                }
              />
            </Field>
            <Field label={t("settingsRefundDays")}>
              <Input
                type="number"
                min={1}
                className={fieldClass()}
                value={policy.refundBusinessDays}
                onChange={(e) =>
                  setPolicy((s) => ({
                    ...s,
                    refundBusinessDays: Number(e.target.value),
                  }))
                }
              />
            </Field>
          </div>
        </Section>

        <article className="rounded-2xl border border-zinc-200/80 bg-white p-6">
          <h2 className="font-semibold text-zinc-950">
            {t("settingsStaffTitle")}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">
            {t("settingsStaffHelp")}
          </p>

          <div className="mt-5 space-y-3">
            {staff.length === 0 ? (
              <p className="text-sm text-zinc-500">{t("settingsNoStaff")}</p>
            ) : (
              staff.map((person) => (
                <div
                  key={person.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {person.name}{" "}
                      <span className="font-normal text-zinc-500">
                        · {person.username}
                      </span>
                    </p>
                    <p className="text-xs text-zinc-400">
                      {t(`settingsRole.${person.role}`)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 rounded-lg"
                    onClick={() => {
                      const next = staff.filter((s) => s.id !== person.id);
                      setStaff(next);
                      stored.saveStaff(next);
                      toast.success(t("settingsStaffRemoved"));
                    }}
                  >
                    {t("settingsRemove")}
                  </Button>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label={t("settingsStaffName")}>
              <Input
                className={fieldClass()}
                value={newStaff.name}
                onChange={(e) =>
                  setNewStaff((s) => ({ ...s, name: e.target.value }))
                }
              />
            </Field>
            <Field label={t("username")}>
              <Input
                className={fieldClass()}
                value={newStaff.username}
                onChange={(e) =>
                  setNewStaff((s) => ({ ...s, username: e.target.value }))
                }
              />
            </Field>
            <Field label={t("password")}>
              <Input
                type="password"
                className={fieldClass()}
                value={newStaff.password}
                onChange={(e) =>
                  setNewStaff((s) => ({ ...s, password: e.target.value }))
                }
              />
            </Field>
            <Field label={t("settingsStaffRole")}>
              <select
                className={cn(fieldClass(), "w-full bg-white")}
                value={newStaff.role}
                onChange={(e) =>
                  setNewStaff((s) => ({
                    ...s,
                    role: e.target.value as StaffRole,
                  }))
                }
              >
                {ROLE_KEYS.map((role) => (
                  <option key={role} value={role}>
                    {t(`settingsRole.${role}`)}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Button
            size="sm"
            className="mt-4 h-9 rounded-lg"
            onClick={() => {
              if (
                !newStaff.name.trim() ||
                !newStaff.username.trim() ||
                !newStaff.password.trim()
              ) {
                toast.error(t("settingsRequired"));
                return;
              }
              if (
                newStaff.username.trim() === "admin" ||
                staff.some((s) => s.username === newStaff.username.trim())
              ) {
                toast.error(t("settingsStaffDup"));
                return;
              }
              const next = [
                ...staff,
                {
                  id: crypto.randomUUID(),
                  name: newStaff.name.trim(),
                  username: newStaff.username.trim(),
                  password: newStaff.password,
                  role: newStaff.role,
                },
              ];
              setStaff(next);
              stored.saveStaff(next);
              setNewStaff({
                name: "",
                username: "",
                password: "",
                role: "ops",
              });
              toast.success(t("settingsStaffAdded"));
            }}
          >
            {t("settingsAddStaff")}
          </Button>
        </article>

        <div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-zinc-200"
            onClick={() => {
              stored.resetSettings();
              const defaults = defaultSiteSettings();
              setContact(defaults.contact);
              setPayment(defaults.payment);
              setCharter(defaults.charter);
              setPolicy(defaults.cancelPolicy);
              setStaff(defaults.staff);
              toast.success(t("settingsResetOk"));
            }}
          >
            {t("settingsReset")}
          </Button>
        </div>
      </div>
    </div>
  );
}
