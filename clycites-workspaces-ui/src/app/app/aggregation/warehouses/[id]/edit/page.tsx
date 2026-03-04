import { AggregationEntityFormPage } from "@/app/app/aggregation/_components/AggregationEntityFormPage";

interface AggregationEditWarehousesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationEditWarehousesPage({ params }: AggregationEditWarehousesPageProps) {
  const { id } = await params;
  return <AggregationEntityFormPage entityKey="warehouses" mode="edit" recordId={id} />;
}
