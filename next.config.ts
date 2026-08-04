import type { NextConfig } from "next";

const developmentScriptAllowance = process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${developmentScriptAllowance} https://translate.google.com https://translate.googleapis.com https://www.gstatic.com`,
  "style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https: wss: ws:",
  "frame-src https://translate.google.com",
  "media-src 'self' blob: https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://esbgames.com",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    return [
      { source: "/blog", destination: "/news", permanent: true },
      { source: "/blog/:slug*", destination: "/news/:slug*", permanent: true },
      { source: "/creator-hub", destination: "/developer-hub", permanent: true },
      { source: "/login", destination: "https://esbgames.com/login", permanent: true },
      { source: "/signup", destination: "https://esbgames.com/sign-up", permanent: true },
      { source: "/sign-up", destination: "https://esbgames.com/sign-up", permanent: true },
      { source: "/early-access", destination: "https://esbgames.com/sign-up", permanent: true },
    ];
  },
};

export default nextConfig;
