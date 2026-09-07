/** Digits-only phone for tel:/wa.me links. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Official WhatsApp number (local format) used on live QR assets. */
export const OFFICIAL_WHATSAPP_LOCAL = "0884433309";

/** Static QR image that opens chat with OFFICIAL_WHATSAPP_LOCAL. */
export const OFFICIAL_WHATSAPP_QR_SRC = "/whatsapp/qr-0884433309.png";

export function telHref(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.startsWith("0") && digits.length >= 9) {
    return `tel:+66${digits.slice(1)}`;
  }
  if (digits.startsWith("66")) return `tel:+${digits}`;
  return `tel:${digits}`;
}

export function whatsappHref(phone: string = OFFICIAL_WHATSAPP_LOCAL): string {
  const digits = digitsOnly(phone || OFFICIAL_WHATSAPP_LOCAL);
  const intl =
    digits.startsWith("0") && digits.length >= 9
      ? `66${digits.slice(1)}`
      : digits;
  return `https://wa.me/${intl}`;
}
