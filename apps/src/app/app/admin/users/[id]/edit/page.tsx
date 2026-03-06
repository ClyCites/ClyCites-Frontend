import { AdminEntityFormPage } from "@/app/app/admin/_components/AdminEntityFormPage";

interface AdminEditUsersPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditUsersPage({ params }: AdminEditUsersPageProps) {
  const { id } = await params;
  return <AdminEntityFormPage entityKey="users" mode="edit" recordId={id} />;
}
