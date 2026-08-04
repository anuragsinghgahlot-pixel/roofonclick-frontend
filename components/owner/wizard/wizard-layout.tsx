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
  const { currentStep, handleReset } = useWizard();

  const currentRole = user?.role || role;

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
    "Review & Publish",
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1" data-no-intercept="true">
        <Section className="bg-muted/10 py-12 relative text-left">
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container className="max-w-2xl mx-auto px-4 sm:px-6">
            {/* Top Navigation Row */}
            <div className="flex items-center justify-between gap-4 mb-5 sm:mb-6">
              <BackButton fallbackUrl="/owner/dashboard" />
            </div>

            {/* Header section with timeline */}
            <div className="mb-6 sm:mb-8">
              <div className="flex justify-between items-end mb-3 sm:mb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-secondary block mb-1">
                    Listing Wizard
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
                    ● Draft autosaved
                  </span>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <ProgressTimeline currentStep={currentStep} />

              {/* Clear draft option */}
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
            </div>

            {/* Inner Content Card Box */}
            <div className="bg-card border border-border/80 rounded-[20px] sm:rounded-[28px] p-5 sm:p-8 shadow-premium flex flex-col gap-5 sm:gap-6">
              {/* Form Content rendering the children step component */}
              <div className="flex-1">
                {children}
              </div>

              {/* Dynamic bottom Navigation previous/next CTAs */}
              <NavigationButtons />
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
