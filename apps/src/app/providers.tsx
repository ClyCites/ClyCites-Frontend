"use client";

import { useEffect, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MockSessionProvider } from "@/lib/auth/mock-session";
import { Toaster } from "@/components/ui/toaster";
import { initializeTheme } from "@/lib/theme/theme";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    initializeTheme();
  }, []);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MockSessionProvider>
        {children}
        <Toaster />
      </MockSessionProvider>
    </QueryClientProvider>
  );
}
