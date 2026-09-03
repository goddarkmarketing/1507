/** Digits-only phone for tel:/wa.me links. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function telHref(phone: string): string {
  const digits = digitsOnly(phone);
  if (digits.startsWith("0") && digits.length >= 9) {
    return `tel:+66${digits.slice(1)}`;
  }
  if (digits.startsWith("66")) return `tel:+${digits}`;
  return `tel:${digits}`;
}

export function whatsappHref(phone: string): string {
  const digits = digitsOnly(phone);
  const intl =
    digits.startsWith("0") && digits.length >= 9
      ? `66${digits.slice(1)}`
      : digits;
  return `https://wa.me/${intl}`;
}
