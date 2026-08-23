import type { PolicyRecord } from "../policy-types";
import { reviewHeader } from "../policy-types";

export const safetyPolicyDrafts: PolicyRecord[] = [
  {
    slug: "child-safety",
    title: "Child Safety Policy",
    category: "Safety",
    markdown: `${reviewHeader("This policy describes ESB Games' intended child-safety framework. It must be checked against the final age-assurance, reporting and Family Centre implementation before publication.")}

# Child Safety Policy

ESB Games is being designed for an audience that can include children and teenagers. Child safety therefore affects product design, privacy, moderation, communications, creator rules, support and family controls rather than existing as a single moderation rule.

## Best interests and age-appropriate design

Where a service is likely to be accessed by children, ESB Games should consider children's best interests, use age-appropriate information, minimise unnecessary collection of children's data, and apply protective defaults appropriate to the risk of the feature.

## Prohibited conduct

ESB Games prohibits child sexual exploitation and abuse, grooming, sexual extortion, requests for sexual material from minors, sexualised content involving minors, trafficking or facilitation of exploitation, and attempts to move a child into unsafe off-platform contact for exploitative purposes.

We may also restrict adult-minor interactions, sexual content, private communications, gifting, trading, discovery or other features where necessary to reduce foreseeable risk.

## Detection and reporting

Safety systems may combine user reports, staff review, technical signals and automated detection. Automated systems may prioritise or flag content but should not be treated as infallible evidence.

Where ESB Games becomes aware of apparent child sexual exploitation, imminent danger or another matter requiring external reporting, information may be preserved and disclosed to competent authorities or recognised reporting organisations where required or lawfully justified.

## Family and parental controls

Family Centre is intended to provide linked-account tools, approvals, spending controls, communication settings and activity information as those capabilities become available. A parent or guardian does not automatically receive unrestricted access to a child's private communications or safety evidence. Disclosure must take account of the child's safety, privacy rights, other people's rights and applicable law.

## Privacy and data minimisation

Age assurance should be proportionate to the feature and risk. ESB Games should not collect identity documents or biometric data merely because a lower-risk age signal would be sufficient. Where stronger assurance is required, retention and access should be minimised.

## Creators and experiences

Creators must not design experiences to sexualise or exploit children, encourage dangerous private contact, evade age restrictions or manipulate children into purchases or disclosure of unnecessary personal information. Age ratings, discovery controls and monetisation rules may impose additional requirements.

## Emergency situations

ESB Games is not an emergency service. Where a report appears to involve imminent risk of death, serious injury or child exploitation, staff may take accelerated protective action and contact appropriate external authorities where lawful and appropriate.

## Review and accountability

Child-safety rules, risk assessments and controls should be reviewed as the platform changes. Serious enforcement decisions should be auditable, and affected users should have appropriate review routes unless an exception is necessary for safety, law or investigation integrity.
`,
  },
  {
    slug: "reporting-enforcement-policy",
    title: "Reporting & Enforcement Policy",
    category: "Safety",
    markdown: `${reviewHeader("This draft aligns public reporting with the private support and departmental-routing model. Final SLA language must not be added unless ESB Games has approved and can measure it.")}

# Reporting & Enforcement Policy

Users can report content, accounts, experiences, messages, transactions or conduct through the reporting and support routes made available in the relevant product.

## How reports are routed

Reports should be classified by issue type and routed to staff or systems authorised for that function. Private support tickets are access-controlled. Safety and abuse cases may be restricted to authorised Trust & Safety staff; billing matters may be restricted to staff with the relevant financial/support permissions.

A report being visible to an authorised queue does not mean every staff member can access the underlying evidence.

## What to include

Provide enough information to identify the issue, such as account names, experience or asset identifiers, approximate time, relevant messages and a concise explanation. Attach evidence only where relevant. Never send passwords, one-time codes or full payment-card numbers.

## Assessment

ESB Games may consider the reported material, surrounding context, account history, age and audience, severity, intent, likelihood of harm, authenticity and reliability of evidence, and whether similar conduct is repeated or coordinated.

Automated detection may assist prioritisation and enforcement, but material decisions should receive human review where required by law or appropriate to the risk.

## Possible actions

Depending on the issue, actions may include no action, education or warning, content removal, age or visibility restrictions, communication limits, transaction holds, experience restrictions, temporary suspension, permanent account termination, or referral to an external authority where required or appropriate.

Measures should be proportionate to the evidence and risk. A severe safety or security threat may justify immediate temporary restrictions while an investigation continues.

## Notice

Where required or reasonably appropriate, ESB Games will provide notice of significant enforcement and identify the rule or reason at a useful level of detail. Notice may be limited where more detail would expose another person's private information, enable abuse, compromise security or an investigation, or conflict with law.

## Misuse of reporting

Good-faith mistakes, disagreement with a decision and reports that cannot be substantiated are not automatically abuse. Deliberately false, retaliatory, automated or spam reporting may itself be restricted.

## Evidence preservation

Relevant records may be preserved for appeals, safeguarding, fraud prevention, security, legal obligations and legal claims. Retention must follow the Privacy Policy and Data Retention Policy.
`,
  },
  {
    slug: "appeals-policy",
    title: "Appeals Policy",
    category: "Safety",
    markdown: `${reviewHeader("This draft establishes a review route without promising a fixed response time that ESB Games has not operationally approved.")}

# Appeals Policy

Where an enforcement or account decision is eligible for appeal, ESB Games will provide a route to ask for review.

## What can be appealed

Eligible matters may include significant account restrictions, content or experience removal, marketplace or creator enforcement, and other decisions identified in the notice given to the user. Some temporary security measures may need to remain in place while review occurs.

## Submitting an appeal

An appeal should identify the decision, explain why the user believes it was wrong or disproportionate, and provide any relevant new context or evidence. Appeals must not include threats, fabricated evidence or confidential credentials.

## Review

Where practicable, an appeal should be reviewed by a person who can reassess the evidence and policy application rather than merely repeating the original decision. The reviewer may uphold, modify or reverse the action, or request more information.

## Time limits

Any final appeal deadline must be clearly stated in the original enforcement notice or applicable policy. This draft does not invent a universal deadline before ESB Games has approved one for each decision type.

## Repeated appeals

Users do not need to submit repeated identical appeals while one is pending. ESB Games may close duplicate or abusive submissions, but should consider genuinely new evidence or a material change in circumstances.

## External rights

The appeal process does not remove rights that users may have to complain to a regulator, use a statutory dispute process or bring a claim in a competent court.
`,
  },
];
