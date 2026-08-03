import { PageHeader } from "@/components/shared/page-header";
import { TravelInfoPageContent } from "@/components/travel/travel-info-page-content";

export default function TravelInfoPage() {
  return (
    <>
      <PageHeader
        title="Travel Info"
        subtitle="Practical guides for Ao Nang, Railay, Phi Phi arrivals, and the Krabi–Phuket corridor."
      />
      <TravelInfoPageContent />
    </>
  );
}
