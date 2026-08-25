import type { Metadata } from "next";
import PrivacyPolicyClient from "./privacy-policy-client";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the RoofOnClick Privacy Policy to understand how we collect, store, protect, and process user data across our platform.",
  alternates: {
    canonical: "https://roofonclick.com/legal/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | RoofOnClick",
    description:
      "Read the RoofOnClick Privacy Policy to understand how we collect, store, protect, and process user data across our platform.",
    url: "https://roofonclick.com/legal/privacy-policy",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
