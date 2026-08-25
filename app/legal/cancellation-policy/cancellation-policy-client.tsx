"use client";

import * as React from "react";
import { LegalPageLayout } from "@/components/legal/legal-page-layout";

const CANCEL_TOC = [
  { id: "section-1", title: "Reservation Cancellation Windows" },
  { id: "section-2", title: "Refund Calculation & Timelines" },
  { id: "section-3", title: "Owner-Initiated Cancellations" },
  { id: "section-4", title: "Dispute Resolution" },
];

export default function CancellationPolicyClient() {
  return (
    <LegalPageLayout
      title="Refund & Cancellation Policy"
      subtitle="Standard rules, eligibility windows, and refund processing timelines for booking reservations on RoofOnClick."
      lastUpdated="August 5, 2026"
      toc={CANCEL_TOC}
    >
      <section id="section-1" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          1. Reservation Cancellation Windows
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Bookings cancelled 48 hours or more before scheduled check-in qualify for a 100% refund of advance payments. Cancellations made between 24 and 48 hours before check-in qualify for a 50% refund.
        </p>
      </section>

      <section id="section-2" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          2. Refund Calculation &amp; Timelines
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Approved refunds are processed to the original payment method (Bank Account, UPI, Credit/Debit Card) within 3–5 business days.
        </p>
      </section>

      <section id="section-3" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          3. Owner-Initiated Cancellations
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          If a property owner cancels a confirmed reservation, the buyer receives a 100% full refund immediately alongside priority reassignment assistance from RoofOnClick Support.
        </p>
      </section>

      <section id="section-4" className="space-y-3 scroll-mt-28">
        <h2 className="font-heading text-lg sm:text-xl font-extrabold text-primary border-b border-border/60 pb-2">
          4. Dispute Resolution
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          For refund disputes or booking inquiries, contact <a href="mailto:support@roofonclick.com" className="font-bold text-primary hover:underline">support@roofonclick.com</a>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
