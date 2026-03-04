import { AggregationEntityDetailPage } from "@/app/app/aggregation/_components/AggregationEntityDetailPage";

interface AggregationQualityGradesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationQualityGradesDetailPage({ params }: AggregationQualityGradesDetailPageProps) {
  const { id } = await params;
  return <AggregationEntityDetailPage entityKey="qualityGrades" recordId={id} />;
}
