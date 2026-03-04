import { AdminEntityFormPage } from "@/app/app/admin/_components/AdminEntityFormPage";

interface AdminEditPermissionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditPermissionsPage({ params }: AdminEditPermissionsPageProps) {
  const { id } = await params;
  return <AdminEntityFormPage entityKey="permissions" mode="edit" recordId={id} />;
}
