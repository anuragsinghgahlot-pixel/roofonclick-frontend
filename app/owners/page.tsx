import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "List Your Property in Indore",
  description:
    "List your hostel, PG, or rental property on RoofOnClick to connect with verified student and professional tenants in Indore with zero brokerage hassle.",
  alternates: {
    canonical: "https://roofonclick.com/owners",
  },
  openGraph: {
    title: "List Your Property in Indore | RoofOnClick",
    description:
      "List your hostel, PG, or rental property on RoofOnClick to connect with verified student and professional tenants in Indore with zero brokerage hassle.",
    url: "https://roofonclick.com/owners",
    type: "website",
  },
};

export default function OwnersPage() {
  return (
    <ComingSoon
      title="For Owners"
      description="List your hostel, PG, or property with RoofOnClick. Get verified leads, manage bookings, and grow your rental business in Indore with zero brokerage hassle."
    />
  );
}
