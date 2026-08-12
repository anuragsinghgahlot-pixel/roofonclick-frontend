/**
 * apiClient — centralized fetch wrapper for all backend API calls.
 *
 * Security features:
 *   - Base URL always from NEXT_PUBLIC_API_URL env var (never hardcoded)
 *   - AT attached from memory via TokenManager.getAT()
 *   - 401 → single refresh attempt with isRefreshing lock
 *   - Concurrent 401s during refresh are queued and replayed
 *   - On refresh failure → TokenManager.clear() + redirect to /login
 *   - Headers/tokens never logged
 */

import { TokenManager } from "@/lib/token-manager";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE && typeof window !== "undefined") {
  console.error("[apiClient] NEXT_PUBLIC_API_URL is not set.");
}

// ─── Refresh lock + queue ─────────────────────────────────────────────────────
let isRefreshing = false;
type QueueCallback = (token: string | null) => void;
let failedQueue: QueueCallback[] = [];

function processQueue(token: string | null) {
  failedQueue.forEach((cb) => cb(token));
  failedQueue = [];
}

// ─── Silent redirect helper (client-side only) ────────────────────────────────
function redirectToLogin() {
  if (typeof window !== "undefined") {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login?redirect=${redirect}`;
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: Array<{ msg: string; path: string }>;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  _retry = false
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${path}`;
  const at = TokenManager.getAT();

  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  if (at) {
    headers["Authorization"] = `Bearer ${at}`;
  }

  const res = await fetch(url, { ...options, headers });

  // ── Happy path ──────────────────────────────────────────────────────────────
  if (res.ok) {
    const json: ApiResponse<T> = await res.json();
    return json;
  }

  // ── 401 — try refresh once ──────────────────────────────────────────────────
  // ⚠ Auth endpoints (login/register/refresh) must NEVER trigger a refresh loop.
  //   A 401 on /api/auth/login means wrong credentials — not an expired token.
  const isAuthEndpoint = path.startsWith("/api/auth/");

  if (res.status === 401 && !_retry && !isAuthEndpoint) {
    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise<ApiResponse<T>>((resolve, reject) => {
        failedQueue.push((newToken) => {
          if (!newToken) {
            reject(new Error("Session expired. Please log in again."));
            return;
          }
          // Replay with new token
          request<T>(path, options, true).then(resolve).catch(reject);
        });
      });
    }

    isRefreshing = true;
    const rt = TokenManager.getRT();

    if (!rt) {
      isRefreshing = false;
      TokenManager.clear();
      redirectToLogin();
      throw new Error("No refresh token. Please log in again.");
    }

    try {
      const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: rt }),
      });

      if (!refreshRes.ok) throw new Error("Refresh failed");

      const refreshData: ApiResponse<{ accessToken: string }> = await refreshRes.json();
      const newAT = refreshData.data?.accessToken;

      if (!newAT) throw new Error("No access token in refresh response");

      TokenManager.setAT(newAT);
      isRefreshing = false;
      processQueue(newAT);

      // Replay the original request with new AT
      return request<T>(path, options, true);
    } catch {
      isRefreshing = false;
      processQueue(null);
      TokenManager.clear();
      redirectToLogin();
      throw new Error("Session expired. Please log in again.");
    }
  }

  // ── Other error — parse and throw ───────────────────────────────────────────
  let errBody: ApiResponse;
  try {
    errBody = await res.json();
  } catch {
    errBody = { success: false, message: `Request failed (${res.status})` };
  }

  const err = new Error(errBody.message || `Request failed (${res.status})`);
  (err as any).statusCode = res.status;
  (err as any).errors = errBody.errors;
  throw err;
}

// ─── Convenience methods ──────────────────────────────────────────────────────
export const apiClient = {
  get: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, options?: RequestInit) =>
    request<T>(path, { ...options, method: "DELETE" }),

  /**
   * Upload files — does NOT set Content-Type (let browser set multipart boundary)
   */
  upload: <T>(path: string, formData: FormData) => {
    const at = TokenManager.getAT();
    const headers: Record<string, string> = {};
    if (at) headers["Authorization"] = `Bearer ${at}`;
    return request<T>(path, { method: "POST", body: formData, headers } as RequestInit);
  },
};
