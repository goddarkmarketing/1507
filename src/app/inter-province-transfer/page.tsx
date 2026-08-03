import { PageHeader } from "@/components/shared/page-header";
import { TransferPageTemplate } from "@/components/shared/transfer-page-template";

export default function InterProvinceTransferPage() {
  return (
    <>
      <PageHeader
        title="Inter Province Transfer"
        subtitle="Long-distance transfers between provinces in Southern Thailand"
      />
      <TransferPageTemplate pageKey="inter-province-transfer" />
    </>
  );
}
