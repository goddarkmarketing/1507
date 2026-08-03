import { PageHeader } from "@/components/shared/page-header";
import { PriceListContent } from "@/components/price-list/price-list-content";

export default function PriceListPage() {
  return (
    <>
      <PageHeader
        title="Price List"
        subtitle="Car rental packages by day, plus transparent transfer rates across Southern Thailand."
      />
      <PriceListContent />
    </>
  );
}
