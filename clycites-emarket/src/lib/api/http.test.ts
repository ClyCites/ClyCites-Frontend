import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, getToken, HttpError, removeToken, setCurrentOrgId, setToken } from "./http";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("http client", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    removeToken();
    setCurrentOrgId(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
    removeToken();
    setCurrentOrgId(null);
  });

  it("attaches auth, org, and idempotency headers for write operations", async () => {
    setToken("token-123");
    setCurrentOrgId("org-abc");

    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({ success: true, data: { id: "ord-1" } })
    );
    global.fetch = fetchMock as typeof fetch;

    await api.post("/orders", { listingId: "listing-1", quantity: 1 });

    const [, requestOptions] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = requestOptions.headers as Record<string, string>;

    expect(headers.Authorization).toBe("Bearer token-123");
    expect(headers["X-Organization-Id"]).toBe("org-abc");
    expect(headers["Idempotency-Key"]).toBeTruthy();
  });

  it("retries transient server errors with backoff", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(
          { success: false, error: { code: "INTERNAL_ERROR", message: "boom" } },
          500
        )
      )
      .mockResolvedValueOnce(jsonResponse({ success: true, data: { healthy: true } }));

    global.fetch = fetchMock as typeof fetch;

    const response = await api.get<{ healthy: boolean }>("/analytics");
    expect(response.healthy).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("refreshes token on 401 and retries original request", async () => {
    setToken("expired-token");

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ success: false, error: { code: "UNAUTHORIZED", message: "expired" } }, 401)
      )
      .mockResolvedValueOnce(
        jsonResponse({
          success: true,
          data: { accessToken: "fresh-token", expiresIn: "15m" },
        })
      )
      .mockResolvedValueOnce(jsonResponse({ success: true, data: { ok: true } }));

    global.fetch = fetchMock as typeof fetch;

    const response = await api.get<{ ok: boolean }>("/prices");
    expect(response.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect((fetchMock.mock.calls[1] as [string])[0]).toContain("/auth/refresh-token");
    expect(getToken()).toBe("fresh-token");
  });

  it("exposes requestId in normalized errors", async () => {
    const fetchMock = vi.fn().mockImplementation(() =>
      Promise.resolve(
        jsonResponse(
          {
            success: false,
            error: { code: "VALIDATION_ERROR", message: "Invalid payload" },
            meta: { requestId: "req_123" },
          },
          422
        )
      )
    );

    global.fetch = fetchMock as typeof fetch;

    let thrownError: unknown;
    try {
      await api.post("/orders", { foo: "bar" });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(HttpError);
    const httpError = thrownError as HttpError;
    expect(httpError.requestId).toBe("req_123");
    expect(httpError.code).toBe("VALIDATION_ERROR");
  });
});
