"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, Clock } from "lucide-react";
import { enUS, th } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { bookingSelectTriggerClass } from "@/lib/booking/form-field-styles";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

function parseIsoDate(value: string): Date | undefined {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** YYYY-MM-DD → DD-MM-YYYY */
export function formatDayMonthYear(value: string): string {
  const [y, m, d] = value.split("-");
  return y && m && d ? `${d}-${m}-${y}` : value;
}

const triggerClass = cn(
  "gap-1.5 transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-[popup-open]:border-amber-400 data-[popup-open]:ring-3 data-[popup-open]:ring-amber-200/60",
  bookingSelectTriggerClass
);

export function BookingDatePicker({
  value,
  min,
  onChange,
  invalid,
}: {
  value: string;
  min?: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations("Booking");
  const [open, setOpen] = useState(false);
  const selected = parseIsoDate(value);
  const minDate = parseIsoDate(min ?? "");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-invalid={invalid || undefined}
        className={cn(
          triggerClass,
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
        )}
      >
        <CalendarDays className="size-4 shrink-0 text-amber-600" />
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-left tabular-nums",
            !value && "text-muted-foreground"
          )}
        >
          {value ? formatDayMonthYear(value) : t("date")}
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto max-w-[calc(100vw-1.5rem)] p-2"
        initialFocus={false}
      >
        <Calendar
          mode="single"
          locale={locale === "th" ? th : enUS}
          selected={selected}
          defaultMonth={selected ?? minDate}
          startMonth={minDate}
          disabled={minDate ? { before: minDate } : undefined}
          onSelect={(date) => {
            if (!date) return;
            onChange(toIsoDate(date));
            setOpen(false);
          }}
          className="[--cell-size:--spacing(9)]"
          classNames={{
            today:
              "rounded-(--cell-radius) font-semibold text-amber-700 ring-1 ring-amber-300 ring-inset",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

const HOURS = Array.from({ length: 24 }, (_, i) => pad(i));
const MINUTES = Array.from({ length: 12 }, (_, i) => pad(i * 5));

export function BookingTimePicker({
  value,
  min,
  onChange,
  invalid,
}: {
  value: string;
  /** HH:MM; earlier slots are disabled (same-day pickups). */
  min?: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [hour = "", minute = ""] = value.split(":");
  const minutes = minute && !MINUTES.includes(minute)
    ? [...MINUTES, minute].sort()
    : MINUTES;
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const isBeforeMin = (h: string, m: string) => Boolean(min) && `${h}:${m}` < min!;
  const hourDisabled = (h: string) => minutes.every((m) => isBeforeMin(h, m));

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => {
      for (const ref of [hourRef, minuteRef]) {
        const active = ref.current?.querySelector<HTMLElement>("[data-active=true]");
        if (active && ref.current) {
          ref.current.scrollTop = active.offsetTop - ref.current.clientHeight / 2 + active.clientHeight / 2;
        }
      }
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  const pickHour = (h: string) => {
    const keep = minute && !isBeforeMin(h, minute) ? minute : undefined;
    const next = keep ?? minutes.find((m) => !isBeforeMin(h, m)) ?? "00";
    onChange(`${h}:${next}`);
  };

  const pickMinute = (m: string) => {
    onChange(`${hour || "00"}:${m}`);
    setOpen(false);
  };

  const cell = (active: boolean) =>
    cn(
      "flex h-9 w-full shrink-0 items-center justify-center rounded-md text-sm tabular-nums transition-colors",
      "hover:bg-amber-50 hover:text-amber-900 disabled:pointer-events-none disabled:opacity-30",
      active && "bg-zinc-900 font-semibold text-white hover:bg-zinc-900 hover:text-white"
    );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        type="button"
        aria-invalid={invalid || undefined}
        className={cn(
          triggerClass,
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20"
        )}
      >
        <Clock className="size-4 shrink-0 text-amber-600" />
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-left tabular-nums",
            !value && "text-muted-foreground"
          )}
        >
          {value ? (locale === "th" ? `${value} น.` : value) : t("pickupTime")}
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[max(var(--anchor-width),12rem)] max-w-[calc(100vw-1.5rem)] gap-1.5 p-2"
        initialFocus={false}
      >
        <div className="grid grid-cols-2 gap-2 px-1 text-center text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
          <span>{t("timeHour")}</span>
          <span>{t("timeMinute")}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div
            ref={hourRef}
            className="relative flex max-h-56 flex-col gap-0.5 overflow-y-auto overscroll-contain rounded-md bg-muted/40 p-1 [scrollbar-width:none]"
          >
            {HOURS.map((h) => (
              <button
                key={h}
                type="button"
                data-active={h === hour}
                disabled={hourDisabled(h)}
                onClick={() => pickHour(h)}
                className={cell(h === hour)}
              >
                {h}
              </button>
            ))}
          </div>
          <div
            ref={minuteRef}
            className="relative flex max-h-56 flex-col gap-0.5 overflow-y-auto overscroll-contain rounded-md bg-muted/40 p-1 [scrollbar-width:none]"
          >
            {minutes.map((m) => (
              <button
                key={m}
                type="button"
                data-active={m === minute}
                disabled={isBeforeMin(hour || "00", m)}
                onClick={() => pickMinute(m)}
                className={cell(m === minute)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
