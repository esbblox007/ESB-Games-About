export type SupportFieldType = "text" | "textarea" | "select" | "date";

export type SupportField = {
  name: string;
  label: string;
  type: SupportFieldType;
  required?: boolean;
  options?: readonly string[];
  placeholder?: string;
  help?: string;
  maxLength?: number;
  fullWidth?: boolean;
};

export type SupportCategoryDefinition = {
  id: string;
  label: string;
  description: string;
  fields: readonly SupportField[];
};

const accountOwnerOptions = [
  "My own account",
  "My child's account as their parent or guardian",
  "A creator, group or organisation I am authorised to represent",
  "Another person's account with their permission",
  "I am not contacting you about a specific account",
] as const;

export const supportCategoryDefinitions: readonly SupportCategoryDefinition[] = [
  {
    id: "account-access",
    label: "Account & Access",
    description: "Login, account recovery, verification, security and access concerns.",
    fields: [
      {
        name: "issueType",
        label: "What do you need help with?",
        type: "select",
        required: true,
        options: [
          "I cannot log in",
          "I believe an account has been compromised",
          "Email, username or account details",
          "Two-factor authentication or device verification",
          "Parental linking or age-related access",
          "Account restriction or appeal",
          "Another account access issue",
        ],
      },
      {
        name: "accountOwner",
        label: "Who is the affected account for?",
        type: "select",
        required: true,
        options: accountOwnerOptions,
      },
      {
        name: "affectedAccount",
        label: "Affected username or account ID",
        type: "text",
        placeholder: "Enter the username or account ID, if known",
        help: "Do not enter a password, backup code or verification code.",
        maxLength: 160,
      },
      {
        name: "emailAccess",
        label: "Can you access the email currently linked to the account?",
        type: "select",
        required: true,
        options: ["Yes", "No", "I am not sure", "Not applicable"],
      },
      {
        name: "lastAccessDate",
        label: "When did you last successfully access the account?",
        type: "date",
      },
      {
        name: "details",
        label: "Describe the issue and any changes you noticed",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 10000,
        placeholder: "Explain what happened, when it began, any error shown, and the steps you have already tried.",
      },
      {
        name: "requestedOutcome",
        label: "What would you like the support team to help you with?",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 3000,
        placeholder: "For example: restore access, secure the account, update an account detail or explain a restriction.",
      },
    ],
  },
  {
    id: "billing-payments",
    label: "Billing & Payments",
    description: "Payments, subscriptions, ESBucks, refunds and transaction concerns.",
    fields: [
      {
        name: "issueType",
        label: "What do you need help with?",
        type: "select",
        required: true,
        options: [
          "Payment failed or was declined",
          "Charge I do not recognise",
          "Refund request",
          "Subscription issue",
          "ESBucks purchase or balance issue",
          "Creator payout or earnings issue",
          "Another billing or payment issue",
        ],
      },
      {
        name: "affectedAccount",
        label: "Username or account ID",
        type: "text",
        placeholder: "Enter the account connected to the transaction, if known",
        maxLength: 160,
      },
      {
        name: "transactionReference",
        label: "Transaction, receipt or order reference",
        type: "text",
        placeholder: "Enter the reference shown on your receipt, if available",
        help: "Never include a full payment-card number or security code.",
        maxLength: 200,
      },
      {
        name: "transactionDate",
        label: "Transaction date",
        type: "date",
      },
      {
        name: "amount",
        label: "Amount and currency",
        type: "text",
        placeholder: "For example: £9.99 GBP",
        maxLength: 80,
      },
      {
        name: "paymentMethod",
        label: "Payment method or provider",
        type: "select",
        options: ["Card", "Apple Pay", "Google Pay", "Stripe checkout", "App store purchase", "Other", "Not sure"],
      },
      {
        name: "details",
        label: "Describe the billing or payment issue",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 10000,
        placeholder: "Explain what you expected to happen, what actually happened, and any error or receipt information that may help us investigate.",
      },
      {
        name: "requestedOutcome",
        label: "What resolution are you requesting?",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 3000,
        placeholder: "For example: explain a charge, correct a balance, review a refund request or restore a subscription benefit.",
      },
    ],
  },
  {
    id: "creator-developer",
    label: "Creator & Developer Support",
    description: "ESB Studio, publishing, creator tools, UGC, APIs and programme support.",
    fields: [
      {
        name: "issueType",
        label: "Which creator area is affected?",
        type: "select",
        required: true,
        options: [
          "ESB Studio",
          "Experience publishing or updates",
          "UGC or marketplace content",
          "Creator account or verification",
          "Creator earnings or monetisation",
          "API, data or integration",
          "Group or collaborative project",
          "Another creator or developer issue",
        ],
      },
      {
        name: "affectedAccount",
        label: "Creator username, group or studio name",
        type: "text",
        placeholder: "Enter the creator, group or organisation involved",
        maxLength: 200,
      },
      {
        name: "contentReference",
        label: "Experience, asset, upload or project ID",
        type: "text",
        placeholder: "Enter any relevant ID or public link",
        maxLength: 500,
      },
      {
        name: "environment",
        label: "Tool, version or environment",
        type: "text",
        placeholder: "For example: ESB Studio version, operating system or API environment",
        maxLength: 240,
      },
      {
        name: "details",
        label: "Describe the creator or developer issue",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 10000,
        placeholder: "Explain the workflow, what you expected, what happened instead, and any error message or moderation decision shown.",
      },
      {
        name: "stepsTried",
        label: "What have you already tried?",
        type: "textarea",
        fullWidth: true,
        maxLength: 3000,
        placeholder: "List any troubleshooting, republishing, permissions checks or other steps already attempted.",
      },
      {
        name: "requestedOutcome",
        label: "What help do you need from ESB Games?",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 3000,
      },
    ],
  },
  {
    id: "safety-abuse",
    label: "Safety & Abuse",
    description: "Harassment, exploitation, dangerous content, abuse and urgent safety concerns.",
    fields: [
      {
        name: "issueType",
        label: "What are you reporting?",
        type: "select",
        required: true,
        options: [
          "Harassment, bullying or threats",
          "Sexual or exploitative content or behaviour",
          "Hate, discrimination or extremist content",
          "Self-harm, suicide or immediate wellbeing concern",
          "Personal information or privacy exposure",
          "Scam, fraud or impersonation",
          "Inappropriate experience, image, audio or UGC",
          "Child-safety concern",
          "Another safety or abuse concern",
        ],
      },
      {
        name: "urgency",
        label: "How urgent is this concern?",
        type: "select",
        required: true,
        options: [
          "Immediate danger or risk of serious harm",
          "Ongoing or recent serious concern",
          "Not immediate, but needs review",
          "Historical concern or supporting information",
        ],
        help: "Contact local emergency services immediately if someone is in immediate danger.",
      },
      {
        name: "reportedParty",
        label: "Reported username, group, experience or content reference",
        type: "text",
        placeholder: "Enter usernames, IDs or links that help identify the content or account",
        maxLength: 1000,
      },
      {
        name: "incidentDate",
        label: "When did the incident happen?",
        type: "date",
      },
      {
        name: "platformReportReference",
        label: "Existing in-platform report reference",
        type: "text",
        placeholder: "Enter the report ID, if you already submitted one",
        maxLength: 200,
      },
      {
        name: "details",
        label: "Describe what happened",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 12000,
        placeholder: "Describe the behaviour or content, where it happened, who was involved, and why you are concerned. Do not include unnecessary personal information.",
      },
      {
        name: "actionsTaken",
        label: "What actions have already been taken?",
        type: "textarea",
        fullWidth: true,
        maxLength: 3000,
        placeholder: "For example: blocked the user, left the experience, submitted an in-platform report or contacted a parent, school or emergency service.",
      },
      {
        name: "requestedOutcome",
        label: "What support or safeguarding action are you requesting?",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 3000,
      },
    ],
  },
  {
    id: "technical-issues",
    label: "Technical Issues",
    description: "Bugs, crashes, performance, compatibility and service problems.",
    fields: [
      {
        name: "affectedService",
        label: "Which product or service is affected?",
        type: "select",
        required: true,
        options: ["Play Platform", "ESB Games Player", "ESB Studio", "Creator Hub", "Family Centre", "About website", "Backend or staff tools", "Another service"],
      },
      {
        name: "issueType",
        label: "What type of problem are you experiencing?",
        type: "select",
        required: true,
        options: ["Page or feature not loading", "Crash or freeze", "Performance or lag", "Installation or update", "Login or session error", "Data not saving or syncing", "Visual or accessibility issue", "Another technical issue"],
      },
      {
        name: "device",
        label: "Device",
        type: "text",
        required: true,
        placeholder: "For example: Windows PC, MacBook, iPhone, Android tablet or games console",
        maxLength: 200,
      },
      {
        name: "environment",
        label: "Operating system, browser or app version",
        type: "text",
        required: true,
        placeholder: "For example: Windows 11, Edge 150, ESB Studio 1.0",
        maxLength: 240,
      },
      {
        name: "stepsToReproduce",
        label: "Steps to reproduce the issue",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 7000,
        placeholder: "List the exact steps that cause the problem, in order.",
      },
      {
        name: "expectedOutcome",
        label: "What did you expect to happen?",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 3000,
      },
      {
        name: "details",
        label: "What happened instead?",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 7000,
        placeholder: "Include the full error message, frequency, timing and whether the issue happens every time.",
      },
      {
        name: "stepsTried",
        label: "Troubleshooting already attempted",
        type: "textarea",
        fullWidth: true,
        maxLength: 3000,
      },
    ],
  },
  {
    id: "something-else",
    label: "Something Else",
    description: "Questions or requests that do not fit another support category.",
    fields: [
      {
        name: "issueType",
        label: "What is your request about?",
        type: "select",
        required: true,
        options: ["General account or platform question", "Partnership or organisation enquiry", "Accessibility request", "Privacy or data request", "Feedback or suggestion", "Legal or policy question", "Another request"],
      },
      {
        name: "affectedAccount",
        label: "Relevant username, account, organisation or reference",
        type: "text",
        maxLength: 300,
      },
      {
        name: "details",
        label: "Describe your request",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 10000,
        placeholder: "Provide the background, relevant dates or references, and the exact question or request you would like us to review.",
      },
      {
        name: "requestedOutcome",
        label: "What response or action are you requesting?",
        type: "textarea",
        required: true,
        fullWidth: true,
        maxLength: 3000,
      },
    ],
  },
] as const;

export function getSupportCategoryDefinition(categoryId: string) {
  return supportCategoryDefinitions.find((category) => category.id === categoryId) ?? null;
}

export function buildSupportTicketDescription(form: FormData, categoryId: string) {
  const category = getSupportCategoryDefinition(categoryId);
  if (!category) throw new Error("Choose a valid support category.");

  const lines: string[] = [
    "SUPPORT REQUEST DETAILS",
    "",
    `Category: ${category.label}`,
    `Subject: ${cleanFormValue(form, "subject")}`,
  ];

  for (const field of category.fields) {
    const value = cleanFormValue(form, field.name);
    if (field.required && !value) throw new Error(`Complete the “${field.label}” field.`);
    if (!value) continue;
    if (field.maxLength && value.length > field.maxLength) throw new Error(`“${field.label}” is too long.`);
    lines.push("", `${field.label}:`, value);
  }

  lines.push(
    "",
    "SECURITY NOTICE",
    "The requester was instructed not to include passwords, one-time codes, backup codes or full payment-card information.",
  );

  const description = lines.join("\n").trim();
  if (description.length > 20000) throw new Error("The completed support request is too long. Shorten some responses and try again.");
  return description;
}

function cleanFormValue(form: FormData, name: string) {
  return String(form.get(name) ?? "").replace(/\r\n/g, "\n").trim();
}
