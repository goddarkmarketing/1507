import { PageHeader } from "@/components/shared/page-header";
import { TransferPageTemplate } from "@/components/shared/transfer-page-template";

export default function PierTransferPage() {
  return (
    <>
      <PageHeader
        title="Pier Transfer"
        subtitle="Seamless connections to ferry piers and island departures"
      />
      <TransferPageTemplate pageKey="pier-transfer" />
    </>
  );
}
