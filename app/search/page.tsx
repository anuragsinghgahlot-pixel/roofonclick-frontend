import * as React from "react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { MapPin, Star, ShieldCheck } from "lucide-react";

// Mock Properties Dataset (9 items)
const MOCK_PROPERTIES = [
  {
    id: "p1",
    name: "Elite Residency",
    location: "Vijay Nagar",
    price: 8500,
    rating: 4.8,
    verified: true,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
    type: "Co-Living",
    amenities: ["WiFi", "Food", "AC", "Laundry", "Parking"],
  },
  {
    id: "p2",
    name: "Skyline Premium Stays",
    location: "Bhawarkuan",
    price: 7200,
    rating: 4.5,
    verified: true,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
    type: "Boys PG",
    amenities: ["WiFi", "Food", "AC", "Laundry"],
  },
  {
    id: "p3",
    name: "CoHabit Spaces",
    location: "Palasia",
    price: 9500,
    rating: 4.9,
    verified: true,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
    type: "Co-Living",
    amenities: ["WiFi", "AC", "Laundry", "Parking"],
  },
  {
    id: "p4",
    name: "Oasis Student Hostel",
    location: "Vijay Nagar",
    price: 6000,
    rating: 4.2,
    verified: false,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&auto=format&fit=crop&q=80",
    type: "Boys PG",
    amenities: ["WiFi", "Food", "Laundry"],
  },
  {
    id: "p5",
    name: "Serene Nest for Girls",
    location: "Bhawarkuan",
    price: 8000,
    rating: 4.7,
    verified: true,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    type: "Girls PG",
    amenities: ["WiFi", "Food", "AC", "Laundry", "Parking"],
  },
  {
    id: "p6",
    name: "DAVV Scholar House",
    location: "IET DAVV",
    price: 6500,
    rating: 4.4,
    verified: true,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    type: "Boys PG",
    amenities: ["WiFi", "Food", "Laundry", "Parking"],
  },
  {
    id: "p7",
    name: "Medanta Care Suites",
    location: "Medanta Hospital",
    price: 11000,
    rating: 4.9,
    verified: true,
    image: "https://images.unsplash.com/photo-1560185127-6a2806647f81?w=600&auto=format&fit=crop&q=80",
    type: "Co-Living",
    amenities: ["WiFi", "AC", "Laundry", "Parking"],
  },
  {
    id: "p8",
    name: "C21 Luxury Stay",
    location: "C21 Mall",
    price: 12500,
    rating: 4.9,
    verified: true,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&auto=format&fit=crop&q=80",
    type: "Co-Living",
    amenities: ["WiFi", "Food", "AC", "Laundry", "Parking"],
  },
  {
    id: "p9",
    name: "Orchard Heights",
    location: "Palasia",
    price: 8800,
    rating: 4.6,
    verified: false,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600&auto=format&fit=crop&q=80",
    type: "Girls PG",
    amenities: ["WiFi", "Food", "AC", "Laundry"],
  },
];

// Helper to format slug to title case / display name
function getDisplayTitle(slug: string): string {
  const mapping: { [key: string]: string } = {
    "vijay-nagar": "Vijay Nagar",
    "palasia": "Palasia",
    "bhawarkuan": "Bhawarkuan",
    "iet-davv": "IET DAVV",
    "medanta-hospital": "Medanta Hospital",
    "c21-mall": "C21 Mall",
  };
  return mapping[slug.toLowerCase()] || slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ location?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const locationSlug = resolvedSearchParams.location;

  // Filter properties based on URL slug
  const filteredProperties = locationSlug
    ? MOCK_PROPERTIES.filter(
        (p) => p.location.toLowerCase().replace(/\s+/g, "-") === locationSlug.toLowerCase()
      )
    : MOCK_PROPERTIES;

  const displayLocation = locationSlug ? getDisplayTitle(locationSlug) : "All Locations";

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Section className="bg-muted/10 py-12 relative overflow-hidden">
          {/* Decorative ambient background glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none -z-10" />

          <Container>
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/80 pb-6 mb-10 text-left">
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-primary tracking-tight mb-2">
                  Search Results
                </h1>
                <p className="font-body text-base text-muted-foreground flex items-center gap-1.5">
                  Showing stays in <span className="font-semibold text-secondary flex items-center gap-1">📍 {displayLocation}</span>
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="font-body text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-lg">
                  {filteredProperties.length} Stays Found
                </span>
              </div>
            </div>

            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    className="group bg-card border border-border/80 rounded-2xl overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-300 flex flex-col"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Type Badge */}
                      <span className="absolute top-3 left-3 bg-foreground/80 backdrop-blur-md text-background text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md z-10">
                        {property.type}
                      </span>

                      {/* Verified Badge */}
                      {property.verified && (
                        <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm z-10">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Content Container */}
                    <div className="p-5 flex-1 flex flex-col justify-between text-left">
                      <div>
                        {/* Location and Rating Row */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                            <span className="text-xs font-semibold font-body">{property.location}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-secondary/10 px-2 py-0.5 rounded-lg">
                            <Star className="w-3.5 h-3.5 text-secondary fill-current shrink-0" />
                            <span className="text-xs font-bold text-primary">{property.rating}</span>
                          </div>
                        </div>

                        {/* Property Name */}
                        <h3 className="font-heading text-lg font-bold text-primary mb-3 group-hover:text-secondary transition-colors duration-200">
                          {property.name}
                        </h3>

                        {/* Amenities Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {property.amenities.map((amenity) => (
                            <span
                              key={amenity}
                              className="text-[10px] font-semibold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price & Action Row */}
                      <div className="border-t border-border/60 pt-4 flex items-center justify-between mt-auto">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block leading-none">
                            Starting from
                          </span>
                          <span className="font-heading text-lg font-extrabold text-primary">
                            ₹{property.price.toLocaleString()}
                            <span className="text-xs font-semibold text-muted-foreground font-body">/mo</span>
                          </span>
                        </div>
                        <button className="bg-primary hover:bg-secondary text-primary-foreground hover:text-secondary-foreground text-xs font-bold tracking-wide px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-md shadow-primary/10">
                          Book Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                <span className="text-5xl">🏢</span>
                <h3 className="font-heading text-xl font-bold text-primary">No properties found</h3>
                <p className="font-body text-sm text-muted-foreground max-w-md">
                  We couldn&apos;t find any PGs or hostels matching &ldquo;{displayLocation}&rdquo; in our current handpicked directory.
                </p>
              </div>
            )}
          </Container>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
