import { FarmerEntityFormPage } from "@/app/app/farmer/_components/FarmerEntityFormPage";

interface FarmerEditPlotsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerEditPlotsPage({ params }: FarmerEditPlotsPageProps) {
  const { id } = await params;
  return <FarmerEntityFormPage entityKey="plots" mode="edit" recordId={id} />;
}
