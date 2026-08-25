import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Building2, Sparkles, ShieldCheck } from "lucide-react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { PropertyCard } from "@/components/cards/property-card";
import { CITIES_REGISTRY } from "@/constants/cities";
import { ListingsAPI } from "@/services/listings/listings.api";
import { Property } from "@/services/property/property.types";

interface Props {
  params: Promise<{ city: string }>;
}

async function getCityConfig(cityParam: string) {
  const normalized = cityParam.toLowerCase();
  const city = CITIES_REGISTRY.find(
    (c) => c.id.toLowerCase() === normalized || c.name.toLowerCase() === normalized
  );
  if (!city || !city.isLive) {
    return null;
  }
  return city;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: cityParam } = await params;
  const city = await getCityConfig(cityParam);
  if (!city) {
    return {};
  }

  const title = `Hostels, PGs & Rental Properties in ${city.name}`;
  const description = `Explore verified hostels, PGs, studio apartments, and flat rentals in ${city.name}. Zero brokerage, 100% verified student and professional stays with modern amenities.`;
  const canonicalUrl = `https://roofonclick.com/${city.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CityLandingPage({ params }: Props) {
  const { city: cityParam } = await params;
  const city = await getCityConfig(cityParam);
  if (!city) {
    notFound();
  }

  let listings: Property[] = [];
  try {
    const res = await ListingsAPI.getListings({ city: city.name });
    listings = res.listings;
  } catch (error) {
    console.warn(`[CityLandingPage] Failed to load listings for ${city.name}:`, error);
  }

  const canonicalUrl = `https://roofonclick.com/${city.id}`;

  // Structured Data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://roofonclick.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: city.name,
        item: canonicalUrl,
      },
    ],
  };

  const itemListJsonLd =
    listings.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          numberOfItems: listings.length,
          itemListElement: listings.map((prop, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: prop.propertyName,
            url: `https://roofonclick.com/property/${prop.id}`,
          })),
        }
      : null;

  const categories = [
    { label: "Hostels", slug: "hostels", desc: "Student hostels with mess" },
    { label: "PGs", slug: "pg", desc: "Co-living & single rooms" },
    { label: "Studio / RK", slug: "studio-rk", desc: "Compact private stays" },
    { label: "1 BHK", slug: "1-bhk", desc: "Independent 1 BHK flats" },
    { label: "2 BHK", slug: "2-bhk", desc: "2 BHK family/co-living" },
    { label: "3 BHK", slug: "3-bhk", desc: "Spacious 3 BHK flats" },
    { label: "4+ BHK", slug: "4-bhk", desc: "Large apartments & suites" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero Section */}
        <Section className="pt-8 pb-12 bg-gradient-to-b from-primary/5 via-background to-background border-b border-border/40">
          <Container>
            <div className="flex flex-col gap-4 text-left max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{city.name}&apos;s Verified Stay Finder</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
                Hostels, PGs &amp; Rental Properties in {city.name}
              </h1>

              <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
                {city.tagline}. Discover verified student hostels, professional PGs, studio apartments, and independent BHK flats with zero brokerage.
              </p>
            </div>
          </Container>
        </Section>

        {/* Popular Areas Quick Navigation */}
        <Section className="py-8 bg-muted/20 border-b border-border/40">
          <Container>
            <div className="flex flex-col gap-4 text-left">
              <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-secondary">
                Popular Localities in {city.name}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {city.popularAreas.map((area) => (
                  <Link
                    key={area.id}
                    href={`/${city.id}/${area.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border/80 text-xs font-bold text-primary hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm"
                  >
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    <span>{area.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Categories Quick Navigation */}
        <Section className="py-8 border-b border-border/40">
          <Container>
            <div className="flex flex-col gap-4 text-left">
              <span className="font-heading text-xs font-extrabold uppercase tracking-widest text-secondary">
                Browse Stays by Category
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${city.id}/${cat.slug}`}
                    className="flex flex-col gap-1 p-3.5 rounded-xl bg-card border border-border/80 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group shadow-sm"
                  >
                    <span className="font-heading text-sm font-extrabold text-primary group-hover:text-secondary transition-colors">
                      {cat.label}
                    </span>
                    <span className="font-body text-[10px] text-muted-foreground line-clamp-1">
                      {cat.desc}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* Listing Showcase Section */}
        <Section className="py-12">
          <Container>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left border-b border-border/60 pb-4">
                <div>
                  <h2 className="font-heading text-2xl font-extrabold text-primary">
                    Verified Stays in {city.name}
                  </h2>
                  <p className="font-body text-xs font-semibold text-muted-foreground mt-0.5">
                    Showing verified accommodations ready for immediate move-in
                  </p>
                </div>

                <Link
                  href={`/search?city=${city.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-secondary transition-colors shadow-sm w-fit"
                >
                  <span>Advanced Search &amp; Filters</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((prop) => (
                    <PropertyCard key={prop.id} property={prop as any} />
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-border/80 rounded-2xl p-8 text-center space-y-4 max-w-md mx-auto">
                  <Building2 className="w-10 h-10 text-muted-foreground/50 mx-auto" />
                  <h3 className="font-heading text-base font-bold text-primary">
                    Explore Stays in {city.name}
                  </h3>
                  <p className="font-body text-xs text-muted-foreground">
                    Check out all available hostels and PGs using our search filter.
                  </p>
                  <Link
                    href={`/search?city=${city.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-secondary transition-colors"
                  >
                    <span>Browse All Listings</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </Container>
        </Section>
      </main>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

      <Footer />
    </div>
  );
}
