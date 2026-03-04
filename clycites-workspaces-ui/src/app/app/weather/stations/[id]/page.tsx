import { WeatherEntityDetailPage } from "@/app/app/weather/_components/WeatherEntityDetailPage";

interface WeatherStationsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WeatherStationsDetailPage({ params }: WeatherStationsDetailPageProps) {
  const { id } = await params;
  return <WeatherEntityDetailPage entityKey="stations" recordId={id} />;
}
