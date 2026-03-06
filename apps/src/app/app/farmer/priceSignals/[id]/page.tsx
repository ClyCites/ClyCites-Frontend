import { FarmerEntityDetailPage } from "@/app/app/farmer/_components/FarmerEntityDetailPage";

interface FarmerPriceSignalsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerPriceSignalsDetailPage({ params }: FarmerPriceSignalsDetailPageProps) {
  const { id } = await params;
  return <FarmerEntityDetailPage entityKey="priceSignals" recordId={id} />;
}
