"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import PropertyWizard from "@/components/owner/wizard/property-wizard";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

export default function NewPropertyPage() {
  const router = useRouter();
  const { role } = useAuth();
  const [isCheckingSub, setIsCheckingSub] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const isSubscribed = localStorage.getItem("owner_subscribed") !== "false";
      if (!isSubscribed) {
        toast.error("Subscription Required", {
          description: "You need an active subscription before listing your property.",
        });
        router.replace("/owner/properties");
        return;
      }
    }
    setIsCheckingSub(false);
  }, [router]);

  if (isCheckingSub) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-heading text-sm font-bold text-muted-foreground">
          Checking owner subscription status...
        </p>
      </div>
    );
  }

  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-heading text-sm font-bold text-muted-foreground">
            Loading Listing Wizard...
          </p>
        </div>
      }
    >
      <PropertyWizard />
    </React.Suspense>
  );
}
