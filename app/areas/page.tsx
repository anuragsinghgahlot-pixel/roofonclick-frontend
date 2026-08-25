import type { Metadata } from "next";
import AreasPageContent from "./areas-client";

export const metadata: Metadata = {
  title: "Areas to Find Hostels, PGs & Rentals in Indore",
  description:
    "Explore popular localities and student hubs in Indore including Vijay Nagar, Bhawarkuan, and Palasia to find verified hostels, PGs, and rental flats.",
  alternates: {
    canonical: "https://roofonclick.com/areas",
  },
  openGraph: {
    title: "Areas to Find Hostels, PGs & Rentals in Indore | RoofOnClick",
    description:
      "Explore popular localities and student hubs in Indore including Vijay Nagar, Bhawarkuan, and Palasia to find verified hostels, PGs, and rental flats.",
    url: "https://roofonclick.com/areas",
    type: "website",
  },
};

export default function AreasPage() {
  return <AreasPageContent />;
}
