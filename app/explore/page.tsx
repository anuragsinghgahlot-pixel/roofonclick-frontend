import type { Metadata } from "next";
import { ComingSoon } from "@/components/shared/coming-soon";

export const metadata: Metadata = {
  title: "Explore Verified Hostels & PGs in Indore",
  description:
    "Discover and explore verified hostels, boys & girls PGs, 1RK/Studio apartments, and BHK rental flats across popular educational and IT hubs in Indore with zero brokerage.",
  alternates: {
    canonical: "https://roofonclick.com/explore",
  },
  openGraph: {
    title: "Explore Verified Hostels & PGs in Indore | RoofOnClick",
    description:
      "Discover and explore verified hostels, boys & girls PGs, 1RK/Studio apartments, and BHK rental flats across popular educational and IT hubs in Indore with zero brokerage.",
    url: "https://roofonclick.com/explore",
    type: "website",
  },
};

export default function ExplorePage() {
  return (
    <ComingSoon
      title="Explore Properties"
      description="Find the perfect verified PGs, hostels, co-living spaces, and studio apartments across popular educational and commercial hubs in Indore."
    />
  );
}
