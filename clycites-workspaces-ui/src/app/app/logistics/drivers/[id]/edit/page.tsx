import { LogisticsEntityFormPage } from "@/app/app/logistics/_components/LogisticsEntityFormPage";

interface LogisticsEditDriversPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsEditDriversPage({ params }: LogisticsEditDriversPageProps) {
  const { id } = await params;
  return <LogisticsEntityFormPage entityKey="drivers" mode="edit" recordId={id} />;
}
