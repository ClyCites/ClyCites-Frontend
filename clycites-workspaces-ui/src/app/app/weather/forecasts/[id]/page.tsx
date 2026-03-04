import { WeatherEntityDetailPage } from "@/app/app/weather/_components/WeatherEntityDetailPage";

interface WeatherForecastsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WeatherForecastsDetailPage({ params }: WeatherForecastsDetailPageProps) {
  const { id } = await params;
  return <WeatherEntityDetailPage entityKey="forecasts" recordId={id} />;
}
