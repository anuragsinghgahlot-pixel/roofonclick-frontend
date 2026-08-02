"use client";

import * as React from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/shared/section";
import { PageHeader } from "@/components/shared/page-header";
import { RecentlyViewedSection } from "@/components/property/recently-viewed-section";

export default function RecentlyViewedPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1" data-no-intercept="true">
        <Section className="bg-background relative overflow-hidden text-left pt-6 pb-20">
          <Container className="space-y-8">
            <PageHeader
              title="Recently Viewed Properties"
              subtitle="Quickly pick up where you left off in your stay search history."
              backFallbackUrl="/search"
            />

            <RecentlyViewedSection
              title="Your Viewing History"
              subtitle="Stays you inspected recently while browsing RoofOnClick."
              showEmptyState={true}
            />
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
