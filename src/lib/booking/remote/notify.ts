import type { Booking } from "@/lib/types";
import {
  getAdminNotifyWebhook,
  getPublicSiteUrl,
  getSupabaseAnonKey,
  getSupabaseUrl,
  isBookingRemoteEnabled,
  voucherUrl,
} from "@/lib/booking/remote/config";

function bookingSummaryLine(booking: Booking): string {
  const leg = booking.legs[0];
  const when = leg ? `${leg.date} ${leg.time}` : "—";
  return [
    `*New booking* \`${booking.bookingNumber}\``,
    `Customer: ${booking.customerName} · ${booking.customerPhone}`,
    `Email: ${booking.customerEmail}`,
    `Plan: ${booking.paymentPlan ?? "—"} / ${booking.payment?.method ?? "—"}`,
    `Total: ฿${booking.totalPrice.toLocaleString("en-US")} (due now ฿${(booking.amountDueNow ?? 0).toLocaleString("en-US")})`,
    `When: ${when}`,
    `Voucher: ${voucherUrl(booking.bookingNumber)}`,
  ].join("\n");
}

/** Discord-compatible or generic JSON webhook for ops. */
export async function notifyAdminNewBooking(booking: Booking): Promise<void> {
  const webhook = getAdminNotifyWebhook();
  if (!webhook) return;

  const content = bookingSummaryLine(booking);
  const discordBody = {
    content: content.slice(0, 1900),
    embeds: [
      {
        title: `Booking ${booking.bookingNumber}`,
        url: voucherUrl(booking.bookingNumber),
        color: 0xf59e0b,
        fields: [
          { name: "Customer", value: booking.customerName, inline: true },
          { name: "Phone", value: booking.customerPhone, inline: true },
          {
            name: "Amount due",
            value: `฿${(booking.amountDueNow ?? 0).toLocaleString("en-US")}`,
            inline: true,
          },
        ],
      },
    ],
  };

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordBody),
    });
  } catch {
    // Non-blocking
  }
}

/** Calls Supabase Edge Function (optional) to email customer the voucher link. */
export async function notifyCustomerVoucherEmail(
  booking: Booking,
  locale = "th"
): Promise<void> {
  if (!isBookingRemoteEnabled()) return;
  const url = `${getSupabaseUrl()}/functions/v1/notify-booking`;
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getSupabaseAnonKey()}`,
      },
      body: JSON.stringify({
        bookingNumber: booking.bookingNumber,
        email: booking.customerEmail,
        customerName: booking.customerName,
        locale,
        voucherUrl: voucherUrl(booking.bookingNumber, locale),
        siteUrl: getPublicSiteUrl(),
      }),
    });
  } catch {
    // Non-blocking — Edge Function may not be deployed yet
  }
}

export async function notifyBookingCreated(
  booking: Booking,
  locale = "th"
): Promise<void> {
  await Promise.allSettled([
    notifyAdminNewBooking(booking),
    notifyCustomerVoucherEmail(booking, locale),
  ]);
}
