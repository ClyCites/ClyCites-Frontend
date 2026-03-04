import { AdminEntityDetailPage } from "@/app/app/admin/_components/AdminEntityDetailPage";

interface AdminModuleTogglesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminModuleTogglesDetailPage({ params }: AdminModuleTogglesDetailPageProps) {
  const { id } = await params;
  return <AdminEntityDetailPage entityKey="moduleToggles" recordId={id} />;
}
