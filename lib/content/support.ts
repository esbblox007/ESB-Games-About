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
    description: "Manage an ESB Games subscription, plan or renewal setting.",
    intro: "Subscription controls will be available from the billing area of your ESB Games account.",
    sections: [
      { heading: "Manage your plan", body: ["Sign in to your ESB Games account, open Settings and choose Subscriptions or Billing."], steps: ["Review the active plan.", "Choose Change Plan or Cancel Renewal.", "Read the confirmation details before continuing.", "Keep the confirmation email for your records."] },
      { heading: "Need billing help?", body: ["Submit a Billing and Payments support ticket with the account username and transaction reference. Do not include full card information."] },
    ],
  },
  {
    slug: "request-refund",
    title: "Request a refund",
    description: "Learn what information to provide when asking ESB Games to review a purchase.",
    intro: "Refund eligibility depends on the purchase, account activity and applicable consumer rules.",
    sections: [
      { heading: "Before submitting", body: ["Gather the purchase date, receipt or transaction reference, account username and a clear explanation of the issue."] },
      { heading: "Submit your request", body: ["Open a Billing and Payments ticket through the support page. ESB Games will review the request and reply to the email on the ticket."], steps: ["Choose Billing and Payments.", "Select Refund Request.", "Add the transaction details.", "Submit the ticket and keep the ticket ID."] },
    ],
  },
  {
    slug: "appeal-account-action",
    title: "Appeal an account action",
    description: "Ask ESB Games to review a moderation or account enforcement decision.",
    intro: "Appeals should explain why you believe the decision should be reviewed and include the relevant moderation reference where available.",
    sections: [
      { heading: "What to include", body: ["Provide the username, moderation date, action type and any relevant context. Keep the appeal factual and do not submit duplicate tickets."] },
      { heading: "What happens next", body: ["A member of the Trust and Safety team will review the original action and the information supplied. Submitting an appeal does not guarantee that the action will change."] },
    ],
  },
  {
    slug: "report-player-or-game",
    title: "Report a player or game",
    description: "Report safety, abuse or content concerns to ESB Games.",
    intro: "Use in platform reporting tools whenever they are available. Urgent safety concerns should be sent through the Safety and Abuse support category.",
    sections: [
      { heading: "Useful evidence", body: ["Include usernames, experience names, approximate times, message references and screenshots where appropriate. Do not put yourself at risk to collect evidence."] },
      { heading: "After reporting", body: ["ESB Games reviews reports according to priority and severity. Privacy rules may prevent the team from sharing the exact action taken against another account."] },
    ],
  },
  {
    slug: "creator-payout-guide",
    title: "Creator payout guide",
    description: "Understand the information creators will need for ESB Games payout systems.",
    intro: "Creator payouts are planned to use verified account, tax and payment information before funds can be released.",
    sections: [
      { heading: "Prepare your account", body: ["Keep your account secure, enable two factor authentication and ensure your creator information is accurate."] },
      { heading: "Payout requirements", body: ["Final payout thresholds, supported regions and verification requirements will be published before public creator payouts launch."] },
    ],
  },
];

export function getSupportArticle(slug: string) {
  return supportArticles.find((article) => article.slug === slug);
}
