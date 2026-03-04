import { LogisticsEntityDetailPage } from "@/app/app/logistics/_components/LogisticsEntityDetailPage";

interface LogisticsDriversDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsDriversDetailPage({ params }: LogisticsDriversDetailPageProps) {
  const { id } = await params;
  return <LogisticsEntityDetailPage entityKey="drivers" recordId={id} />;
}
