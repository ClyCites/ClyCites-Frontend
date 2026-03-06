import { LogisticsEntityFormPage } from "@/app/app/logistics/_components/LogisticsEntityFormPage";

interface LogisticsEditColdChainLogsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsEditColdChainLogsPage({ params }: LogisticsEditColdChainLogsPageProps) {
  const { id } = await params;
  return <LogisticsEntityFormPage entityKey="coldChainLogs" mode="edit" recordId={id} />;
}
