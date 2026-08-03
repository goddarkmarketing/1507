export type LocationType =
  | "province"
  | "airport"
  | "pier"
  | "city"
  | "hotel"
  | "beach"
  | "temple"
  | "park"
  | "viewpoint"
  | "attraction"
  | "border"
  | "train_station"
  | "bus_station";

export type TransferCategory =
  | "airport"
  | "hotel"
  | "pier"
  | "beach"
  | "city"
  | "attraction"
  | "inter-province";

export type VehicleCode =
  | "ECO"
  | "PREM"
  | "SUV"
  | "VAN"
  | "VIP"
  | "SIG"
  | "BUS"
  | "EXE";

export type BookingType =
  | "one-way"
  | "round-trip"
  | "multi-route"
  | "multi-day"
  | "daily-charter"
  | "hourly-charter";

export type PaymentMethod = "bank-transfer" | "card" | "promptpay";

export interface CardPaymentDetails {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

export interface TransferProof {
  fileName: string;
  fileType: string;
  /** Base64 data URL — mock storage only (demo) */
  dataUrl: string;
  uploadedAt: string;
}

export interface BookingPayment {
  method: PaymentMethod;
  /** Last 4 digits for card, or bank name / PromptPay id summary */
  summary: string;
  paidAt?: string;
  status: "paid" | "awaiting-transfer";
  /** Bank symbol when paid via transfer (KBANK / SCB / BBL) */
  bankSymbol?: string;
  transferProof?: TransferProof;
}

export interface Location {
  id: string;
  name: string;
  nameTh: string;
  type: LocationType;
  province: string;
  connections: string[];
}

export interface Vehicle {
  code: VehicleCode;
  name: string;
  passengers: string;
  luggage: string;
  amenities: string[];
  priceMultiplier: number;
  image: string;
}

export interface RoutePrice {
  fromId: string;
  toId: string;
  basePrice: number;
  durationMin: number;
  distanceKm: number;
  category: TransferCategory;
}

export interface BookingLeg {
  id: string;
  fromId: string;
  toId: string;
  date: string;
  time: string;
  vehicleCode: VehicleCode;
  price: number;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  type: BookingType;
  legs: BookingLeg[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  flightNumber?: string;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  status: "confirmed" | "pending" | "cancelled";
  payment?: BookingPayment;
}

export interface Review {
  id: string;
  name: string;
  country: string;
  rating: number;
  comment: string;
  route: string;
  date: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Policy {
  id: string;
  title: string;
  content: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readMinutes: number;
  content: string[];
}

export type TourCategory =
  | "Island"
  | "Snorkel"
  | "Kayak"
  | "Sightseeing"
  | "Combo";

export interface Tour {
  slug: string;
  title: string;
  excerpt: string;
  category: TourCategory;
  duration: string;
  fromArea: string;
  toArea: string;
  highlights: string[];
  includes: string[];
  priceFrom: number;
  coverImage: string;
  pierId?: string;
  content: string[];
}

export type BoatType = "ferry" | "speedboat" | "longtail";

export interface BoatSchedule {
  id: string;
  routeLabel: string;
  fromPierId: string;
  toPierId: string;
  operator: string;
  type: BoatType;
  departures: string[];
  durationMin: number;
  priceFrom: number;
  notes: string;
  /** Square 1:1 cover for schedule list */
  image: string;
}

export type TravelGuideCategory =
  | "Destination"
  | "Island"
  | "Corridor"
  | "Practical";

export interface TravelGuide {
  slug: string;
  title: string;
  excerpt: string;
  region: string;
  category: TravelGuideCategory;
  coverImage: string;
  readMinutes: number;
  tips: string[];
  content: string[];
  relatedTourSlugs?: string[];
  relatedBoatRouteIds?: string[];
}

export interface RentalDailyRates {
  /** 1–3 days — price per day (THB), null = on request */
  days1to3: number | null;
  /** 4–6 days */
  days4to6: number | null;
  /** 7–20 days */
  days7to20: number | null;
  /** 21–30 days */
  days21to30: number | null;
}

export type RentalCategory = "Mini Car" | "Economy" | "Compact" | "Full Size";

export interface RentalPackage {
  id: string;
  category: RentalCategory;
  model: string;
  engine: string;
  transmission: "Automatic";
  seats: number;
  largeBags: number;
  doors: number;
  rates: RentalDailyRates;
  image: string;
}
