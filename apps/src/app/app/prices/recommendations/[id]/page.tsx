import { PricesEntityDetailPage } from "@/app/app/prices/_components/PricesEntityDetailPage";

interface PricesRecommendationsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesRecommendationsDetailPage({ params }: PricesRecommendationsDetailPageProps) {
  const { id } = await params;
  return <PricesEntityDetailPage entityKey="recommendations" recordId={id} />;
}
