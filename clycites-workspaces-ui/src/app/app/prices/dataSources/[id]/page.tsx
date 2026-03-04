import { PricesEntityDetailPage } from "@/app/app/prices/_components/PricesEntityDetailPage";

interface PricesDataSourcesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesDataSourcesDetailPage({ params }: PricesDataSourcesDetailPageProps) {
  const { id } = await params;
  return <PricesEntityDetailPage entityKey="dataSources" recordId={id} />;
}
