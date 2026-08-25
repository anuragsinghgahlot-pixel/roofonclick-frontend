import type { Metadata } from "next";
import SearchResultsPage from "./search-client";

export const metadata: Metadata = {
  title: "Search Hostels, PGs & Rental Stays in Indore",
  description:
    "Search and filter verified student hostels, boys & girls PGs, studio apartments, and BHK rental flats in Indore by location, budget, sharing, and amenities.",
  alternates: {
    canonical: "https://roofonclick.com/search",
  },
  openGraph: {
    title: "Search Hostels, PGs & Rental Stays in Indore | RoofOnClick",
    description:
      "Search and filter verified student hostels, boys & girls PGs, studio apartments, and BHK rental flats in Indore by location, budget, sharing, and amenities.",
    url: "https://roofonclick.com/search",
    type: "website",
  },
};

export default function SearchPage() {
  return <SearchResultsPage />;
}
