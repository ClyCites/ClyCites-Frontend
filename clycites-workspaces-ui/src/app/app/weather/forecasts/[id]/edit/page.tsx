import { WeatherEntityFormPage } from "@/app/app/weather/_components/WeatherEntityFormPage";

interface WeatherEditForecastsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WeatherEditForecastsPage({ params }: WeatherEditForecastsPageProps) {
  const { id } = await params;
  return <WeatherEntityFormPage entityKey="forecasts" mode="edit" recordId={id} />;
}
