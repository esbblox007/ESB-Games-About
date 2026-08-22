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

const prelaunch = (slug: string, title: string, description: string): TrustResource => ({
  slug,
  title,
  description,
  state: "development",
  href: `/legal/${slug}`,
});

export const trustSections: TrustSection[] = [
  {
    id: "legal",
    title: "Legal",
    description: "The terms and policies that will govern access, payments, subscriptions and virtual currency across ESB Games.",
    resources: [
      prelaunch("terms", "Terms of Service", "The terms governing access to and use of ESB Games services."),
      prelaunch("privacy", "Privacy Policy", "How ESB Games handles personal information and privacy choices."),
      prelaunch("cookies", "Cookie Policy", "How cookies and similar technologies are used on ESB Games websites."),
      prelaunch("refunds", "Refund Policy", "The planned rules for eligible refunds and payment reversals."),
      prelaunch("subscription-terms", "Subscription Terms", "Terms for paid ESB Games memberships when subscriptions become available."),
      prelaunch("esbucks", "ESBucks & Virtual Currency Policy", "Rules for ESBucks, virtual items and platform balances."),
      prelaunch("payment-terms", "Payment Terms", "The planned terms for purchases, billing and supported payment methods."),
    ],
  },
  {
    id: "safety",
    title: "Safety",
    description: "Clear standards, reporting routes and enforcement principles designed to support safer communities.",
    resources: [
      prelaunch("community-standards", "Community Standards", "The standards being finalised for behaviour, content and participation across ESB Games."),
      prelaunch("child-safety", "Child Safety", "The principles and safeguards being developed for younger users and families."),
      prelaunch("reporting-enforcement", "Reporting & Enforcement Policy", "How reports, review and enforcement are intended to work across the ecosystem."),
      prelaunch("appeals", "Appeals Policy", "How eligible moderation decisions will be able to be challenged and reviewed."),
      { slug: "safety-centre", title: "Safety Centre", description: "A high-level overview of prevention, detection, enforcement, appeals and family safety.", state: "available", href: "/trust/safety" },
      prelaunch("transparency", "Transparency Reports", "The structure for future public reporting about safety and enforcement activity."),
    ],
  },
  {
    id: "families",
    title: "Parents & Families",
    description: "Guidance and tools designed to help parents and guardians understand and manage age-appropriate experiences.",
    resources: [
      prelaunch("parental-guide", "Parental Guide", "A practical guide to accounts, safety, privacy and family settings."),
      { slug: "family-centre", title: "Family Centre", description: "The dedicated family experience for linked accounts and parental controls, currently in development.", state: "development", href: "/parental-controls" },
      prelaunch("digital-wellbeing", "Screen Time & Digital Wellbeing Guide", "Guidance for healthy play patterns, screen-time controls and family conversations."),
      prelaunch("age-ratings", "Age Ratings & Content Guide", "How content labels and age-appropriate experiences are intended to be communicated."),
    ],
  },
  {
    id: "creators",
    title: "Creators",
    description: "Standards and policies being prepared for creators, publishing, UGC and Marketplace participation.",
    resources: [
      prelaunch("creator-terms", "Creator Terms", "The planned terms for using ESB Studio and creator services."),
      prelaunch("marketplace", "Marketplace Policy", "Rules being prepared for Marketplace listings, transactions and creator conduct."),
      prelaunch("ugc", "UGC Guidelines", "Guidance for user-generated content published through ESB Games."),
      prelaunch("copyright", "Copyright Policy", "How copyright concerns and rights-holder requests will be handled."),
      prelaunch("trademark", "Trademark Policy", "Guidance on trademarks, brand use and protected identifiers."),
      prelaunch("brand-guidelines", "Brand Guidelines", "Rules for approved use of ESB Games names, logos and brand assets."),
    ],
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    description: "Resources for privacy rights, data handling, security practices and responsible vulnerability reporting.",
    resources: [
      prelaunch("data-requests", "Data Requests", "How users will be able to request access, correction or deletion of eligible data."),
      prelaunch("data-retention", "Data Retention Policy", "How retention periods and deletion practices are being documented."),
      prelaunch("security", "Security Policy", "The security principles being established for ESB Games services and accounts."),
      prelaunch("responsible-disclosure", "Responsible Disclosure Policy", "Guidance for reporting potential security vulnerabilities responsibly."),
      { slug: "accessibility", title: "Accessibility Statement", description: "Current accessibility commitments and the status of the full public statement.", state: "development", href: "/accessibility" },
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

export const legalDocuments = Object.fromEntries(
  trustSections
    .flatMap((section) => section.resources)
    .filter((resource) => resource.href?.startsWith("/legal/"))
    .map((resource) => [resource.slug, resource]),
) as Record<string, TrustResource>;
