export type TrustResource = {
  slug: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

export type TrustSection = {
  id: string;
  title: string;
  description: string;
  resources: TrustResource[];
};

const resource = (slug: string, title: string, description: string, href: string, external = false): TrustResource => ({ slug, title, description, href, external });

export const trustSections: TrustSection[] = [
  {
    id: "legal",
    title: "Legal",
    description: "Core service, purchase and virtual-currency terms for the ESB Games ecosystem.",
    resources: [
      resource("terms", "Terms of Service", "The agreement governing access to ESB Games services.", "/terms-of-service"),
      resource("privacy", "Privacy Policy", "How ESB Games handles personal information and privacy choices.", "/privacy-policy"),
      resource("cookies", "Cookie Policy", "How cookies and similar technologies are used.", "/cookie-policy"),
      resource("refunds", "Refund Policy", "Refund and cancellation principles for eligible purchases.", "/refund-policy"),
      resource("subscription-terms", "Subscription Terms", "Terms for recurring ESB Games memberships and plans.", "/subscription-terms"),
      resource("esbucks", "ESBucks & Virtual Currency", "Rules for ESBucks and other virtual-value features.", "/esbucks-virtual-currency-policy"),
      resource("payments", "Payment Terms", "Terms applying to payments and eligible transactions.", "/payment-terms"),
    ],
  },
  {
    id: "safety",
    title: "Safety",
    description: "Practical safety guidance plus the rules, reporting and review processes that support the community.",
    resources: [
      resource("safety-centre", "Safety framework", "Prevention, detection, reporting, enforcement, appeals and family-safety guidance.", "/help/trust-safety#safety-framework"),
      resource("community-standards", "Community Standards", "The rules for behaviour and content across ESB Games.", "/community-standards"),
      resource("child-safety", "Child Safety", "Safeguards and expectations for children, families and creators.", "/child-safety"),
      resource("reporting-enforcement", "Reporting & Enforcement", "How reports are reviewed and platform rules are enforced.", "/reporting-enforcement-policy"),
      resource("appeals", "Appeals Policy", "How eligible platform decisions can be challenged.", "/appeals-policy"),
    ],
  },
  {
    id: "families",
    title: "Parents & families",
    description: "Guidance for families, parental controls, wellbeing and age-appropriate experiences.",
    resources: [
      resource("family-centre-page", "Family Centre", "Product information for linked accounts and parental controls.", "/parental-controls"),
      resource("parental-guide", "Parental Guide", "An overview of ESB Games for parents and guardians.", "/parental-guide"),
      resource("family-centre", "Family Centre Guide", "How the Family Centre and linked-account controls are designed to work.", "/family-centre-guide"),
      resource("screen-time", "Screen Time & Digital Wellbeing", "Guidance for healthy, balanced use of ESB Games.", "/screen-time-digital-wellbeing-guide"),
      resource("age-ratings", "Age Ratings & Content Guide", "How content labels and age-appropriate access are designed.", "/age-ratings-content-guide"),
    ],
  },
  {
    id: "creators",
    title: "Creators",
    description: "Rules and guidance for creators, Marketplace activity, user-generated content and brand use.",
    resources: [
      resource("creator-hub", "Creator Hub", "Public product information for ESB Studio and creator tools.", "/developer-hub"),
      resource("creator-documentation", "Creator Documentation", "Getting-started, Studio, scripting and publishing guidance.", "/documentation"),
      resource("creator-terms", "Creator Terms", "Terms applying to creator and developer activity.", "/creator-terms"),
      resource("marketplace", "Marketplace Policy", "Rules for Marketplace listings, assets and transactions.", "/marketplace-policy"),
      resource("ugc", "UGC Guidelines", "Guidance for user-generated content across the ecosystem.", "/ugc-guidelines"),
      resource("copyright", "Copyright Policy", "How copyright and rights reports are handled.", "/copyright-policy"),
      resource("trademark", "Trademark Policy", "Rules for trademarks, identity and authorised use.", "/trademark-policy"),
      resource("brand", "Brand Guidelines", "Guidance for using ESB Games branding appropriately.", "/brand-guidelines"),
    ],
  },
  {
    id: "privacy-security",
    title: "Privacy & security",
    description: "Information about data rights, retention, security, disclosure and accessibility.",
    resources: [
      resource("careers-privacy", "Careers Application Privacy", "How applicant information and private recruitment files are handled.", "/careers/privacy"),
      resource("data-requests", "Data Requests", "How to make eligible privacy and personal-data requests.", "/data-requests"),
      resource("retention", "Data Retention", "How retention principles are documented across ESB Games.", "/data-retention-policy"),
      resource("security", "Security Policy", "Security principles and expectations across the ecosystem.", "/security-policy"),
      resource("responsible-disclosure", "Responsible Disclosure", "How good-faith security researchers can report vulnerabilities.", "/responsible-disclosure-policy"),
      resource("accessibility", "Accessibility Statement", "ESB Games accessibility commitments and contact routes.", "/accessibility-statement"),
    ],
  },
  {
    id: "support",
    title: "Help & support",
    description: "Self-service guidance, private case handling and live service information have separate sources of truth.",
    resources: [
      resource("help-centre", "Help Centre", "Task-based guides and answers for common ESB Games questions.", "/help/centre"),
      resource("contact-support", "Private Support", "Create a private case when an issue needs authorised staff review.", "/support#contact-support"),
      resource("service-status", "Service Status", "The dedicated source of truth for incidents, maintenance and availability.", "https://status.esbgames.com", true),
    ],
  },
];
