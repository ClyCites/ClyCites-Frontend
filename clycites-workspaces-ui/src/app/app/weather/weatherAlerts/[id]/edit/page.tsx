import { WeatherEntityFormPage } from "@/app/app/weather/_components/WeatherEntityFormPage";

interface WeatherEditWeatherAlertsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WeatherEditWeatherAlertsPage({ params }: WeatherEditWeatherAlertsPageProps) {
  const { id } = await params;
  return <WeatherEntityFormPage entityKey="weatherAlerts" mode="edit" recordId={id} />;
}
