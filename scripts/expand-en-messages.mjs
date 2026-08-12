import fs from "fs";

const en = JSON.parse(fs.readFileSync("src/messages/en.json", "utf8"));

Object.assign(en.Common, {
  book: "Book",
  explore: "Explore",
  read: "Read",
  min: "min",
  bookVehicle: "Book {name}",
  allArticles: "All Articles",
});

en.Site = {
  slogan: "Your Trusted Southern Thailand Transfer Network",
  tagline: "Southern Thailand Travel & Transportation Platform",
};

en.Home = {
  ...en.Home,
  slogan: "Your Trusted Southern Thailand Transfer Network",
  fleetSubtitle: "{count} vehicle classes for every group size",
  fleetSearch: "Search vehicles...",
  fleetEmpty: "No vehicles match your filters.",
  fleetFilterAll: "All",
  fleetFilter13: "1–3 seats",
  fleetFilter14: "1–4 seats",
  fleetFilter18: "1–8 seats",
  fleetFilterGroup: "Group / Bus",
  articlesTitle: "Travel Articles",
  articlesSubtitle:
    "Guides for airport, beach, pier, and inter-province transfers",
  travelHubsTitle: "Travel Intelligence",
  travelHubsSubtitle:
    "Tours, boat times, and destination tips — then book your transfer",
  toursDesc: "Day trips to Phi Phi, 4 Islands, Hong Island, and more.",
  boatsDesc: "Mock ferry, speedboat, and longtail departure times.",
  travelInfoDesc: "Guides for Ao Nang, Railay, Phi Phi, and Krabi–Phuket.",
  reviewMarqueeTitle: "Customer Reviews",
  reviewHintMobile: "Swipe or tap arrows · tap photo to enlarge",
  reviewHintDesktop: "Hover to pause · click to enlarge",
};

en.Faq = {
  pageTitle: "FAQ & Policies",
  pageSubtitle:
    "Everything you need to know about booking, payments, and our service standards.",
  sectionTitle: "Frequently Asked Questions",
  policiesTitle: "Service Policies",
  items: {
    "1": {
      q: "How do I book a transfer?",
      a: "Select your pickup and drop-off locations, choose your vehicle, date and time, then complete the booking form. You'll receive an e-Voucher with QR code instantly.",
    },
    "2": {
      q: "Can I book multiple routes in one booking?",
      a: "Yes. Our booking system supports one-way, round-trip, multi-route, multi-day, and charter bookings — all in a single reservation.",
    },
    "3": {
      q: "What if my flight is delayed?",
      a: "We monitor flight schedules. For airport pickups, we include 60 minutes of free waiting time from your actual landing time.",
    },
    "4": {
      q: "What payment methods do you accept?",
      a: "We accept bank transfer, credit/debit cards, and PromptPay during online booking (demo uses mock payment data). You can also pay the driver in cash (THB) if arranged in advance.",
    },
    "5": {
      q: "What is your cancellation policy?",
      a: "Free cancellation up to 24 hours before pickup. Cancellations within 24 hours may incur a 50% charge. No-shows are non-refundable.",
    },
    "6": {
      q: "Do you provide child seats?",
      a: "Yes, child seats are available upon request at no extra charge. Please specify the age/weight of children when booking.",
    },
    "7": {
      q: "Are prices all-inclusive?",
      a: "Yes. Quoted prices include tolls, parking, fuel, and driver service. Extra charges only apply for overtime waiting or optional add-ons you request.",
    },
    "8": {
      q: "How do I receive my e-Voucher?",
      a: "After confirming your booking, an e-Voucher with QR code is shown instantly and can be reopened anytime from your booking page. Show it to the driver at pickup.",
    },
  },
  policies: {
    waiting: {
      title: "Waiting Time",
      content:
        "Airport pickups include 60 minutes free waiting. Hotel/pier pickups include 15 minutes free waiting. Additional waiting is charged at 200 THB per 30 minutes.",
    },
    "flight-delay": {
      title: "Flight Delay",
      content:
        "We track your flight number and adjust pickup time automatically. No extra charge for delays up to 2 hours.",
    },
    "child-seat": {
      title: "Child Seat",
      content:
        "Infant, toddler, and booster seats available free of charge. Request during booking.",
    },
    pets: {
      title: "Pets",
      content:
        "Small pets in carriers are welcome in SUV and Van categories. Additional cleaning fee of 300 THB may apply.",
    },
    ferry: {
      title: "Ferry Connections",
      content:
        "Pier transfers include drop-off at the ferry terminal. Ferry tickets can be arranged as an add-on service.",
    },
    toll: {
      title: "Toll & Parking",
      content:
        "All toll fees and parking charges at airports/piers are included in the quoted price.",
    },
    payment: {
      title: "Payment",
      content:
        "Pay online via card/transfer or cash to driver in THB. Prices are all-inclusive unless stated otherwise.",
    },
    cancellation: {
      title: "Cancellation",
      content:
        "Free cancellation 24+ hours before pickup. Within 24 hours: 50% charge. No-show: no refund.",
    },
    refund: {
      title: "Refund",
      content:
        "Approved refunds are processed within 5–7 business days to the original payment method.",
    },
  },
};

en.Reviews = {
  pageTitle: "Customer Reviews",
  pageSubtitle: "Real feedback from travelers across Southern Thailand.",
  items: {
    "1": {
      country: "United Kingdom",
      comment:
        "Smooth transfer from Krabi Airport to Ao Nang. Driver was waiting with a sign, car was clean and comfortable.",
      route: "KBV Airport → Ao Nang Beach",
    },
    "2": {
      country: "Germany",
      comment:
        "Booked round-trip to Railay Beach. Excellent communication and punctual service both ways.",
      route: "KBV Airport ↔ Railay Beach",
    },
    "3": {
      country: "Japan",
      comment:
        "VIP van for our family of 6 was perfect. Kids loved the cold towels and snacks!",
      route: "KBV Airport → Centara Grand",
    },
    "4": {
      country: "Italy",
      comment:
        "Good value inter-province transfer to Phuket. Slightly delayed due to traffic but driver kept us informed.",
      route: "Krabi → Phuket Airport",
    },
    "5": {
      country: "Australia",
      comment:
        "Hotel pickup to the pier was spot on. Driver helped with bags and timed everything for our Phi Phi ferry.",
      route: "Ao Nang Hotel → Ao Nang Pier",
    },
    "6": {
      country: "France",
      comment:
        "Booked a beach transfer to Railay via the pier. Clear updates on LINE and a clean van for our luggage.",
      route: "Krabi Town → Railay Pier",
    },
    "7": {
      country: "Thailand",
      comment:
        "Used them for multi-day trips around Krabi. Easy booking, fair price, and drivers always on time.",
      route: "Daily Charter · Krabi",
    },
  },
};

en.Transfer = {
  fromEco: "Economy Sedan from",
  book: "Book",
  popularRoutes: "Popular {title} Routes",
  route: "Route",
  distance: "Distance",
  duration: "Duration",
  fromPrice: "From (ECO)",
  recommended: "Recommended Vehicles",
  recommendedBody: "Choose the right vehicle for your group size and luggage.",
  ctaTitle: "Ready to book your {title}?",
  ctaBody: "Get an instant e-Voucher with QR code after booking.",
};

en.TransferPages = {
  "airport-transfer": {
    title: "Airport Transfer",
    subtitle:
      "Reliable transfers to and from Krabi & Southern Thailand airports",
  },
  "hotel-transfer": {
    title: "Hotel Transfer",
    subtitle: "Door-to-door service to resorts and hotels across the region",
  },
  "pier-transfer": {
    title: "Pier Transfer",
    subtitle: "Seamless connections to ferry piers and island departures",
  },
  "beach-transfer": {
    title: "Beach Transfer",
    subtitle: "Direct transfers to Krabi's stunning beaches and coastal areas",
  },
  "city-transfer": {
    title: "City Transfer",
    subtitle:
      "Comfortable city-to-city transportation across Southern Thailand",
  },
  "attraction-transfer": {
    title: "Attraction Transfer",
    subtitle: "Visit temples, national parks, and top tourist attractions",
  },
  "inter-province-transfer": {
    title: "Inter Province Transfer",
    subtitle:
      "Long-distance transfers between provinces in Southern Thailand",
  },
};

en.Booking = {
  ...en.Booking,
  typeTitle: "Booking Type",
  typeSubtitle:
    "All booking types in one reservation — add routes, days, or charter as needed.",
  routeDetails: "Route Details",
  charterDetails: "Charter Details",
  addRoute: "Add Route",
  routeN: "Route {n}",
  charterN: "Charter {n}",
  pickup: "Pickup Location",
  dropoff: "Drop-off Location",
  date: "Date",
  pickupTime: "Pickup Time",
  vehicle: "Vehicle",
  selectVehicle: "Select Vehicle",
  legPrice: "Leg price",
  customerTitle: "Customer Details",
  fullName: "Full Name *",
  phone: "Phone *",
  email: "Email *",
  flightOptional: "Flight Number (optional)",
  specialRequests: "Special Requests",
  phName: "John Smith",
  phPhone: "+66 ...",
  phEmail: "email@example.com",
  phFlight: "FD1234",
  phNotes: "Child seat, extra stops, etc.",
  paymentTitle: "Payment",
  paymentSubtitle:
    "Choose how to pay — bank details, QR, and card fields are mock demo data",
  summaryTitle: "Booking Summary",
  summarySubtitle: "Review before confirming",
  total: "Total",
  paymentMethod: "Payment method:",
  bankTransfer: "Bank Transfer",
  card: "Credit / Debit Card",
  promptpay: "PromptPay",
  confirmBooking: "Confirm Booking",
  confirmBank: "Confirm booking (awaiting transfer)",
  confirmCard: "Pay by card & confirm",
  confirmPromptPay: "Confirm PromptPay payment",
  processing: "Processing...",
  demoNote:
    "Demo payment — no real charge · e-Voucher issued after confirmation",
  at: "at",
  toastCustomer: "Please complete all customer details",
  toastPayment: "Please select a payment method",
  toastFail: "Could not confirm booking. Please check your details.",
  types: {
    "one-way": {
      label: "One Way",
      desc: "Single transfer",
      detail: "Single point-to-point transfer.",
    },
    "round-trip": {
      label: "Round Trip",
      desc: "Return journey included",
      detail: "We'll automatically create a return leg with reversed route.",
    },
    "multi-route": {
      label: "Multi Route",
      desc: "Multiple destinations",
      detail: "Add as many route legs as you need for your journey.",
    },
    "multi-day": {
      label: "Multi Day",
      desc: "Different dates",
      detail: "Schedule transfers on different dates within one booking.",
    },
    "daily-charter": {
      label: "Daily Charter",
      desc: "8 hours full day",
      detail:
        "Full day charter (8 hours) — choose your vehicle and start time.",
    },
    "hourly-charter": {
      label: "Hourly Charter",
      desc: "Min 3 hours",
      detail:
        "Minimum 3 hours — flexible stops within your charter period.",
    },
  },
};

en.Pages = {
  ...en.Pages,
  fleetSubtitle: "8 vehicle classes with real photos and full specifications",
  priceListSubtitle: "Transparent rates for transfers and daily rental",
  reviewsSubtitle: "Real feedback from travelers across Southern Thailand",
  contactSubtitle:
    "Call, LINE, or email — we are happy to help plan your transfer",
  articlesSubtitle:
    "Guides for airport, beach, pier, and inter-province transfers",
  toursSubtitle: "Day trips and island experiences around Krabi",
  boatSchedulesSubtitle: "Mock ferry and speedboat departure times",
  travelInfoSubtitle:
    "Practical tips for popular Southern Thailand destinations",
};

fs.writeFileSync("src/messages/en.json", JSON.stringify(en, null, 2) + "\n");
console.log("en written");
