import { ProductionEntityFormPage } from "@/app/app/production/_components/ProductionEntityFormPage";

interface ProductionEditYieldPredictionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductionEditYieldPredictionsPage({ params }: ProductionEditYieldPredictionsPageProps) {
  const { id } = await params;
  return <ProductionEntityFormPage entityKey="yieldPredictions" mode="edit" recordId={id} />;
}
