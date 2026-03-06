import { FarmerEntityFormPage } from "@/app/app/farmer/_components/FarmerEntityFormPage";

interface FarmerEditFarmsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerEditFarmsPage({ params }: FarmerEditFarmsPageProps) {
  const { id } = await params;
  return <FarmerEntityFormPage entityKey="farms" mode="edit" recordId={id} />;
}
