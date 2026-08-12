import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // ── Content Security Policy ───────────────────────────────────────
          // Tightened to reduce XSS attack surface (defence-in-depth)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // Next.js needs unsafe-inline for inline styles/scripts in dev
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Allow images from our API, Unsplash, Cloudflare R2, DiceBear
              "img-src 'self' data: blob: https: http:",
              // Allow connections to backend API + Google OAuth
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6969"} https://accounts.google.com`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // ── Other security headers ────────────────────────────────────────
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
