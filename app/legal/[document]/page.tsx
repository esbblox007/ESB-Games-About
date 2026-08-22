import { notFound, redirect } from "next/navigation";

const legacyRoutes: Record<string, string> = {
  terms: "/terms-of-service", privacy: "/privacy-policy", cookies: "/cookie-policy", refunds: "/refund-policy",
  "subscription-terms": "/subscription-terms", esbucks: "/esbucks-virtual-currency-policy", "payment-terms": "/payment-terms",
  "community-standards": "/community-standards", "child-safety": "/child-safety", "reporting-enforcement": "/reporting-enforcement-policy",
  appeals: "/appeals-policy", "safety-centre": "/safety-centre", "parental-guide": "/parental-guide", "family-centre": "/family-centre-guide",
  "digital-wellbeing": "/screen-time-digital-wellbeing-guide", "age-ratings": "/age-ratings-content-guide", "creator-terms": "/creator-terms",
  marketplace: "/marketplace-policy", ugc: "/ugc-guidelines", copyright: "/copyright-policy", trademark: "/trademark-policy",
  "brand-guidelines": "/brand-guidelines", "data-requests": "/data-requests", "data-retention": "/data-retention-policy", security: "/security-policy",
  "responsible-disclosure": "/responsible-disclosure-policy", accessibility: "/accessibility-statement",
};

export function generateStaticParams() { return Object.keys(legacyRoutes).map((document) => ({ document })); }

export default async function LegacyLegalDocument({ params }: { params: Promise<{ document: string }> }) {
  const { document } = await params;
  const destination = legacyRoutes[document];
  if (!destination) notFound();
  redirect(destination);
}
