import { LogisticsEntityFormPage } from "@/app/app/logistics/_components/LogisticsEntityFormPage";

interface LogisticsEditTrackingEventsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsEditTrackingEventsPage({ params }: LogisticsEditTrackingEventsPageProps) {
  const { id } = await params;
  return <LogisticsEntityFormPage entityKey="trackingEvents" mode="edit" recordId={id} />;
}
