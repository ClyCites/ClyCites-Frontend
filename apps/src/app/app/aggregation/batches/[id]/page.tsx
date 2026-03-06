import { AggregationEntityDetailPage } from "@/app/app/aggregation/_components/AggregationEntityDetailPage";

interface AggregationBatchesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationBatchesDetailPage({ params }: AggregationBatchesDetailPageProps) {
  const { id } = await params;
  return <AggregationEntityDetailPage entityKey="batches" recordId={id} />;
}
