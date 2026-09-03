import { cn } from "@/lib/utils";

/** 44px — one height for every booking control on all devices */
const BOOKING_FIELD_HEIGHT =
  "h-11 min-h-11 max-h-11 shrink-0 box-border";

const BOOKING_FIELD_RESET =
  "py-0 leading-none [&::-webkit-datetime-edit]:p-0 [&::-webkit-datetime-edit-fields-wrapper]:p-0";

export const bookingFieldClass = cn(
  BOOKING_FIELD_HEIGHT,
  BOOKING_FIELD_RESET,
  "text-base"
);

export const bookingSelectTriggerClass = cn(
  "flex w-full min-w-0 items-center justify-between gap-1.5",
  "rounded-lg border border-input bg-transparent px-2.5",
  "whitespace-nowrap text-base outline-none select-none",
  BOOKING_FIELD_HEIGHT,
  BOOKING_FIELD_RESET
);

export const bookingSummaryBarClass = cn(
  "col-span-2 flex items-center justify-between",
  "rounded-lg bg-muted/50 px-3 sm:px-4",
  BOOKING_FIELD_HEIGHT
);
