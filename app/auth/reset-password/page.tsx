"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, Loader2, Sparkles, LogIn, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrengthMeter } from "@/components/auth/password-strength-meter";
import { evaluatePasswordStrength } from "@/lib/password-utils";
import { AuthService } from "@/services/auth/auth.service";
import { toast } from "sonner";

export function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [tokenValid, setTokenValid] = React.useState<boolean | null>(null); // null = checking
  const [tokenError, setTokenError] = React.useState<string | null>(null);

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const strength = evaluatePasswordStrength(newPassword);

  /* Validate token on mount */
  React.useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setTokenError("No reset token found. Please request a new password reset link.");
      return;
    }
    AuthService.verifyResetToken(token).then(({ valid, message }) => {
      setTokenValid(valid);
      if (!valid) setTokenError(message);
    });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!strength.isStrongEnough) {
      setError("Please choose a stronger password that meets at least 2 security requirements and 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter identical passwords.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthService.resetPassword(token, newPassword);
      if (res.success) {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 md:py-16">
        <Section className="w-full">
          <Container className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border/80 p-6 sm:p-8 rounded-3xl shadow-premium text-center space-y-6"
            >
              {/* ── Checking token ── */}
              {tokenValid === null && (
                <div className="py-10 flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="font-body text-xs text-muted-foreground">Validating reset link…</p>
                </div>
              )}

              {/* ── Invalid / expired token ── */}
              {tokenValid === false && (
                <div className="py-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                  <h1 className="font-heading text-xl font-extrabold text-foreground">
                    Link invalid or expired
                  </h1>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    {tokenError}
                  </p>
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => router.push("/auth/forgot-password")}
                    className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3 rounded-xl font-heading text-xs font-bold transition-all cursor-pointer"
                  >
                    Request a new link
                  </button>
                </div>
              )}

              {/* ── Success ── */}
              {isSuccess && (
                <div className="py-4 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <span className="font-heading text-xs font-bold uppercase tracking-widest text-emerald-600 block">
                      Account Restored
                    </span>
                    <h2 className="font-heading text-2xl font-extrabold text-primary">
                      Password Reset Successfully!
                    </h2>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                      Your password has been updated and all previous sessions have been signed out.
                      Please sign in with your new password.
                    </p>
                  </div>
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => router.push("/login")}
                    className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3.5 rounded-xl font-heading text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In Now</span>
                  </button>
                </div>
              )}

              {/* ── Reset Form ── */}
              {tokenValid === true && !isSuccess && (
                <>
                  <div className="space-y-2">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto shadow-sm">
                      <Lock className="w-7 h-7" />
                    </div>
                    <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary block">
                      Security Verified
                    </span>
                    <h1 className="font-heading text-2xl font-extrabold text-primary tracking-tight">
                      Create New Password
                    </h1>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">
                      Choose a new, strong password for your RoofOnClick account.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                      <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                        New Password <span className="text-rose-500">*</span>
                      </label>
                      <PasswordInput
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setError(null); }}
                        placeholder="Create a strong password"
                        required
                      />
                    </div>

                    <PasswordStrengthMeter password={newPassword} />

                    <div className="space-y-1.5 pt-2">
                      <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                        Confirm New Password <span className="text-rose-500">*</span>
                      </label>
                      <PasswordInput
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                        placeholder="Re-enter your password"
                        required
                      />
                      {confirmPassword && (
                        <div className="pl-1 pt-1">
                          {newPassword === confirmPassword ? (
                            <span className="font-heading text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                              ✓ Passwords match
                            </span>
                          ) : (
                            <span className="font-heading text-[11px] font-bold text-rose-500 flex items-center gap-1">
                              ✗ Passwords do not match
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {error && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-body text-xs font-semibold">
                        {error}
                      </div>
                    )}

                    <button
                      id="reset-password-submit"
                      type="submit"
                      disabled={isLoading || !newPassword || newPassword !== confirmPassword}
                      className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3.5 rounded-xl font-heading text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Reset Password</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={null}>
      <ResetPasswordContent />
    </React.Suspense>
  );
}
