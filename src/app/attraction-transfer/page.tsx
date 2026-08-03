import { PageHeader } from "@/components/shared/page-header";
import { TransferPageTemplate } from "@/components/shared/transfer-page-template";

export default function AttractionTransferPage() {
  return (
    <>
      <PageHeader
        title="Attraction Transfer"
        subtitle="Visit temples, national parks, and top tourist attractions"
      />
      <TransferPageTemplate pageKey="attraction-transfer" />
    </>
  );
}
