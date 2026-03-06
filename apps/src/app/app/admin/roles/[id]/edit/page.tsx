import { AdminEntityFormPage } from "@/app/app/admin/_components/AdminEntityFormPage";

interface AdminEditRolesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditRolesPage({ params }: AdminEditRolesPageProps) {
  const { id } = await params;
  return <AdminEntityFormPage entityKey="roles" mode="edit" recordId={id} />;
}
