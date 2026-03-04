import { ProductionEntityFormPage } from "@/app/app/production/_components/ProductionEntityFormPage";

interface ProductionEditGrowthStagesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductionEditGrowthStagesPage({ params }: ProductionEditGrowthStagesPageProps) {
  const { id } = await params;
  return <ProductionEntityFormPage entityKey="growthStages" mode="edit" recordId={id} />;
}
