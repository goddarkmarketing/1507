import { PageHeader } from "@/components/shared/page-header";
import { TransferPageTemplate } from "@/components/shared/transfer-page-template";

export default function BeachTransferPage() {
  return (
    <>
      <PageHeader
        title="Beach Transfer"
        subtitle="Direct transfers to Krabi's stunning beaches and coastal areas"
      />
      <TransferPageTemplate pageKey="beach-transfer" />
    </>
  );
}
