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

const prelaunch = (slug: string, title: string, description: string, href: string): TrustResource => ({
  slug,
  title,
  description,
  state: "development",
  href,
});

export const trustSections: TrustSection[] = [
  {
    id: "legal",
    title: "Legal",
    description: "The terms and policies that will govern access, payments, subscriptions and virtual currency across ESB Games.",
    resources: [
      prelaunch("terms", "Terms of Service", "The terms governing access to and use of ESB Games services.", "/terms-of-service"),
      prelaunch("privacy", "Privacy Policy", "How ESB Games handles personal information and privacy choices.", "/privacy-policy"),
      prelaunch("cookies", "Cookie Policy", "How cookies and similar technologies are used on ESB Games websites.", "/cookie-policy"),
      prelaunch("refunds", "Refund Policy", "The planned rules for eligible refunds and payment reversals.", "/refund-policy"),
      prelaunch("subscription-terms", "Subscription Terms", "Terms for paid ESB Games memberships when subscriptions become available.", "/subscription-terms"),
      prelaunch("esbucks", "ESBucks & Virtual Currency Policy", "Rules for ESBucks, virtual items and platform balances.", "/esbucks-virtual-currency-policy"),
      prelaunch("payment-terms", "Payment Terms", "The planned terms for purchases, billing and supported payment methods.", "/payment-terms"),
    ],
  },
  {
    id: "safety",
    title: "Safety",
    description: "Clear standards, reporting routes and enforcement principles designed to support safer communities.",
    resources: [
      prelaunch("community-standards", "Community Standards", "The standards being finalised for behaviour, content and participation across ESB Games.", "/community-standards"),
      prelaunch("child-safety", "Child Safety", "The principles and safeguards being developed for younger users and families.", "/child-safety"),
      prelaunch("reporting-enforcement", "Reporting & Enforcement Policy", "How reports, review and enforcement are intended to work across the ecosystem.", "/reporting-enforcement-policy"),
      prelaunch("appeals", "Appeals Policy", "How eligible moderation decisions will be able to be challenged and reviewed.", "/appeals-policy"),
      { slug: "safety-centre", title: "Safety Centre", description: "A detailed public safety resource covering prevention, detection, enforcement, appeals and family safety.", state: "development", href: "/safety-centre" },
      prelaunch("transparency", "Transparency Reports", "The structure for future public reporting about safety and enforcement activity.", "/trust#safety"),
    ],
  },
  {
    id: "families",
    title: "Parents & Families",
    description: "Guidance and tools designed to help parents and guardians understand and manage age-appropriate experiences.",
    resources: [
      prelaunch("parental-guide", "Parental Guide", "A practical guide to accounts, safety, privacy and family settings.", "/parental-guide"),
      { slug: "family-centre", title: "Family Centre Guide", description: "Guidance for the dedicated family experience, linked accounts and parental controls.", state: "development", href: "/family-centre-guide" },
      prelaunch("digital-wellbeing", "Screen Time & Digital Wellbeing Guide", "Guidance for healthy play patterns, screen-time controls and family conversations.", "/screen-time-digital-wellbeing-guide"),
      prelaunch("age-ratings", "Age Ratings & Content Guide", "How content labels and age-appropriate experiences are intended to be communicated.", "/age-ratings-content-guide"),
    ],
  },
  {
    id: "creators",
    title: "Creators",
    description: "Standards and policies being prepared for creators, publishing, UGC and Marketplace participation.",
    resources: [
      prelaunch("creator-terms", "Creator Terms", "The planned terms for using ESB Studio and creator services.", "/creator-terms"),
      prelaunch("marketplace", "Marketplace Policy", "Rules being prepared for Marketplace listings, transactions and creator conduct.", "/marketplace-policy"),
      prelaunch("ugc", "UGC Guidelines", "Guidance for user-generated content published through ESB Games.", "/ugc-guidelines"),
      prelaunch("copyright", "Copyright Policy", "How copyright concerns and rights-holder requests will be handled.", "/copyright-policy"),
      prelaunch("trademark", "Trademark Policy", "Guidance on trademarks, brand use and protected identifiers.", "/trademark-policy"),
      prelaunch("brand-guidelines", "Brand Guidelines", "Rules for approved use of ESB Games names, logos and brand assets.", "/brand-guidelines"),
    ],
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    description: "Resources for privacy rights, data handling, security practices and responsible vulnerability reporting.",
    resources: [
      prelaunch("data-requests", "Data Requests", "How users will be able to request access, correction or deletion of eligible data.", "/data-requests"),
      prelaunch("data-retention", "Data Retention Policy", "How retention periods and deletion practices are being documented.", "/data-retention-policy"),
      prelaunch("security", "Security Policy", "The security principles being established for ESB Games services and accounts.", "/security-policy"),
      prelaunch("responsible-disclosure", "Responsible Disclosure Policy", "Guidance for reporting potential security vulnerabilities responsibly.", "/responsible-disclosure-policy"),
      { slug: "accessibility", title: "Accessibility Statement", description: "Accessibility commitments across ESB Games products and services.", state: "development", href: "/accessibility-statement" },
    ],
  },
  {
    id: "support",
    title: "Support",
    description: "Public routes for help, private support requests and service availability information.",
    resources: [
      { slug: "help", title: "Help Centre", description: "Browse account, billing, safety and creator guidance.", state: "available", href: "/support" },
      { slug: "contact", title: "Contact Support", description: "Start a private support conversation with ESB Games.", state: "available", href: "/support#contact-support" },
      { slug: "status", title: "Service Status", description: "View the dedicated ESB Games status website. Some status information may be preview data during pre-launch.", state: "available", href: "https://status.esbgames.com", external: true },
    ],
  },
];

export const legalDocuments: Record<string, TrustResource> = Object.fromEntries(
  trustSections.flatMap((section) => section.resources).map((resource) => [resource.slug, resource]),
);
