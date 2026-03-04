import { FarmerEntityFormPage } from "@/app/app/farmer/_components/FarmerEntityFormPage";

interface FarmerEditInputsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerEditInputsPage({ params }: FarmerEditInputsPageProps) {
  const { id } = await params;
  return <FarmerEntityFormPage entityKey="inputs" mode="edit" recordId={id} />;
}
