import { WeatherEntityFormPage } from "@/app/app/weather/_components/WeatherEntityFormPage";

interface WeatherEditStationsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WeatherEditStationsPage({ params }: WeatherEditStationsPageProps) {
  const { id } = await params;
  return <WeatherEntityFormPage entityKey="stations" mode="edit" recordId={id} />;
}
