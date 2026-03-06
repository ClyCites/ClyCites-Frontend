import { FarmerEntityFormPage } from "@/app/app/farmer/_components/FarmerEntityFormPage";

interface FarmerEditAdvisoriesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerEditAdvisoriesPage({ params }: FarmerEditAdvisoriesPageProps) {
  const { id } = await params;
  return <FarmerEntityFormPage entityKey="advisories" mode="edit" recordId={id} />;
}
