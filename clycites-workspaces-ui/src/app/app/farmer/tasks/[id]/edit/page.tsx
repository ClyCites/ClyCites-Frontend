import { FarmerEntityFormPage } from "@/app/app/farmer/_components/FarmerEntityFormPage";

interface FarmerEditTasksPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerEditTasksPage({ params }: FarmerEditTasksPageProps) {
  const { id } = await params;
  return <FarmerEntityFormPage entityKey="tasks" mode="edit" recordId={id} />;
}
