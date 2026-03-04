import { AdminEntityFormPage } from "@/app/app/admin/_components/AdminEntityFormPage";

interface AdminEditOrgsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditOrgsPage({ params }: AdminEditOrgsPageProps) {
  const { id } = await params;
  return <AdminEntityFormPage entityKey="orgs" mode="edit" recordId={id} />;
}
