import { AggregationEntityFormPage } from "@/app/app/aggregation/_components/AggregationEntityFormPage";

interface AggregationEditBatchesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationEditBatchesPage({ params }: AggregationEditBatchesPageProps) {
  const { id } = await params;
  return <AggregationEntityFormPage entityKey="batches" mode="edit" recordId={id} />;
}
