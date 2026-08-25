import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PropertyDetailsPage from "./property-details-client";
import { ListingsAPI } from "@/services/listings/listings.api";
import { PropertyService, Property } from "@/services/property";
import { CITIES_REGISTRY } from "@/constants/cities";

interface Props {
  params: Promise<{ id: string }>;
}

async function getPropertyForSEO(id: string): Promise<Property | null> {
  if (!id) return null;
  try {
    const listing = await ListingsAPI.getListingById(id);
    const prop = listing || PropertyService.getPropertyById(id);
    if (!prop) return null;

    // Check status: only publicly available properties receive indexable metadata
    const isPublic =
      prop.status === "Published" ||
      (prop as any).status === "active" ||
      (prop as any).status === "Published";

    if (!isPublic) return null;

    return prop;
  } catch {
    const fallbackProp = PropertyService.getPropertyById(id);
    if (
      fallbackProp &&
      (fallbackProp.status === "Published" ||
        (fallbackProp as any).status === "active")
    ) {
      return fallbackProp;
    }
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyForSEO(id);

  if (!property) {
    return {};
  }

  const displayTitle = property.propertyName || "Accommodation";
  const displayArea = property.area || "Indore";
  const displayCity = property.city || "Indore";
  const title = `${displayTitle} in ${displayArea}, ${displayCity}`;

  const pType = property.propertyType || "Property";
  const isVerified = (property as any).isVerified || property.status === "Published";
  const verifiedPrefix = isVerified ? "verified " : "";
  const startingRent = property.startingRent || property.startingPrice;
  const rentStr = startingRent ? ` with rent starting from ₹${startingRent.toLocaleString()}/month` : "";
  const amenitiesList = property.amenities && property.amenities.length > 0 ? `, featuring ${property.amenities.slice(0, 4).join(", ")}` : "";

  const description = property.description
    ? `${property.description.slice(0, 150)}... Find ${displayTitle} in ${displayArea}, ${displayCity} on RoofOnClick.`
    : `Explore ${displayTitle} in ${displayArea}, ${displayCity}. Verified ${pType.toLowerCase()}${rentStr}${amenitiesList} with zero brokerage on RoofOnClick.`;

  const canonicalUrl = `https://roofonclick.com/property/${id}`;
  const image = property.coverPhoto || property.images?.[0]?.url || "https://roofonclick.com/logos/roofonclick-brand-logo.png";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | RoofOnClick`,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: image,
          alt: displayTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | RoofOnClick`,
      description,
      images: [image],
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const property = await getPropertyForSEO(id);

  if (!property) {
    notFound();
  }

  const displayTitle = property.propertyName || "Accommodation";
  const displayArea = property.area || "Indore";
  const displayCity = property.city || "Indore";
  const canonicalUrl = `https://roofonclick.com/property/${id}`;
  const image = property.coverPhoto || property.images?.[0]?.url;

  // ─── JSON-LD Structured Data ────────────────────────────────────────────────
  const propertyJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: displayTitle,
    description: property.description || `Verified ${property.propertyType} in ${displayArea}, ${displayCity}`,
    url: canonicalUrl,
    ...(image ? { image: [image] } : {}),
    address: {
      "@type": "PostalAddress",
      ...(property.address ? { streetAddress: property.address } : {}),
      addressLocality: displayArea,
      addressRegion: displayCity,
      addressCountry: "IN",
    },
  };

  const startingRent = property.startingRent || property.startingPrice;
  if (startingRent) {
    propertyJsonLd.offers = {
      "@type": "Offer",
      price: startingRent,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    };
  }

  if (property.amenities && property.amenities.length > 0) {
    propertyJsonLd.amenityFeature = property.amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity,
      value: true,
    }));
  }

  // ─── Breadcrumb JSON-LD ───────────────────────────────────────────────────
  const cityMatch = CITIES_REGISTRY.find(
    (c) => c.name.toLowerCase() === displayCity.toLowerCase()
  );
  const cityId = cityMatch?.id || (displayCity.toLowerCase() === "indore" ? "indore" : null);

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
      name: "Search",
      item: "https://roofonclick.com/search",
    },
  ];

  if (cityId && displayArea) {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: displayArea,
      item: `https://roofonclick.com/search?city=${encodeURIComponent(cityId)}&area=${encodeURIComponent(displayArea)}`,
    });
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 4,
      name: displayTitle,
      item: canonicalUrl,
    });
  } else {
    breadcrumbItems.push({
      "@type": "ListItem",
      position: 3,
      name: displayTitle,
      item: canonicalUrl,
    });
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(propertyJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PropertyDetailsPage />
    </>
  );
}
