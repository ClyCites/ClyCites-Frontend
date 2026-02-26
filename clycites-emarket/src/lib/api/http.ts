import type { ApiError, ApiMeta, ApiResponse, AuthTokens } from "./types/shared.types";

type PrimitiveParam = string | number | boolean | null | undefined;
type HeaderMap = Record<string, string>;

export type RequestParams = Record<string, PrimitiveParam>;

export interface RequestOptions extends Omit<RequestInit, "headers" | "body"> {
  body?: unknown;
  headers?: HeaderMap;
  params?: RequestParams;
  orgId?: string | null;
  superAdminMode?: boolean;
  superAdminReason?: string;
  idempotencyKey?: string;
  skipAuth?: boolean;
  skipRefresh?: boolean;
  retryCount?: number;
}

const ACCESS_TOKEN_KEY = "clycites.session.access_token";
const ORG_ID_KEY = "clycites.session.organization_id";
const DEFAULT_TIMEOUT_MS = 20_000;
const DEFAULT_MAX_RETRIES = 2;

let accessTokenMemory: string | null = null;
let orgIdMemory: string | null = null;
let onUnauthorized: (() => void) | null = null;
let refreshPromise: Promise<string | null> | null = null;
let lastMeta: ApiMeta | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function withNoTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function resolveApiBaseUrl(): string {
  const explicitBase = process.env.NEXT_PUBLIC_API_BASE;
  if (explicitBase) return `${withNoTrailingSlash(explicitBase)}/api/v1`;

  const legacyBase = process.env.NEXT_PUBLIC_API_URL;
  if (!legacyBase) return "http://localhost:5000/api/v1";

  const normalized = withNoTrailingSlash(legacyBase);
  if (normalized.endsWith("/api/v1")) return normalized;
  if (normalized.endsWith("/api")) return `${normalized}/v1`;
  return `${normalized}/api/v1`;
}

const BASE_URL = resolveApiBaseUrl();

function normalizePath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;

  let normalized = `/${path.replace(/^\/+/, "")}`;
  if (normalized.startsWith("/api/v1/")) normalized = normalized.slice("/api/v1".length);
  if (normalized === "/api/v1") normalized = "/";
  if (normalized.startsWith("/v1/")) normalized = normalized.slice("/v1".length);
  if (normalized === "/v1") normalized = "/";

  return normalized || "/";
}

function readSessionStorage(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSessionStorage(key: string, value: string): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // no-op
  }
}

function removeSessionStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // no-op
  }
}

// ── Token + tenant storage ────────────────────────────────────────────────────

export function getToken(): string | null {
  if (accessTokenMemory) return accessTokenMemory;
  accessTokenMemory = readSessionStorage(ACCESS_TOKEN_KEY);
  return accessTokenMemory;
}

export function setToken(token: string): void {
  accessTokenMemory = token;
  writeSessionStorage(ACCESS_TOKEN_KEY, token);
}

export function removeToken(): void {
  accessTokenMemory = null;
  removeSessionStorage(ACCESS_TOKEN_KEY);
}

export function getCurrentOrgId(): string | null {
  if (orgIdMemory) return orgIdMemory;
  orgIdMemory = readSessionStorage(ORG_ID_KEY);
  return orgIdMemory;
}

export function setCurrentOrgId(orgId: string | null): void {
  orgIdMemory = orgId;
  if (orgId) {
    writeSessionStorage(ORG_ID_KEY, orgId);
  } else {
    removeSessionStorage(ORG_ID_KEY);
  }
}

export function registerUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export function getLastResponseMeta(): ApiMeta | null {
  return lastMeta;
}

export function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  const seed = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `idem-${seed}`;
}

// ── Errors ────────────────────────────────────────────────────────────────────

export class HttpError extends Error {
  constructor(public readonly apiError: ApiError) {
    super(apiError.message);
    this.name = "HttpError";
  }

  get status(): number {
    return this.apiError.status;
  }

  get code(): string {
    return this.apiError.code;
  }

  get requestId(): string | undefined {
    return this.apiError.requestId;
  }
}

function toApiError(response: Response, payload?: ApiResponse<unknown> | null): ApiError {
  return {
    status: response.status,
    code: payload?.error?.code ?? "HTTP_ERROR",
    message: payload?.error?.message ?? `HTTP ${response.status}`,
    details: payload?.error?.details,
    requestId: payload?.meta?.requestId,
    meta: payload?.meta,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildRequestUrl(path: string, params?: RequestParams): string {
  if (/^https?:\/\//i.test(path)) {
    const direct = new URL(path);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          direct.searchParams.set(key, String(value));
        }
      });
    }
    return direct.toString();
  }

  const url = new URL(`${BASE_URL}${normalizePath(path)}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

function withTimeoutSignal(signal: AbortSignal | null | undefined, timeoutMs: number): AbortSignal {
  if (signal) return signal;
  if (typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
    return AbortSignal.timeout(timeoutMs);
  }

  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller.signal;
}

function shouldSetJsonContentType(body: RequestOptions["body"]): boolean {
  if (body === null || body === undefined) return false;
  if (typeof FormData !== "undefined" && body instanceof FormData) return false;
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) return false;
  return !(body instanceof Blob);
}

function shouldRetryStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function getBackoffMs(attempt: number): number {
  return Math.min(750 * 2 ** attempt, 5_000);
}

function requiresIdempotency(method: string, path: string): boolean {
  const target = normalizePath(path);
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
    (target.startsWith("/orders") || target.startsWith("/payments"));
}

function isAuthEndpoint(path: string): boolean {
  const normalized = normalizePath(path);
  return normalized.startsWith("/auth/login") ||
    normalized.startsWith("/auth/refresh-token") ||
    normalized.startsWith("/auth/register");
}

async function delay(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseApiPayload<T>(response: Response): Promise<ApiResponse<T> | null> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) return null;

  try {
    return await response.json() as ApiResponse<T>;
  } catch {
    return null;
  }
}

function buildHeaders(path: string, options: RequestOptions, body: RequestOptions["body"]): HeaderMap {
  const method = (options.method ?? "GET").toUpperCase();
  const headers: HeaderMap = {
    ...(options.headers ?? {}),
  };

  if (shouldSetJsonContentType(body) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (!options.skipAuth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const scopedOrg = options.orgId ?? getCurrentOrgId();
  if (scopedOrg) headers["X-Organization-Id"] = scopedOrg;

  if (options.superAdminMode) {
    headers["X-Super-Admin-Mode"] = "true";
    if (options.superAdminReason) {
      headers["X-Super-Admin-Reason"] = options.superAdminReason;
    }
  }

  if (requiresIdempotency(method, path)) {
    headers["Idempotency-Key"] = options.idempotencyKey ?? headers["Idempotency-Key"] ?? createIdempotencyKey();
  }

  return headers;
}

function encodeBody(body: RequestOptions["body"], headers: HeaderMap): BodyInit | undefined {
  if (body === null || body === undefined) return undefined;
  if (typeof FormData !== "undefined" && body instanceof FormData) return body;
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams) return body;
  if (body instanceof Blob) return body;

  const contentType = headers["Content-Type"]?.toLowerCase() ?? "";
  if (contentType.includes("application/json")) {
    return JSON.stringify(body);
  }

  return body as BodyInit;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const tokens = await http<AuthTokens>("/auth/refresh-token", {
        method: "POST",
        skipAuth: true,
        skipRefresh: true,
        retryCount: 0,
      });

      if (tokens.accessToken) {
        setToken(tokens.accessToken);
        return tokens.accessToken;
      }
    } catch {
      // no-op
    } finally {
      refreshPromise = null;
    }

    removeToken();
    onUnauthorized?.();
    return null;
  })();

  return refreshPromise;
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

export async function http<T = unknown>(
  path: string,
  options: RequestOptions = {},
  attempt = 0
): Promise<T> {
  const method = (options.method ?? "GET").toUpperCase();
  const headers = buildHeaders(path, options, options.body);
  const url = buildRequestUrl(path, options.params);

  const response = await fetch(url, {
    ...options,
    method,
    headers,
    body: encodeBody(options.body, headers),
    credentials: options.credentials ?? "include",
    signal: withTimeoutSignal(options.signal, DEFAULT_TIMEOUT_MS),
  });

  const payload = await parseApiPayload<T>(response);
  if (payload?.meta) lastMeta = payload.meta;

  if (!response.ok) {
    if (response.status === 401 && !options.skipRefresh && !isAuthEndpoint(path)) {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        return http<T>(path, { ...options, skipRefresh: true }, attempt);
      }
    }

    const retryBudget = options.retryCount ?? DEFAULT_MAX_RETRIES;
    if (attempt < retryBudget && shouldRetryStatus(response.status)) {
      await delay(getBackoffMs(attempt));
      return http<T>(path, options, attempt + 1);
    }

    throw new HttpError(toApiError(response, payload));
  }

  if (payload && payload.success === false) {
    throw new HttpError({
      status: response.status,
      code: payload.error?.code ?? "API_ERROR",
      message: payload.error?.message ?? "Request failed",
      details: payload.error?.details,
      requestId: payload.meta?.requestId,
      meta: payload.meta,
    });
  }

  if (payload && "success" in payload) {
    return (payload.data ?? null) as T;
  }

  return (payload as unknown as T) ?? (null as T);
}

// ── Convenience methods ───────────────────────────────────────────────────────

type MethodOptions = Omit<RequestOptions, "method" | "params" | "body">;

export const api = {
  get: <T>(path: string, params?: RequestParams, options?: MethodOptions) =>
    http<T>(path, { ...options, method: "GET", params }),

  post: <T>(path: string, body?: RequestOptions["body"], options?: MethodOptions) =>
    http<T>(path, { ...options, method: "POST", body }),

  put: <T>(path: string, body?: RequestOptions["body"], options?: MethodOptions) =>
    http<T>(path, { ...options, method: "PUT", body }),

  patch: <T>(path: string, body?: RequestOptions["body"], options?: MethodOptions) =>
    http<T>(path, { ...options, method: "PATCH", body }),

  delete: <T>(path: string, body?: RequestOptions["body"], options?: MethodOptions) =>
    http<T>(path, { ...options, method: "DELETE", body }),
};
