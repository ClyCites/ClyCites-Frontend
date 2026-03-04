import { PricesEntityDetailPage } from "@/app/app/prices/_components/PricesEntityDetailPage";

interface PricesMarketPricesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesMarketPricesDetailPage({ params }: PricesMarketPricesDetailPageProps) {
  const { id } = await params;
  return <PricesEntityDetailPage entityKey="marketPrices" recordId={id} />;
}
