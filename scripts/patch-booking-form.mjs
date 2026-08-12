import fs from "fs";

const path = "src/components/booking/booking-form.tsx";
let s = fs.readFileSync(path, "utf8");

if (!s.includes('useTranslations')) {
  s = s.replace(
    'import { useEffect, useState } from "react";',
    'import { useEffect, useState } from "react";\nimport { useTranslations } from "next-intl";'
  );
}

// Replace bookingTypes static array with value-only list
s = s.replace(
  /const bookingTypes: \{[\s\S]*?\];/,
  `const bookingTypeValues = [
  "one-way",
  "round-trip",
  "multi-route",
  "multi-day",
  "daily-charter",
  "hourly-charter",
] as const;`
);

// Add t hooks after paying state
if (!s.includes('const t = useTranslations("Booking")')) {
  s = s.replace(
    "const [paying, setPaying] = useState(false);",
    `const [paying, setPaying] = useState(false);
  const t = useTranslations("Booking");`
  );
}

const replacements = [
  ['Please complete all customer details', 't("toastCustomer")'],
  ['Please select a payment method', 't("toastPayment")'],
  ['Could not confirm booking. Please check your details.', 't("toastFail")'],
  ['"Confirm booking (awaiting transfer)"', 't("confirmBank")'],
  ['"Pay by card & confirm"', 't("confirmCard")'],
  ['"Confirm PromptPay payment"', 't("confirmPromptPay")'],
  ['"Confirm Booking"', 't("confirmBooking")'],
  [">Booking Type<", '>{t("typeTitle")}<'],
  ["All booking types in one reservation — add routes, days, or charter as needed.", '{t("typeSubtitle")}'],
  ["{isCharter ? \"Charter Details\" : \"Route Details\"}", '{isCharter ? t("charterDetails") : t("routeDetails")}'],
  [">Add Route<", '>{t("addRoute")}<'],
  ["{isCharter ? \"Charter\" : \"Route\"} {index + 1}", '{isCharter ? t("charterN", { n: index + 1 }) : t("routeN", { n: index + 1 })}'],
  [">Pickup Location<", '>{t("pickup")}<'],
  [">Drop-off Location<", '>{t("dropoff")}<'],
  [">Date<", '>{t("date")}<'],
  [">Pickup Time<", '>{t("pickupTime")}<'],
  [">Vehicle<", '>{t("vehicle")}<'],
  ['placeholder="Pickup Location"', 'placeholder={t("pickup")}'],
  ['"Pickup Location"', 't("pickup")'],
  ['placeholder="Drop-off Location"', 'placeholder={t("dropoff")}'],
  ['"Drop-off Location"', 't("dropoff")'],
  ['placeholder="Select Vehicle"', 'placeholder={t("selectVehicle")}'],
  ['"Select Vehicle"', 't("selectVehicle")'],
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
  ["Choose how to pay — bank details, QR, and card fields are mock demo data", '{t("paymentSubtitle")}'],
  [">Booking Summary<", '>{t("summaryTitle")}<'],
  [">Review before confirming<", '>{t("summarySubtitle")}<'],
  [">Total<", '>{t("total")}<'],
  ["Payment method:", '{t("paymentMethod")}'],
  ['"Bank Transfer"', 't("bankTransfer")'],
  ['"Credit / Debit Card"', 't("card")'],
  ['"PromptPay"', 't("promptpay")'],
  ['"Processing..."', 't("processing")'],
  ["Demo payment — no real charge · e-Voucher issued after confirmation", '{t("demoNote")}'],
  ['{paying ? "Processing..." : "Confirm"}', '{paying ? t("processing") : t("confirm")}'],
  ['{paying ? "Processing..." : confirmLabel}', '{paying ? t("processing") : confirmLabel}'],
];

for (const [from, to] of replacements) {
  s = s.split(from).join(to);
}

// Fix bookingTypes.map references
s = s.replace(/bookingTypes\.map/g, "bookingTypeValues.map");
s = s.replace(
  /\{bookingTypes\.map\(\(type\) => \{[\s\S]*?const selected = draft\.type === type\.value;/,
  `{bookingTypeValues.map((typeValue) => {
                const selected = draft.type === typeValue;`
);

// This might be messy - let's do a more careful map rewrite
fs.writeFileSync(path, s);
console.log("partial booking form update done");
