import { AggregationEntityFormPage } from "@/app/app/aggregation/_components/AggregationEntityFormPage";

interface AggregationEditSpoilageReportsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationEditSpoilageReportsPage({ params }: AggregationEditSpoilageReportsPageProps) {
  const { id } = await params;
  return <AggregationEntityFormPage entityKey="spoilageReports" mode="edit" recordId={id} />;
}
