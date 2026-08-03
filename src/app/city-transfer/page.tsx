import { PageHeader } from "@/components/shared/page-header";
import { TransferPageTemplate } from "@/components/shared/transfer-page-template";

export default function CityTransferPage() {
  return (
    <>
      <PageHeader
        title="City Transfer"
        subtitle="Comfortable city-to-city transportation across Southern Thailand"
      />
      <TransferPageTemplate pageKey="city-transfer" />
    </>
  );
}
