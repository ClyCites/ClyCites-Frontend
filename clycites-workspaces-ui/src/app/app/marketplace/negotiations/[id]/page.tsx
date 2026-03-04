import { MarketplaceEntityDetailPage } from "@/app/app/marketplace/_components/MarketplaceEntityDetailPage";

interface MarketplaceNegotiationsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceNegotiationsDetailPage({ params }: MarketplaceNegotiationsDetailPageProps) {
  const { id } = await params;
  return <MarketplaceEntityDetailPage entityKey="negotiations" recordId={id} />;
}
