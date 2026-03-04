import { LogisticsEntityDetailPage } from "@/app/app/logistics/_components/LogisticsEntityDetailPage";

interface LogisticsTrackingEventsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsTrackingEventsDetailPage({ params }: LogisticsTrackingEventsDetailPageProps) {
  const { id } = await params;
  return <LogisticsEntityDetailPage entityKey="trackingEvents" recordId={id} />;
}
