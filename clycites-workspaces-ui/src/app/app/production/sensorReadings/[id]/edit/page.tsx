import { ProductionEntityFormPage } from "@/app/app/production/_components/ProductionEntityFormPage";

interface ProductionEditSensorReadingsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductionEditSensorReadingsPage({ params }: ProductionEditSensorReadingsPageProps) {
  const { id } = await params;
  return <ProductionEntityFormPage entityKey="sensorReadings" mode="edit" recordId={id} />;
}
