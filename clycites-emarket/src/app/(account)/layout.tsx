"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlobalTopbar } from "@/components/layout/GlobalTopbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/auth/auth-context";
import { LoadingState } from "@/components/shared/LoadingState";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <LoadingState text="Authenticating…" className="min-h-screen" />;
  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <GlobalTopbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
