import * as React from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import {
  Hero,
  PopularAreas,
  FeaturedListings,
  Categories,
  Advantages,
  PartnerCTA,
} from "@/features/home/components";

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <div className="flex flex-col">
          <Hero />
          <PopularAreas />
          <FeaturedListings />
          <Categories />
          <Advantages />
          <PartnerCTA />
        </div>
      </main>
      <Footer />
    </div>
  );
}
