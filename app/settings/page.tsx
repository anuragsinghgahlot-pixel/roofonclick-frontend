"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { ProfileAvatar } from "@/components/navigation/profile-dropdown";
import { useAuth } from "@/providers/auth-provider";
import {
  User as UserIcon,
  Mail,
  Phone,
  Sun,
  Moon,
  Laptop,
  Bell,
  Lock,
  Globe,
  HelpCircle,
  MessageSquare,
  Bug,
  Info,
  LogOut,
  Edit3,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { BackButton } from "@/components/shared/back-button";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

interface NotificationSettings {
  emailNotifications: boolean;
  bookingUpdates: boolean;
  promotionalOffers: boolean;
}

const emptySubscribe = () => () => {};

export default function SettingsPage() {
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Hydration mounted check via useSyncExternalStore (prevents react-hooks/set-state-in-effect)
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Notification Settings State (Local Storage Persistence)
  const [notifications, setNotifications] = React.useState<NotificationSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("roofonclick_notification_settings");
        if (stored) return JSON.parse(stored);
      } catch {
        // Fallback to defaults
      }
    }
    return {
      emailNotifications: true,
      bookingUpdates: true,
      promotionalOffers: false,
    };
  });

  // Language Preference State
  const [language, setLanguage] = React.useState("en-US");

  // Dialog State for Support/Legal
  const [activeDialog, setActiveDialog] = React.useState<{
    title: string;
    description: string;
    icon: React.ReactNode;
  } | null>(null);

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      if (typeof window !== "undefined") {
        localStorage.setItem("roofonclick_notification_settings", JSON.stringify(updated));
      }
      toast.success("Notification preferences updated.");
      return updated;
    });
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const isOwner = (user?.role || role) === "owner";

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between pt-24">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <Container className="max-w-4xl mx-auto space-y-8">
          {/* Standardized Page Header */}
          <PageHeader
            title="Account Settings"
            subtitle="Configure preferences, notification options, and system theme."
            badge={
              <button
                type="button"
                data-no-intercept="true"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 font-heading text-xs font-bold transition-all cursor-pointer shadow-sm shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            }
            backFallbackUrl={isOwner ? "/owner/dashboard" : "/profile"}
          />

          <div className="space-y-6">
            
            {/* 1. General Profile Summary Section */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: PREMIUM_EASE }}
              className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
            >
              <div className="flex items-center justify-between border-b border-border/60 pb-4">
                <div className="space-y-0.5">
                  <h2 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-primary" />
                    General Settings
                  </h2>
                  <p className="font-body text-xs text-muted-foreground">
                    Overview of your identity credentials.
                  </p>
                </div>

                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => router.push("/profile")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-heading text-xs font-bold transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex items-center gap-4">
                  <ProfileAvatar
                    name={user?.name}
                    email={user?.email}
                    avatarUrl={user?.avatarUrl}
                    size="lg"
                    className="w-14 h-14 text-lg"
                  />
                  <div className="space-y-0.5 text-left">
                    <h3 className="font-heading text-base font-extrabold text-primary truncate">
                      {user?.name || "RoofOnClick Member"}
                    </h3>
                    <div className="flex items-center gap-4 text-xs font-body text-muted-foreground">
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3.5 h-3.5 text-secondary" />
                        {user?.email}
                      </span>
                      {user?.phone && (
                        <span className="hidden sm:flex items-center gap-1 truncate">
                          <Phone className="w-3.5 h-3.5 text-emerald-500" />
                          {user.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 font-heading text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 self-start sm:self-auto">
                  {isOwner ? "🏢 Owner" : "👤 Buyer"}
                </span>
              </div>
            </motion.section>

            {/* 2. Appearance (Theme) Section */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: PREMIUM_EASE }}
              className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
            >
              <div className="space-y-0.5 border-b border-border/60 pb-4">
                <h2 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                  <Sun className="w-5 h-5 text-amber-500" />
                  Appearance & Theme
                </h2>
                <p className="font-body text-xs text-muted-foreground">
                  Customize the interface theme of RoofOnClick.
                </p>
              </div>

              {mounted && (
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {/* System Theme */}
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => setTheme("system")}
                    className={cn(
                      "flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all cursor-pointer select-none",
                      theme === "system"
                        ? "border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    <Laptop className="w-5 h-5" />
                    <span className="font-heading text-xs font-bold">System</span>
                  </button>

                  {/* Light Theme */}
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => setTheme("light")}
                    className={cn(
                      "flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all cursor-pointer select-none",
                      theme === "light"
                        ? "border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    <Sun className="w-5 h-5" />
                    <span className="font-heading text-xs font-bold">Light</span>
                  </button>

                  {/* Dark Theme */}
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "flex flex-col items-center gap-2.5 p-4 rounded-2xl border text-center transition-all cursor-pointer select-none",
                      theme === "dark"
                        ? "border-primary bg-primary/10 text-primary shadow-sm ring-2 ring-primary/20"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    <Moon className="w-5 h-5" />
                    <span className="font-heading text-xs font-bold">Dark</span>
                  </button>
                </div>
              )}
            </motion.section>

            {/* 3. Notifications Section */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: PREMIUM_EASE }}
              className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
            >
              <div className="space-y-0.5 border-b border-border/60 pb-4">
                <h2 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                  <Bell className="w-5 h-5 text-secondary" />
                  Notifications & Preferences
                </h2>
                <p className="font-body text-xs text-muted-foreground">
                  Choose how RoofOnClick communicates updates to you.
                </p>
              </div>

              <div className="space-y-4">
                {/* Email Notifications Toggle */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60">
                  <div className="space-y-0.5 text-left">
                    <span className="font-heading text-xs font-extrabold text-primary block">
                      Email Notifications
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      Receive account alerts and message summaries via email.
                    </span>
                  </div>
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => toggleNotification("emailNotifications")}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0",
                      notifications.emailNotifications ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      className={cn(
                        "w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-sm",
                        notifications.emailNotifications ? "left-6.5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>

                {/* Booking Updates Toggle */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60">
                  <div className="space-y-0.5 text-left">
                    <span className="font-heading text-xs font-extrabold text-primary block">
                      Booking & Inquiry Updates
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      Real-time updates regarding hostel reservations and inquiries.
                    </span>
                  </div>
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => toggleNotification("bookingUpdates")}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0",
                      notifications.bookingUpdates ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      className={cn(
                        "w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-sm",
                        notifications.bookingUpdates ? "left-6.5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>

                {/* Promotional Offers Toggle */}
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-muted/20 border border-border/60">
                  <div className="space-y-0.5 text-left">
                    <span className="font-heading text-xs font-extrabold text-primary block">
                      Promotional Offers & Discounts
                    </span>
                    <span className="font-body text-xs text-muted-foreground">
                      Special deals, seasonal coupons, and property recommendations.
                    </span>
                  </div>
                  <button
                    type="button"
                    data-no-intercept="true"
                    onClick={() => toggleNotification("promotionalOffers")}
                    className={cn(
                      "w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none shrink-0",
                      notifications.promotionalOffers ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  >
                    <span
                      className={cn(
                        "w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-sm",
                        notifications.promotionalOffers ? "left-6.5" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
              </div>
            </motion.section>

            {/* 4. Privacy & Security Section */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3, ease: PREMIUM_EASE }}
              className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
            >
              <div className="space-y-0.5 border-b border-border/60 pb-4">
                <h2 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-500" />
                  Privacy & Security
                </h2>
                <p className="font-body text-xs text-muted-foreground">
                  Security credentials and account removal settings.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() => router.push("/profile")}
                  className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 hover:bg-muted/40 border border-border/60 transition-all cursor-pointer text-left"
                >
                  <div className="space-y-0.5">
                    <span className="font-heading text-xs font-extrabold text-primary block">
                      Change Account Password
                    </span>
                    <span className="font-body text-[11px] text-muted-foreground">
                      Update credentials using strength validation
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </button>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 border border-border/60 opacity-60">
                  <div className="space-y-0.5">
                    <span className="font-heading text-xs font-extrabold text-muted-foreground block">
                      Delete Account
                    </span>
                    <span className="font-body text-[11px] text-muted-foreground">
                      Permanently erase listing data
                    </span>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/40 shrink-0">
                    Coming Soon
                  </span>
                </div>
              </div>
            </motion.section>

            {/* 5. Language Section */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4, ease: PREMIUM_EASE }}
              className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
            >
              <div className="space-y-0.5 border-b border-border/60 pb-4">
                <h2 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                  <Globe className="w-5 h-5 text-sky-500" />
                  Language & Locale
                </h2>
                <p className="font-body text-xs text-muted-foreground">
                  Select display language preference for RoofOnClick.
                </p>
              </div>

              <div className="max-w-md">
                <select
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    toast.info(`Language set to ${e.target.options[e.target.selectedIndex].text}`);
                  }}
                  className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 text-sm font-semibold font-body text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                >
                  <option value="en-US">English (US)</option>
                  <option value="hi-IN">Hindi (हिंदी - Coming Soon)</option>
                </select>
              </div>
            </motion.section>

            {/* 6. Support Section */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5, ease: PREMIUM_EASE }}
              className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
            >
              <div className="space-y-0.5 border-b border-border/60 pb-4">
                <h2 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-500" />
                  Support & Help
                </h2>
                <p className="font-body text-xs text-muted-foreground">
                  Need assistance with your stays or listing?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Help Center */}
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() =>
                    setActiveDialog({
                      title: "RoofOnClick Help Center",
                      description:
                        "Our 24/7 Support Desk is ready to assist with PG bookings, owner listing setup, and payment queries. Contact us directly at support@roofonclick.com or call +91 98765 43210.",
                      icon: <HelpCircle className="w-6 h-6 text-primary" />,
                    })
                  }
                  className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 hover:bg-primary/5 hover:border-primary/40 border border-border/60 transition-all cursor-pointer text-left group"
                >
                  <HelpCircle className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="space-y-0.5">
                    <span className="font-heading text-xs font-bold text-primary block">Help Center</span>
                    <span className="font-body text-[11px] text-muted-foreground">FAQs & Documentation</span>
                  </div>
                </button>

                {/* Contact Support */}
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() =>
                    setActiveDialog({
                      title: "Contact Support Team",
                      description:
                        "Have a specific inquiry regarding an active booking or host partnership? Email our team at support@roofonclick.com or reach out via WhatsApp at +91 98765 43210.",
                      icon: <MessageSquare className="w-6 h-6 text-secondary" />,
                    })
                  }
                  className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 hover:bg-secondary/5 hover:border-secondary/40 border border-border/60 transition-all cursor-pointer text-left group"
                >
                  <MessageSquare className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="space-y-0.5">
                    <span className="font-heading text-xs font-bold text-primary block">Contact Support</span>
                    <span className="font-body text-[11px] text-muted-foreground">Live Desk & Email</span>
                  </div>
                </button>

                {/* Report a Bug */}
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() =>
                    setActiveDialog({
                      title: "Report a Technical Issue",
                      description:
                        "Spotted a glitch on the platform? We appreciate your help! Please report bugs or feedback directly to dev@roofonclick.com.",
                      icon: <Bug className="w-6 h-6 text-rose-500" />,
                    })
                  }
                  className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 hover:bg-rose-500/5 hover:border-rose-500/40 border border-border/60 transition-all cursor-pointer text-left group"
                >
                  <Bug className="w-5 h-5 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="space-y-0.5">
                    <span className="font-heading text-xs font-bold text-primary block">Report a Bug</span>
                    <span className="font-body text-[11px] text-muted-foreground">Feedback & Glitches</span>
                  </div>
                </button>
              </div>
            </motion.section>

            {/* 7. About Section */}
            <motion.section
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6, ease: PREMIUM_EASE }}
              className="bg-card/90 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6 text-left"
            >
              <div className="space-y-0.5 border-b border-border/60 pb-4">
                <h2 className="font-heading text-lg font-extrabold text-primary flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  About RoofOnClick
                </h2>
                <p className="font-body text-xs text-muted-foreground">
                  Platform details and legal guidelines.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="space-y-1 text-left">
                  <span className="font-heading text-base font-extrabold text-primary block">
                    RoofOnClick Platform
                  </span>
                  <span className="font-body text-xs text-muted-foreground">
                    Modern accommodation discovery platform helping students and working professionals find verified hostels & PGs in Indore.
                  </span>
                </div>
                <span className="font-heading text-xs font-extrabold text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 shrink-0 self-start sm:self-auto">
                  v1.2.5
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-heading font-bold text-muted-foreground pt-2">
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() =>
                    setActiveDialog({
                      title: "Privacy Policy",
                      description:
                        "RoofOnClick respects your data privacy. User credentials and booking records are encrypted and stored locally/session-bound until cloud migration.",
                      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
                    })
                  }
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span>•</span>
                <button
                  type="button"
                  data-no-intercept="true"
                  onClick={() =>
                    setActiveDialog({
                      title: "Terms & Conditions",
                      description:
                        "By using RoofOnClick, users and property owners agree to honest listing practices, verified information disclosure, and respectful tenant interactions.",
                      icon: <Info className="w-6 h-6 text-primary" />,
                    })
                  }
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </div>
            </motion.section>

          </div>
        </Container>
      </main>

      {/* Support / Info Modal Dialog */}
      {activeDialog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card border border-border/80 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-premium text-left space-y-5 relative"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-muted/40 border border-border/60 shrink-0">
                {activeDialog.icon}
              </div>
              <h3 className="font-heading text-lg font-extrabold text-primary">
                {activeDialog.title}
              </h3>
            </div>

            <p className="font-body text-xs text-muted-foreground leading-relaxed">
              {activeDialog.description}
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                data-no-intercept="true"
                onClick={() => setActiveDialog(null)}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading text-xs font-bold hover:bg-accent transition-all cursor-pointer shadow-md"
              >
                Got It
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
