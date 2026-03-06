import { MarketplaceEntityDetailPage } from "@/app/app/marketplace/_components/MarketplaceEntityDetailPage";

interface MarketplaceRfqsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceRfqsDetailPage({ params }: MarketplaceRfqsDetailPageProps) {
  const { id } = await params;
  return <MarketplaceEntityDetailPage entityKey="rfqs" recordId={id} />;
}
