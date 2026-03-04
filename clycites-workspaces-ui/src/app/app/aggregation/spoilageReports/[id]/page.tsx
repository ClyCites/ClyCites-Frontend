import { AggregationEntityDetailPage } from "@/app/app/aggregation/_components/AggregationEntityDetailPage";

interface AggregationSpoilageReportsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationSpoilageReportsDetailPage({ params }: AggregationSpoilageReportsDetailPageProps) {
  const { id } = await params;
  return <AggregationEntityDetailPage entityKey="spoilageReports" recordId={id} />;
}
