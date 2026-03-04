import { FarmerEntityDetailPage } from "@/app/app/farmer/_components/FarmerEntityDetailPage";

interface FarmerPlotsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerPlotsDetailPage({ params }: FarmerPlotsDetailPageProps) {
  const { id } = await params;
  return <FarmerEntityDetailPage entityKey="plots" recordId={id} />;
}
