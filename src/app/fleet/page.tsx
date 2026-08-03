import { PageHeader } from "@/components/shared/page-header";
import { FleetPageContent } from "@/components/fleet/fleet-page-content";

export default function FleetPage() {
  return (
    <>
      <PageHeader
        title="Our Fleet"
        subtitle="Self-drive rental packages and private transfer vehicles for every group size."
      />
      <FleetPageContent />
    </>
  );
}
