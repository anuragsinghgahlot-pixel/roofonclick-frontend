import type { Metadata } from "next";
import BuyerTermsClient from "./buyer-terms-client";

export const metadata: Metadata = {
  title: "Buyer Terms & Conditions",
  description:
    "Read the RoofOnClick Buyer Terms and Conditions governing resident account registrations, property visits, bookings, and platform usage.",
  alternates: {
    canonical: "https://roofonclick.com/legal/buyer-terms",
  },
  openGraph: {
    title: "Buyer Terms & Conditions | RoofOnClick",
    description:
      "Read the RoofOnClick Buyer Terms and Conditions governing resident account registrations, property visits, bookings, and platform usage.",
    url: "https://roofonclick.com/legal/buyer-terms",
    type: "website",
  },
};

export default function BuyerTermsPage() {
  return <BuyerTermsClient />;
}
