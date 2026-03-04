import { FarmerEntityDetailPage } from "@/app/app/farmer/_components/FarmerEntityDetailPage";

interface FarmerWeatherAlertsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerWeatherAlertsDetailPage({ params }: FarmerWeatherAlertsDetailPageProps) {
  const { id } = await params;
  return <FarmerEntityDetailPage entityKey="weatherAlerts" recordId={id} />;
}
