import { FarmerEntityDetailPage } from "@/app/app/farmer/_components/FarmerEntityDetailPage";

interface FarmerFarmsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerFarmsDetailPage({ params }: FarmerFarmsDetailPageProps) {
  const { id } = await params;
  return <FarmerEntityDetailPage entityKey="farms" recordId={id} />;
}
