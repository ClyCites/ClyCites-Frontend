import { ProductionEntityDetailPage } from "@/app/app/production/_components/ProductionEntityDetailPage";

interface ProductionSensorReadingsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductionSensorReadingsDetailPage({ params }: ProductionSensorReadingsDetailPageProps) {
  const { id } = await params;
  return <ProductionEntityDetailPage entityKey="sensorReadings" recordId={id} />;
}
