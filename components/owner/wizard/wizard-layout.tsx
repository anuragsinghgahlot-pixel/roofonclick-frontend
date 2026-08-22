"use client";

import * as React from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import { useWizard } from "./wizard-context";
import { ProgressTimeline } from "./progress-timeline";
import { NavigationButtons } from "./navigation-buttons";
import { BackButton } from "@/components/shared/back-button";

import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";

export function WizardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role } = useAuth();
  const { currentStep, handleReset, isEditMode, isLoadingProperty, form } = useWizard();

  const currentRole = user?.role || role;
  const propertyName = form.watch("propertyName");

  React.useEffect(() => {
    if (user && currentRole === "buyer") {
      router.replace("/");
    }
  }, [user, currentRole, router]);

  const stepTitles = [
    "Basic Details",
    "Location Details",
    "Pricing & Sharing",
    "Amenities Selection",
    "Photos & Media",
    isEditMode ? "Review & Save Changes" : "Review & Publish",
  ];

  return (
    <div
      data-lenis-prevent="true"
      data-lenis-prevent-wheel="true"
      className="relative flex flex-col min-h-[100dvh] bg-background w-full max-w-full overflow-x-clip"
    >
      <Navbar />

      <main className="flex-1 text-left w-full max-w-full overflow-x-clip" data-no-intercept="true">
        <div className="bg-muted/10 pt-4 sm:pt-6 lg:pt-8 pb-12 sm:pb-16 relative overflow-hidden w-full max-w-full">
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-[500px] sm:h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-[500px] sm:h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container className="max-w-2xl mx-auto px-3.5 sm:px-6 w-full min-w-0">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between gap-4 mb-4">
              <BackButton fallbackUrl="/owner/dashboard" />
              {isEditMode && propertyName && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-heading text-xs font-bold truncate max-w-[200px] sm:max-w-[320px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="truncate">Editing: {propertyName}</span>
                </div>
              )}
            </div>

            {/* Header section with timeline */}
            <div className="mb-5 sm:mb-6">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary block mb-1">
                    {isEditMode ? "Property Editor" : "Listing Wizard"}
                  </span>
                  <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-primary">
                    {stepTitles[currentStep - 1] || "Wizard Complete"}
                  </h1>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-heading text-xs font-bold text-muted-foreground block leading-none">
                    Step {currentStep} of 6
                  </span>
                  <span className="text-[9px] font-bold text-emerald-500 mt-1.5 block">
                    {isEditMode ? "● Active Property" : "● Draft autosaved"}
                  </span>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <ProgressTimeline currentStep={currentStep} />

              {/* Clear draft option (Only for create mode) */}
              {!isEditMode && (
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/40">
                  <span className="text-[10px] font-semibold text-muted-foreground">
                    Listing drafts are preserved on reload.
                  </span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer select-none"
                  >
                    Clear Draft
                  </button>
                </div>
              )}
            </div>

            {/* Inner Content Card Box */}
            <div className="bg-card border border-border/80 rounded-[20px] sm:rounded-[28px] p-5 sm:p-8 shadow-premium flex flex-col gap-5 sm:gap-6 relative min-h-[360px]">
              {isLoadingProperty ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <div className="space-y-1">
                    <p className="font-heading text-sm font-extrabold text-primary">
                      Loading Property Details...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Retrieving existing photos, room configurations, and pricing.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Form Content rendering the children step component */}
                  <div className="flex-1">
                    {children}
                  </div>

                  {/* Dynamic bottom Navigation previous/next CTAs */}
                  <NavigationButtons />
                </>
              )}
            </div>
          </Container>
        </div>
      </main>

      <Footer />
    </div>
  );
}
