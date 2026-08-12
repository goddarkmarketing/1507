import { TransferLocalePage } from "@/components/shared/transfer-locale-page";

type Props = { params: Promise<{ locale: string }> };

export default function Page({ params }: Props) {
  return <TransferLocalePage pageKey="pier-transfer" params={params} />;
}
