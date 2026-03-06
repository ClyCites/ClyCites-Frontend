import { MarketplaceEntityDetailPage } from "@/app/app/marketplace/_components/MarketplaceEntityDetailPage";

interface MarketplaceContractsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceContractsDetailPage({ params }: MarketplaceContractsDetailPageProps) {
  const { id } = await params;
  return <MarketplaceEntityDetailPage entityKey="contracts" recordId={id} />;
}
