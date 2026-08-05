"use client";

import * as React from "react";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

const PRIVACY_TOC = [
  { id: "section-1", title: "Information We Collect" },
  { id: "section-2", title: "How We Use Your Information" },
  { id: "section-3", title: "Data Storage & Security Measures" },
  { id: "section-4", title: "Sharing & Disclosure" },
  { id: "section-5", title: "User Rights & Data Control" },
  { id: "section-6", title: "Contact Privacy Officer" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="How RoofOnClick collects, protects, processes, and respects user personal data across our web applications and services."
      lastUpdated="August 5, 2026"
      toc={PRIVACY_TOC}
    >
      <title>Privacy Policy | RoofOnClick Legal</title>

      <section id="section-1" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          1. Information We Collect
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          We collect personal details necessary to operate our stay discovery and listing management network. This includes name, email address, phone number, gender, property preferences, search queries, and visit requests.
        </p>
      </section>

      <section id="section-2" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          2. How We Use Your Information
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Information is used strictly to facilitate room bookings, property visit schedules, owner-tenant communications, platform security, and personalized search recommendations.
        </p>
      </section>

      <section id="section-3" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          3. Data Storage &amp; Security Measures
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          RoofOnClick employs 256-bit SSL encryption, secure token authentication, and strict access controls to safeguard user information against unauthorized access.
        </p>
      </section>

      <section id="section-4" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          4. Sharing &amp; Disclosure
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          We do NOT sell or rent personal data to third-party advertisers. Information is shared only with verified property owners when you explicitly request a visit or reserve a room.
        </p>
      </section>

      <section id="section-5" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          5. User Rights &amp; Data Control
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          You may review, update, or request deletion of your personal account data at any time via Account Settings or by contacting our data protection officer.
        </p>
      </section>

      <section id="section-6" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          6. Contact Privacy Officer
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          For privacy inquiries or data requests, contact us at <span className="font-bold text-primary">privacy@roofonclick.com</span>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
