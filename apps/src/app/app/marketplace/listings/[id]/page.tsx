import { MarketplaceEntityDetailPage } from "@/app/app/marketplace/_components/MarketplaceEntityDetailPage";

interface MarketplaceListingsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceListingsDetailPage({ params }: MarketplaceListingsDetailPageProps) {
  const { id } = await params;
  return <MarketplaceEntityDetailPage entityKey="listings" recordId={id} />;
}
