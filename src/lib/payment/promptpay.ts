import generatePayload from "promptpay-qr";

/** Build a scannable Thai PromptPay EMVCo QR payload (works with banking apps). */
export function buildPromptPayQrPayload(
  promptPayId: string,
  amount: number
): string {
  const id = promptPayId.replace(/\D/g, "");
  if (!id) {
    throw new Error("PromptPay ID is required");
  }
  return generatePayload(id, { amount: Math.max(0, amount) });
}
