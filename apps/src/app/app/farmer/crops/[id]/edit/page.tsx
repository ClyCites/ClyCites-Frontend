import { FarmerEntityFormPage } from "@/app/app/farmer/_components/FarmerEntityFormPage";

interface FarmerEditCropsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerEditCropsPage({ params }: FarmerEditCropsPageProps) {
  const { id } = await params;
  return <FarmerEntityFormPage entityKey="crops" mode="edit" recordId={id} />;
}
