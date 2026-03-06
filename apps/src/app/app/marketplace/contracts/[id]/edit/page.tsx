import { MarketplaceEntityFormPage } from "@/app/app/marketplace/_components/MarketplaceEntityFormPage";

interface MarketplaceEditContractsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceEditContractsPage({ params }: MarketplaceEditContractsPageProps) {
  const { id } = await params;
  return <MarketplaceEntityFormPage entityKey="contracts" mode="edit" recordId={id} />;
}
