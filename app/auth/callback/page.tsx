"use client";

/**
 * /auth/callback — Google OAuth landing page.
 *
 * The backend redirects here after OAuth success:
 *   GET /auth/callback?accessToken=<AT>&refreshToken=<RT>
 *
 * Security: tokens are extracted from URL then IMMEDIATELY stripped
 * from the browser history with history.replaceState so they never
 * appear in server logs, referrer headers, or browser history.
 */

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TokenManager } from "@/lib/token-manager";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/providers/auth-provider";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithTokens } = useAuth();
  const [status, setStatus] = React.useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    async function handleCallback() {
      const accessToken = searchParams.get("accessToken");
      const refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");

      // ── Strip tokens from URL immediately (security) ─────────────────────
      if (typeof window !== "undefined") {
        window.history.replaceState({}, document.title, "/auth/callback");
      }

      if (error) {
        setErrorMessage("Google sign-in failed. Please try again.");
        setStatus("error");
        return;
      }

      if (!accessToken || !refreshToken) {
        setErrorMessage("Invalid callback. No tokens received.");
        setStatus("error");
        return;
      }

      try {
        // Store tokens temporarily so apiClient can make request
        TokenManager.setAT(accessToken);
        TokenManager.setRT(refreshToken);

        // Fetch user profile with the new AT
        const meRes = await apiClient.get<{ user: any }>("/api/auth/me");
        const u = meRes.data?.user;
        if (u) {
          const loggedInUser = loginWithTokens(accessToken, refreshToken, u);
          const savedRoute = typeof window !== "undefined" ? sessionStorage.getItem("lastBrowsingRoute") : null;
          if (savedRoute && savedRoute !== "/" && savedRoute !== "/login" && savedRoute !== "/signup") {
            router.replace(savedRoute);
          } else if (loggedInUser.role === "admin") {
            router.replace("/admin");
          } else if (loggedInUser.role === "owner") {
            router.replace("/owner/dashboard");
          } else {
            router.replace("/");
          }
        } else {
          throw new Error("User profile not found");
        }
      } catch {
        TokenManager.clear();
        setErrorMessage("Authentication failed. Please try logging in again.");
        setStatus("error");
      }
    }

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-destructive font-semibold text-sm">{errorMessage}</p>
        <a
          href="/login"
          className="text-primary underline text-sm font-bold"
        >
          Back to Login
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <svg
          className="animate-spin h-8 w-8 text-primary"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <p className="text-sm text-muted-foreground font-body">
          Completing sign in...
        </p>
      </div>
    </div>
  );
}
