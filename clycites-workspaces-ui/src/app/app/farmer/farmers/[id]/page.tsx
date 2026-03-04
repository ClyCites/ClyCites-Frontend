import { FarmerEntityDetailPage } from "@/app/app/farmer/_components/FarmerEntityDetailPage";

interface FarmerFarmersDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerFarmersDetailPage({ params }: FarmerFarmersDetailPageProps) {
  const { id } = await params;
  return <FarmerEntityDetailPage entityKey="farmers" recordId={id} />;
}
