import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Building2, Sparkles, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";
import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { PropertyCard } from "@/components/cards/property-card";
import { CITIES_REGISTRY, CityArea } from "@/constants/cities";
import { ListingsAPI, ListingsFilters } from "@/services/listings/listings.api";
import { Property } from "@/services/property/property.types";

interface Props {
  params: Promise<{ city: string; slug: string }>;
}

interface CategoryConfig {
  type: string;
  uiTypeLabel: string;
  title: string;
  heading: string;
  description: string;
}

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  hostels: {
    type: "hostel",
    uiTypeLabel: "Hostel",
    title: "Verified Hostels in Indore",
    heading: "Verified Hostels in Indore",
    description: "Browse verified hostels in Indore with mess facilities, 24/7 security, high-speed Wi-Fi, and zero brokerage.",
  },
  pg: {
    type: "pg",
    uiTypeLabel: "PG",
    title: "Verified PGs in Indore",
    heading: "Verified PGs in Indore",
    description: "Discover top-rated PG accommodations for students and working professionals in Indore with single and shared rooms.",
  },
  "studio-rk": {
    type: "studio",
    uiTypeLabel: "Studio Apartment",
    title: "Studio Apartments & RK in Indore",
    heading: "Studio Apartments & RK Stays in Indore",
    description: "Find fully furnished studio apartments and 1 RK rooms in Indore for independent living.",
  },
  "1-bhk": {
    type: "1-bhk",
    uiTypeLabel: "1 BHK",
    title: "1 BHK Rental Properties in Indore",
    heading: "1 BHK Rental Properties in Indore",
    description: "Explore 1 BHK flats and private apartments for rent in Indore with modern amenities.",
  },
  "2-bhk": {
    type: "2-bhk",
    uiTypeLabel: "2 BHK",
    title: "2 BHK Rental Properties in Indore",
    heading: "2 BHK Rental Properties in Indore",
    description: "Explore 2 BHK flats and apartments for family and co-living in Indore.",
  },
  "3-bhk": {
    type: "3-bhk",
    uiTypeLabel: "3 BHK",
    title: "3 BHK Rental Properties in Indore",
    heading: "3 BHK Rental Properties in Indore",
    description: "Discover spacious 3 BHK rental flats and apartments in Indore.",
  },
  "4-bhk": {
    type: "4-bhk",
    uiTypeLabel: "4+ BHK",
    title: "4+ BHK Rental Properties in Indore",
    heading: "4+ BHK Rental Properties in Indore",
    description: "Discover luxury 4+ BHK rental homes and large co-living apartments in Indore.",
  },
};

interface ResolvedPageTarget {
  kind: "locality" | "category";
  cityName: string;
  cityId: string;
  areaObj?: CityArea;
  categoryConfig?: CategoryConfig;
  filters: ListingsFilters;
  canonicalUrl: string;
  title: string;
  heading: string;
  description: string;
  searchCtaUrl: string;
}

async function resolveTarget(cityParam: string, slugParam: string): Promise<ResolvedPageTarget | null> {
  const normCity = cityParam.toLowerCase();
  const normSlug = slugParam.toLowerCase();

  const city = CITIES_REGISTRY.find(
    (c) => c.id.toLowerCase() === normCity || c.name.toLowerCase() === normCity
  );

  if (!city || !city.isLive) {
    return null;
  }

  // 1. Check if slug matches an allowed locality in the city
  const areaObj = city.popularAreas.find(
    (a) => a.id.toLowerCase() === normSlug || a.name.toLowerCase().replace(/\s+/g, "-") === normSlug
  );

  if (areaObj) {
    const canonicalUrl = `https://roofonclick.com/${city.id}/${areaObj.id}`;
    return {
      kind: "locality",
      cityName: city.name,
      cityId: city.id,
      areaObj,
      filters: { city: city.name, area: areaObj.name },
      canonicalUrl,
      title: `Hostels & PGs in ${areaObj.name}, ${city.name}`,
      heading: `Hostels, PGs & Rental Properties in ${areaObj.name}, ${city.name}`,
      description: `Explore verified hostels, PGs, studio apartments, and rooms for rent in ${areaObj.name}, ${city.name}. Zero brokerage verified student and professional stays.`,
      searchCtaUrl: `/search?city=${city.id}&area=${encodeURIComponent(areaObj.name)}`,
    };
  }

  // 2. Check if slug matches an allowed category
  const categoryConfig = CATEGORY_MAP[normSlug];
  if (categoryConfig) {
    const canonicalUrl = `https://roofonclick.com/${city.id}/${normSlug}`;
    return {
      kind: "category",
      cityName: city.name,
      cityId: city.id,
      categoryConfig,
      filters: { city: city.name, type: categoryConfig.type },
      canonicalUrl,
      title: categoryConfig.title,
      heading: categoryConfig.heading,
      description: categoryConfig.description,
      searchCtaUrl: `/search?city=${city.id}&type=${encodeURIComponent(categoryConfig.uiTypeLabel)}`,
    };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, slug } = await params;
  const target = await resolveTarget(city, slug);
  if (!target) {
    return {};
  }

  return {
    title: target.title,
    description: target.description,
    alternates: {
      canonical: target.canonicalUrl,
    },
    openGraph: {
      title: target.title,
      description: target.description,
      url: target.canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: target.title,
      description: target.description,
    },
  };
}

export default async function LocalityOrCategoryLandingPage({ params }: Props) {
  const { city, slug } = await params;
  const target = await resolveTarget(city, slug);

  if (!target) {
    notFound();
  }

  let listings: Property[] = [];
  try {
    const res = await ListingsAPI.getListings(target.filters);
    listings = res.listings;
  } catch (error) {
    console.warn(`[LocalityOrCategoryLandingPage] Failed to load listings for ${target.title}:`, error);
  }

  // Structured Data
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://roofonclick.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: target.cityName,
      item: `https://roofonclick.com/${target.cityId}`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: target.kind === "locality" ? target.areaObj!.name : target.categoryConfig!.heading,
      item: target.canonicalUrl,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
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
                <span>
                  {target.kind === "locality"
                    ? `${target.areaObj?.name}, ${target.cityName}`
                    : target.cityName}
                </span>
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-tight">
                {target.heading}
              </h1>

              <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed">
                {target.description}
              </p>
            </div>
          </Container>
        </Section>

        {/* Listings Display Grid */}
        <Section className="py-12">
          <Container>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left border-b border-border/60 pb-4">
                <div>
                  <h2 className="font-heading text-xl font-extrabold text-primary flex items-center gap-2">
                    <span>Available Stays</span>
                    <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full">
                      {listings.length} Found
                    </span>
                  </h2>
                  <p className="font-body text-xs font-semibold text-muted-foreground mt-0.5">
                    Verified properties matching {target.kind === "locality" ? target.areaObj?.name : target.categoryConfig?.heading}
                  </p>
                </div>

                <Link
                  href={target.searchCtaUrl}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-secondary transition-colors shadow-sm w-fit"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>More Search Filters</span>
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
                    No Direct Listings Matches Found
                  </h3>
                  <p className="font-body text-xs text-muted-foreground">
                    Try refining your preferences using our full search filters.
                  </p>
                  <Link
                    href={target.searchCtaUrl}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:bg-secondary transition-colors"
                  >
                    <span>Open Search Page</span>
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
