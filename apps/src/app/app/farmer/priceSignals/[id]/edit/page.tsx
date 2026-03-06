import { FarmerEntityFormPage } from "@/app/app/farmer/_components/FarmerEntityFormPage";

interface FarmerEditPriceSignalsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function FarmerEditPriceSignalsPage({ params }: FarmerEditPriceSignalsPageProps) {
  const { id } = await params;
  return <FarmerEntityFormPage entityKey="priceSignals" mode="edit" recordId={id} />;
}
