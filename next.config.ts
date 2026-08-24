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
    return [
      { source: "/support/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0, must-revalidate" }] },
      { source: "/(.*)", headers: securityHeaders },
    ];
  },
  async redirects() {
    return [
      { source: "/tos", destination: "/terms-of-service", permanent: true },
      { source: "/trust", destination: "/help/trust-safety", permanent: true },
      { source: "/trust/safety", destination: "/help/trust-safety", permanent: true },
      { source: "/trust-safety", destination: "/help/trust-safety", permanent: true },
      { source: "/safety-centre", destination: "/help/trust-safety", permanent: true },
      { source: "/legal/terms", destination: "/terms-of-service", permanent: true },
      { source: "/legal/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/legal/cookies", destination: "/cookie-policy", permanent: true },
      { source: "/legal/refunds", destination: "/refund-policy", permanent: true },
      { source: "/legal/subscription-terms", destination: "/subscription-terms", permanent: true },
      { source: "/legal/esbucks", destination: "/esbucks-virtual-currency-policy", permanent: true },
      { source: "/legal/payment-terms", destination: "/payment-terms", permanent: true },
      { source: "/legal/community-standards", destination: "/community-standards", permanent: true },
      { source: "/legal/child-safety", destination: "/child-safety", permanent: true },
      { source: "/legal/reporting-enforcement", destination: "/reporting-enforcement-policy", permanent: true },
      { source: "/legal/appeals", destination: "/appeals-policy", permanent: true },
      { source: "/legal/safety-centre", destination: "/help/trust-safety", permanent: true },
      { source: "/legal/parental-guide", destination: "/parental-guide", permanent: true },
      { source: "/legal/family-centre", destination: "/family-centre-guide", permanent: true },
      { source: "/legal/digital-wellbeing", destination: "/screen-time-digital-wellbeing-guide", permanent: true },
      { source: "/legal/age-ratings", destination: "/age-ratings-content-guide", permanent: true },
      { source: "/legal/creator-terms", destination: "/creator-terms", permanent: true },
      { source: "/legal/marketplace", destination: "/marketplace-policy", permanent: true },
      { source: "/legal/ugc", destination: "/ugc-guidelines", permanent: true },
      { source: "/legal/copyright", destination: "/copyright-policy", permanent: true },
      { source: "/legal/trademark", destination: "/trademark-policy", permanent: true },
      { source: "/legal/brand-guidelines", destination: "/brand-guidelines", permanent: true },
      { source: "/legal/data-requests", destination: "/data-requests", permanent: true },
      { source: "/legal/data-retention", destination: "/data-retention-policy", permanent: true },
      { source: "/legal/security", destination: "/security-policy", permanent: true },
      { source: "/legal/responsible-disclosure", destination: "/responsible-disclosure-policy", permanent: true },
      { source: "/legal/accessibility", destination: "/accessibility-statement", permanent: true },
      { source: "/accessibility", destination: "/accessibility-statement", permanent: true },
      { source: "/docs", destination: "/documentation", permanent: true },
      { source: "/doc", destination: "/documentation", permanent: true },
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
