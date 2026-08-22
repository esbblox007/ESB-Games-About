export type SupportArticle = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{ heading: string; body: string[]; steps?: string[] }>;
};

export const supportArticles: SupportArticle[] = [
  {
    slug: "reset-password",
    title: "Reset your password",
    description: "Recover access to an ESB Games account when you have forgotten your password.",
    intro: "Use the password recovery option on the ESB Games login page. You will need access to the email address connected to the account.",
    sections: [
      { heading: "Reset your password", body: ["Open the ESB Games login page and choose Forgot Password."], steps: ["Enter the email connected to your account.", "Open the recovery email sent by ESB Games.", "Choose a new secure password.", "Return to the login page and sign in again."] },
      { heading: "No access to your email?", body: ["Contact ESB Games Support and provide enough information for the team to verify account ownership. Never send your password to anyone."] },
    ],
  },
  {
    slug: "manage-subscription",
    title: "Cancel or change a subscription",
    description: "Preview how ESB Games subscription, plan and renewal controls are intended to work.",
    intro: "Subscriptions are not publicly available yet. The flow below describes the planned account experience and may change before launch.",
    sections: [
      { heading: "Planned subscription management flow", body: ["When subscriptions launch, the current plan and renewal controls are intended to be available from Settings under Subscriptions or Billing."], steps: ["Open the subscription or billing area.", "Review the active plan.", "Choose the available plan-change or renewal option.", "Review the confirmation details before continuing.", "Keep any confirmation email for your records."] },
      { heading: "Billing support", body: ["The planned Billing & Payments form will request the account username and transaction reference. Never include passwords or full card information."] },
    ],
  },
  {
    slug: "request-refund",
    title: "Request a refund",
    description: "Learn what information to provide when asking ESB Games to review a purchase.",
    intro: "Public ESB Games purchasing is not yet available. This article describes the planned refund-support flow; final eligibility will depend on the purchase and applicable consumer rules.",
    sections: [
      { heading: "Before submitting", body: ["When purchases launch, keep the purchase date, receipt or transaction reference, account username and a clear explanation of the issue."] },
      { heading: "Planned refund request flow", body: ["The planned Billing & Payments workflow will collect the information needed for a review and provide a confirmation once the request has been stored."], steps: ["Choose Billing & Payments.", "Select the relevant purchase issue.", "Add the transaction details.", "Only treat the request as submitted after receiving a confirmation reference."] },
    ],
  },
  {
    slug: "appeal-account-action",
    title: "Appeal an account action",
    description: "Ask ESB Games to review a moderation or account enforcement decision.",
    intro: "Appeals should explain why you believe the decision should be reviewed and include the relevant moderation reference where available.",
    sections: [
      { heading: "What to include", body: ["Provide the username, moderation date, action type and any relevant context. Keep the appeal factual and avoid sending duplicate requests once the appeal system is live."] },
      { heading: "What happens next", body: ["The planned appeal workflow will provide the original action and supplied context to the appropriate reviewer. An appeal will not guarantee that the action changes."] },
    ],
  },
  {
    slug: "report-player-or-game",
    title: "Report a player or game",
    description: "Report safety, abuse or content concerns to ESB Games.",
    intro: "Use in-platform reporting tools when they become available. The dedicated Safety & Abuse route is being prepared for concerns that need additional review.",
    sections: [
      { heading: "Useful evidence", body: ["Include usernames, experience names, approximate times, message references and screenshots where appropriate. Do not put yourself at risk to collect evidence."] },
      { heading: "After reporting", body: ["The planned process will prioritise reports by severity. Privacy rules may limit what can be shared about action taken against another account."] },
    ],
  },
  {
    slug: "creator-payout-guide",
    title: "Creator payout guide",
    description: "Understand the information creators will need for ESB Games payout systems.",
    intro: "Creator payouts are not publicly available yet. They are planned to use verified account, tax and payment information before funds can be released.",
    sections: [
      { heading: "Prepare your account", body: ["Keep your account secure, enable two factor authentication and ensure your creator information is accurate."] },
      { heading: "Payout requirements", body: ["Final payout thresholds, supported regions and verification requirements will be published before public creator payouts launch."] },
    ],
  },
];

export function getSupportArticle(slug: string) {
  return supportArticles.find((article) => article.slug === slug);
}