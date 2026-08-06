"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, Check, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, UserRole } from "@/providers/auth-provider";
import { PasswordInput } from "@/components/auth/password-input";
import {
  PasswordStrengthMeter,
  ConfirmPasswordMessage,
} from "@/components/auth/password-strength-meter";
import { evaluatePasswordStrength } from "@/lib/password-utils";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
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
  const [showToast, setShowToast] = React.useState(false);

  // Field-level touched tracking
  const [touched, setTouched] = React.useState({
    name: false,
    email: false,
    phoneNumber: false,
    gender: false,
    password: false,
    confirmPassword: false,
    agreedToTerms: false,
  });

  const markTouched = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation rules
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isNameValid = name.trim().length > 0;
  const isEmailValid = emailRegex.test(email.trim());
  const isPhoneValid = /^\d{10}$/.test(phoneNumber);
  const isGenderValid = gender !== "";
  const isPasswordValid = password.length >= 8;
  const isConfirmPasswordValid = confirmPassword.length > 0 && password === confirmPassword;

  const errors = {
    name: touched.name && !isNameValid ? "Full Name is required." : null,
    email: touched.email && !isEmailValid ? "Please enter a valid email address." : null,
    phoneNumber: touched.phoneNumber && !isPhoneValid ? "Please enter a valid 10-digit mobile number." : null,
    gender: touched.gender && !isGenderValid ? "Please select your gender." : null,
    password: touched.password && !isPasswordValid ? "Password must contain at least 8 characters." : null,
    confirmPassword: touched.confirmPassword && !isConfirmPasswordValid ? "Passwords do not match." : null,
    agreedToTerms: touched.agreedToTerms && !agreedToTerms ? "You must accept the Terms & Conditions to proceed." : null,
  };

  const isFormValid =
    isNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isGenderValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    agreedToTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields touched on submit attempt
    setTouched({
      name: true,
      email: true,
      phoneNumber: true,
      gender: true,
      password: true,
      confirmPassword: true,
      agreedToTerms: true,
    });

    if (!selectedRole || !isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    setTimeout(() => {
      signup(name, email, phoneNumber, gender, selectedRole);
      setShowToast(true);

      setTimeout(() => {
        setIsSubmitting(false);

        // TODO: Integrate backend OTP verification - Route to /auth/verify-otp once SMS/Email OTP backend service is connected
        // router.push(`/auth/verify-otp?role=${selectedRole}&email=${encodeURIComponent(email)}`);

        // TEMPORARY FRONTEND BYPASS: Automatically log user in and redirect directly to role-specific dashboard/home
        if (selectedRole === "owner") {
          router.push("/owner/dashboard");
        } else {
          router.push("/");
        }
      }, 800);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between relative overflow-hidden">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 pt-24 pb-16 relative z-10">
        {/* Soft background radial highlights */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

        <Container className="max-w-4xl mx-auto flex flex-col items-center">
          <AnimatePresence mode="wait">
            {!selectedRole ? (
              /* STEP 1: ROLE SELECTION BEFORE REGISTRATION FORM */
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: PREMIUM_EASE }}
                className="w-full flex flex-col items-center text-center"
              >
                <title>Select Role | Sign Up | RoofOnClick</title>

                {/* Step Indicator */}
                <div className="flex flex-col items-center gap-2 mb-6">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary bg-secondary/10 px-3.5 py-1 rounded-full">
                    Step 1 of 2
                  </span>
                  <div className="w-28 h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                    <div className="w-1/2 h-full bg-secondary rounded-full" />
                  </div>
                </div>

                {/* Headings */}
                <div className="max-w-xl mb-10 flex flex-col gap-2">
                  <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                    Welcome to RoofOnClick 🎉
                  </h1>
                  <p className="font-body text-xs sm:text-sm text-muted-foreground">
                    Select how you want to use RoofOnClick to open your registration form.
                  </p>
                </div>

                {/* Role Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-3xl">
                  {/* BUYER CARD */}
                  <motion.div
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setSelectedRole("buyer")}
                    className="group bg-card border border-border/80 hover:border-primary rounded-[28px] p-6 sm:p-8 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 shadow-premium hover:shadow-2xl relative overflow-hidden select-none"
                  >
                    <div className="flex flex-col gap-4">
                      <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300 block select-none">
                        🏠
                      </span>
                      <div>
                        <h2 className="font-heading text-xl font-extrabold text-primary">
                          Find Your Stay
                        </h2>
                        <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">
                          Explore verified PGs, hostels, co-living spaces and rental properties with zero brokerage.
                        </p>
                      </div>

                      <ul className="flex flex-col gap-2 mt-4 border-t border-border/60 pt-4">
                        {[
                          "Search verified stays in Indore",
                          "Save favourites to wishlist",
                          "Contact owners directly",
                          "Zero brokerage fees",
                        ].map((feat) => (
                          <li key={feat} className="flex items-center gap-2 font-body text-xs font-semibold text-primary">
                            <span className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <button
                        type="button"
                        className="w-full py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground group-hover:bg-primary/90 transition-all duration-300 shadow-md cursor-pointer"
                      >
                        Continue as Buyer
                      </button>
                    </div>
                  </motion.div>

                  {/* OWNER CARD */}
                  <motion.div
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setSelectedRole("owner")}
                    className="group bg-card border border-border/80 hover:border-secondary rounded-[28px] p-6 sm:p-8 flex flex-col justify-between text-left cursor-pointer transition-all duration-300 shadow-premium hover:shadow-2xl relative overflow-hidden select-none"
                  >
                    <div className="flex flex-col gap-4">
                      <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-300 block select-none">
                        🏢
                      </span>
                      <div>
                        <h2 className="font-heading text-xl font-extrabold text-primary">
                          List Your Property
                        </h2>
                        <p className="font-body text-xs text-muted-foreground mt-2 leading-relaxed">
                          List your property, manage enquiries, track rent settlements, and reach verified tenants.
                        </p>
                      </div>

                      <ul className="flex flex-col gap-2 mt-4 border-t border-border/60 pt-4">
                        {[
                          "List properties in Indore",
                          "Automate visit requests",
                          "Track monthly settlements",
                          "Manage bookings & tenants",
                        ].map((feat) => (
                          <li key={feat} className="flex items-center gap-2 font-body text-xs font-semibold text-primary">
                            <span className="w-4 h-4 rounded-full bg-secondary/15 flex items-center justify-center text-secondary shrink-0">
                              <Check className="w-3 h-3 text-secondary" />
                            </span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8">
                      <button
                        type="button"
                        className="w-full py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider bg-secondary text-secondary-foreground group-hover:bg-secondary/90 transition-all duration-300 shadow-md cursor-pointer"
                      >
                        Continue as Owner
                      </button>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center text-xs mt-8">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link href="/login" className="font-bold text-secondary hover:underline">
                    Log in
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* STEP 2: ROLE-SPECIFIC REGISTRATION FORM */
              <motion.div
                key="registration-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: PREMIUM_EASE }}
                className="w-full max-w-md bg-card/90 backdrop-blur-md border border-border/80 p-6 sm:p-10 rounded-[28px] shadow-premium flex flex-col gap-6"
              >
                <title>{selectedRole === "owner" ? "Owner Registration" : "Buyer Registration"} | RoofOnClick</title>

                {/* Back button & Role indicator */}
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Change Role</span>
                  </button>

                  <span
                    className={cn(
                      "text-[10px] font-heading font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border",
                      selectedRole === "owner"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-primary/10 text-primary border-primary/20"
                    )}
                  >
                    {selectedRole === "owner" ? "🏢 Owner Registration" : "🏠 Buyer Registration"}
                  </span>
                </div>

                {/* Form Header */}
                <div className="flex flex-col gap-1.5 text-left">
                  <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-primary tracking-tight">
                    {selectedRole === "owner" ? "Create Owner Account" : "Create Resident Account"}
                  </h1>
                  <p className="font-body text-xs text-muted-foreground">
                    {selectedRole === "owner"
                      ? "Register your owner profile to start listing properties."
                      : "Register your buyer profile to explore and book verified stays."}
                  </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        required
                        value={name}
                        onBlur={() => markTouched("name")}
                        onChange={(e) => {
                          setName(e.target.value);
                          markTouched("name");
                        }}
                        className={cn(
                          "w-full bg-card border rounded-xl pl-11 pr-4 py-3 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all duration-300",
                          errors.name ? "border-rose-500 ring-2 ring-rose-500/10" : "border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        )}
                        placeholder="Your Full Name"
                      />
                    </div>
                    {errors.name && (
                      <span className="text-[11px] font-semibold text-rose-500 text-left pl-1">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
                      <input
                        type="email"
                        required
                        value={email}
                        onBlur={() => markTouched("email")}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          markTouched("email");
                        }}
                        className={cn(
                          "w-full bg-card border rounded-xl pl-11 pr-4 py-3 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all duration-300",
                          errors.email ? "border-rose-500 ring-2 ring-rose-500/10" : "border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        )}
                        placeholder="your@example.com"
                      />
                    </div>
                    {errors.email && (
                      <span className="text-[11px] font-semibold text-rose-500 text-left pl-1">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
                      <input
                        type="tel"
                        required
                        value={phoneNumber}
                        onBlur={() => markTouched("phoneNumber")}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value.replace(/[^0-9]/g, "").slice(0, 10));
                          markTouched("phoneNumber");
                        }}
                        className={cn(
                          "w-full bg-card border rounded-xl pl-11 pr-4 py-3 text-sm font-semibold font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none transition-all duration-300",
                          errors.phoneNumber ? "border-rose-500 ring-2 ring-rose-500/10" : "border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        )}
                        placeholder="10-digit mobile number"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <span className="text-[11px] font-semibold text-rose-500 text-left pl-1">
                        {errors.phoneNumber}
                      </span>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider pl-1">
                      Gender <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-sm">👤</span>
                      <select
                        required
                        value={gender}
                        onBlur={() => markTouched("gender")}
                        onChange={(e) => {
                          setGender(e.target.value);
                          markTouched("gender");
                        }}
                        className={cn(
                          "w-full bg-card border rounded-xl pl-11 pr-8 py-3 text-sm font-semibold font-body text-foreground focus:outline-none transition-all duration-300 appearance-none cursor-pointer",
                          errors.gender ? "border-rose-500 ring-2 ring-rose-500/10" : "border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/10"
                        )}
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    {errors.gender && (
                      <span className="text-[11px] font-semibold text-rose-500 text-left pl-1">
                        {errors.gender}
                      </span>
                    )}
                  </div>

                  {/* Password & Strength */}
                  <div className="space-y-1">
                    <PasswordInput
                      id="signup-password"
                      label="Password"
                      required
                      value={password}
                      onBlur={() => markTouched("password")}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        markTouched("password");
                      }}
                      className={errors.password ? "border-rose-500 ring-2 ring-rose-500/10" : ""}
                      placeholder="••••••••"
                    />
                    {errors.password ? (
                      <span className="text-[11px] font-semibold text-rose-500 text-left pl-1 block">
                        {errors.password}
                      </span>
                    ) : (
                      <PasswordStrengthMeter password={password} showChecklist={true} />
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <PasswordInput
                      id="signup-confirm-password"
                      label="Confirm Password"
                      required
                      value={confirmPassword}
                      onBlur={() => markTouched("confirmPassword")}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        markTouched("confirmPassword");
                      }}
                      className={errors.confirmPassword ? "border-rose-500 ring-2 ring-rose-500/10" : ""}
                      placeholder="••••••••"
                    />
                    {errors.confirmPassword ? (
                      <span className="text-[11px] font-semibold text-rose-500 text-left pl-1 block">
                        {errors.confirmPassword}
                      </span>
                    ) : (
                      <ConfirmPasswordMessage password={password} confirmPassword={confirmPassword} />
                    )}
                  </div>

                  {/* Role-Specific Terms & Conditions Checkbox */}
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex items-start gap-2.5 pl-1 py-1">
                      <input
                        type="checkbox"
                        required
                        id="role-terms"
                        checked={agreedToTerms}
                        onChange={(e) => {
                          setAgreedToTerms(e.target.checked);
                          markTouched("agreedToTerms");
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 accent-primary cursor-pointer mt-0.5"
                      />
                      <label htmlFor="role-terms" className="font-body text-[11px] text-muted-foreground leading-snug cursor-pointer select-none">
                        {selectedRole === "owner" ? (
                          <>
                            I have read and agree to the{" "}
                            <a
                              href="/legal/owner-terms"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-secondary hover:underline"
                            >
                              Property Owner Terms &amp; Conditions
                            </a>{" "}
                            and{" "}
                            <a
                              href="/legal/privacy-policy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-secondary hover:underline"
                            >
                              Privacy Policy
                            </a>
                            .
                          </>
                        ) : (
                          <>
                            I have read and agree to the{" "}
                            <a
                              href="/legal/buyer-terms"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-secondary hover:underline"
                            >
                              Buyer Terms &amp; Conditions
                            </a>{" "}
                            and{" "}
                            <a
                              href="/legal/privacy-policy"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-secondary hover:underline"
                            >
                              Privacy Policy
                            </a>
                            .
                          </>
                        )}
                      </label>
                    </div>
                    {errors.agreedToTerms && (
                      <span className="text-[11px] font-semibold text-rose-500 text-left pl-1">
                        {errors.agreedToTerms}
                      </span>
                    )}
                  </div>

                  {/* Toast */}
                  {showToast && (
                    <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground font-heading text-xs font-extrabold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-2xl z-50 flex items-center gap-2 select-none">
                      <ShieldCheck className="w-4 h-4 text-secondary" />
                      <span>Account created successfully! Logging you in...</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid}
                    data-no-intercept="true"
                    className={cn(
                      "w-full py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-2 select-none",
                      selectedRole === "owner"
                        ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90",
                      (!isFormValid || isSubmitting) ? "cursor-not-allowed opacity-65" : "cursor-pointer"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Processing Registration...</span>
                      </>
                    ) : selectedRole === "owner" ? (
                      "Create Owner Account"
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Footer Link */}
                <div className="text-center text-xs mt-2 border-t border-border/60 pt-4">
                  <span className="text-muted-foreground">Already have an account? </span>
                  <Link href="/login" className="font-bold text-secondary hover:underline">
                    Log in
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
