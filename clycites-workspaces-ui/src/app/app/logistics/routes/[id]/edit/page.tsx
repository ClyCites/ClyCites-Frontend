import { LogisticsEntityFormPage } from "@/app/app/logistics/_components/LogisticsEntityFormPage";

interface LogisticsEditRoutesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LogisticsEditRoutesPage({ params }: LogisticsEditRoutesPageProps) {
  const { id } = await params;
  return <LogisticsEntityFormPage entityKey="routes" mode="edit" recordId={id} />;
}
