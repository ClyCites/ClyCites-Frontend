import { ProductionEntityDetailPage } from "@/app/app/production/_components/ProductionEntityDetailPage";

interface ProductionCropCyclesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductionCropCyclesDetailPage({ params }: ProductionCropCyclesDetailPageProps) {
  const { id } = await params;
  return <ProductionEntityDetailPage entityKey="cropCycles" recordId={id} />;
}
