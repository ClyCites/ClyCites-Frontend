import { FarmerEntityFormPage } from "@/app/app/farmer/_components/FarmerEntityFormPage";

interface FarmerEditFarmersPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerEditFarmersPage({ params }: FarmerEditFarmersPageProps) {
  const { id } = await params;
  return <FarmerEntityFormPage entityKey="farmers" mode="edit" recordId={id} />;
}
