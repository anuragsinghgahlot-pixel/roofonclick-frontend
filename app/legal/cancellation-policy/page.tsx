import type { Metadata } from "next";
import CancellationPolicyClient from "./cancellation-policy-client";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "Read the RoofOnClick Refund and Cancellation Policy to understand cancellation eligibility, processing timelines, and refund terms.",
  alternates: {
    canonical: "https://roofonclick.com/legal/cancellation-policy",
  },
  openGraph: {
    title: "Refund & Cancellation Policy | RoofOnClick",
    description:
      "Read the RoofOnClick Refund and Cancellation Policy to understand cancellation eligibility, processing timelines, and refund terms.",
    url: "https://roofonclick.com/legal/cancellation-policy",
    type: "website",
  },
};

export default function CancellationPolicyPage() {
  return <CancellationPolicyClient />;
}
