import type { MetadataRoute } from "next";
import { CITIES_REGISTRY } from "@/constants/cities";

const BASE_URL = "https://roofonclick.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ─── 1. Core Static Public Pages ───────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/explore`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/areas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/owners`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/compare`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    // Legal & Trust
    {
      url: `${BASE_URL}/legal/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/legal/buyer-terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/legal/owner-terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/legal/cancellation-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // ─── 2. Clean Location & Category SEO Landing Pages ───────────────────────
  const landingRoutes: MetadataRoute.Sitemap = [];
  const allowedCategories = ["hostels", "pg", "studio-rk", "1-bhk", "2-bhk", "3-bhk", "4-bhk"];

  CITIES_REGISTRY.filter((city) => city.isLive).forEach((city) => {
    // City Landing Page (/indore)
    landingRoutes.push({
      url: `${BASE_URL}/${encodeURIComponent(city.id)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    });

    // Locality Landing Pages (/indore/vijay-nagar, etc.)
    city.popularAreas.forEach((area) => {
      landingRoutes.push({
        url: `${BASE_URL}/${encodeURIComponent(city.id)}/${encodeURIComponent(area.id)}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      });
    });

    // Category Landing Pages (/indore/hostels, etc.)
    allowedCategories.forEach((catSlug) => {
      landingRoutes.push({
        url: `${BASE_URL}/${encodeURIComponent(city.id)}/${encodeURIComponent(catSlug)}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      });
    });
  });

  // ─── 3. Dynamic Public Active Property Pages ──────────────────────────────
  const propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (apiBase) {
      const res = await fetch(`${apiBase}/api/listings?limit=500&status=active`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const json = await res.json();
        const listings: Array<{ _id?: string; id?: string; updatedAt?: string; status?: string }> =
          json.data?.listings || json.listings || [];

        listings.forEach((item) => {
          // Strictly only include status="active" properties
          const isListingActive = !item.status || item.status === "active";
          if (!isListingActive) return;

          const id = item._id || item.id;
          if (id) {
            propertyRoutes.push({
              url: `${BASE_URL}/property/${encodeURIComponent(id)}`,
              lastModified: item.updatedAt ? new Date(item.updatedAt) : now,
              changeFrequency: "daily",
              priority: 0.9,
            });
          }
        });
      }
    }
  } catch (error) {
    // Graceful fallback during build if backend is offline/unreachable
    console.warn("[sitemap] Failed to fetch dynamic property listings:", error);
  }

  // Deduplicate and combine all indexable public URLs
  const urlMap = new Map<string, MetadataRoute.Sitemap[number]>();
  [
    ...staticRoutes,
    ...landingRoutes,
    ...propertyRoutes,
  ].forEach((entry) => {
    if (!urlMap.has(entry.url)) {
      urlMap.set(entry.url, entry);
    }
  });

  return Array.from(urlMap.values());
}
