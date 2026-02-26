import { QueryClient } from "@tanstack/react-query";
import { HttpError } from "@/lib/api/http";
import { isDataSaverEnabled } from "@/lib/context/data-saver-context";

export function makeQueryClient() {
  const dataSaver = typeof window !== "undefined" && isDataSaverEnabled();

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: dataSaver ? 1000 * 60 * 5 : 1000 * 60 * 2,
        gcTime: dataSaver ? 1000 * 60 * 20 : 1000 * 60 * 10,
        retry: (failureCount, error) => {
          if (error instanceof HttpError) {
            if (error.status === 429) return failureCount < 3;
            if (error.status < 500) return false;
          }
          return failureCount < 3;
        },
        retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 5_000),
        refetchOnWindowFocus: !dataSaver,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}
