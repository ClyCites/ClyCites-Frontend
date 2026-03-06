import { FarmerEntityFormPage } from "@/app/app/farmer/_components/FarmerEntityFormPage";

interface FarmerEditWeatherAlertsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerEditWeatherAlertsPage({ params }: FarmerEditWeatherAlertsPageProps) {
  const { id } = await params;
  return <FarmerEntityFormPage entityKey="weatherAlerts" mode="edit" recordId={id} />;
}
