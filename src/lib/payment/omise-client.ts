import type { CardPaymentDetails } from "@/lib/types";

type OmiseClient = {
  setPublicKey: (key: string) => void;
  createToken: (
    type: "card",
    data: {
      name: string;
      number: string;
      expiration_month: number;
      expiration_year: number;
      security_code: string;
    },
    callback: (
      statusCode: number,
      response: { id?: string; message?: string }
    ) => void
  ) => void;
};

declare global {
  interface Window {
    Omise?: OmiseClient;
  }
}

const OMISE_SCRIPT = "https://cdn.omise.co/omise.js";

export function getOmisePublicKey() {
  return process.env.NEXT_PUBLIC_OMISE_PUBLIC_KEY?.trim() ?? "";
}

export function isOmiseConfigured() {
  return getOmisePublicKey().length > 0;
}

let omiseLoadPromise: Promise<OmiseClient> | null = null;

export function loadOmise(): Promise<OmiseClient> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Omise is only available in the browser"));
  }
  if (window.Omise) {
    return Promise.resolve(window.Omise);
  }
  if (!omiseLoadPromise) {
    omiseLoadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${OMISE_SCRIPT}"]`
      );
      if (existing) {
        existing.addEventListener("load", () => {
          if (window.Omise) resolve(window.Omise);
          else reject(new Error("Omise failed to load"));
        });
        existing.addEventListener("error", () =>
          reject(new Error("Omise script error"))
        );
        return;
      }
      const script = document.createElement("script");
      script.src = OMISE_SCRIPT;
      script.async = true;
      script.onload = () => {
        if (window.Omise) resolve(window.Omise);
        else reject(new Error("Omise failed to load"));
      };
      script.onerror = () => reject(new Error("Omise script error"));
      document.head.appendChild(script);
    });
  }
  return omiseLoadPromise;
}

export async function createOmiseCardToken(
  card: CardPaymentDetails,
  publicKey = getOmisePublicKey()
): Promise<string> {
  if (!publicKey) {
    throw new Error("Omise public key is not configured");
  }

  const digits = card.cardNumber.replace(/\s/g, "");
  const [mmRaw, yyRaw] = card.expiry.split("/");
  const month = Number.parseInt(mmRaw ?? "", 10);
  const yearSuffix = Number.parseInt(yyRaw ?? "", 10);
  if (
    digits.length < 15 ||
    !card.cardName.trim() ||
    !month ||
    !yearSuffix ||
    card.cvv.length < 3
  ) {
    throw new Error("Incomplete card details");
  }

  const Omise = await loadOmise();
  Omise.setPublicKey(publicKey);

  return new Promise((resolve, reject) => {
    Omise.createToken(
      "card",
      {
        name: card.cardName.trim(),
        number: digits,
        expiration_month: month,
        expiration_year: 2000 + yearSuffix,
        security_code: card.cvv,
      },
      (_status, response) => {
        if (response.id) {
          resolve(response.id);
          return;
        }
        reject(new Error(response.message ?? "Card tokenization failed"));
      }
    );
  });
}
