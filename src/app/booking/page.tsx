import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { BookingForm } from "@/components/booking/booking-form";

export default function BookingPage() {
  return (
    <>
      <PageHeader
        title="Book Your Transfer"
        subtitle="One-way, round-trip, multi-route, multi-day & charter — all in one booking."
      />
      <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
        <BookingForm />
      </Suspense>
    </>
  );
}
