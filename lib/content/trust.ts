export type TrustResource = {
  slug: string;
  title: string;
  description: string;
  href: string;
};

export type TrustSection = {
  id: string;
  title: string;
  description: string;
  resources: TrustResource[];
};

const resource = (slug: string, title: string, description: string, href: string): TrustResource => ({ slug, title, description, href });

export const trustSections: TrustSection[] = [
  {
    id: "rules-privacy",
    title: "Rules & privacy",
    description: "The three documents most people need to understand their rights and responsibilities.",
    resources: [
      resource("terms", "Terms of Service", "The agreement governing access to ESB Games services.", "/terms-of-service"),
      resource("privacy", "Privacy Policy", "How ESB Games handles personal information and privacy choices.", "/privacy-policy"),
      resource("community-standards", "Community Standards", "The rules for behaviour and content across ESB Games.", "/community-standards"),
    ],
  },
  {
    id: "safety-decisions",
    title: "Safety & decisions",
    description: "The core routes for protection, reporting and reviewing platform decisions.",
    resources: [
      resource("child-safety", "Child Safety", "Safeguards and expectations for children, families and creators.", "/child-safety"),
      resource("reporting-enforcement", "Reporting & Enforcement", "How reports are reviewed and platform rules are enforced.", "/reporting-enforcement-policy"),
      resource("appeals", "Appeals Policy", "How eligible platform decisions can be challenged.", "/appeals-policy"),
    ],
  },
];
