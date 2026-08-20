/** English copy for tours, travel guides, and boat rows — merged into en.json. */

const numbered = (items) =>
  Object.fromEntries(items.map((item, index) => [String(index + 1), item]));

export const extraListing = {
  relatedBoats: "Related boat routes",
  landTransferBody:
    "We do not sell ferry tickets — we get you to the departure point on time.",
  tourCtaTitle: "Book pier or hotel transfer",
  tourCtaBody:
    "Tour tickets are sold by local operators. We get you to the meeting pier on time with an e-Voucher.",
  toursCtaBody:
    "Tour prices are operator estimates (mock). We handle hotel–pier transfers with an instant e-Voucher.",
  travelCtaBody:
    "Check boat times, then book a private transfer to the pier or hotel.",
};

export const Tours = {
  categories: {
    Island: "Island",
    Snorkel: "Snorkel",
    Kayak: "Kayak",
    Sightseeing: "Sightseeing",
    Combo: "Combo",
  },
  items: {
    "phi-phi-islands-day-trip": {
      title: "Phi Phi Islands Day Trip",
      excerpt:
        "Classic Andaman day trip with Maya Bay viewpoint, snorkel stops, and lunch on the beach.",
      duration: "Full day (~8–9 hrs)",
      fromArea: "Ao Nang / Krabi",
      toArea: "Phi Phi Islands",
      highlights: numbered([
        "Maya Bay viewpoint (subject to park rules)",
        "Snorkel at clear reefs",
        "Beach lunch on Phi Phi Don or nearby bay",
        "Hotel or pier pickup timing support",
      ]),
      includes: numbered([
        "Speedboat or ferry seat (operator dependent)",
        "National park fees (where included by operator)",
        "Lunch & drinking water",
        "Life jacket & snorkel gear",
      ]),
      content: numbered([
        "Phi Phi remains one of the most requested day trips from Krabi. Most packages leave early from Ao Nang or nearby piers and return in the late afternoon.",
        "We recommend booking a private pier transfer so you arrive with buffer time before check-in. Evening returns can be busy — reserve your pickup slot when you book the tour.",
        "Tour prices shown are from typical local operators (mock guide prices). Confirm inclusions, boat type, and Maya Bay access rules for your travel date.",
      ]),
    },
    "four-islands-tour": {
      title: "4 Islands Tour (Chicken, Tup, Poda & Railay)",
      excerpt:
        "Short island hopping near Ao Nang — shallow reefs, iconic rocks, and soft sand beaches.",
      duration: "Half / full day",
      fromArea: "Ao Nang",
      toArea: "Chicken · Tup · Poda · Railay",
      highlights: numbered([
        "Chicken Island viewpoint & snorkel",
        "Tup Island sandbar (tide dependent)",
        "Poda Beach swim stop",
        "Optional Railay drop or visit",
      ]),
      includes: numbered([
        "Longtail or speedboat",
        "Snorkel mask & life jacket",
        "Fruit / soft drinks (operator dependent)",
        "Guide on board",
      ]),
      content: numbered([
        "The 4 Islands route is ideal if you want scenery close to Ao Nang without a long crossing to Phi Phi.",
        "Tide affects sandbar visibility at Tup Island — morning departures usually give the best conditions.",
        "Pair this tour with a hotel–pier transfer so you do not rely on last-minute songthaews during peak season.",
      ]),
    },
    "hong-island-lagoon": {
      title: "Hong Island Lagoon Trip",
      excerpt:
        "Calm lagoons, kayaking options, and powder sand beaches in Than Bok Khorani National Park.",
      duration: "Full day",
      fromArea: "Ao Nang / Nopparat Thara",
      toArea: "Hong Island",
      highlights: numbered([
        "Emerald lagoon views",
        "Kayak through limestone channels",
        "Quiet beach time",
        "National park scenery",
      ]),
      includes: numbered([
        "Boat transfer to Hong Island",
        "Kayak (shared or private — operator dependent)",
        "National park fee (often included)",
        "Lunch on some packages",
      ]),
      content: numbered([
        "Hong Island is popular with travelers who prefer lagoons and kayaking over long-distance speedboat days.",
        "Departures are often from Nopparat Thara / Ao Nang side. Allow extra time if your hotel is inland or in Krabi Town.",
        "Ask your operator about park opening rules and whether kayaks are included or rented on site.",
      ]),
    },
    "james-bond-island-phang-nga": {
      title: "James Bond Island · Phang Nga Bay",
      excerpt:
        "Iconic limestone karsts, canoeing in caves, and the famous Koh Tapu rock needle.",
      duration: "Full day",
      fromArea: "Krabi / Phuket side",
      toArea: "Phang Nga Bay",
      highlights: numbered([
        "Koh Tapu (James Bond Island)",
        "Canoe through mangrove caves",
        "Muslim fishing village stop (operator dependent)",
        "Scenic bay cruise",
      ]),
      includes: numbered([
        "Boat & canoe segment",
        "Guide",
        "Lunch",
        "National park fees (package dependent)",
      ]),
      content: numbered([
        "James Bond Island tours can start from Krabi or Phuket. Travel time on land may be longer than the boat segment itself.",
        "A private transfer between your hotel and the meeting pier keeps the day on schedule — especially for early hotel pickups.",
        "Prices vary widely by canoe quality and group size; use our from-price as a planning guide only.",
      ]),
    },
    "emerald-pool-hot-spring-combo": {
      title: "Emerald Pool & Hot Spring Combo",
      excerpt:
        "Land-based nature day — emerald jungle pools and mineral hot springs near Krabi Town.",
      duration: "Half day",
      fromArea: "Krabi Town / Ao Nang",
      toArea: "Emerald Pool · Hot Spring",
      highlights: numbered([
        "Swim at Emerald Pool",
        "Relax at natural hot spring",
        "Blue Pool viewpoint option",
        "Easy half-day for families",
      ]),
      includes: numbered([
        "Entrance fees (package dependent)",
        "Guide on some packages",
        "Drinking water",
      ]),
      content: numbered([
        "This combo is perfect when seas are rough or you want a land day between island trips.",
        "Book an attraction transfer for door-to-door timing without shared van delays.",
        "Bring water shoes — paths can be slippery after rain.",
      ]),
    },
    "railay-sunset-longtail": {
      title: "Railay Sunset by Longtail",
      excerpt:
        "Short pier hop to Railay for viewpoints, climbing cliffs, and golden-hour photos.",
      duration: "3–5 hrs / evening",
      fromArea: "Ao Nang",
      toArea: "Railay Beach",
      highlights: numbered([
        "Longtail to Railay West / East",
        "Phra Nang Cave Beach walk",
        "Sunset on Railay West",
        "Optional dinner on the beach",
      ]),
      includes: numbered([
        "Round-trip longtail (shared or private)",
        "Life jacket",
      ]),
      content: numbered([
        "Railay is only a short boat ride from Ao Nang but feels like a different destination.",
        "Check return boat times if you stay for sunset — private longtails are flexible when public boats slow down.",
        "We can drop you at Ao Nang Pier and wait for your return pickup on request.",
      ]),
    },
  },
};

export const TravelGuides = {
  categories: {
    Destination: "Destination",
    Island: "Island",
    Corridor: "Corridor",
    Practical: "Practical",
  },
  items: {
    "ao-nang-base-guide": {
      title: "Ao Nang as Your Krabi Base",
      excerpt:
        "Where to stay, how to reach the pier, and how to link beaches, Railay, and day trips.",
      region: "Krabi",
      tips: numbered([
        "Stay near the beach road for easy longtail access to Railay.",
        "Book pier transfers the night before busy ferry mornings.",
        "Evening traffic between Krabi Town and Ao Nang can add 15–25 minutes.",
      ]),
      content: numbered([
        "Ao Nang is the most practical base for first-time visitors: restaurants, tour desks, and boat access sit close together.",
        "Use private transfers from Krabi Airport (KBV) if you arrive with luggage or after dark — metered taxis and shared vans vary in wait time.",
        "From Ao Nang you can reach Railay in about 15 minutes by longtail, join 4 Islands trips, or connect to Phi Phi speedboats.",
        "If your hotel is uphill or inland, add buffer time to every pier departure.",
      ]),
    },
    "railay-access-tips": {
      title: "Getting to Railay Beach Without Stress",
      excerpt:
        "Boat options, luggage tips, and when to book a private longtail vs shared boats.",
      region: "Krabi",
      tips: numbered([
        "Large suitcases are easier on private longtails.",
        "Railay East can be muddy at low tide — West is better for sunset.",
        "Confirm return boat plans before dinner.",
      ]),
      content: numbered([
        "Railay has no road access. Almost everyone arrives by boat from Ao Nang or by longer routes from Krabi Town.",
        "Shared longtails are cheap and frequent by day. Private boats cost more but help with timing, kids, and bulky bags.",
        "Climbing, kayaking, and Phra Nang Cave Beach are walkable once you arrive — plan footwear for rocky paths.",
        "We can transfer you hotel → Ao Nang Pier and arrange a timed return pickup after sunset.",
      ]),
    },
    "phi-phi-arrival-checklist": {
      title: "Phi Phi Arrival Checklist",
      excerpt:
        "Ferry vs speedboat, pier timing, and how to connect hotel transfers before and after the crossing.",
      region: "Phi Phi / Krabi",
      tips: numbered([
        "Arrive at the pier 45–60 minutes early in high season.",
        "Speedboats are faster; ferries are usually smoother and cheaper.",
        "Pre-book the land transfer so you are not rushing with luggage.",
      ]),
      content: numbered([
        "Island days start on land. A reliable hotel-to-pier transfer is as important as the boat ticket itself.",
        "Weather and park rules can change Maya Bay access — check with your operator the day before.",
        "On return evenings, private pier pickups beat waiting for shared vans, especially with wet bags and tired kids.",
        "If you fly out of Phuket or Krabi the next morning, leave buffer time for ferry delays.",
      ]),
    },
    "krabi-phuket-corridor": {
      title: "Krabi–Phuket Corridor: Transfer Tips",
      excerpt:
        "When a private car beats shared vans on the busiest inter-province route in the south.",
      region: "Krabi · Phuket",
      tips: numbered([
        "Door-to-door private cars skip multiple hotel stops.",
        "Airport–airport transfers need flight tracking and waiting time.",
        "Toll and parking are usually included in private quotes.",
      ]),
      content: numbered([
        "Krabi ↔ Phuket is the most requested inter-province corridor for flight connections and multi-stay trips.",
        "Shared vans are cheaper but add time with stops. Private SUVs or vans suit families and tight flight schedules.",
        "Typical legs connect KBV or Krabi Town with Phuket Airport, Patong, or west-coast hotels.",
        "Book round-trip if you fly into one province and out of the other — one e-Voucher covers both legs.",
      ]),
    },
  },
};

export const Boats = {
  items: {
    "ao-nang-railay-longtail": {
      routeLabel: "Ao Nang Pier → Railay Beach",
      operator: "Local longtail (shared)",
      notes:
        "Frequent shared longtails; private charter available. Evening boats thin out after sunset.",
    },
    "railay-ao-nang-longtail": {
      routeLabel: "Railay Beach → Ao Nang Pier",
      operator: "Local longtail (shared)",
      notes: "Return boats from Railay West / East depending on tide and luggage.",
    },
    "ao-nang-phi-phi-speedboat": {
      routeLabel: "Ao Nang / Tonsai → Phi Phi",
      operator: "Speedboat operators (mock)",
      notes:
        "Exact pier (Ao Nang vs Tonsai) depends on operator. Arrive 30–45 min early in peak season.",
    },
    "phi-phi-ao-nang-speedboat": {
      routeLabel: "Phi Phi → Ao Nang / Tonsai",
      operator: "Speedboat operators (mock)",
      notes: "Book return pier pickup in advance if you arrive after dark.",
    },
    "ao-nang-phi-phi-ferry": {
      routeLabel: "Ao Nang area → Phi Phi (Ferry)",
      operator: "Ferry / combined transfer (mock)",
      notes:
        "Slower and usually cheaper than speedboat. May include van to a larger ferry pier.",
    },
    "krabi-lanta-ferry": {
      routeLabel: "Krabi → Koh Lanta",
      operator: "Ferry + van combo (mock)",
      notes:
        "Many packages use Krabi Town or nearby piers; confirm meeting point. Duration includes road + sea.",
    },
    "phi-phi-phuket-ferry": {
      routeLabel: "Phi Phi → Phuket",
      operator: "Ferry operators (mock)",
      notes: "Connect with a Phuket Airport or Patong private transfer after arrival.",
    },
    "railay-hong-island-speedboat": {
      routeLabel: "Ao Nang → Hong Island",
      operator: "Day-trip speedboat (mock)",
      notes:
        "Usually sold as a round-trip day package rather than one-way tickets.",
    },
  },
};
