import { LogisticsEntityDetailPage } from "@/app/app/logistics/_components/LogisticsEntityDetailPage";

interface LogisticsColdChainLogsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsColdChainLogsDetailPage({ params }: LogisticsColdChainLogsDetailPageProps) {
  const { id } = await params;
  return <LogisticsEntityDetailPage entityKey="coldChainLogs" recordId={id} />;
}
