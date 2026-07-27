"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, ArrowLeft, KeyRound, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { AuthService } from "@/services/auth/auth.service";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [method, setMethod] = React.useState<"email" | "phone">("email");
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanInput = inputValue.trim();
    if (!cleanInput) {
      setError(`Please enter your ${method === "email" ? "email address" : "phone number"}.`);
      return;
    }

    if (method === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanInput.toLowerCase())) {
        setError("Please enter a valid email address format.");
        return;
      }
    } else {
      if (!/^\d{10}$/.test(cleanInput)) {
        setError("Phone number must be exactly 10 digits and numeric only.");
        return;
      }
    }

    setIsLoading(true);
    try {
      const res = await AuthService.requestPasswordReset(cleanInput, method);
      if (res.success) {
        toast.success(res.message);
        router.push("/auth/verify-otp");
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
    <div className="relative flex min-h-screen flex-col bg-background">
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
              {/* Icon & Title */}
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
                  Choose your recovery method and enter details below. We will send a 6-digit OTP code to reset your password.
                </p>
              </div>

              {/* Method Selection Toggle */}
              <div className="flex border border-border/80 rounded-2xl p-1 bg-muted/20 relative z-10 select-none">
                <button
                  type="button"
                  onClick={() => {
                    setMethod("email");
                    setInputValue("");
                    setError(null);
                  }}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold font-heading rounded-xl transition-all cursor-pointer",
                    method === "email"
                      ? "bg-card text-primary shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  Email Address
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMethod("phone");
                    setInputValue("");
                    setError(null);
                  }}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold font-heading rounded-xl transition-all cursor-pointer",
                    method === "phone"
                      ? "bg-card text-primary shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  Phone Number
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div className="space-y-1.5">
                  <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                    {method === "email" ? "Email Address" : "Phone Number"} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    {method === "email" ? (
                      <Mail className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Phone className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
                    )}
                    <input
                      type={method === "email" ? "email" : "tel"}
                      required
                      value={inputValue}
                      onChange={(e) => {
                        if (method === "phone") {
                          setInputValue(e.target.value.replace(/[^0-9]/g, "").slice(0, 10));
                        } else {
                          setInputValue(e.target.value);
                        }
                        setError(null);
                      }}
                      placeholder={method === "email" ? "e.g. alex@example.com" : "e.g. 9876543210"}
                      className="w-full bg-background border border-border/80 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-body text-xs font-semibold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3.5 rounded-xl font-heading text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending OTP...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Send OTP Code</span>
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
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
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
