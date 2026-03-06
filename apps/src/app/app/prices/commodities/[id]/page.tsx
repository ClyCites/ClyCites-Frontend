import { PricesEntityDetailPage } from "@/app/app/prices/_components/PricesEntityDetailPage";

interface PricesCommoditiesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PricesCommoditiesDetailPage({ params }: PricesCommoditiesDetailPageProps) {
  const { id } = await params;
  return <PricesEntityDetailPage entityKey="commodities" recordId={id} />;
}
