import { AdminEntityFormPage } from "@/app/app/admin/_components/AdminEntityFormPage";

interface AdminEditModuleTogglesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditModuleTogglesPage({ params }: AdminEditModuleTogglesPageProps) {
  const { id } = await params;
  return <AdminEntityFormPage entityKey="moduleToggles" mode="edit" recordId={id} />;
}
