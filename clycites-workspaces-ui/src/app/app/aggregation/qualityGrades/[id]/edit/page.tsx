import { AggregationEntityFormPage } from "@/app/app/aggregation/_components/AggregationEntityFormPage";

interface AggregationEditQualityGradesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationEditQualityGradesPage({ params }: AggregationEditQualityGradesPageProps) {
  const { id } = await params;
  return <AggregationEntityFormPage entityKey="qualityGrades" mode="edit" recordId={id} />;
}
