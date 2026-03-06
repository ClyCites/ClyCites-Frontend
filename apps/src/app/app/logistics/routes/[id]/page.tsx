import { LogisticsEntityDetailPage } from "@/app/app/logistics/_components/LogisticsEntityDetailPage";

interface LogisticsRoutesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsRoutesDetailPage({ params }: LogisticsRoutesDetailPageProps) {
  const { id } = await params;
  return <LogisticsEntityDetailPage entityKey="routes" recordId={id} />;
}
