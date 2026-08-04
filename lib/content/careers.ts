export type Job = {
  slug: string;
  title: string;
  departments: string[];
  location: "Remote";
  type: "Full-time";
  reportsTo: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  desirable: string[];
  eligibility?: string;
  applicationPrompt: string;
};

export const jobs: Job[] = [
  {
    slug: "chief-financial-officer",
    title: "Chief Financial Officer",
    departments: ["Executive Leadership"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Managing Director / Chief Executive Officer",
    summary: "Lead financial planning, budgeting, forecasting and sustainable growth across ESB Games.",
    responsibilities: [
      "Own company budgeting, forecasting and financial planning.",
      "Oversee revenue operations, reporting and financial controls.",
      "Support monetisation strategy, payroll planning and future investment readiness.",
    ],
    requirements: [
      "Strong experience in senior financial leadership or an equivalent operational finance role.",
      "Confidence building budgets, forecasts, controls and clear management reporting.",
      "Ability to explain financial decisions to non-finance leaders.",
    ],
    desirable: ["Experience with gaming, technology, marketplaces or high-growth digital products.", "Experience preparing an organisation for investment or international growth."],
    applicationPrompt: "Share your background in financial leadership, forecasting and operational finance.",
  },
  {
    slug: "chief-technology-officer",
    title: "Chief Technology Officer",
    departments: ["Executive Leadership", "Engineering"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Chief Executive Officer",
    summary: "Define the technology strategy for the ESB Games ecosystem across platform, tooling, infrastructure and security.",
    responsibilities: [
      "Lead platform engineering direction and architecture.",
      "Guide infrastructure, performance, privacy and security priorities.",
      "Build strong engineering practices and long-term technical roadmaps.",
    ],
    requirements: [
      "Senior technical leadership experience across complex products or platforms.",
      "Strong architecture, infrastructure and engineering-management judgement.",
      "Ability to balance shipping speed with safety, reliability and maintainability.",
    ],
    desirable: ["Experience with gaming platforms, creator tooling, real-time systems or large communities.", "Experience scaling distributed engineering teams."],
    applicationPrompt: "Tell us about the platforms or products you have scaled and the teams you have led.",
  },
  {
    slug: "chief-legal-officer",
    title: "Chief Legal Officer",
    departments: ["Executive Leadership"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Chief Executive Officer",
    summary: "Oversee legal strategy, company compliance and the governance needed to support responsible growth.",
    responsibilities: [
      "Support legal operations, policy review and company governance.",
      "Guide commercial agreements, privacy, risk and regulatory readiness.",
      "Help leadership turn legal requirements into practical operating standards.",
    ],
    requirements: [
      "Relevant legal qualifications and experience advising technology or digital businesses.",
      "Strong judgement across privacy, contracts, governance and platform risk.",
      "Ability to communicate complex legal matters clearly and practically.",
    ],
    desirable: ["Experience with gaming, user-generated content, child safety or online marketplaces.", "International regulatory experience."],
    applicationPrompt: "Highlight your experience with platform law, governance or commercial legal work.",
  },
  {
    slug: "chief-product-officer",
    title: "Chief Product Officer",
    departments: ["Executive Leadership", "Product"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Managing Director / Chief Executive Officer",
    summary: "Set the product vision across play, create, connect and family experiences in the ESB Games ecosystem.",
    responsibilities: [
      "Own product direction, prioritisation and roadmap quality.",
      "Work closely with design, engineering, safety and operations.",
      "Keep player, creator and family needs central to product decisions.",
    ],
    requirements: [
      "Senior product leadership experience with evidence of shipping complex products.",
      "Strong prioritisation, user-research and cross-functional leadership skills.",
      "Ability to turn an ambitious vision into staged, measurable delivery.",
    ],
    desirable: ["Experience with gaming, creator tools, communities or marketplaces.", "Experience operating across consumer and internal products."],
    applicationPrompt: "Show us how you have led product strategy and shipped meaningful experiences.",
  },
  {
    slug: "director-of-trust-and-safety",
    title: "Director of Trust & Safety",
    departments: ["Trust & Safety"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Managing Director / Chief Executive Officer",
    summary: "Lead moderation, investigations, safety programmes and platform integrity across ESB Games.",
    responsibilities: [
      "Define safety strategy, enforcement standards and escalation routes.",
      "Own moderation quality, investigations and serious-incident handling.",
      "Work across product and engineering to build safer systems before launch.",
    ],
    requirements: [
      "Substantial trust and safety, moderation, investigations or platform-integrity experience.",
      "Strong judgement in sensitive, high-risk and time-critical situations.",
      "Experience creating clear policies, operational workflows and quality controls.",
    ],
    desirable: ["Experience with youth safety, gaming, social platforms or user-generated content.", "Experience leading distributed safety operations."],
    eligibility: "Applicants must be aged 18 or over because the role may involve reviewing sensitive safety material.",
    applicationPrompt: "Include your experience in moderation, investigations, policy or safety operations.",
  },
  {
    slug: "senior-trust-and-safety-manager",
    title: "Senior Trust & Safety Manager",
    departments: ["Trust & Safety"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Director of Trust & Safety",
    summary: "Support day-to-day trust and safety operations, escalations and moderation effectiveness.",
    responsibilities: [
      "Help manage reviews, investigations and escalations.",
      "Improve moderation workflows and quality controls.",
      "Contribute to enforcement consistency and support readiness.",
    ],
    requirements: [
      "Experience in trust and safety, moderation, investigations or abuse operations.",
      "Clear written communication and strong evidence-based decision-making.",
      "Ability to manage queues, priorities and sensitive escalations.",
    ],
    desirable: ["Experience coaching reviewers or managing moderation quality.", "Knowledge of gaming or creator-platform abuse patterns."],
    eligibility: "Applicants must be aged 18 or over because the role may involve reviewing sensitive safety material.",
    applicationPrompt: "Share examples of moderation leadership, queue management or abuse-prevention work.",
  },
  {
    slug: "quality-assurance-specialist",
    title: "Quality Assurance Specialist",
    departments: ["Engineering"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Chief Technology Officer",
    summary: "Help ensure the ESB Games platform ships with quality, consistency and strong player experiences.",
    responsibilities: [
      "Test platform features, account flows and creator tools.",
      "Document bugs clearly and verify fixes across releases.",
      "Support regression testing, release readiness and test planning.",
    ],
    requirements: [
      "Experience testing websites, applications, games or creator tools.",
      "Strong attention to detail and clear bug-reporting skills.",
      "Ability to reproduce issues and communicate evidence consistently.",
    ],
    desirable: ["Experience with automated testing or accessibility testing.", "Experience testing across browsers, devices and operating systems."],
    applicationPrompt: "Include tools, workflows or products you have tested previously.",
  },
  {
    slug: "policy-developer",
    title: "Policy Developer",
    departments: ["Product"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Chief Product Officer",
    summary: "Develop clear, practical policies that support safety, creators, community standards and responsible product use.",
    responsibilities: [
      "Draft and improve user-facing and operational policies.",
      "Work with trust and safety, product and legal stakeholders.",
      "Turn policy decisions into clear guidance for staff and users.",
    ],
    requirements: [
      "Strong policy-writing, research and structured-thinking skills.",
      "Ability to write accurately for both public and operational audiences.",
      "Confidence working through complex and sometimes sensitive platform questions.",
    ],
    desirable: ["Experience in online safety, gaming, privacy or platform governance.", "Experience translating policy into moderation guidance."],
    applicationPrompt: "Tell us about policy writing, guideline development or standards work you have done.",
  },
  {
    slug: "social-media-lead",
    title: "Social Media Lead",
    departments: ["Marketing"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Managing Director / Chief Executive Officer",
    summary: "Shape the public voice of ESB Games across launch marketing, community growth and creator outreach.",
    responsibilities: [
      "Lead content planning, channel strategy and campaign execution.",
      "Coordinate product updates, creator stories and community messaging.",
      "Build a consistent, professional and recognisable ESB Games voice.",
    ],
    requirements: [
      "Experience planning and running social-media content or campaigns.",
      "Strong writing, creative judgement and platform awareness.",
      "Ability to organise a content calendar and collaborate with multiple teams.",
    ],
    desirable: ["Experience in gaming, entertainment or creator communities.", "Experience using analytics to improve content performance."],
    applicationPrompt: "Show us campaigns, accounts or communities you have helped grow.",
  },
  {
    slug: "marketing-associate",
    title: "Marketing Associate",
    departments: ["Marketing"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Social Media Lead",
    summary: "Support day-to-day marketing execution across social, community, campaign support and launch communications.",
    responsibilities: [
      "Help coordinate posts, assets and messaging.",
      "Support creator and community marketing work.",
      "Track campaign tasks and keep launches organised.",
    ],
    requirements: [
      "Strong written communication and reliable organisation.",
      "Interest in gaming, communities, creators and digital products.",
      "Ability to take feedback and deliver polished work consistently.",
    ],
    desirable: ["Previous social, marketing, design or community experience.", "Basic analytics, editing or content-production skills."],
    applicationPrompt: "Include examples of social, marketing or community work you have contributed to.",
  },
  {
    slug: "senior-operations-manager",
    title: "Senior Operations Manager",
    departments: ["Operations"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Managing Director / Chief Executive Officer",
    summary: "Build strong internal processes, cross-functional coordination and execution discipline across ESB Games.",
    responsibilities: [
      "Coordinate operational planning across teams.",
      "Improve internal processes, ownership and execution quality.",
      "Support launches, internal systems and organisational readiness.",
    ],
    requirements: [
      "Experience managing operations, programmes or cross-functional delivery.",
      "Excellent organisation, documentation and follow-through.",
      "Ability to identify blockers and create practical, scalable processes.",
    ],
    desirable: ["Experience in a startup, gaming or technology environment.", "Experience introducing project-management or operational systems."],
    applicationPrompt: "Outline the teams, processes or operations you have previously managed.",
  },
];

export const careerDepartments = [
  "All",
  "Executive Leadership",
  "Trust & Safety",
  "Engineering",
  "Product",
  "Marketing",
  "Operations",
] as const;

export function getJob(slug: string) {
  return jobs.find((job) => job.slug === slug);
}
