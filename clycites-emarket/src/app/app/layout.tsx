import { GlobalTopbar } from "@/components/layout/GlobalTopbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <GlobalTopbar />
      <main>{children}</main>
    </div>
  );
}
