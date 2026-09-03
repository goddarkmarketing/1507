export const siteConfig = {
  name: "KRABI LINKS TAXI",
  shortName: "Krabi Links",
  domain: "www.krabilinkstaxi.com",
  slogan: "เชื่อมทุกเส้นทางของภาคใต้",
  sloganEn: "Your Trusted Southern Thailand Transfer Network",
  tagline: "Southern Thailand Travel & Transportation Platform",
  phone: "088 443 3309",
  email: "krabilinkstaxi.social@gmail.com",
  whatsapp: "+66 88 443 3309",
  facebook: "https://www.facebook.com/Krabilinkstaxi",
  /** @deprecated use whatsapp */
  line: "+66 88 443 3309",
  address: "Krabi Town, Krabi 81000, Thailand",
};

/** href + Nav.* message key for i18n */
export type NavItem = {
  href: string;
  labelKey:
    | "home"
    | "airportTransfer"
    | "hotelTransfer"
    | "pierTransfer"
    | "beachTransfer"
    | "cityTransfer"
    | "attractionTransfer"
    | "interProvince"
    | "fleet"
    | "priceList"
    | "tours"
    | "boatSchedules"
    | "travelInfo"
    | "articles"
    | "faq"
    | "reviews"
    | "contact";
  group?: "transfers" | "travel";
};

export const navItems: NavItem[] = [
  { href: "/", labelKey: "home" },
  {
    href: "/airport-transfer",
    labelKey: "airportTransfer",
    group: "transfers",
  },
  { href: "/hotel-transfer", labelKey: "hotelTransfer", group: "transfers" },
  { href: "/pier-transfer", labelKey: "pierTransfer", group: "transfers" },
  { href: "/beach-transfer", labelKey: "beachTransfer", group: "transfers" },
  { href: "/city-transfer", labelKey: "cityTransfer", group: "transfers" },
  {
    href: "/attraction-transfer",
    labelKey: "attractionTransfer",
    group: "transfers",
  },
  {
    href: "/inter-province-transfer",
    labelKey: "interProvince",
    group: "transfers",
  },
  { href: "/fleet", labelKey: "fleet" },
  { href: "/price-list", labelKey: "priceList" },
  { href: "/tours", labelKey: "tours", group: "travel" },
  { href: "/boat-schedules", labelKey: "boatSchedules", group: "travel" },
  { href: "/travel-info", labelKey: "travelInfo", group: "travel" },
  { href: "/articles", labelKey: "articles" },
  { href: "/faq", labelKey: "faq" },
  { href: "/reviews", labelKey: "reviews" },
  { href: "/contact", labelKey: "contact" },
];

export const transferPages = {
  "airport-transfer": {
    category: "airport" as const,
    navLabelKey: "airportTransfer" as const,
    coverImage: "/images/article-airport-transfer.png",
    locationTypes: ["airport"] as const,
    reviewIds: ["1", "2", "3"] as const,
    featuredRoutes: [
      ["kbv-airport", "ao-nang-beach"],
      ["phuket-airport", "ao-nang-beach"],
      ["phuket-airport", "koh-lanta-z1"],
      ["ao-nang-beach", "koh-lanta-z1"],
      ["kbv-airport", "phuket-airport"],
      ["kbv-airport", "koh-lanta-z1"],
    ] as const,
    vehicleCodes: ["ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "BUS"] as const,
  },
  "hotel-transfer": {
    category: "hotel" as const,
    navLabelKey: "hotelTransfer" as const,
    coverImage: "/images/transfer-services-bg-v3.png",
    locationTypes: ["hotel"] as const,
    reviewIds: ["3", "5", "7"] as const,
    featuredRoutes: [
      ["kbv-airport", "centara-ao-nang"],
      ["kbv-airport", "rayavadee"],
      ["krabi-town", "centara-ao-nang"],
      ["ao-nang-beach", "centara-ao-nang"],
      ["centara-ao-nang", "ao-nang-pier"],
      ["rayavadee", "railay-beach"],
    ] as const,
    vehicleCodes: ["ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "BUS"] as const,
  },
  "pier-transfer": {
    category: "pier" as const,
    navLabelKey: "pierTransfer" as const,
    coverImage: "/images/article-pier-phi-phi.png",
    locationTypes: ["pier"] as const,
    reviewIds: ["5", "6", "1"] as const,
    featuredRoutes: [
      ["kbv-airport", "chao-fah-pier"],
      ["kbv-airport", "klong-jilad-pier"],
      ["kbv-airport", "ao-nam-mao"],
      ["kbv-airport", "laem-kruat-pier"],
      ["kbv-airport", "donsak-pier"],
      ["kbv-airport", "ao-nang-pier"],
    ] as const,
    vehicleCodes: ["ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "BUS"] as const,
  },
  "beach-transfer": {
    category: "beach" as const,
    navLabelKey: "beachTransfer" as const,
    coverImage: "/images/article-ao-nang-railay.png",
    locationTypes: ["beach"] as const,
    reviewIds: ["2", "6", "1"] as const,
    featuredRoutes: [
      ["kbv-airport", "ao-nang-beach"],
      ["phuket-airport", "ao-nang-beach"],
      ["ao-nang-beach", "koh-lanta-z1"],
      ["ao-nang-beach", "koh-lanta-z2"],
      ["ao-nang-beach", "koh-lanta-z3"],
      ["kbv-airport", "koh-lanta-z1"],
    ] as const,
    vehicleCodes: ["ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "BUS"] as const,
  },
  "city-transfer": {
    category: "city" as const,
    navLabelKey: "cityTransfer" as const,
    coverImage: "/images/transfer-services-bg-v2.png",
    locationTypes: ["city"] as const,
    reviewIds: ["7", "4", "3"] as const,
    featuredRoutes: [
      ["kbv-airport", "krabi-town"],
      ["kbv-airport", "phuket-town"],
      ["kbv-airport", "trang-town"],
      ["kbv-airport", "surat-thani"],
      ["kbv-airport", "hat-yai-town"],
      ["kbv-airport", "satun-town"],
    ] as const,
    vehicleCodes: ["ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "BUS"] as const,
  },
  "attraction-transfer": {
    category: "attraction" as const,
    navLabelKey: "attractionTransfer" as const,
    coverImage: "/images/tours/emerald-pool.jpg",
    locationTypes: ["attraction", "temple", "park", "viewpoint"] as const,
    reviewIds: ["7", "6", "2"] as const,
    featuredRoutes: [
      ["krabi-town", "emerald-pool"],
      ["krabi-town", "tiger-cave"],
      ["krabi-town", "hot-spring"],
      ["kbv-airport", "tiger-cave"],
      ["emerald-pool", "hot-spring"],
      ["ao-nang-beach", "emerald-pool"],
    ] as const,
    vehicleCodes: ["ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "BUS"] as const,
  },
  "inter-province-transfer": {
    category: "inter-province" as const,
    navLabelKey: "interProvince" as const,
    coverImage: "/images/article-inter-province.png",
    locationTypes: ["province", "city", "airport"] as const,
    reviewIds: ["4", "7", "1"] as const,
    featuredRoutes: [
      ["phuket-airport", "ao-nang-beach"],
      ["phuket-airport", "koh-lanta-z1"],
      ["kbv-airport", "phuket-airport"],
      ["kbv-airport", "trang-town"],
      ["kbv-airport", "surat-thani"],
      ["kbv-airport", "hat-yai-airport"],
    ] as const,
    vehicleCodes: ["ECO", "PREM", "SUV", "VAN", "EXE", "VIP", "BUS"] as const,
  },
};

export type TransferPageKey = keyof typeof transferPages;
