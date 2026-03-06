import { FarmerEntityDetailPage } from "@/app/app/farmer/_components/FarmerEntityDetailPage";

interface FarmerTasksDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerTasksDetailPage({ params }: FarmerTasksDetailPageProps) {
  const { id } = await params;
  return <FarmerEntityDetailPage entityKey="tasks" recordId={id} />;
}
