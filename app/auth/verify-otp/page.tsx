"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, ArrowLeft, RotateCw, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { AuthService } from "@/services/auth/auth.service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function VerifyOtpPage() {
  const router = useRouter();

  const [resetState] = React.useState(() => {
    return AuthService.getActiveResetState();
  });
  const emailOrPhone = resetState?.emailOrPhone || resetState?.email || "";
  const maskedDestination = React.useMemo(() => {
    if (!resetState) return "your registered account";
    return AuthService.maskValue(resetState.emailOrPhone, resetState.method);
  }, [resetState]);

  const [otp, setOtp] = React.useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  // 30-second countdown timer for resend OTP
  const [countdown, setCountdown] = React.useState(30);

  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer logic
  React.useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // Focus first input on mount
  React.useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    setError(null);
    const cleaned = value.replace(/[^0-9]/g, "");

    if (!cleaned) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Take last digit
    const digit = cleaned[cleaned.length - 1];
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (pastedData.length > 0) {
      const newOtp = ["", "", "", "", "", ""];
      for (let i = 0; i < Math.min(6, pastedData.length); i++) {
        newOtp[i] = pastedData[i];
      }
      setOtp(newOtp);

      // Focus last populated or next box
      const focusIndex = Math.min(5, pastedData.length);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    setError(null);

    try {
      const res = await AuthService.resendOTP(emailOrPhone);
      if (res.success) {
        toast.success(res.message);
        setCountdown(30);
      } else {
        setError(res.message);
      }
    } catch {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Please enter all 6 digits of the OTP code.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthService.verifyOTP(emailOrPhone, fullOtp);
      if (res.success) {
        toast.success(res.message);
        const searchParams = new URLSearchParams(window.location.search);
        const roleParam = searchParams.get("role");
        if (roleParam === "owner") {
          router.push("/owner/dashboard");
        } else if (roleParam === "buyer") {
          router.push("/");
        } else {
          router.push("/auth/reset-password");
        }
      } else {
        setError(res.message);
      }
    } catch {
      setError("Verification failed. Please check the OTP and try again.");
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
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto shadow-sm">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-secondary block">
                  Two-Step Verification
                </span>
                <h1 className="font-heading text-2xl font-extrabold text-primary tracking-tight">
                  Enter 6-Digit OTP
                </h1>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">
                  We have sent a verification code to{" "}
                  <span className="font-bold text-primary">{maskedDestination}</span>.
                </p>
                <p className="font-body text-[11px] text-muted-foreground/80 italic">
                  (Dev Hint: Use OTP code <span className="font-bold text-primary">123456</span>)
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 6 Input Boxes */}
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className={cn(
                        "w-10 h-12 sm:w-12 sm:h-14 bg-background border rounded-xl text-center font-heading text-lg font-extrabold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all select-none",
                        digit
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border/80 focus:border-primary"
                      )}
                    />
                  ))}
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-body text-xs font-semibold text-left">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading || otp.join("").length < 6}
                  className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground py-3.5 rounded-xl font-heading text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify OTP</span>
                    </>
                  )}
                </button>
              </form>

              {/* Resend OTP Row */}
              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs font-body">
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => router.push("/auth/forgot-password")}
                  className="inline-flex items-center gap-1 font-heading font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>

                <button
                  type="button"
                  data-no-intercept="true"
                  disabled={countdown > 0 || isResending}
                  onClick={handleResend}
                  className={cn(
                    "inline-flex items-center gap-1 font-heading font-bold transition-colors cursor-pointer",
                    countdown > 0 || isResending
                      ? "text-muted-foreground/60 cursor-not-allowed"
                      : "text-secondary hover:text-primary"
                  )}
                >
                  <RotateCw className={cn("w-3.5 h-3.5", isResending && "animate-spin")} />
                  <span>
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                  </span>
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
