import { describe, expect, it } from "vitest";
import {
  digitsOnly,
  OFFICIAL_WHATSAPP_LOCAL,
  OFFICIAL_WHATSAPP_QR_SRC,
  telHref,
  whatsappHref,
} from "@/lib/contact-links";

describe("contact-links", () => {
  it("normalizes Thai local numbers for tel and WhatsApp", () => {
    expect(digitsOnly("088 443 3309")).toBe("0884433309");
    expect(telHref("088 443 3309")).toBe("tel:+66884433309");
    expect(whatsappHref("+66 88 443 3309")).toBe("https://wa.me/66884433309");
  });

  it("uses the official WhatsApp QR number", () => {
    expect(OFFICIAL_WHATSAPP_LOCAL).toBe("0884433309");
    expect(OFFICIAL_WHATSAPP_QR_SRC).toBe("/whatsapp/qr-0884433309.png");
    expect(whatsappHref()).toBe("https://wa.me/66884433309");
  });
});
