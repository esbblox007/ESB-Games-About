export type HelpArticleLink = {
  title: string;
  href: string;
  external?: boolean;
};

export type HelpCategory = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  articles: HelpArticleLink[];
};

export type HelpSection = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  categories: HelpCategory[];
};

export const helpSections: HelpSection[] = [
  {
    id: "account-safety",
    eyebrow: "Account & Safety",
    title: "Get back in, stay secure and get help quickly.",
    description: "Account access, harmful behaviour, reports and moderation decisions live together so the safest route is easy to find.",
    categories: [
      {
        id: "account-login",
        title: "Account & Login",
        description: "Sign-in, password recovery and account access.",
        badge: "Account help",
        articles: [
          { title: "Reset your password", href: "/support/help/reset-password" },
          { title: "Contact Account Support", href: "/support#contact-support" },
        ],
      },
      {
        id: "safety-reporting",
        title: "Safety & Reporting",
        description: "Report harmful behaviour or challenge an account action.",
        badge: "Safety route",
        articles: [
          { title: "Report a player or game", href: "/support/help/report-player-or-game" },
          { title: "Appeal an account action", href: "/support/help/appeal-account-action" },
        ],
      },
    ],
  },
  {
    id: "payments-creation",
    eyebrow: "Payments & Creation",
    title: "Manage purchases and keep building.",
    description: "Billing questions and Creator support are separated from ordinary account help so commercial and publishing issues reach the right place faster.",
    categories: [
      {
        id: "payments",
        title: "Payments & Subscriptions",
        description: "Plans, refunds and billing questions.",
        badge: "Billing help",
        articles: [
          { title: "Manage a subscription", href: "/support/help/manage-subscription" },
          { title: "Request a refund", href: "/support/help/request-refund" },
        ],
      },
      {
        id: "creators",
        title: "Creators & Studio",
        description: "Creator tools, publishing and payout guidance.",
        badge: "Creator help",
        articles: [
          { title: "Open the Creator Hub", href: "/developer-hub" },
          { title: "Creator payout guide", href: "/support/help/creator-payout-guide" },
          { title: "Contact Creator Support", href: "/support#contact-support" },
        ],
      },
    ],
  },
  {
    id: "family-privacy-service",
    eyebrow: "Family, Privacy & Service",
    title: "Controls, privacy rights and service information.",
    description: "Family settings, data requests and service availability are grouped here because they are usually about managing the wider ESB Games experience rather than one isolated ticket.",
    categories: [
      {
        id: "family-privacy",
        title: "Family & Privacy",
        description: "Family controls, privacy rights and data requests.",
        badge: "Privacy & family",
        articles: [
          { title: "Open Family Centre", href: "/parental-controls" },
          { title: "Make a data request", href: "/data-requests" },
          { title: "Read the Privacy Policy", href: "/privacy-policy" },
        ],
      },
      {
        id: "technical-service",
        title: "Technical & Service Status",
        description: "Check availability first, then contact Support if your issue is not a wider incident.",
        badge: "Service help",
        articles: [
          { title: "View ESB Games Status", href: "https://status.esbgames.com", external: true },
          { title: "Contact Technical Support", href: "/support#contact-support" },
        ],
      },
    ],
  },
];

export const helpCategories = helpSections.flatMap((section) => section.categories);
