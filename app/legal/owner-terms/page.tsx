import type { Metadata } from "next";
import OwnerTermsClient from "./owner-terms-client";

export const metadata: Metadata = {
  title: "Property Owner Terms & Conditions",
  description:
    "Read the RoofOnClick Property Owner Terms and Conditions governing listing verifications, booking management, and service policies.",
  alternates: {
    canonical: "https://roofonclick.com/legal/owner-terms",
  },
  openGraph: {
    title: "Property Owner Terms & Conditions | RoofOnClick",
    description:
      "Read the RoofOnClick Property Owner Terms and Conditions governing listing verifications, booking management, and service policies.",
    url: "https://roofonclick.com/legal/owner-terms",
    type: "website",
  },
};

export default function OwnerTermsPage() {
  return <OwnerTermsClient />;
}
