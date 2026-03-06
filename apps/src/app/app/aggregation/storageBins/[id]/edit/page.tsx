import { AggregationEntityFormPage } from "@/app/app/aggregation/_components/AggregationEntityFormPage";

interface AggregationEditStorageBinsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationEditStorageBinsPage({ params }: AggregationEditStorageBinsPageProps) {
  const { id } = await params;
  return <AggregationEntityFormPage entityKey="storageBins" mode="edit" recordId={id} />;
}
