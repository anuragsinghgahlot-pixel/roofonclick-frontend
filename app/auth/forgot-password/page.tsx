"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, KeyRound, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { AuthService } from "@/services/auth/auth.service";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthService.requestPasswordReset(cleanEmail);
      if (res.success) {
        setSent(true);
      } else {
        setError(res.message);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
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
              <AnimatePresence mode="wait">
                {/* ── Success: Check inbox ── */}
                {sent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-5 py-2"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h1 className="font-heading text-2xl font-extrabold text-foreground">
                        Check your inbox
                      </h1>
                      <p className="font-body text-sm text-muted-foreground leading-relaxed">
                        If an account with{" "}
                        <span className="text-primary font-semibold">
                          {AuthService.maskEmail(email)}
                        </span>{" "}
                        exists, we&apos;ve sent a password reset link. The link expires in{" "}
                        <strong className="text-foreground">15 minutes</strong>.
                      </p>
                    </div>

                    {/* ── Check Spam Callout ── */}
                    <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 text-left flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-heading text-xs font-bold text-amber-500">
                          Can&apos;t find it? Check your Spam or Junk folder
                        </p>
                        <p className="font-body text-[11px] text-muted-foreground leading-relaxed">
                          Automated messages sometimes land in spam. If found there, please mark it as <strong className="text-foreground">&ldquo;Not Spam&rdquo;</strong> so future emails reach your inbox directly.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => { setSent(false); setEmail(""); }}
                        className="font-heading text-xs font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                      >
                        Try a different email
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="space-y-2">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-sm">
                        <KeyRound className="w-7 h-7" />
                      </div>
                      <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary block">
                        Account Recovery
                      </span>
                      <h1 className="font-heading text-2xl font-extrabold text-primary tracking-tight">
                        Forgot Password?
                      </h1>
                      <p className="font-body text-xs text-muted-foreground leading-relaxed">
                        Enter your email and we&apos;ll send you a secure link to reset your password.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                      <div className="space-y-1.5">
                        <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
                          <input
                            id="forgot-email"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(null); }}
                            placeholder="e.g. alex@example.com"
                            className={cn(
                              "w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold font-body text-foreground",
                              "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all",
                              error && "border-rose-500/60"
                            )}
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-body text-xs font-semibold">
                          {error}
                        </div>
                      )}

                      <button
                        id="forgot-password-submit"
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3.5 rounded-xl font-heading text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending link...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Reset Link</span>
                          </>
                        )}
                      </button>
                    </form>

                    <div className="pt-2 border-t border-border/50">
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={() => router.push("/login")}
                        className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Sign In</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
