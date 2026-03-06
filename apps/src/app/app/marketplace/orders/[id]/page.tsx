import { MarketplaceEntityDetailPage } from "@/app/app/marketplace/_components/MarketplaceEntityDetailPage";

interface MarketplaceOrdersDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MarketplaceOrdersDetailPage({ params }: MarketplaceOrdersDetailPageProps) {
  const { id } = await params;
  return <MarketplaceEntityDetailPage entityKey="orders" recordId={id} />;
}
