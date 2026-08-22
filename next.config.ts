import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ['192.168.1.13'],
  compress: true,
  // Reduce bundle size by tree-shaking these large icon/animation libraries
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  images: {
    qualities: [60, 80, 100],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24h cache
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cloudflare.com" },
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "imagedelivery.net" },
    ],
  },
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|favicon.ico).*)",
        headers: [
          // ── Content Security Policy ───────────────────────────────────────
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: http:",
              `connect-src 'self' ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6969"} https://accounts.google.com https://ipapi.co https://freeipapi.com`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          // ── Other security headers ────────────────────────────────────────
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
        ],
      },
      // Cache static Next.js assets aggressively
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
