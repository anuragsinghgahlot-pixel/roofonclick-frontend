import type { Metadata } from "next";
import ComparePageContent from "./compare-client";

export const metadata: Metadata = {
  title: "Compare Hostels, PGs & Rental Stays",
  description:
    "Compare rent, security deposit, sharing options, food mess, and amenities of selected hostels and PGs side-by-side to choose the best stay in Indore.",
  alternates: {
    canonical: "https://roofonclick.com/compare",
  },
  openGraph: {
    title: "Compare Hostels, PGs & Rental Stays | RoofOnClick",
    description:
      "Compare rent, security deposit, sharing options, food mess, and amenities of selected hostels and PGs side-by-side to choose the best stay in Indore.",
    url: "https://roofonclick.com/compare",
    type: "website",
  },
};

export default function ComparePage() {
  return <ComparePageContent />;
}
