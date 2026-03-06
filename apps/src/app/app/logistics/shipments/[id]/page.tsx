import { LogisticsEntityDetailPage } from "@/app/app/logistics/_components/LogisticsEntityDetailPage";

interface LogisticsShipmentsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsShipmentsDetailPage({ params }: LogisticsShipmentsDetailPageProps) {
  const { id } = await params;
  return <LogisticsEntityDetailPage entityKey="shipments" recordId={id} />;
}
