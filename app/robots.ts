import type { MetadataRoute } from "next";

const BASE_URL = "https://roofonclick.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/admin",
          "/owner/",
          "/owner",
          "/profile/",
          "/profile",
          "/settings/",
          "/settings",
          "/booking/",
          "/booking",
          "/wishlist/",
          "/wishlist",
          "/recently-viewed/",
          "/recently-viewed",
          "/saved-searches/",
          "/saved-searches",
          "/onboarding/",
          "/onboarding",
          "/auth/",
          "/auth",
          "/login",
          "/signup",
          "/register",
          "/contact-owner",
          "/coming-soon",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
