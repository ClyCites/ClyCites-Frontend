import { FarmerEntityDetailPage } from "@/app/app/farmer/_components/FarmerEntityDetailPage";

interface FarmerInputsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerInputsDetailPage({ params }: FarmerInputsDetailPageProps) {
  const { id } = await params;
  return <FarmerEntityDetailPage entityKey="inputs" recordId={id} />;
}
