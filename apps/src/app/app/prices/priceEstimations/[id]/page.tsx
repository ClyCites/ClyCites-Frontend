import { PricesEntityDetailPage } from "@/app/app/prices/_components/PricesEntityDetailPage";

interface PricesPriceEstimationsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesPriceEstimationsDetailPage({ params }: PricesPriceEstimationsDetailPageProps) {
  const { id } = await params;
  return <PricesEntityDetailPage entityKey="priceEstimations" recordId={id} />;
}
