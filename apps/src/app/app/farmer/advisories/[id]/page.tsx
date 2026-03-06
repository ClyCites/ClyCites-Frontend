import { FarmerEntityDetailPage } from "@/app/app/farmer/_components/FarmerEntityDetailPage";

interface FarmerAdvisoriesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerAdvisoriesDetailPage({ params }: FarmerAdvisoriesDetailPageProps) {
  const { id } = await params;
  return <FarmerEntityDetailPage entityKey="advisories" recordId={id} />;
}
