export type HelpArticleLink = {
  title: string;
  href: string;
  external?: boolean;
};

export type HelpCategory = {
  id: string;
  title: string;
  description: string;
  articles: HelpArticleLink[];
};

export const helpCategories: HelpCategory[] = [
  {
    id: "account-login",
    title: "Account & Login",
    description: "Sign-in, recovery and account access.",
    articles: [
      { title: "Reset your password", href: "/support/help/reset-password" },
      { title: "Contact Account Support", href: "/support#contact-support" },
    ],
  },
  {
    id: "safety-reporting",
    title: "Safety & Reporting",
    description: "Report harmful behaviour or challenge a decision.",
    articles: [
      { title: "Report a player or game", href: "/support/help/report-player-or-game" },
      { title: "Appeal an account action", href: "/support/help/appeal-account-action" },
    ],
  },
  {
    id: "payments",
    title: "Payments & Subscriptions",
    description: "Manage plans, refunds and billing questions.",
    articles: [
      { title: "Manage a subscription", href: "/support/help/manage-subscription" },
      { title: "Request a refund", href: "/support/help/request-refund" },
    ],
  },
  {
    id: "creators",
    title: "Creators & Studio",
    description: "Creator tools, publishing and Creator support.",
    articles: [
      { title: "Open the Creator Hub", href: "/developer-hub" },
      { title: "Contact Creator Support", href: "/support#contact-support" },
    ],
  },
  {
    id: "family-privacy",
    title: "Family & Privacy",
    description: "Family controls, privacy rights and data requests.",
    articles: [
      { title: "Open Family Centre", href: "/parental-controls" },
      { title: "Make a data request", href: "/data-requests" },
    ],
  },
];
