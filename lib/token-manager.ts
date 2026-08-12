/**
 * TokenManager — single source of truth for auth tokens.
 *
 * Security contract:
 *   - accessToken  → module-level variable ONLY (never written to disk/DOM)
 *   - refreshToken → localStorage under obfuscated key '_roc_sid'
 *
 * Import this ONLY from:
 *   - lib/api-client.ts
 *   - providers/auth-provider.tsx
 */

// ─── Access Token (in-memory, wiped on page reload) ──────────────────────────
let _accessToken: string | null = null;

// ─── Refresh Token key (obfuscated) ──────────────────────────────────────────
const RT_KEY = "_roc_sid";

function safeLocalStorage() {
  return typeof window !== "undefined" ? window.localStorage : null;
}

export const TokenManager = {
  // Access Token — memory only
  getAT(): string | null {
    return _accessToken;
  },
  setAT(token: string): void {
    _accessToken = token;
  },

  // Refresh Token — localStorage only
  getRT(): string | null {
    return safeLocalStorage()?.getItem(RT_KEY) ?? null;
  },
  setRT(token: string): void {
    safeLocalStorage()?.setItem(RT_KEY, token);
  },

  // Clear everything on logout / session expiry
  clear(): void {
    _accessToken = null;
    safeLocalStorage()?.removeItem(RT_KEY);
  },

  hasSession(): boolean {
    return !!safeLocalStorage()?.getItem(RT_KEY);
  },
};
