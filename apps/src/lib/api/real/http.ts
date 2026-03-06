import { getApiBaseUrl } from "@/lib/api/config";

const ACCESS_TOKEN_KEY = "clycites.real.accessToken";
const REFRESH_TOKEN_KEY = "clycites.real.refreshToken";
const MAX_RETRY_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 350;
const MAX_RETRY_DELAY_MS = 4_000;

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

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function parseValidationDetails(payload: unknown): string | undefined {
  const record = asRecord(payload);
  if (!record) return undefined;

  const details = record.details;
  if (Array.isArray(details)) {
    const first = details.find((item) => {
      const row = asRecord(item);
      return Boolean(asString(row?.message));
    });

    if (first && typeof first === "object") {
      const row = first as Record<string, unknown>;
      const message = asString(row.message);
      const field = asString(row.field);
      if (message) {
        return field ? `${field}: ${message}` : message;
      }
    }
  }

  const errors = record.errors;
  if (Array.isArray(errors)) {
    const first = errors.find((item) => asString(item));
    if (typeof first === "string") return first;
  }

  if (errors && typeof errors === "object") {
    const entries = Object.entries(errors as Record<string, unknown>);
    const first = entries.find(([, value]) => typeof value === "string" || (Array.isArray(value) && value.length > 0));
    if (!first) return undefined;
    const [field, value] = first;
    if (typeof value === "string") return `${field}: ${value}`;
    if (Array.isArray(value)) {
      const firstMessage = value.find((item) => typeof item === "string");
      if (typeof firstMessage === "string") return `${field}: ${firstMessage}`;
    }
  }

  return undefined;
}

export function parseApiErrorPayload(payload: unknown, status: number, fallback: string): ApiErrorPayload {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return { status, message: payload.trim(), details: payload };
  }

  const root = asRecord(payload) ?? {};
  const nestedError = asRecord(root.error);
  const nestedData = asRecord(root.data);
  const validationMessage =
    parseValidationDetails(root) ??
    parseValidationDetails(nestedError) ??
    parseValidationDetails(nestedData);

  const message =
    validationMessage ??
    asString(root.message) ??
    asString(root.error_description) ??
    asString(root.detail) ??
    asString(nestedError?.message) ??
    asString(nestedData?.message) ??
    fallback;

  const code =
    asString(root.code) ??
    asString(root.errorCode) ??
    asString(root.error) ??
    asString(nestedError?.code) ??
    asString(nestedData?.code);

  return {
    status,
    message,
    code,
    details: payload,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function retryDelayFromAttempt(attempt: number): number {
  const exponential = BASE_RETRY_DELAY_MS * 2 ** Math.max(0, attempt - 1);
  const jitter = Math.floor(Math.random() * 150);
  return Math.min(MAX_RETRY_DELAY_MS, exponential + jitter);
}

function parseRetryAfterMs(headerValue: string | null): number | null {
  if (!headerValue) return null;

  const seconds = Number(headerValue);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.max(0, Math.floor(seconds * 1_000));
  }

  const target = Date.parse(headerValue);
  if (Number.isNaN(target)) return null;
  return Math.max(0, target - Date.now());
}

function shouldRetryStatus(status: number): boolean {
  return status === 429 || status === 502 || status === 503 || status === 504;
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
  const dataSource = "data" in objectPayload ? objectPayload.data : objectPayload;
  const data = asRecord(dataSource);
  if (!data) return null;

  const nestedTokens = asRecord(data.tokens) ?? asRecord(objectPayload.tokens);

  const accessToken =
    asString(nestedTokens?.accessToken) ??
    asString(data.accessToken) ??
    asString(data.token) ??
    asString(objectPayload.accessToken) ??
    asString(objectPayload.token);

  const refreshToken =
    asString(nestedTokens?.refreshToken) ??
    asString(data.refreshToken) ??
    asString(objectPayload.refreshToken);

  if (!accessToken) return null;
  return { accessToken, refreshToken };
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
    attempt?: number;
  }
): Promise<T> {
  const authEnabled = options.auth ?? true;
  const attempt = options.attempt ?? 1;
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

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

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers,
    });
  } catch (error) {
    if (attempt < MAX_RETRY_ATTEMPTS) {
      await delay(retryDelayFromAttempt(attempt));
      return requestInternal<T>(path, init, { ...options, attempt: attempt + 1 });
    }
    throw new ApiRequestError({
      status: 0,
      message: "Network request failed. Please check connection and retry.",
      code: "NETWORK_ERROR",
      details: error,
    });
  }

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
          attempt: 1,
        });
      }
    }

    if (shouldRetryStatus(response.status) && attempt < MAX_RETRY_ATTEMPTS) {
      const retryAfterMs = parseRetryAfterMs(response.headers.get("retry-after"));
      await delay(retryAfterMs ?? retryDelayFromAttempt(attempt));
      return requestInternal<T>(path, init, {
        ...options,
        attempt: attempt + 1,
      });
    }

    throw new ApiRequestError(
      parseApiErrorPayload(payload, response.status, `Request failed with status ${response.status}`)
    );
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
  return requestInternal<T>(path, init, {
    ...options,
    attempt: 1,
  });
}
