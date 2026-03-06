import { AggregationEntityDetailPage } from "@/app/app/aggregation/_components/AggregationEntityDetailPage";

interface AggregationStorageBinsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationStorageBinsDetailPage({ params }: AggregationStorageBinsDetailPageProps) {
  const { id } = await params;
  return <AggregationEntityDetailPage entityKey="storageBins" recordId={id} />;
}
