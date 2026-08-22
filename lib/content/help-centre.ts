export type HelpArticleLink = {
  title: string;
  href?: string;
  external?: boolean;
};

export type HelpCategory = {
  id: string;
  title: string;
  description: string;
  action: string;
  articles: HelpArticleLink[];
};

export const helpCategories: HelpCategory[] = [
  {
    id: "account-login",
    title: "Account & Login",
    description: "Sign-in, verification, recovery and security.",
    action: "Get Account help",
    articles: [
      { title: "Reset a password", href: "/support/help/reset-password" },
      { title: "Email verification" },
      { title: "Account recovery", href: "/support#contact-support" },
      { title: "Sessions and trusted devices" },
      { title: "MFA and backup codes" },
      { title: "Compromised Account", href: "/support#contact-support" },
    ],
  },
  {
    id: "safety-reporting",
    title: "Safety & Reporting",
    description: "Report harmful content, users or urgent concerns.",
    action: "Make a report",
    articles: [
      { title: "Block, mute and leave" },
      { title: "Report a user", href: "/support/help/report-player-or-game" },
      { title: "Report a game, group or event", href: "/support/help/report-player-or-game" },
      { title: "Harassment and bullying" },
      { title: "Threats and immediate danger", href: "/support#contact-support" },
      { title: "Appeal a moderation decision", href: "/support/help/appeal-account-action" },
    ],
  },
  {
    id: "payments-esbucks",
    title: "Payments & ESBucks",
    description: "Purchases, subscriptions, refunds and balances.",
    action: "Get payment help",
    articles: [
      { title: "Buying ESBucks" },
      { title: "Subscriptions and plan changes", href: "/support/help/manage-subscription" },
      { title: "Cancel a subscription", href: "/support/help/manage-subscription" },
      { title: "Refund eligibility", href: "/support/help/request-refund" },
      { title: "Unknown or duplicate charges", href: "/support#contact-support" },
      { title: "Creator payouts", href: "/support/help/creator-payout-guide" },
    ],
  },
  {
    id: "games-playing",
    title: "Games & Playing",
    description: "Installing, launching, joining and gameplay problems.",
    action: "Fix a game issue",
    articles: [
      { title: "Install ESB Games Player", href: "/download" },
      { title: "Launch or join a game" },
      { title: "Friends and presence" },
      { title: "Messages and notifications" },
      { title: "Performance and connection problems" },
      { title: "Report a broken experience", href: "/support/help/report-player-or-game" },
    ],
  },
  {
    id: "creators-studio",
    title: "Creators & Studio",
    description: "Publishing, collaboration, assets, APIs and earnings.",
    action: "Creator help",
    articles: [
      { title: "Install and open ESB Studio", href: "/download" },
      { title: "Create and publish a game" },
      { title: "Manage projects and collaborators" },
      { title: "Upload assets and UGC" },
      { title: "Creator Earnings and payouts", href: "/support/help/creator-payout-guide" },
      { title: "Publishing, moderation and appeals", href: "/support/help/appeal-account-action" },
    ],
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Buying, selling, licences and listings.",
    action: "Marketplace help",
    articles: [
      { title: "Marketplace listings" },
      { title: "Licences and ownership" },
      { title: "Item missing", href: "/support#contact-support" },
      { title: "Listing removed", href: "/support/help/appeal-account-action" },
      { title: "Copyright and trademark reports", href: "/trust#creators" },
      { title: "Report counterfeit content", href: "/support#contact-support" },
    ],
  },
  {
    id: "family-centre",
    title: "Family Centre",
    description: "Parental links, approvals, spending and safety settings.",
    action: "Family help",
    articles: [
      { title: "Create or link Family Centre", href: "/parental-controls" },
      { title: "Parent or carer verification", href: "/parental-guide" },
      { title: "Privacy and communication settings", href: "/family-centre-guide" },
      { title: "Purchase approvals and limits", href: "/family-centre-guide" },
      { title: "Bedtime and screen-time schedules", href: "/screen-time-digital-wellbeing-guide" },
      { title: "Parent and Carer Guide", href: "/parental-guide" },
    ],
  },
  {
    id: "privacy-data",
    title: "Privacy & Data",
    description: "Data requests, privacy settings and deletion.",
    action: "Manage privacy",
    articles: [
      { title: "Download your information", href: "/data-requests" },
      { title: "Correct personal information", href: "/data-requests" },
      { title: "Delete information or close an Account", href: "/data-requests" },
      { title: "Data Retention Policy", href: "/data-retention-policy" },
      { title: "Cookie choices", href: "/cookie-policy" },
      { title: "Responsible Disclosure Policy", href: "/responsible-disclosure-policy" },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility",
    description: "Accessible features, barriers and support routes.",
    action: "Accessibility help",
    articles: [
      { title: "Accessibility Statement", href: "/accessibility-statement" },
      { title: "Keyboard support" },
      { title: "Captions and readable content" },
      { title: "Report an accessibility barrier", href: "/support#contact-support" },
    ],
  },
  {
    id: "service-status",
    title: "Service Status",
    description: "Live incidents, maintenance and availability.",
    action: "View status",
    articles: [
      { title: "Current incidents", href: "https://status.esbgames.com", external: true },
      { title: "Planned maintenance", href: "https://status.esbgames.com", external: true },
      { title: "Past incident updates", href: "https://status.esbgames.com", external: true },
      { title: "Technical Support", href: "/support#contact-support" },
    ],
  },
];

export const popularHelpArticles = [
  { label: "Account", title: "Reset your ESB Games password", description: "Use the password-reset route when you can access the email connected to your Account.", href: "/support/help/reset-password" },
  { label: "Payments", title: "Cancel or change a subscription", description: "Review the purchase channel, cancellation timing and what happens to benefits.", href: "/support/help/manage-subscription" },
  { label: "Payments", title: "Request a refund", description: "Check refund eligibility and submit the relevant purchase details through the correct support route.", href: "/support/help/request-refund" },
  { label: "Safety", title: "Appeal an account action", description: "Use the decision notice or Appeals route and provide the case reference and relevant context.", href: "/support/help/appeal-account-action" },
  { label: "Safety", title: "Report a player or game", description: "Use the appropriate report route for harmful behaviour, unsafe content or a broken experience.", href: "/support/help/report-player-or-game" },
  { label: "Creators", title: "Creator payout planning guide", description: "Understand common verification, eligibility and payout-review steps for Creator Earnings.", href: "/support/help/creator-payout-guide" },
] as const;

export const helpFaqs = [
  ["What is ESB Games?", "ESB Games is a gaming and Creator ecosystem where people can discover and play experiences, communicate, join groups and events, customise their identity, create content and use Creator tools."],
  ["Is ESB Games connected to Discord or Roblox?", "No. ESB Games is its own platform. Other services may be referenced for comparison, temporary team communication or external integrations, but they are not the ESB Games service."],
  ["How old do I need to be?", "Age access depends on the user’s country, the Account type and the feature. Child Accounts receive stronger defaults and restrictions."],
  ["How do I contact ESB Games?", "Choose the topic in the Help Centre so the request reaches the correct team. Safety, privacy, payments and security vulnerabilities use separate specialist routes."],
  ["Can I report without an Account?", "Essential safety, privacy, security and legal reporting routes should be available without sign-in, although limited contact or ownership checks may be needed."],
  ["Can I speak to a real person?", "Some requests require human review. The Help Centre explains when a request needs to reach an ESB Games team."],
  ["Can I upload evidence?", "Yes, where the form supports it. Upload only relevant, lawful and safely redacted evidence. Never upload passwords, illegal material or unnecessary personal information."],
  ["How do I appeal?", "Open the decision notice or Appeals page and provide the case reference, the reason you believe the decision is wrong or disproportionate, and any relevant context."],
  ["Where are the legal policies?", "The Trust, Safety & Legal Centre links to the Terms of Service, Privacy Policy, Community Standards and other official ESB Games documents."],
  ["Where can Creators get help?", "Use the Creator and Studio category for publishing, assets, collaboration, Marketplace, earnings, APIs and technical support."],
  ["What should I do during an outage?", "Check the Status page, avoid repeated risky actions such as multiple payments, and follow the incident instructions."],
] as const;
