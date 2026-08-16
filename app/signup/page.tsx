"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, Check, ShieldCheck, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, UserRole } from "@/providers/auth-provider";
import { PasswordInput } from "@/components/auth/password-input";
import {
  PasswordStrengthMeter,
  ConfirmPasswordMessage,
} from "@/components/auth/password-strength-meter";
import Navbar from "@/components/navigation/navbar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useAuth();

  const initialRoleParam = searchParams.get("role");
  const initialRole: UserRole | null =
    initialRoleParam === "owner" || initialRoleParam === "buyer"
      ? (initialRoleParam as UserRole)
      : null;

  const [selectedRole, setSelectedRole] = React.useState<UserRole | null>(initialRole);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const [touched, setTouched] = React.useState({
    name: false, email: false, phoneNumber: false, gender: false,
    password: false, confirmPassword: false, agreedToTerms: false,
  });

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isNameValid = name.trim().length > 0;
  const isEmailValid = emailRegex.test(email.trim());
  const isPhoneValid = /^\d{10}$/.test(phoneNumber);
  const isGenderValid = gender !== "";
  const isPasswordValid = password.length >= 8;
  const isConfirmPasswordValid = confirmPassword.length > 0 && password === confirmPassword;

  const errors = {
    name: touched.name && !isNameValid ? "Name required" : null,
    email: touched.email && !isEmailValid ? "Invalid email" : null,
    phoneNumber: touched.phoneNumber && !isPhoneValid ? "Invalid phone" : null,
    gender: touched.gender && !isGenderValid ? "Select gender" : null,
    password: touched.password && !isPasswordValid ? "Min 8 chars" : null,
    confirmPassword: touched.confirmPassword && !isConfirmPasswordValid ? "Passwords mismatch" : null,
    agreedToTerms: touched.agreedToTerms && !agreedToTerms ? "Accept terms" : null,
  };

  const isFormValid =
    isNameValid && isEmailValid && isPhoneValid && isGenderValid &&
    isPasswordValid && isConfirmPasswordValid && agreedToTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    setTouched({
      name: true, email: true, phoneNumber: true, gender: true,
      password: true, confirmPassword: true, agreedToTerms: true,
    });

    if (!selectedRole || !isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await signup(name, email, password, selectedRole);
      if (selectedRole === "owner") {
        router.push("/owner/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      setApiError(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-background flex flex-col overflow-hidden z-0">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-3 pt-16 relative z-10 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-secondary/5 rounded-full blur-3xl pointer-events-none animate-pulse" />

        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: PREMIUM_EASE }}
              className="w-full max-w-md bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl shadow-premium p-5 flex flex-col text-center"
            >
              <title>Select Role | Sign Up | RoofOnClick</title>
              
              <h1 className="font-heading text-lg font-extrabold text-primary tracking-tight mb-0.5">
                Create an Account
              </h1>
              <p className="font-body text-[11px] text-muted-foreground mb-3">
                How would you like to use RoofOnClick?
              </p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                {/* Resident */}
                <div
                  onClick={() => setSelectedRole("buyer")}
                  className="group bg-background border border-border/80 hover:border-primary rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🏠</span>
                  <h2 className="font-heading text-xs font-extrabold text-primary">Resident</h2>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Find your stay</p>
                </div>

                {/* Owner */}
                <div
                  onClick={() => setSelectedRole("owner")}
                  className="group bg-background border border-border/80 hover:border-secondary rounded-xl p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">🏢</span>
                  <h2 className="font-heading text-xs font-extrabold text-primary">Owner</h2>
                  <p className="text-[10px] text-muted-foreground mt-0.5">List property</p>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-2 my-2">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">or</span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              {/* Google Sign Up */}
              <a
                id="google-signup-role-btn"
                href={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL || "http://localhost:6969/api/auth/google"}
                className="w-full flex items-center justify-center gap-2.5 border border-border/80 bg-background hover:bg-muted/50 py-2.5 rounded-xl font-heading text-xs font-bold text-primary tracking-wide transition-all cursor-pointer shadow-xs mb-3"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Continue with Google</span>
              </a>

              <p className="text-[11px] text-muted-foreground mt-1">
                Already have an account?{" "}
                <Link href="/login" className="font-bold text-secondary hover:underline">
                  Log in
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="registration-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: PREMIUM_EASE }}
              className="w-full max-w-[480px] bg-card/90 backdrop-blur-md border border-border/80 p-4 rounded-2xl shadow-premium flex flex-col gap-2.5 relative z-10"
            >
              <title>{selectedRole === "owner" ? "Owner Signup" : "Resident Signup"} | RoofOnClick</title>

              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="inline-flex items-center gap-1 text-[10px] font-heading font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Change Role
                </button>
                <span className={cn(
                  "text-[9px] font-heading font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                  selectedRole === "owner" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : "bg-primary/10 text-primary border-primary/20"
                )}>
                  {selectedRole === "owner" ? "🏢 Owner" : "🏠 Resident"}
                </span>
              </div>

              <div className="text-left">
                <h1 className="font-heading text-base font-extrabold text-primary tracking-tight">
                  {selectedRole === "owner" ? "Create Owner Account" : "Create Resident Account"}
                </h1>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-2">
                {apiError && (
                  <div className="flex items-center justify-between gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 rounded-xl px-3 py-2 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="truncate">{apiError}</span>
                    </div>
                    {(apiError.toLowerCase().includes("already exists") || apiError.toLowerCase().includes("log in")) && (
                      <Link href="/login" className="font-heading font-extrabold underline text-primary hover:text-secondary whitespace-nowrap shrink-0">
                        Log In →
                      </Link>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {/* Name */}
                  <div className="flex flex-col gap-0.5 text-left">
                    <label className="font-heading text-[9px] font-bold text-primary uppercase tracking-wider pl-0.5">Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={name}
                        onBlur={() => markTouched("name")}
                        onChange={(e) => { setName(e.target.value); markTouched("name"); }}
                        className={cn(
                          "w-full bg-background border rounded-lg pl-8 pr-2 py-1 text-xs font-body text-foreground focus:outline-none transition-all",
                          errors.name ? "border-rose-500 ring-1 ring-rose-500/10" : "border-border/80 focus:border-primary"
                        )}
                        placeholder="Full Name"
                      />
                    </div>
                    {errors.name && <span className="text-[9px] text-rose-500 pl-0.5">{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-0.5 text-left">
                    <label className="font-heading text-[9px] font-bold text-primary uppercase tracking-wider pl-0.5">Email</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onBlur={() => markTouched("email")}
                        onChange={(e) => { setEmail(e.target.value); markTouched("email"); }}
                        className={cn(
                          "w-full bg-background border rounded-lg pl-8 pr-2 py-1 text-xs font-body text-foreground focus:outline-none transition-all",
                          errors.email ? "border-rose-500 ring-1 ring-rose-500/10" : "border-border/80 focus:border-primary"
                        )}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && <span className="text-[9px] text-rose-500 pl-0.5">{errors.email}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Phone */}
                  <div className="flex flex-col gap-0.5 text-left">
                    <label className="font-heading text-[9px] font-bold text-primary uppercase tracking-wider pl-0.5">Phone</label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onBlur={() => markTouched("phoneNumber")}
                        onChange={(e) => { setPhoneNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); markTouched("phoneNumber"); }}
                        className={cn(
                          "w-full bg-background border rounded-lg pl-8 pr-2 py-1 text-xs font-body text-foreground focus:outline-none transition-all",
                          errors.phoneNumber ? "border-rose-500 ring-1 ring-rose-500/10" : "border-border/80 focus:border-primary"
                        )}
                        placeholder="10-digit number"
                      />
                    </div>
                    {errors.phoneNumber && <span className="text-[9px] text-rose-500 pl-0.5">{errors.phoneNumber}</span>}
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-0.5 text-left">
                    <label className="font-heading text-[9px] font-bold text-primary uppercase tracking-wider pl-0.5">Gender</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 text-xs">👤</span>
                      <select
                        required
                        value={gender}
                        onBlur={() => markTouched("gender")}
                        onChange={(e) => { setGender(e.target.value); markTouched("gender"); }}
                        className={cn(
                          "w-full bg-background border rounded-lg pl-8 pr-5 py-1 text-xs font-body text-foreground focus:outline-none transition-all appearance-none",
                          errors.gender ? "border-rose-500 ring-1 ring-rose-500/10" : "border-border/80 focus:border-primary"
                        )}
                      >
                        <option value="" disabled>Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    {errors.gender && <span className="text-[9px] text-rose-500 pl-0.5">{errors.gender}</span>}
                  </div>
                </div>

                {/* Password */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5 text-left">
                    <PasswordInput
                      id="signup-password"
                      label="Password"
                      required
                      value={password}
                      onBlur={() => markTouched("password")}
                      onChange={(e) => { setPassword(e.target.value); markTouched("password"); }}
                      className={cn(errors.password ? "border-rose-500 ring-1 ring-rose-500/10" : "", "py-1 text-xs")}
                      placeholder="••••••••"
                    />
                    {errors.password && <span className="text-[9px] text-rose-500 pl-0.5">{errors.password}</span>}
                  </div>

                  <div className="flex flex-col gap-0.5 text-left">
                    <PasswordInput
                      id="signup-confirm-password"
                      label="Confirm Password"
                      required
                      value={confirmPassword}
                      onBlur={() => markTouched("confirmPassword")}
                      onChange={(e) => { setConfirmPassword(e.target.value); markTouched("confirmPassword"); }}
                      className={cn(errors.confirmPassword ? "border-rose-500 ring-1 ring-rose-500/10" : "", "py-1 text-xs")}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword && <span className="text-[9px] text-rose-500 pl-0.5">{errors.confirmPassword}</span>}
                  </div>
                </div>
                
                {/* Strength & Match (only show if typing) */}
                {(password.length > 0 || confirmPassword.length > 0) && (
                  <div className="flex flex-col sm:flex-row gap-2 bg-muted/20 p-1.5 rounded-lg text-[9px] border border-border/40">
                    <div className="flex-1">
                      <PasswordStrengthMeter password={password} showChecklist={false} />
                    </div>
                    <div className="flex-1 border-t sm:border-t-0 sm:border-l border-border/60 pt-1 sm:pt-0 sm:pl-2">
                      <ConfirmPasswordMessage password={password} confirmPassword={confirmPassword} />
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="flex flex-col gap-0.5 text-left mt-0.5">
                  <div className="flex items-start gap-1.5 pl-0.5">
                    <input
                      type="checkbox"
                      required
                      id="role-terms"
                      checked={agreedToTerms}
                      onChange={(e) => { setAgreedToTerms(e.target.checked); markTouched("agreedToTerms"); }}
                      className="w-3 h-3 mt-0.5 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                    />
                    <label htmlFor="role-terms" className="font-body text-[9px] text-muted-foreground leading-tight cursor-pointer">
                      I agree to the{" "}
                      <a href={selectedRole === "owner" ? "/legal/owner-terms" : "/legal/buyer-terms"} target="_blank" className="font-bold text-secondary hover:underline">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="/legal/privacy-policy" target="_blank" className="font-bold text-secondary hover:underline">
                        Privacy Policy
                      </a>.
                    </label>
                  </div>
                  {errors.agreedToTerms && <span className="text-[9px] text-rose-500 pl-0.5">{errors.agreedToTerms}</span>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className={cn(
                    "w-full py-2 rounded-lg font-heading text-[11px] font-bold uppercase tracking-wider transition-all mt-0.5 shadow-sm flex items-center justify-center gap-1.5",
                    selectedRole === "owner"
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90",
                    (!isFormValid || isSubmitting) ? "cursor-not-allowed opacity-65" : "cursor-pointer"
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-2 my-1">
                  <div className="h-px flex-1 bg-border/60" />
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">or</span>
                  <div className="h-px flex-1 bg-border/60" />
                </div>

                {/* Google Sign Up */}
                <a
                  id="google-signup-form-btn"
                  href={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL || "http://localhost:6969/api/auth/google"}
                  className="w-full flex items-center justify-center gap-2 border border-border/80 bg-background hover:bg-muted/50 py-2 rounded-lg font-heading text-xs font-bold text-primary tracking-wide transition-all cursor-pointer shadow-xs"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </a>
              </form>

              <div className="text-center text-[10px] mt-0.5 pt-2 border-t border-border/60">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="font-bold text-secondary hover:underline">
                  Log in
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
