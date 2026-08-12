import fs from "fs";

const p = "src/components/booking/booking-form.tsx";
let s = fs.readFileSync(p, "utf8");

const pairs = [
  [
    'toast.error("Could not confirm booking. Please check your details.");',
    'toast.error(t("toastFail"));',
  ],
  [
    'toast.success("Booking submitted — awaiting transfer verification");',
    'toast.success(t("confirmBank"));',
  ],
  [
    'toast.success("Payment successful (mock) — e-Voucher issued");',
    'toast.success(t("confirmCard"));',
  ],
  [
    `const confirmLabel =
    draft.paymentMethod === "bank-transfer"
      ? "Confirm booking (awaiting transfer)"
      : draft.paymentMethod === "card"
        ? "Pay by card & confirm"
        : draft.paymentMethod === "promptpay"
          ? "Confirm PromptPay payment"
          : "Confirm Booking";`,
    `const confirmLabel =
    draft.paymentMethod === "bank-transfer"
      ? t("confirmBank")
      : draft.paymentMethod === "card"
        ? t("confirmCard")
        : draft.paymentMethod === "promptpay"
          ? t("confirmPromptPay")
          : t("confirmBooking");`,
  ],
  [
    '{isCharter ? "Charter Details" : "Route Details"}',
    '{isCharter ? t("charterDetails") : t("routeDetails")}',
  ],
  ["Add Route\n", '{t("addRoute")}\n'],
  [">Pickup Location<", '>{t("pickup")}<'],
  [">Drop-off Location<", '>{t("dropoff")}<'],
  [">Date<", '>{t("date")}<'],
  [">Pickup Time<", '>{t("pickupTime")}<'],
  [">Vehicle<", '>{t("vehicle")}<'],
  [
    'placeholder="Pickup Location"',
    'placeholder={t("pickup")}',
  ],
  [
    '{locations.find((l) => l.id === leg.fromId)?.name ??\n                              "Pickup Location"}',
    '{locations.find((l) => l.id === leg.fromId)?.name ??\n                              t("pickup")}',
  ],
  [
    'placeholder="Drop-off Location"',
    'placeholder={t("dropoff")}',
  ],
  [
    '{locations.find((l) => l.id === leg.toId)?.name ??\n                              "Drop-off Location"}',
    '{locations.find((l) => l.id === leg.toId)?.name ??\n                              t("dropoff")}',
  ],
  ['placeholder="Select Vehicle"', 'placeholder={t("selectVehicle")}'],
  [': "Select Vehicle"', ': t("selectVehicle")'],
  [">Leg price<", '>{t("legPrice")}<'],
  [">Customer Details<", '>{t("customerTitle")}<'],
  [">Full Name *<", '>{t("fullName")}<'],
  [">Phone *<", '>{t("phone")}<'],
  [">Email *<", '>{t("email")}<'],
  [">Flight Number (optional)<", '>{t("flightOptional")}<'],
  [">Special Requests<", '>{t("specialRequests")}<'],
  ['placeholder="John Smith"', 'placeholder={t("phName")}'],
  ['placeholder="+66 ..."', 'placeholder={t("phPhone")}'],
  ['placeholder="email@example.com"', 'placeholder={t("phEmail")}'],
  ['placeholder="FD1234"', 'placeholder={t("phFlight")}'],
  ['placeholder="Child seat, extra stops, etc."', 'placeholder={t("phNotes")}'],
  [">Payment<", '>{t("paymentTitle")}<'],
  [
    "Choose how to pay — bank details, QR, and card fields are mock demo data",
    '{t("paymentSubtitle")}',
  ],
  [">Booking Summary<", '>{t("summaryTitle")}<'],
  [">Review before confirming<", '>{t("summarySubtitle")}<'],
  [
    '<span className="text-base font-semibold sm:text-lg">Total</span>',
    '<span className="text-base font-semibold sm:text-lg">{t("total")}</span>',
  ],
  ["Payment method:", '{t("paymentMethod")}'],
  [
    '{draft.paymentMethod === "bank-transfer" && "Bank Transfer"}',
    '{draft.paymentMethod === "bank-transfer" && t("bankTransfer")}',
  ],
  [
    '{draft.paymentMethod === "card" && "Credit / Debit Card"}',
    '{draft.paymentMethod === "card" && t("card")}',
  ],
  [
    '{draft.paymentMethod === "promptpay" && "PromptPay"}',
    '{draft.paymentMethod === "promptpay" && t("promptpay")}',
  ],
  [
    "Demo payment — no real charge · e-Voucher issued after confirmation",
    '{t("demoNote")}',
  ],
  [
    '{paying ? "Processing..." : confirmLabel}',
    '{paying ? t("processing") : confirmLabel}',
  ],
  [
    '{paying ? "Processing..." : "Confirm"}',
    '{paying ? t("processing") : t("confirm")}',
  ],
  [
    '<p className="text-[11px] leading-none text-muted-foreground">Total</p>',
    '<p className="text-[11px] leading-none text-muted-foreground">{t("total")}</p>',
  ],
  [">Add Route<", '>{t("addRoute")}<'],
];

let n = 0;
for (const [a, b] of pairs) {
  if (s.includes(a)) {
    s = s.split(a).join(b);
    n++;
  } else {
    console.log("MISS:", a.slice(0, 60));
  }
}

fs.writeFileSync(p, s);
console.log("replaced", n, "pairs");
