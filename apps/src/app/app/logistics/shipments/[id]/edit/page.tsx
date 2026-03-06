import { LogisticsEntityFormPage } from "@/app/app/logistics/_components/LogisticsEntityFormPage";

interface LogisticsEditShipmentsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsEditShipmentsPage({ params }: LogisticsEditShipmentsPageProps) {
  const { id } = await params;
  return <LogisticsEntityFormPage entityKey="shipments" mode="edit" recordId={id} />;
}
