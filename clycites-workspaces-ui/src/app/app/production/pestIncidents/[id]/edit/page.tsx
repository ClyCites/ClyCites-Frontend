import { ProductionEntityFormPage } from "@/app/app/production/_components/ProductionEntityFormPage";

interface ProductionEditPestIncidentsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductionEditPestIncidentsPage({ params }: ProductionEditPestIncidentsPageProps) {
  const { id } = await params;
  return <ProductionEntityFormPage entityKey="pestIncidents" mode="edit" recordId={id} />;
}
