import { searchService as mockSearchService } from "@/lib/api/mock";
import { apiRequest, ApiRequestError, unwrapApiData } from "@/lib/api/real/http";
import type { SearchResultItem } from "@/lib/store/types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function shouldFallback(error: unknown): boolean {
  if (!(error instanceof ApiRequestError)) return true;
  return error.status !== 401 && error.status !== 403;
}

async function withFallback<T>(remote: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await remote();
  } catch (error) {
    if (!shouldFallback(error)) throw error;
    return fallback();
  }
}

function extractRows(payload: unknown): unknown[] {
  const data = unwrapApiData<unknown>(payload);
  if (Array.isArray(data)) return data;
  const record = asRecord(data);
  if (!record) return [];
  const candidates = [record.items, record.rows, record.results, record.data];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function normalizeListings(rows: unknown[]): SearchResultItem[] {
  return rows.slice(0, 20).map((row, index) => {
    const record = asRecord(row) ?? {};
    const id = String(record.id ?? record._id ?? `listing-${index + 1}`);
    return {
      id,
      entity: "listings",
      title: String(record.title ?? record.productName ?? record.name ?? `Listing ${index + 1}`),
      status: String(record.status ?? "active"),
      workspace: "marketplace",
      route: "/app/marketplace/listings",
      updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : new Date().toISOString(),
    };
  });
}

export const searchService = {
  async search(query: string) {
    const text = query.trim();
    if (text.length < 2) return [];

    return withFallback(
      async () => {
        const params = new URLSearchParams();
        params.set("product", text);
        const payload = await apiRequest<unknown>(`/api/v1/listings?${params.toString()}`, { method: "GET" }, { auth: true });
        return normalizeListings(extractRows(payload));
      },
      () => mockSearchService.search(query)
    );
  },
};
