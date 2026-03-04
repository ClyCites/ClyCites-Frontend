import { PricesEntityFormPage } from "@/app/app/prices/_components/PricesEntityFormPage";

interface PricesEditRecommendationsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesEditRecommendationsPage({ params }: PricesEditRecommendationsPageProps) {
  const { id } = await params;
  return <PricesEntityFormPage entityKey="recommendations" mode="edit" recordId={id} />;
}
