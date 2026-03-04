import { ProductionEntityDetailPage } from "@/app/app/production/_components/ProductionEntityDetailPage";

interface ProductionYieldPredictionsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductionYieldPredictionsDetailPage({ params }: ProductionYieldPredictionsDetailPageProps) {
  const { id } = await params;
  return <ProductionEntityDetailPage entityKey="yieldPredictions" recordId={id} />;
}
