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

  // ─── 2. Public Category & Type Routes ──────────────────────────────────────
  const categoryTypes = ["Hostel", "PG", "Studio Apartment", "1 BHK", "2 BHK", "3 BHK", "Co-living"];
  const categoryRoutes: MetadataRoute.Sitemap = categoryTypes.map((type) => ({
    url: `${BASE_URL}/search?type=${encodeURIComponent(type)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // ─── 3. Public City & Area Locality Routes ──────────────────────────────────
  const areaRoutes: MetadataRoute.Sitemap = [];
  CITIES_REGISTRY.filter((city) => city.isLive).forEach((city) => {
    // City-level search
    areaRoutes.push({
      url: `${BASE_URL}/search?city=${encodeURIComponent(city.id)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    });

    // Area-level search
    city.popularAreas.forEach((area) => {
      areaRoutes.push({
        url: `${BASE_URL}/search?city=${encodeURIComponent(city.id)}&area=${encodeURIComponent(area.name)}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      });
    });
  });

  // ─── 4. Dynamic Public Property Pages ──────────────────────────────────────
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
        const listings: Array<{ _id?: string; id?: string; updatedAt?: string }> =
          json.data?.listings || json.listings || [];

        listings.forEach((item) => {
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
  [...staticRoutes, ...categoryRoutes, ...areaRoutes, ...propertyRoutes].forEach((entry) => {
    if (!urlMap.has(entry.url)) {
      urlMap.set(entry.url, entry);
    }
  });

  return Array.from(urlMap.values());
}
