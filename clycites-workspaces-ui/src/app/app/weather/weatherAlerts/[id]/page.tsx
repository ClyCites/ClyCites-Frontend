import { WeatherEntityDetailPage } from "@/app/app/weather/_components/WeatherEntityDetailPage";

interface WeatherWeatherAlertsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WeatherWeatherAlertsDetailPage({ params }: WeatherWeatherAlertsDetailPageProps) {
  const { id } = await params;
  return <WeatherEntityDetailPage entityKey="weatherAlerts" recordId={id} />;
}
