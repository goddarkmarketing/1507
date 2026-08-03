import { PageHeader } from "@/components/shared/page-header";
import { ToursPageContent } from "@/components/tours/tours-page-content";

export default function ToursPage() {
  return (
    <>
      <PageHeader
        title="Tours"
        subtitle="Day trips and packages across Krabi islands, lagoons, and nature spots — with pier transfer support."
      />
      <ToursPageContent />
    </>
  );
}
