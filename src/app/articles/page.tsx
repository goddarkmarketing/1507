import { PageHeader } from "@/components/shared/page-header";
import { ArticlesPageContent } from "@/components/articles/articles-page-content";

export default function ArticlesPage() {
  return (
    <>
      <PageHeader
        title="Travel Articles"
        subtitle="Guides and tips for airport, beach, pier, and inter-province transfers across Southern Thailand."
      />
      <ArticlesPageContent />
    </>
  );
}
