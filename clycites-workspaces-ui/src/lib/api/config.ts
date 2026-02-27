export type ApiMode = "mock" | "real";

export function getApiMode(): ApiMode {
  const mode = process.env.NEXT_PUBLIC_API_MODE?.toLowerCase();
  if (mode === "real") {
    return "real";
  }
  return "mock";
}

export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  const fallback = "https://staging-api.clycites.com";
  const raw = configured && configured.length > 0 ? configured : fallback;
  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}
