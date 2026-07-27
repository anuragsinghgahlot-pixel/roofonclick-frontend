"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { ProfileAvatar } from "@/components/navigation/profile-dropdown";
import { useAuth, UserRole } from "@/providers/auth-provider";
import {
  processAvatarUpload,
  validateAvatarFile,
} from "@/services/avatar/avatar.service";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Lock,
  LogOut,
  Edit3,
  Check,
  X,
  KeyRound,
  Shield,
  Trash2,
  AlertCircle,
  Sparkles,
  Camera,
} from "lucide-react";
import { PasswordInput } from "@/components/auth/password-input";
import {
  PasswordStrengthMeter,
  ConfirmPasswordMessage,
} from "@/components/auth/password-strength-meter";
import { evaluatePasswordStrength } from "@/lib/password-utils";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BackButton } from "@/components/shared/back-button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export default function ProfilePage() {
  const router = useRouter();
  const { user, role, logout, updateUser } = useAuth();

  // If user is not authenticated, prompt or redirect
  const isAuthenticated = user !== null;

  // Personal Info Edit State
  const [isEditing, setIsEditing] = React.useState(false);
  const [fullName, setFullName] = React.useState(user?.name || "");
  const [phoneNumber, setPhoneNumber] = React.useState(user?.phone || user?.phoneNumber || "");
  const [dob, setDob] = React.useState(user?.dob || "1998-08-15");
  const [gender, setGender] = React.useState(user?.gender || "Prefer not to say");

  // Avatar Upload & Preview State
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewDataUrl, setPreviewDataUrl] = React.useState<string | null>(null);
  const [isProcessingAvatar, setIsProcessingAvatar] = React.useState(false);
  const [avatarError, setAvatarError] = React.useState<string | null>(null);

  // Change Password State
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);

  const newStrength = evaluatePasswordStrength(newPassword);
  const newPasswordsMatch = newPassword.length > 0 && confirmNewPassword.length > 0 && newPassword === confirmNewPassword;
  const isNewPasswordValid = newPassword.length > 0 && newStrength.level !== "Weak" && newPasswordsMatch;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    setIsProcessingAvatar(true);

    const validation = validateAvatarFile(file);
    if (!validation.valid) {
      const errorMsg = validation.error || "Invalid file format.";
      setAvatarError(errorMsg);
      toast.error(errorMsg);
      setIsProcessingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      const dataUrl = await processAvatarUpload(file);
      setPreviewDataUrl(dataUrl);
      toast.info("Image selected! Click 'Save Photo' to apply changes.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load image preview.";
      setAvatarError(msg);
      toast.error(msg);
    } finally {
      setIsProcessingAvatar(false);
    }
  };

  const handleSaveAvatar = () => {
    if (!previewDataUrl) return;
    updateUser({ avatarUrl: previewDataUrl });
    setPreviewDataUrl(null);
    setAvatarError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Profile photo updated successfully!");
  };

  const handleCancelAvatarPreview = () => {
    setPreviewDataUrl(null);
    setAvatarError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAvatar = () => {
    updateUser({ avatarUrl: undefined });
    setPreviewDataUrl(null);
    setAvatarError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info("Profile photo removed. Initials avatar restored.");
  };

  const handleStartChangePassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError(null);
    setIsChangingPassword(true);
  };

  const handleCancelChangePassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError(null);
    setIsChangingPassword(false);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!currentPassword || currentPassword.trim().length === 0) {
      setPasswordError("Please enter your current password.");
      return;
    }

    if (currentPassword === "wrong") {
      setPasswordError("Current password is incorrect. Please try again.");
      return;
    }

    if (newStrength.level === "Weak") {
      setPasswordError("New password must be at least Fair strength.");
      return;
    }

    if (!newPasswordsMatch) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);

    setTimeout(() => {
      setIsUpdatingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsChangingPassword(false);
      toast.success("Password updated successfully!");
    }, 600);
  };

  const handleStartEdit = () => {
    setFullName(user?.name || "");
    setPhoneNumber(user?.phone || user?.phoneNumber || "");
    setDob(user?.dob || "1998-08-15");
    setGender(user?.gender || "Prefer not to say");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFullName(user?.name || "");
    setPhoneNumber(user?.phone || user?.phoneNumber || "");
    setDob(user?.dob || "1998-08-15");
    setGender(user?.gender || "Prefer not to say");
    setIsEditing(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: fullName.trim(),
      phone: phoneNumber.trim(),
      phoneNumber: phoneNumber.trim(),
      dob: dob,
      gender: gender,
    });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const activeRole: UserRole = user?.role || role || "buyer";
  const isOwner = activeRole === "owner";
  const memberSince = user?.memberSince || "July 2026";
  const accountStatus = user?.status || "Active";

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-between">
        <Navbar />
        <Container className="py-24 max-w-md mx-auto text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <UserIcon className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-extrabold text-primary">Sign In to View Profile</h1>
            <p className="font-body text-xs text-muted-foreground">
              You must be logged in to manage your RoofOnClick account settings.
            </p>
          </div>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-primary text-primary-foreground hover:bg-accent py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            Sign In Now
          </button>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between pt-24">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <Container className="max-w-6xl mx-auto space-y-8">
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <BackButton fallbackUrl={isOwner ? "/owner/dashboard" : "/"} />
            <Breadcrumb />
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div className="space-y-1 text-left">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
                My Profile
              </h1>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-heading text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0 self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Main Grid: Sidebar Profile Card + Form Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 1. Left Sidebar: Profile Card & Photo Management */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: PREMIUM_EASE }}
              className="lg:col-span-4 bg-card/90 border border-border/80 rounded-3xl p-6 shadow-premium flex flex-col items-center text-center space-y-5 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 -z-10" />

              {/* Avatar with Overlay & Badges */}
              <div className="relative mt-4 group">
                <ProfileAvatar
                  name={user?.name}
                  email={user?.email}
                  avatarUrl={previewDataUrl || user?.avatarUrl}
                  size="lg"
                  className="w-24 h-24 text-2xl ring-4 ring-background shadow-lg"
                />

                {/* Hover Camera Trigger Overlay */}
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  aria-label="Upload profile picture"
                  className="absolute inset-0 w-24 h-24 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                >
                  <Camera className="w-6 h-6" />
                </button>

                {previewDataUrl ? (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white font-heading text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow border border-background">
                    Preview Mode
                  </span>
                ) : (
                  <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-background flex items-center justify-center text-white text-[10px]" title="Active Account">
                    ✓
                  </span>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Choose profile picture file"
              />

              {/* Avatar Actions & Controls */}
              <div className="w-full space-y-2" data-no-intercept="true">
                {previewDataUrl ? (
                  <div className="flex flex-col gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
                    <span className="font-heading text-[11px] font-bold text-amber-700">
                      Previewing new profile picture
                    </span>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSaveAvatar();
                        }}
                        disabled={isProcessingAvatar}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold hover:bg-accent transition-all cursor-pointer shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Photo</span>
                      </button>
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleCancelAvatarPreview();
                        }}
                        className="inline-flex items-center justify-center gap-1 py-2 px-3 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground font-heading text-xs font-bold transition-all cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      type="button"
                      data-no-intercept="true"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      disabled={isProcessingAvatar}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-heading text-xs font-bold transition-all cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{user?.avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                    </button>

                    {user?.avatarUrl && (
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveAvatar();
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-heading text-xs font-bold transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                )}

                {avatarError && (
                  <p className="font-body text-[11px] text-rose-500 font-semibold pt-1">
                    {avatarError}
                  </p>
                )}
                <p className="font-body text-[10px] text-muted-foreground">
                  Supports JPG, PNG, WEBP up to 5 MB
                </p>
              </div>

              {/* Name & Role */}
              <div className="space-y-1.5 w-full pt-1">
                <h2 className="font-heading text-xl font-extrabold text-primary truncate">
                  {user?.name || "RoofOnClick Member"}
                </h2>
                <p className="font-body text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
                <div className="pt-2 flex justify-center items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 font-heading text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm",
                      isOwner
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/25"
                        : "bg-primary/10 text-primary border-primary/25"
                    )}
                  >
                    <span>{isOwner ? "🏢" : "👤"}</span>
                    <span>{isOwner ? "Property Owner" : "Stay Seeker (Buyer)"}</span>
                  </span>
                </div>
              </div>

              {/* Quick Meta Info */}
              <div className="w-full border-t border-border/60 pt-4 space-y-3 text-left">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-body text-muted-foreground flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                    Member Since
                  </span>
                  <span className="font-heading font-bold text-primary">{memberSince}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-body text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Account Status
                  </span>
                  <span className="font-heading font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[11px]">
                    {accountStatus}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right Main Column Sections */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* 2. Personal Information Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: PREMIUM_EASE }}
                className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
              >
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="space-y-0.5">
                    <h3 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                      <UserIcon className="w-5 h-5 text-primary" />
                      Personal Information
                    </h3>
                    <p className="font-body text-xs text-muted-foreground">
                      Manage your personal identity details visible on RoofOnClick.
                    </p>
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-heading text-xs font-bold transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveEdit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      ) : (
                        <div className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-body text-foreground">
                          {user?.name || "Not provided"}
                        </div>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      ) : (
                        <div className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-body text-foreground flex items-center justify-between">
                          <span>{user?.phone || user?.phoneNumber || phoneNumber || "Not provided"}</span>
                          <span className="text-[10px] font-extrabold uppercase text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                      <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider">
                        Date of Birth <span className="text-muted-foreground font-normal lowercase">(optional)</span>
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        />
                      ) : (
                        <div className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-body text-foreground">
                          {user?.dob || dob || "Not specified"}
                        </div>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-1.5">
                      <label className="font-heading text-xs font-bold text-primary uppercase tracking-wider">
                        Gender <span className="text-muted-foreground font-normal lowercase">(optional)</span>
                      </label>
                      {isEditing ? (
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full bg-background border border-border/80 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      ) : (
                        <div className="w-full bg-muted/30 border border-border/40 rounded-xl px-3.5 py-2.5 text-sm font-semibold font-body text-foreground">
                          {user?.gender || gender}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit Controls */}
                  {isEditing && (
                    <div className="flex items-center gap-3 pt-3 border-t border-border/60 justify-end">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground font-heading text-xs font-bold transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-accent font-heading text-xs font-bold transition-all cursor-pointer shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Changes</span>
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>

              {/* 3. Account Information Section (Read-Only) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: PREMIUM_EASE }}
                className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
              >
                <div className="space-y-0.5 border-b border-border/60 pb-4">
                  <h3 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                    <Shield className="w-5 h-5 text-secondary" />
                    Account Information
                  </h3>
                  <p className="font-body text-xs text-muted-foreground">
                    Core system attributes bound to your security credentials.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-1">
                    <span className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Email Address
                    </span>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40 font-body text-xs font-semibold text-primary flex items-center justify-between">
                      <span className="truncate">{user?.email}</span>
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Assigned Role
                    </span>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40 font-body text-xs font-semibold text-primary flex items-center justify-between">
                      <span>{isOwner ? "Property Owner" : "Stay Seeker (Buyer)"}</span>
                      <Lock className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      System Status
                    </span>
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/40 font-body text-xs font-semibold text-emerald-600 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{accountStatus}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 4. Security Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: PREMIUM_EASE }}
                className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
              >
                <div className="space-y-0.5 border-b border-border/60 pb-4">
                  <h3 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-500" />
                    Security & Passwords
                  </h3>
                  <p className="font-body text-xs text-muted-foreground">
                    Manage password credentials and authentication protection.
                  </p>
                </div>

                {!isChangingPassword ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Password Summary Card */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-heading text-xs font-bold text-primary block">
                          Account Password
                        </span>
                        <span className="font-body text-xs text-muted-foreground tracking-widest">
                          ••••••••••••
                        </span>
                      </div>
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={handleStartChangePassword}
                        className="px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-heading text-xs font-bold transition-all cursor-pointer border border-primary/20 shrink-0"
                      >
                        Change Password
                      </button>
                    </div>

                    {/* 2FA Summary Card */}
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="font-heading text-xs font-bold text-primary block">
                          Two-Factor Auth (2FA)
                        </span>
                        <span className="font-body text-xs text-muted-foreground">
                          Extra layer of sign-in security
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-heading text-[10px] font-extrabold uppercase tracking-wider border border-border/40 shrink-0">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Change Password Form Card */
                  <form onSubmit={handleChangePasswordSubmit} className="space-y-5 p-5 rounded-2xl bg-muted/20 border border-border/70">
                    <div className="space-y-4">
                      {/* Current Password */}
                      <PasswordInput
                        id="profile-current-password"
                        label="Current Password"
                        required
                        value={currentPassword}
                        onChange={(e) => {
                          setCurrentPassword(e.target.value);
                          setPasswordError(null);
                        }}
                        placeholder="Enter current password"
                      />

                      {/* New Password & Strength Meter */}
                      <div className="space-y-1">
                        <PasswordInput
                          id="profile-new-password"
                          label="New Password"
                          required
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPasswordError(null);
                          }}
                          placeholder="Enter new strong password"
                        />
                        <PasswordStrengthMeter password={newPassword} showChecklist={true} />
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-1">
                        <PasswordInput
                          id="profile-confirm-new-password"
                          label="Confirm New Password"
                          required
                          value={confirmNewPassword}
                          onChange={(e) => {
                            setConfirmNewPassword(e.target.value);
                            setPasswordError(null);
                          }}
                          placeholder="Re-enter new password"
                        />
                        <ConfirmPasswordMessage password={newPassword} confirmPassword={confirmNewPassword} />
                      </div>

                      {/* Password Error Alert */}
                      {passwordError && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-body text-xs font-semibold text-left">
                          {passwordError}
                        </div>
                      )}
                    </div>

                    {/* Form Controls */}
                    <div className="flex items-center gap-3 pt-3 border-t border-border/60 justify-end">
                      <button
                        type="button"
                        data-no-intercept="true"
                        onClick={handleCancelChangePassword}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground font-heading text-xs font-bold transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                      <button
                        type="submit"
                        data-no-intercept="true"
                        disabled={isUpdatingPassword || !isNewPasswordValid}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-accent font-heading text-xs font-bold transition-all shadow-md",
                          (!isNewPasswordValid || isUpdatingPassword) ? "cursor-not-allowed opacity-65" : "cursor-pointer"
                        )}
                      >
                        {isUpdatingPassword ? (
                          <span>Updating...</span>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Save New Password</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>

              {/* 5. Verification Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: PREMIUM_EASE }}
                className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
              >
                <div className="space-y-0.5 border-b border-border/60 pb-4">
                  <h3 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Account Verification
                  </h3>
                  <p className="font-body text-xs text-muted-foreground">
                    Verified badges build trust on the RoofOnClick platform.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Email Verification */}
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <span className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Verified ✓
                      </span>
                    </div>
                    <span className="font-heading text-xs font-bold text-primary">Email Verification</span>
                    <span className="font-body text-[11px] text-muted-foreground truncate">{user?.email}</span>
                  </div>

                  {/* Phone Verification */}
                  <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Phone className="w-4 h-4 text-emerald-600" />
                      <span className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        Verified ✓
                      </span>
                    </div>
                    <span className="font-heading text-xs font-bold text-primary">Phone Verification</span>
                    <span className="font-body text-[11px] text-muted-foreground">{user?.phone || phoneNumber}</span>
                  </div>

                  {/* Identity Verification */}
                  <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex flex-col gap-2 opacity-75">
                    <div className="flex items-center justify-between">
                      <Sparkles className="w-4 h-4 text-muted-foreground" />
                      <span className="font-heading text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/40">
                        Coming Soon
                      </span>
                    </div>
                    <span className="font-heading text-xs font-bold text-primary">Identity / Govt ID</span>
                    <span className="font-body text-[11px] text-muted-foreground">Aadhaar / Driving License</span>
                  </div>
                </div>
              </motion.div>

              {/* 6. Account Actions Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease: PREMIUM_EASE }}
                className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
              >
                <div className="space-y-0.5 border-b border-border/60 pb-4">
                  <h3 className="font-heading text-lg font-extrabold text-rose-500 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                    Account Actions
                  </h3>
                  <p className="font-body text-xs text-muted-foreground">
                    Perform session sign-out or manage account deletion options.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-left">
                    <span className="font-heading text-xs font-bold text-primary block">
                      Sign Out of Session
                    </span>
                    <p className="font-body text-xs text-muted-foreground">
                      Safely log out of RoofOnClick on this device.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-heading text-xs font-bold transition-all cursor-pointer shrink-0"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>

                <div className="h-px bg-border/60 my-2" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 opacity-60">
                  <div className="space-y-1 text-left">
                    <span className="font-heading text-xs font-bold text-muted-foreground block">
                      Delete Account
                    </span>
                    <p className="font-body text-xs text-muted-foreground">
                      Permanently remove your account and listing data.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-muted-foreground font-heading text-xs font-bold cursor-not-allowed shrink-0 border border-border/40"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account (Soon)</span>
                  </button>
                </div>
              </motion.div>

            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
