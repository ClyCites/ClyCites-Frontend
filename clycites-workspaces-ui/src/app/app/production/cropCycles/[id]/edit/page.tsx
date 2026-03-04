import { ProductionEntityFormPage } from "@/app/app/production/_components/ProductionEntityFormPage";

interface ProductionEditCropCyclesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductionEditCropCyclesPage({ params }: ProductionEditCropCyclesPageProps) {
  const { id } = await params;
  return <ProductionEntityFormPage entityKey="cropCycles" mode="edit" recordId={id} />;
}
