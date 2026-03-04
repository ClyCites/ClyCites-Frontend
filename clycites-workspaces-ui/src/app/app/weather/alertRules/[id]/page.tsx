import { WeatherEntityDetailPage } from "@/app/app/weather/_components/WeatherEntityDetailPage";

interface WeatherAlertRulesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WeatherAlertRulesDetailPage({ params }: WeatherAlertRulesDetailPageProps) {
  const { id } = await params;
  return <WeatherEntityDetailPage entityKey="alertRules" recordId={id} />;
}
