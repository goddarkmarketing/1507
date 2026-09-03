import { describe, expect, it } from "vitest";
import { digitsOnly, telHref, whatsappHref } from "@/lib/contact-links";

describe("contact-links", () => {
  it("normalizes Thai local numbers for tel and WhatsApp", () => {
    expect(digitsOnly("088 443 3309")).toBe("0884433309");
    expect(telHref("088 443 3309")).toBe("tel:+66884433309");
    expect(whatsappHref("+66 88 443 3309")).toBe("https://wa.me/66884433309");
  });
});
