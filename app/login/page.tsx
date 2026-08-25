"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import Navbar from "@/components/navigation/navbar";
import { cn } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(email.trim().toLowerCase(), password);
      const redirectParam = searchParams.get("redirect");
      if (redirectParam) {
        router.push(redirectParam);
      } else if (loggedInUser?.role === "admin") {
        router.push("/admin");
      } else if (loggedInUser?.role === "owner") {
        router.push("/owner/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setError(err?.message || "Sign in failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-background flex flex-col overflow-hidden z-0">
      <title>Login | RoofOnClick</title>
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-16 relative z-10 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

        {/* Card */}
        <div className="w-full max-w-sm bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl shadow-premium relative z-10 p-5 flex flex-col gap-3.5">

          {/* Header */}
          <div className="text-center">
            <h1 className="font-heading text-xl font-extrabold text-primary tracking-tight">
              Welcome Back
            </h1>
            <p className="font-body text-[11px] text-muted-foreground mt-0.5">
              Sign in to explore verified PGs &amp; hostels.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-3 py-2 text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Email */}
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="login-email" className="font-heading text-[10px] font-bold text-primary uppercase tracking-wider pl-0.5">
                Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  className="w-full bg-background border border-border/80 rounded-lg pl-9 pr-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1 text-left">
              <div className="flex justify-between items-center pl-0.5">
                <label htmlFor="login-password" className="font-heading text-[10px] font-bold text-primary uppercase tracking-wider">
                  Password
                </label>
                <a href="/auth/forgot-password" className="font-body text-[10px] font-bold text-secondary hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  className="w-full bg-background border border-border/80 rounded-lg pl-9 pr-9 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              disabled={isSubmitting}
              className={cn(
                "w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-2.5 rounded-lg font-heading text-sm font-bold tracking-wide transition-all duration-200 shadow-sm flex items-center justify-center gap-2 mt-1 select-none",
                isSubmitting ? "cursor-not-allowed opacity-75" : "cursor-pointer"
              )}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </>
              ) : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* Google */}
          <a
            id="google-oauth-btn"
            href={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL || "http://localhost:6969/api/auth/google"}
            className="w-full flex items-center justify-center gap-2.5 border border-border bg-background hover:bg-muted/50 py-2.5 rounded-lg font-heading text-xs font-bold text-primary tracking-wide transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </a>

          <p className="text-center text-[11px] text-muted-foreground">
            No account?{" "}
            <Link href="/signup" className="font-bold text-secondary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginForm />
    </React.Suspense>
  );
}
