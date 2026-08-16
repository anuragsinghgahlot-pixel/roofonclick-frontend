"use client";

/**
 * AuthProvider — real backend-connected authentication.
 *
 * Token strategy (Secure Hybrid):
 *   - accessToken  → in-memory only via TokenManager (never on disk)
 *   - refreshToken → localStorage under obfuscated key '_roc_sid'
 *
 * On mount: if RT exists in storage, silently refresh to rehydrate session.
 */

import * as React from "react";
import { TokenManager } from "@/lib/token-manager";
import { apiClient } from "@/lib/api-client";
import { showToast } from "@/lib/toast";

// ─── Lightweight session cookie (readable by Next.js middleware) ──────────────
// Middleware can't access localStorage, so we set a plain (non-HttpOnly) cookie
// as a presence indicator. It holds NO sensitive data.
const SESSION_COOKIE = "_roc_has_session";

function setSessionCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Strict`;
  }
}

function clearSessionCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
  }
}

// Backend returns role: "seeker" | "owner" | "admin"
// UI uses: "buyer" | "owner" | "admin" — we map seeker → buyer
export type BackendRole = "seeker" | "owner" | "admin";
export type UserRole = "buyer" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  // Legacy aliases used by profile page
  phoneNumber?: string;
  dob?: string;
  gender?: string;
  status?: string;
  avatar?: string;
  avatarUrl?: string;
  role: UserRole;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  memberSince?: string;
}

interface BackendUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: BackendRole;
  createdAt?: string;
}

interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: BackendUser;
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string, role?: UserRole) => Promise<User>;
  loginWithTokens: (accessToken: string, refreshToken: string, backendUser: BackendUser) => User;
  logout: () => Promise<void>;
  updateUser: (updatedFields: Partial<User>) => void;
  // Legacy compat
  setRole: (role: UserRole) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// ─── Role mapper ──────────────────────────────────────────────────────────────
function mapRole(backendRole: BackendRole): UserRole {
  return backendRole === "seeker" ? "buyer" : backendRole;
}

function normalizeUser(backendUser: BackendUser): User {
  return {
    id: backendUser._id,
    name: backendUser.name,
    email: backendUser.email,
    phone: backendUser.phone,
    avatar: backendUser.avatar,
    avatarUrl: backendUser.avatar,
    role: mapRole(backendUser.role),
    memberSince: backendUser.createdAt,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // ── On mount: rehydrate session from stored RT ──────────────────────────────
  React.useEffect(() => {
    async function rehydrate() {
      if (!TokenManager.hasSession()) {
        setIsLoading(false);
        return;
      }
      try {
        const rt = TokenManager.getRT()!;
        // Silently refresh to get a new AT
        const refreshRes = await apiClient.post<{ accessToken: string }>("/api/auth/refresh", {
          refreshToken: rt,
        });
        if (refreshRes.data?.accessToken) {
          TokenManager.setAT(refreshRes.data.accessToken);
        }
        // Fetch user profile
        const meRes = await apiClient.get<{ user: BackendUser }>("/api/auth/me");
        if (meRes.data?.user) {
          setUser(normalizeUser(meRes.data.user));
          setSessionCookie();
        }
      } catch {
        // RT expired or invalid — clean up silently
        TokenManager.clear();
      } finally {
        setIsLoading(false);
      }
    }
    rehydrate();
  }, []);

  // ── Login ───────────────────────────────────────────────────────────────────
  const login = React.useCallback(async (email: string, password: string): Promise<User> => {
    const res = await apiClient.post<AuthTokenResponse>("/api/auth/login", { email, password });
    const payload = res.data!;
    TokenManager.setAT(payload.accessToken);
    TokenManager.setRT(payload.refreshToken);
    const normalized = normalizeUser(payload.user);
    setUser(normalized);
    setSessionCookie();
    showToast.success("Logged In", `Welcome back, ${normalized.name}!`);
    return normalized;
  }, []);

  // ── Signup ──────────────────────────────────────────────────────────────────
  const signup = React.useCallback(
    async (name: string, email: string, password: string, role?: UserRole): Promise<User> => {
      // Map UI role → backend role
      const backendRole: BackendRole = role === "owner" ? "owner" : "seeker";
      const res = await apiClient.post<AuthTokenResponse>("/api/auth/register", {
        name,
        email,
        password,
        role: backendRole,
      });
      const payload = res.data!;
      TokenManager.setAT(payload.accessToken);
      TokenManager.setRT(payload.refreshToken);
      const normalized = normalizeUser(payload.user);
      setUser(normalized);
      setSessionCookie();
      showToast.success("Account Created", `Welcome to RoofOnClick, ${normalized.name}!`);
      return normalized;
    },
    []
  );

  // ── Login with Tokens (OAuth / direct callback) ───────────────────────────
  const loginWithTokens = React.useCallback(
    (accessToken: string, refreshToken: string, backendUser: BackendUser): User => {
      TokenManager.setAT(accessToken);
      TokenManager.setRT(refreshToken);
      const normalized = normalizeUser(backendUser);
      setUser(normalized);
      setSessionCookie();
      showToast.success("Welcome!", `Logged in as ${normalized.name}`);
      return normalized;
    },
    []
  );

  // ── Logout ──────────────────────────────────────────────────────────────────
  const logout = React.useCallback(async () => {
    const rt = TokenManager.getRT();
    try {
      // Tell the backend to revoke the AT jti + RT session in Redis
      await apiClient.post("/api/auth/logout", { refreshToken: rt });
    } catch {
      // Non-fatal — clear client-side regardless
    } finally {
      TokenManager.clear();
      clearSessionCookie();
      setUser(null);
      showToast.info("Logged Out", "You have been logged out securely.");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, []);

  // ── Update user (local + backend DB sync) ──────────────────────────────────
  const updateUser = React.useCallback(async (fields: Partial<User>) => {
    // 1. Optimistic state update
    setUser((prev) => {
      if (!prev) return null;
      const avatarVal = fields.avatarUrl !== undefined ? fields.avatarUrl : (fields.avatar !== undefined ? fields.avatar : prev.avatar);
      return {
        ...prev,
        ...fields,
        avatar: avatarVal,
        avatarUrl: avatarVal,
      };
    });

    // 2. Sync changes with backend database
    try {
      const payload: Record<string, any> = {};
      if (fields.name !== undefined) payload.name = fields.name;
      if (fields.phone !== undefined || fields.phoneNumber !== undefined) {
        payload.phone = fields.phone || fields.phoneNumber;
      }
      if (fields.avatarUrl !== undefined || fields.avatar !== undefined) {
        payload.avatar = fields.avatarUrl !== undefined ? fields.avatarUrl : fields.avatar;
      }

      if (Object.keys(payload).length > 0) {
        const res = await apiClient.put<{ user: BackendUser }>("/api/users/profile", payload);
        if (res.data?.user) {
          setUser(normalizeUser(res.data.user));
        }
      }
    } catch (err: any) {
      console.error("[AuthProvider] Profile update failed:", err?.message || err);
      showToast.error("Update Failed", "Could not save profile changes to server.");
    }
  }, []);

  // ── Legacy compat: setRole ─────────────────────────────────────────────────
  const setRole = React.useCallback((newRole: UserRole) => {
    setUser((prev) => (prev ? { ...prev, role: newRole } : null));
  }, []);

  const role = user?.role ?? null;
  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{ user, role, isLoading, isAuthenticated, login, signup, loginWithTokens, logout, updateUser, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
