"use client";

import * as React from "react";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

const BUYER_TOC = [
  { id: "section-1", title: "Acceptance of Terms & Eligibility" },
  { id: "section-2", title: "User Account & Profile Security" },
  { id: "section-3", title: "Property Discovery & Visit Schedules" },
  { id: "section-4", title: "Booking Reservations & Payments" },
  { id: "section-5", title: "Cancellations & Refund Policies" },
  { id: "section-6", title: "Resident Code of Conduct & House Rules" },
  { id: "section-7", title: "Limitation of Liability & Disclaimers" },
  { id: "section-8", title: "Governing Law & Support Contact" },
];

export default function BuyerTermsClient() {
  return (
    <LegalPageLayout
      title="Buyer Terms & Conditions"
      subtitle="Official terms of service governing resident registrations, room bookings, visit schedules, and property usage on the RoofOnClick platform."
      lastUpdated="August 5, 2026"
      toc={BUYER_TOC}
    >
      {/* Section 1 */}
      <section id="section-1" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          1. Acceptance of Terms &amp; Eligibility
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Welcome to RoofOnClick (&quot;Platform&quot;). By creating a Buyer Account, browsing property listings, scheduling property visits, or reserving room stays through RoofOnClick, you (&quot;User&quot;, &quot;Resident&quot;, or &quot;Buyer&quot;) agree to be bound by these Buyer Terms &amp; Conditions and our Privacy Policy.
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          To register as a Buyer, you must be at least 18 years of age or possess legal parental/guardian consent if you are a student enrolled in a recognized institution. You agree to provide accurate, truthful, and complete verification information during registration.
        </p>
      </section>

      {/* Section 2 */}
      <section id="section-2" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          2. User Account &amp; Profile Security
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          You are responsible for maintaining the confidentiality of your account login credentials, OTP verifications, and mobile authentication methods. Any activity performed under your Buyer Account will be deemed authorized by you.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
          <li>Account credentials may not be shared, assigned, or transferred to third parties.</li>
          <li>You must notify RoofOnClick Support immediately if you suspect unauthorized access.</li>
          <li>RoofOnClick reserves the right to suspend accounts displaying fraudulent activity or impersonation.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section id="section-3" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          3. Property Discovery &amp; Visit Schedules
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          RoofOnClick facilitates direct discovery of verified Paying Guest (PG) accommodations, hostels, co-living spaces, and independent rental units in Indore. When scheduling a property visit:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
          <li>Visit requests are routed directly to verified Property Owners.</li>
          <li>You agree to arrive punctually at agreed visit time slots or cancel/reschedule via the platform.</li>
          <li>RoofOnClick does not charge buyers any brokerage fees for property visits or direct owner connections.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section id="section-4" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          4. Booking Reservations &amp; Payments
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Room reservations made through RoofOnClick lock the selected room configuration and price. All room tariffs, security deposits, and maintenance charges specified at the time of booking are binding.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-muted-foreground">
          <li>Payments processed via RoofOnClick online gateway are secured with 256-bit SSL encryption.</li>
          <li>Security deposits (where applicable) are held per property owner agreement policies and refunded upon lease completion minus any documented damages.</li>
          <li>Receipts and booking confirmations are issued digitally to your registered account.</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section id="section-5" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          5. Cancellations &amp; Refund Policies
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Cancellations requested within 24 hours of booking confirmation qualify for a full refund minus nominal processing charges. Cancellations requested after check-in or occupancy commencement are subject to the property owner&apos;s specific cancellation schedule.
        </p>
      </section>

      {/* Section 6 */}
      <section id="section-6" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          6. Resident Code of Conduct &amp; House Rules
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Residents agree to adhere to property-specific house rules, biometric security guidelines, gate timings, visitor policies, and quiet hours. Misconduct, property damage, or illegal activities will result in immediate termination of stay without refund.
        </p>
      </section>

      {/* Section 7 */}
      <section id="section-7" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          7. Limitation of Liability &amp; Disclaimers
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          RoofOnClick conducts rigorous verification checks on listings, but does not operate or own physical properties. RoofOnClick is not liable for personal property loss, utility disruptions, or disputes between residents and property owners beyond our mediation scope.
        </p>
      </section>

      {/* Section 8 */}
      <section id="section-8" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          8. Governing Law &amp; Support Contact
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          These terms are governed by the laws of India, subject to the exclusive jurisdiction of courts in Indore, Madhya Pradesh. For support or legal enquiries, contact us at <span className="font-bold text-primary">support@roofonclick.com</span>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
