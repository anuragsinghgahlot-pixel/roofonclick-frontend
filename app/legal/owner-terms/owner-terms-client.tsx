"use client";

import * as React from "react";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

const OWNER_TOC = [
  { id: "section-1", title: "Scope of Service & Eligibility" },
  { id: "section-2", title: "Listing Verification & Accuracy Standards" },
  { id: "section-3", title: "Owner Account Responsibilities" },
  { id: "section-4", title: "Visit Requests & Booking Management" },
  { id: "section-5", title: "Financial Terms & Monthly Settlements" },
  { id: "section-6", title: "Statutory Compliance & Property Safety" },
  { id: "section-7", title: "Suspension, Removal & Termination" },
  { id: "section-8", title: "Indemnification & Dispute Resolution" },
];

export default function OwnerTermsClient() {
  return (
    <LegalPageLayout
      title="Property Owner Terms & Conditions"
      subtitle="Official service agreement governing property listings, verification standards, tenant visit requests, and monthly settlements on RoofOnClick."
      lastUpdated="August 5, 2026"
      toc={OWNER_TOC}
    >
      {/* Section 1 */}
      <section id="section-1" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          1. Scope of Service &amp; Eligibility
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          This Property Owner Service Agreement (&quot;Agreement&quot;) is executed between RoofOnClick Technologies (&quot;Platform&quot;) and the registered property manager or landlord (&quot;Owner&quot;, &quot;Host&quot;, or &quot;Property Partner&quot;).
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          By registering an Owner Account and submitting property listings for Paying Guest (PG) stays, student hostels, co-living units, or independent rental properties in Indore, you represent that you possess lawful ownership or authorized property management rights.
        </p>
      </section>

      {/* Section 2 */}
      <section id="section-2" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          2. Listing Verification &amp; Accuracy Standards
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Owners agree that all details submitted via the Listing Wizard—including property structure, room configurations, tariffs, security deposits, food/mess offerings, amenities, photos, and location coordinates—must be truthful, accurate, and up to date.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
          <li>RoofOnClick conducts physical or digital verification audits prior to publishing badge approvals.</li>
          <li>Misleading photos, false pricing, or unverified amenities will result in listing rejection or removal.</li>
          <li>Property partners must promptly update room availability status on the Owner Dashboard.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section id="section-3" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          3. Owner Account Responsibilities
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Owners are responsible for maintaining account confidentiality and ensuring all staff or caretakers operating the Owner Dashboard adhere to RoofOnClick privacy standards.
        </p>
      </section>

      {/* Section 4 */}
      <section id="section-4" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          4. Visit Requests &amp; Booking Management
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          When prospective buyers request property visits or submit booking reservations:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
          <li>Owners agree to respond to visit enquiries within reasonable timeframes (under 24 hours).</li>
          <li>Confirmed room reservations generated through RoofOnClick must be honored at the reserved pricing.</li>
          <li>Owners may not alter room charges post-booking without written mutual consent.</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section id="section-5" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          5. Financial Terms &amp; Monthly Settlements
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          RoofOnClick processes online booking advances and tenant payments via bank transfers directly to the property owner&apos;s registered bank account or UPI ID. Monthly settlement cycles run per agreed payout schedules with detailed breakdown reports accessible on the Owner Dashboard.
        </p>
      </section>

      {/* Section 6 */}
      <section id="section-6" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          6. Statutory Compliance &amp; Property Safety
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Owners warrant that listed properties comply with local municipal regulations, fire safety norms, police verification protocols, and building safety codes in Indore, Madhya Pradesh.
        </p>
      </section>

      {/* Section 7 */}
      <section id="section-7" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          7. Suspension, Removal &amp; Termination
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          RoofOnClick reserves the right to suspend or terminate owner listings displaying recurring tenant complaints, unhygienic conditions, financial default, or breach of service terms.
        </p>
      </section>

      {/* Section 8 */}
      <section id="section-8" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          8. Indemnification &amp; Dispute Resolution
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Owners agree to indemnify RoofOnClick against claims or losses arising from property maintenance failures or contract defaults. Disputes shall be resolved under Indian Arbitration laws in Indore, Madhya Pradesh.
        </p>
      </section>
    </LegalPageLayout>
  );
}
