import { FarmerEntityDetailPage } from "@/app/app/farmer/_components/FarmerEntityDetailPage";

interface FarmerCropsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerCropsDetailPage({ params }: FarmerCropsDetailPageProps) {
  const { id } = await params;
  return <FarmerEntityDetailPage entityKey="crops" recordId={id} />;
}
