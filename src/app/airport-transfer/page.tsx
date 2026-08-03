import { PageHeader } from "@/components/shared/page-header";
import { TransferPageTemplate } from "@/components/shared/transfer-page-template";

export default function AirportTransferPage() {
  return (
    <>
      <PageHeader
        title="Airport Transfer"
        subtitle="Reliable transfers to and from Krabi & Southern Thailand airports"
      />
      <TransferPageTemplate pageKey="airport-transfer" />
    </>
  );
}
