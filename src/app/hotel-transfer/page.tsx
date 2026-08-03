import { PageHeader } from "@/components/shared/page-header";
import { TransferPageTemplate } from "@/components/shared/transfer-page-template";

export default function HotelTransferPage() {
  return (
    <>
      <PageHeader
        title="Hotel Transfer"
        subtitle="Door-to-door service to resorts and hotels across the region"
      />
      <TransferPageTemplate pageKey="hotel-transfer" />
    </>
  );
}
