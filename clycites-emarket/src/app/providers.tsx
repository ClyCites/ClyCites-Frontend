"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/query/query-client";
import { AuthProvider } from "@/lib/auth/auth-context";
import { OrgProvider } from "@/lib/context/org-context";
import { DataSaverProvider } from "@/lib/context/data-saver-context";
import { Toaster } from "@/components/ui/toaster";
import { MockSessionProvider } from "@/lib/auth/mock-session";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MockSessionProvider>
          <DataSaverProvider>
            <OrgProvider>
              {children}
              <Toaster />
            </OrgProvider>
          </DataSaverProvider>
        </MockSessionProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
