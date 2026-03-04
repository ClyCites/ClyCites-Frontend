import { LogisticsEntityFormPage } from "@/app/app/logistics/_components/LogisticsEntityFormPage";

interface LogisticsEditVehiclesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsEditVehiclesPage({ params }: LogisticsEditVehiclesPageProps) {
  const { id } = await params;
  return <LogisticsEntityFormPage entityKey="vehicles" mode="edit" recordId={id} />;
}
