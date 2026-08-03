import type { Review, FaqItem, Policy } from "@/lib/types";

export const reviews: Review[] = [
  {
    id: "1",
    name: "Sarah M.",
    country: "United Kingdom",
    rating: 5,
    comment:
      "Smooth transfer from Krabi Airport to Ao Nang. Driver was waiting with a sign, car was clean and comfortable.",
    route: "KBV Airport → Ao Nang Beach",
    date: "2026-03-12",
  },
  {
    id: "2",
    name: "Hans W.",
    country: "Germany",
    rating: 5,
    comment:
      "Booked round-trip to Railay Beach. Excellent communication and punctual service both ways.",
    route: "KBV Airport ↔ Railay Beach",
    date: "2026-02-28",
  },
  {
    id: "3",
    name: "Yuki T.",
    country: "Japan",
    rating: 5,
    comment:
      "VIP van for our family of 6 was perfect. Kids loved the cold towels and snacks!",
    route: "KBV Airport → Centara Grand",
    date: "2026-01-15",
  },
  {
    id: "4",
    name: "Marco R.",
    country: "Italy",
    rating: 4,
    comment:
      "Good value inter-province transfer to Phuket. Slightly delayed due to traffic but driver kept us informed.",
    route: "Krabi → Phuket Airport",
    date: "2025-12-20",
  },
  {
    id: "5",
    name: "Emily C.",
    country: "Australia",
    rating: 5,
    comment:
      "Hotel pickup to the pier was spot on. Driver helped with bags and timed everything for our Phi Phi ferry.",
    route: "Ao Nang Hotel → Ao Nang Pier",
    date: "2025-11-08",
  },
  {
    id: "6",
    name: "Pierre L.",
    country: "France",
    rating: 5,
    comment:
      "Booked a beach transfer to Railay via the pier. Clear updates on LINE and a clean van for our luggage.",
    route: "Krabi Town → Railay Pier",
    date: "2025-10-22",
  },
  {
    id: "7",
    name: "Siriwan P.",
    country: "Thailand",
    rating: 5,
    comment:
      "Used them for multi-day trips around Krabi. Easy booking, fair price, and drivers always on time.",
    route: "Daily Charter · Krabi",
    date: "2025-09-30",
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "1",
    category: "Booking",
    question: "How do I book a transfer?",
    answer:
      "Select your pickup and drop-off locations, choose your vehicle, date and time, then complete the booking form. You'll receive an e-Voucher with QR code instantly.",
  },
  {
    id: "2",
    category: "Booking",
    question: "Can I book multiple routes in one booking?",
    answer:
      "Yes. Our booking system supports one-way, round-trip, multi-route, multi-day, and charter bookings — all in a single reservation.",
  },
  {
    id: "3",
    category: "Airport",
    question: "What if my flight is delayed?",
    answer:
      "We monitor flight schedules. For airport pickups, we include 60 minutes of free waiting time from your actual landing time.",
  },
  {
    id: "4",
    category: "Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer, credit/debit cards, and PromptPay during online booking (demo uses mock payment data). You can also pay the driver in cash (THB) if arranged in advance.",
  },
  {
    id: "5",
    category: "Cancellation",
    question: "What is your cancellation policy?",
    answer:
      "Free cancellation up to 24 hours before pickup. Cancellations within 24 hours may incur a 50% charge. No-shows are non-refundable.",
  },
  {
    id: "6",
    category: "Child & Pets",
    question: "Do you provide child seats?",
    answer:
      "Yes, child seats are available upon request at no extra charge. Please specify the age/weight of children when booking.",
  },
  {
    id: "7",
    category: "Service",
    question: "Are prices all-inclusive?",
    answer:
      "Yes. Quoted prices include tolls, parking, fuel, and driver service. Extra charges only apply for overtime waiting or optional add-ons you request.",
  },
  {
    id: "8",
    category: "Booking",
    question: "How do I receive my e-Voucher?",
    answer:
      "After confirming your booking, an e-Voucher with QR code is shown instantly and can be reopened anytime from your booking page. Show it to the driver at pickup.",
  },
];

export const policies: Policy[] = [
  {
    id: "waiting",
    title: "Waiting Time",
    content:
      "Airport pickups include 60 minutes free waiting. Hotel/pier pickups include 15 minutes free waiting. Additional waiting is charged at 200 THB per 30 minutes.",
  },
  {
    id: "flight-delay",
    title: "Flight Delay",
    content:
      "We track your flight number and adjust pickup time automatically. No extra charge for delays up to 2 hours.",
  },
  {
    id: "child-seat",
    title: "Child Seat",
    content:
      "Infant, toddler, and booster seats available free of charge. Request during booking.",
  },
  {
    id: "pets",
    title: "Pets",
    content:
      "Small pets in carriers are welcome in SUV and Van categories. Additional cleaning fee of 300 THB may apply.",
  },
  {
    id: "ferry",
    title: "Ferry Connections",
    content:
      "Pier transfers include drop-off at the ferry terminal. Ferry tickets can be arranged as an add-on service.",
  },
  {
    id: "toll",
    title: "Toll & Parking",
    content:
      "All toll fees and parking charges at airports/piers are included in the quoted price.",
  },
  {
    id: "payment",
    title: "Payment",
    content:
      "Pay online via card/transfer or cash to driver in THB. Prices are all-inclusive unless stated otherwise.",
  },
  {
    id: "cancellation",
    title: "Cancellation",
    content:
      "Free cancellation 24+ hours before pickup. Within 24 hours: 50% charge. No-show: no refund.",
  },
  {
    id: "refund",
    title: "Refund",
    content:
      "Approved refunds are processed within 5–7 business days to the original payment method.",
  },
];
