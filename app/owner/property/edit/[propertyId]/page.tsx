"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import PropertyWizard from "@/components/owner/wizard/property-wizard";

export default function EditPropertyPage() {
  const params = useParams();
  const propertyId = params?.propertyId as string;

  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-heading text-sm font-bold text-muted-foreground">
            Loading Property Details for Editing...
          </p>
        </div>
      }
    >
      <PropertyWizard editPropertyId={propertyId} />
    </React.Suspense>
  );
}
