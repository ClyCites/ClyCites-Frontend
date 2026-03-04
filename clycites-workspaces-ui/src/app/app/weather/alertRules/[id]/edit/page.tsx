import { WeatherEntityFormPage } from "@/app/app/weather/_components/WeatherEntityFormPage";

interface WeatherEditAlertRulesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function WeatherEditAlertRulesPage({ params }: WeatherEditAlertRulesPageProps) {
  const { id } = await params;
  return <WeatherEntityFormPage entityKey="alertRules" mode="edit" recordId={id} />;
}
