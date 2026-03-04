import { MarketplaceEntityFormPage } from "@/app/app/marketplace/_components/MarketplaceEntityFormPage";

interface MarketplaceEditRfqsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceEditRfqsPage({ params }: MarketplaceEditRfqsPageProps) {
  const { id } = await params;
  return <MarketplaceEntityFormPage entityKey="rfqs" mode="edit" recordId={id} />;
}
