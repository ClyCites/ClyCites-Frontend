import { PricesEntityDetailPage } from "@/app/app/prices/_components/PricesEntityDetailPage";

interface PricesMarketSignalsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesMarketSignalsDetailPage({ params }: PricesMarketSignalsDetailPageProps) {
  const { id } = await params;
  return <PricesEntityDetailPage entityKey="marketSignals" recordId={id} />;
}
