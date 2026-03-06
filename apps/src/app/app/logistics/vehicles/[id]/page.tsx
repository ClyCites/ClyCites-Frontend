import { LogisticsEntityDetailPage } from "@/app/app/logistics/_components/LogisticsEntityDetailPage";

interface LogisticsVehiclesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsVehiclesDetailPage({ params }: LogisticsVehiclesDetailPageProps) {
  const { id } = await params;
  return <LogisticsEntityDetailPage entityKey="vehicles" recordId={id} />;
}
