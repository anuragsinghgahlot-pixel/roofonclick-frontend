import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
  },
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
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
