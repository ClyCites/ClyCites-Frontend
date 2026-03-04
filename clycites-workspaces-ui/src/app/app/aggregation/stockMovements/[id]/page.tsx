import { AggregationEntityDetailPage } from "@/app/app/aggregation/_components/AggregationEntityDetailPage";

interface AggregationStockMovementsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationStockMovementsDetailPage({ params }: AggregationStockMovementsDetailPageProps) {
  const { id } = await params;
  return <AggregationEntityDetailPage entityKey="stockMovements" recordId={id} />;
}
