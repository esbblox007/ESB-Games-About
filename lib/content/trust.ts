import type { ProductState } from "@/lib/site-config";

export type TrustResource = {
  slug: string;
  title: string;
  description: string;
  state: ProductState;
  href?: string;
  external?: boolean;
};

export type TrustSection = {
  id: string;
  title: string;
  description: string;
  resources: TrustResource[];
};

const publishedResource = (slug: string, title: string, description: string, href: string): TrustResource => ({
  slug,
  title,
  description,
  state: "available",
  href,
});

export const trustSections: TrustSection[] = [
  {
    id: "legal",
    title: "Legal",
    description: "Terms and policies covering access, payments, subscriptions and virtual currency across ESB Games.",
    resources: [
      publishedResource("terms", "Terms of Service", "The terms governing access to and use of ESB Games services.", "/terms-of-service"),
      publishedResource("privacy", "Privacy Policy", "How ESB Games handles personal information and privacy choices.", "/privacy-policy"),
      publishedResource("cookies", "Cookie Policy", "How cookies and similar technologies are used on ESB Games websites.", "/cookie-policy"),
      publishedResource("refunds", "Refund Policy", "Rules for eligible refunds and payment reversals.", "/refund-policy"),
      publishedResource("subscription-terms", "Subscription Terms", "Terms for ESB Games membership subscriptions and recurring billing.", "/subscription-terms"),
      publishedResource("esbucks", "ESBucks & Virtual Currency Policy", "Rules for ESBucks, virtual items and platform balances.", "/esbucks-virtual-currency-policy"),
      publishedResource("payment-terms", "Payment Terms", "Terms for purchases, billing and supported payment methods.", "/payment-terms"),
    ],
  },
  {
    id: "safety",
    title: "Safety",
    description: "Clear standards, reporting routes and enforcement principles designed to support safer communities.",
    resources: [
      publishedResource("community-standards", "Community Standards", "Standards for behaviour, content and participation across ESB Games.", "/community-standards"),
      publishedResource("child-safety", "Child Safety", "Principles and safeguards for younger users and families.", "/child-safety"),
      publishedResource("reporting-enforcement", "Reporting & Enforcement Policy", "How reports, review and enforcement work across the ecosystem.", "/reporting-enforcement-policy"),
      publishedResource("appeals", "Appeals Policy", "How eligible moderation decisions can be challenged and reviewed.", "/appeals-policy"),
      { slug: "safety-centre", title: "Safety Centre", description: "A detailed public safety resource covering prevention, detection, enforcement, appeals and family safety.", state: "available", href: "/safety-centre" },
      publishedResource("transparency", "Transparency Reports", "The structure for future public reporting about safety and enforcement activity.", "/trust#safety"),
    ],
  },
  {
    id: "families",
    title: "Parents & Families",
    description: "Guidance and tools to help parents and guardians understand and manage age-appropriate experiences.",
    resources: [
      publishedResource("parental-guide", "Parental Guide", "A practical guide to accounts, safety, privacy and family settings.", "/parental-guide"),
      { slug: "family-centre", title: "Family Centre Guide", description: "Guidance for the dedicated family experience, linked accounts and parental controls.", state: "available", href: "/family-centre-guide" },
      publishedResource("digital-wellbeing", "Screen Time & Digital Wellbeing Guide", "Guidance for healthy play patterns, screen-time controls and family conversations.", "/screen-time-digital-wellbeing-guide"),
      publishedResource("age-ratings", "Age Ratings & Content Guide", "How content labels and age-appropriate experiences are communicated.", "/age-ratings-content-guide"),
    ],
  },
  {
    id: "creators",
    title: "Creators",
    description: "Standards and policies for creators, publishing, UGC and Marketplace participation.",
    resources: [
      publishedResource("creator-terms", "Creator Terms", "Terms for using ESB Studio and creator services.", "/creator-terms"),
      publishedResource("marketplace", "Marketplace Policy", "Rules for Marketplace listings, transactions and creator conduct.", "/marketplace-policy"),
      publishedResource("ugc", "UGC Guidelines", "Guidance for user-generated content published through ESB Games.", "/ugc-guidelines"),
      publishedResource("copyright", "Copyright Policy", "How copyright concerns and rights-holder requests will be handled.", "/copyright-policy"),
      publishedResource("trademark", "Trademark Policy", "Guidance on trademarks, brand use and protected identifiers.", "/trademark-policy"),
      publishedResource("brand-guidelines", "Brand Guidelines", "Rules for approved use of ESB Games names, logos and brand assets.", "/brand-guidelines"),
    ],
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    description: "Resources for privacy rights, data handling, security practices and responsible vulnerability reporting.",
    resources: [
      publishedResource("data-requests", "Data Requests", "How users can request access, correction or deletion of eligible data.", "/data-requests"),
      publishedResource("data-retention", "Data Retention Policy", "How retention periods and deletion practices are documented.", "/data-retention-policy"),
      publishedResource("security", "Security Policy", "Security principles for ESB Games services and accounts.", "/security-policy"),
      publishedResource("responsible-disclosure", "Responsible Disclosure Policy", "Guidance for reporting potential security vulnerabilities responsibly.", "/responsible-disclosure-policy"),
      { slug: "accessibility", title: "Accessibility Statement", description: "Accessibility commitments across ESB Games products and services.", state: "available", href: "/accessibility-statement" },
    ],
  },
  {
    id: "support",
    title: "Support",
    description: "Public routes for help, private support requests and service availability information.",
    resources: [
      { slug: "help", title: "Help Centre", description: "Browse account, billing, safety and creator guidance.", state: "available", href: "/help" },
      { slug: "contact", title: "Contact Support", description: "Start a private support conversation with ESB Games.", state: "available", href: "/support#contact-support" },
      { slug: "status", title: "Service Status", description: "View the dedicated ESB Games status website. Some status information may be preview data during pre-launch.", state: "available", href: "https://status.esbgames.com", external: true },
    ],
  },
];

export const legalDocuments: Record<string, TrustResource> = Object.fromEntries(
  trustSections.flatMap((section) => section.resources).map((resource) => [resource.slug, resource]),
);
