import { AggregationEntityDetailPage } from "@/app/app/aggregation/_components/AggregationEntityDetailPage";

interface AggregationWarehousesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationWarehousesDetailPage({ params }: AggregationWarehousesDetailPageProps) {
  const { id } = await params;
  return <AggregationEntityDetailPage entityKey="warehouses" recordId={id} />;
}
