import {
  Hero,
  PopularAreas,
  FeaturedListings,
  Categories,
  Advantages,
  Testimonials,
  PartnerCTA,
} from "@/features/home/components";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <PopularAreas />
      <FeaturedListings />
      <Categories />
      <Advantages />
      <Testimonials />
      <PartnerCTA />
    </div>
  );
}

