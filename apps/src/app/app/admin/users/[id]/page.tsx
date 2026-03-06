import { AdminEntityDetailPage } from "@/app/app/admin/_components/AdminEntityDetailPage";

interface AdminUsersDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminUsersDetailPage({ params }: AdminUsersDetailPageProps) {
  const { id } = await params;
  return <AdminEntityDetailPage entityKey="users" recordId={id} />;
}
