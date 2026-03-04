import { ProductionEntityDetailPage } from "@/app/app/production/_components/ProductionEntityDetailPage";

interface ProductionGrowthStagesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductionGrowthStagesDetailPage({ params }: ProductionGrowthStagesDetailPageProps) {
  const { id } = await params;
  return <ProductionEntityDetailPage entityKey="growthStages" recordId={id} />;
}
