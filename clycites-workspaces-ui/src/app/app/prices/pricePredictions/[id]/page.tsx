import { PricesEntityDetailPage } from "@/app/app/prices/_components/PricesEntityDetailPage";

interface PricesPricePredictionsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesPricePredictionsDetailPage({ params }: PricesPricePredictionsDetailPageProps) {
  const { id } = await params;
  return <PricesEntityDetailPage entityKey="pricePredictions" recordId={id} />;
}
