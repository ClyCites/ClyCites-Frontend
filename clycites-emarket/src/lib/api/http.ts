import type { ApiError } from "./types/shared.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

// ── Token storage ─────────────────────────────────────────────────────────────

const TOKEN_KEY = "clycites_access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Normalised error ──────────────────────────────────────────────────────────

export class HttpError extends Error {
  constructor(public readonly apiError: ApiError) {
    super(apiError.message);
    this.name = "HttpError";
  }
  get status() { return this.apiError.status; }
  get code()   { return this.apiError.code; }
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined | null>;
};

export async function http<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, headers: extraHeaders, ...rest } = options;

  // Build URL with query params
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    });
  }

  // Build headers
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders as Record<string, string>),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url.toString(), {
    ...rest,
    headers,
    credentials: "include", // for httpOnly refresh cookie
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Parse JSON (even for errors)
  let json: unknown;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    json = await response.json();
  }

  if (!response.ok) {
    const errBody = json as { error?: { code?: string; message?: string; details?: unknown } } | undefined;
    throw new HttpError({
      status: response.status,
      code: errBody?.error?.code ?? "UNKNOWN_ERROR",
      message: errBody?.error?.message ?? `HTTP ${response.status}`,
      details: errBody?.error?.details as ApiError["details"],
    });
  }

  // ClyCites envelope: { success: true, data: ... }
  const envelope = json as { success: boolean; data: T };
  return envelope.data ?? (json as T);
}

// ── Convenience methods ───────────────────────────────────────────────────────

export const api = {
  get:    <T>(path: string, params?: RequestOptions["params"]) =>
            http<T>(path, { method: "GET", params }),
  post:   <T>(path: string, body?: unknown) =>
            http<T>(path, { method: "POST", body }),
  put:    <T>(path: string, body?: unknown) =>
            http<T>(path, { method: "PUT", body }),
  patch:  <T>(path: string, body?: unknown) =>
            http<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) =>
            http<T>(path, { method: "DELETE" }),
};
