import { ProductionEntityDetailPage } from "@/app/app/production/_components/ProductionEntityDetailPage";

interface ProductionPestIncidentsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductionPestIncidentsDetailPage({ params }: ProductionPestIncidentsDetailPageProps) {
  const { id } = await params;
  return <ProductionEntityDetailPage entityKey="pestIncidents" recordId={id} />;
}
