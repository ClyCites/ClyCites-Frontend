import { AdminEntityFormPage } from "@/app/app/admin/_components/AdminEntityFormPage";

interface AdminEditApiTokensPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditApiTokensPage({ params }: AdminEditApiTokensPageProps) {
  const { id } = await params;
  return <AdminEntityFormPage entityKey="apiTokens" mode="edit" recordId={id} />;
}
