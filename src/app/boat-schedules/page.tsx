import { PageHeader } from "@/components/shared/page-header";
import { BoatSchedulesContent } from "@/components/boats/boat-schedules-content";

export default function BoatSchedulesPage() {
  return (
    <>
      <PageHeader
        title="Boat Schedules"
        subtitle="Mock ferry, speedboat, and longtail times for Krabi, Railay, Phi Phi, and nearby routes."
      />
      <BoatSchedulesContent />
    </>
  );
}
