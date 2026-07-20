"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showToast, setShowToast] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate backend creation delay (e.g. 700ms)
    setTimeout(() => {
      signup(name, email);
      setShowToast(true);
      
      // Short delay to let the user see the success toast
      setTimeout(() => {
        setIsSubmitting(false);
        router.push("/onboarding/role-selection");
      }, 900);
    }, 700);
  };
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Soft background radial highlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

      {/* Back to Home Button */}
      <Link
        href="/"
        data-no-intercept="true"
        className="absolute top-8 left-8 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted/40 text-muted-foreground hover:text-primary font-heading text-xs font-bold transition-all duration-300 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Main card */}
      <div className="w-full max-w-md bg-card/85 backdrop-blur-md border border-border/80 p-8 sm:p-10 rounded-[28px] shadow-premium relative z-10 flex flex-col gap-6">
        <title>Sign Up | RoofOnClick</title>
        {/* Header */}
        <div className="flex flex-col gap-2 text-center">
          <span className="font-heading text-2xl font-extrabold text-primary tracking-tight select-none">
            RoofOnClick
          </span>
          <h1 className="font-heading text-2xl font-extrabold text-primary tracking-tight mt-2">
            Create Your RoofOnClick Account
          </h1>
          <p className="font-body text-xs text-muted-foreground">
            Join RoofOnClick to discover verified stays or list your property with confidence.
          </p>
        </div>

        {/* Demo Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-card border border-border/80 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-card border border-border/80 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                className="w-full bg-card border border-border/80 rounded-xl pl-11 pr-4 py-3 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-center gap-2 pl-1 py-1">
            <input
              type="checkbox"
              required
              id="terms"
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
            />
            <label htmlFor="terms" className="font-body text-[11px] text-muted-foreground leading-snug cursor-pointer select-none">
              I agree to the{" "}
              <a href="/coming-soon" className="font-bold text-secondary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/coming-soon" className="font-bold text-secondary hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Success Toast */}
          {showToast && (
            <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-heading text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 select-none">
              <span>🎉</span> Account created successfully!
            </div>
          )}

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            data-no-intercept="true"
            className={cn(
              "w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3.5 rounded-xl font-heading text-sm font-bold tracking-wide transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-2 select-none",
              isSubmitting ? "cursor-not-allowed opacity-80" : "cursor-pointer"
            )}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-primary-foreground shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <div className="h-px flex-1 bg-border/60" />
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">or</span>
          <div className="h-px flex-1 bg-border/60" />
        </div>

        {/* Continue with Google */}
        <button
          type="button"
          onClick={() => window.location.href = "/coming-soon"}
          className="w-full flex items-center justify-center gap-3 border border-border bg-background hover:bg-card py-3.5 rounded-xl font-heading text-xs font-bold text-primary tracking-wide transition-all duration-300 shadow-sm cursor-pointer"
        >
          {/* Custom minimal Google logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        {/* Footer Link */}
        <div className="text-center text-xs mt-2">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="font-bold text-secondary hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
