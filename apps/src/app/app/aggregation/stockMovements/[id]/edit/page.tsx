import { AggregationEntityFormPage } from "@/app/app/aggregation/_components/AggregationEntityFormPage";

interface AggregationEditStockMovementsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AggregationEditStockMovementsPage({ params }: AggregationEditStockMovementsPageProps) {
  const { id } = await params;
  return <AggregationEntityFormPage entityKey="stockMovements" mode="edit" recordId={id} />;
}
