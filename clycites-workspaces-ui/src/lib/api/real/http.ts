import { getApiBaseUrl } from "@/lib/api/config";

const ACCESS_TOKEN_KEY = "clycites.real.accessToken";
const REFRESH_TOKEN_KEY = "clycites.real.refreshToken";

export interface ApiErrorPayload {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

export class ApiRequestError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiRequestError";
    this.status = payload.status;
    this.code = payload.code;
    this.details = payload.details;
  }
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeJsonParse(input: string): unknown {
  try {
    return JSON.parse(input) as unknown;
  } catch {
    return null;
  }
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export function getStoredTokens(): AuthTokens | null {
  if (!isBrowser()) return null;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken) return null;

  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY) ?? undefined;
  return { accessToken, refreshToken };
}

export function storeTokens(tokens: AuthTokens): void {
  if (!isBrowser()) return;

  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }
}

export function clearTokens(): void {
  if (!isBrowser()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;

  const objectPayload = payload as Record<string, unknown>;
  if (typeof objectPayload.message === "string") return objectPayload.message;

  if (objectPayload.error && typeof objectPayload.error === "object") {
    const nested = objectPayload.error as Record<string, unknown>;
    if (typeof nested.message === "string") return nested.message;
  }

  return fallback;
}

function getErrorCode(payload: unknown): string | undefined {
  if (!payload || typeof payload !== "object") return undefined;
  const objectPayload = payload as Record<string, unknown>;

  if (typeof objectPayload.code === "string") return objectPayload.code;

  const errorObject = objectPayload.error;
  if (errorObject && typeof errorObject === "object") {
    const nested = errorObject as Record<string, unknown>;
    if (typeof nested.code === "string") return nested.code;
  }

  return undefined;
}

export function unwrapApiData<T>(payload: unknown): T {
  if (payload && typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;
    if ("data" in objectPayload) {
      return objectPayload.data as T;
    }
  }

  return payload as T;
}

function extractTokens(payload: unknown): AuthTokens | null {
  if (!payload || typeof payload !== "object") return null;

  const objectPayload = payload as Record<string, unknown>;
  const data = ("data" in objectPayload ? objectPayload.data : objectPayload) as Record<string, unknown> | null;
  if (!data || typeof data !== "object") return null;

  const accessToken =
    (typeof data.accessToken === "string" ? data.accessToken : undefined) ||
    (typeof data.token === "string" ? data.token : undefined) ||
    (typeof objectPayload.accessToken === "string" ? (objectPayload.accessToken as string) : undefined);

  const refreshToken =
    (typeof data.refreshToken === "string" ? data.refreshToken : undefined) ||
    (typeof objectPayload.refreshToken === "string" ? (objectPayload.refreshToken as string) : undefined);

  if (!accessToken) return null;

  return {
    accessToken,
    refreshToken,
  };
}

async function refreshAccessToken(refreshToken: string): Promise<AuthTokens | null> {
  const url = `${getApiBaseUrl()}/api/v1/auth/refresh-token`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const raw = await response.text();
  const payload = contentType.includes("application/json") ? safeJsonParse(raw) : raw;

  if (!response.ok) {
    return null;
  }

  const tokens = extractTokens(payload);
  if (tokens) {
    storeTokens(tokens);
  }

  return tokens;
}

async function requestInternal<T>(
  path: string,
  init: RequestInit,
  options: {
    auth?: boolean;
    retryOnUnauthorized?: boolean;
  }
): Promise<T> {
  const authEnabled = options.auth ?? true;
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(init.headers ?? {});
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const tokens = getStoredTokens();
  if (authEnabled && tokens?.accessToken) {
    headers.set("Authorization", `Bearer ${tokens.accessToken}`);
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const raw = await response.text();
  const payload = contentType.includes("application/json") ? safeJsonParse(raw) : raw;

  if (!response.ok) {
    if (
      response.status === 401 &&
      authEnabled &&
      options.retryOnUnauthorized !== false &&
      tokens?.refreshToken
    ) {
      const refreshed = await refreshAccessToken(tokens.refreshToken);
      if (refreshed?.accessToken) {
        return requestInternal<T>(path, init, {
          ...options,
          retryOnUnauthorized: false,
        });
      }
    }

    throw new ApiRequestError({
      status: response.status,
      message: getErrorMessage(payload, `Request failed with status ${response.status}`),
      code: getErrorCode(payload),
      details: payload,
    });
  }

  if (path.includes("/auth/login") || path.includes("/auth/refresh-token")) {
    const nextTokens = extractTokens(payload);
    if (nextTokens) {
      storeTokens(nextTokens);
    }
  }

  return payload as T;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: {
    auth?: boolean;
    retryOnUnauthorized?: boolean;
  } = {}
): Promise<T> {
  return requestInternal<T>(path, init, options);
}
