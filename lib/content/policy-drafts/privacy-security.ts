import type { PolicyRecord } from "../policy-types";
import { reviewHeader } from "../policy-types";

export const privacySecurityPolicyDrafts: PolicyRecord[] = [
  {
    slug: "data-requests",
    title: "Data Requests",
    category: "Privacy & security",
    markdown: `${reviewHeader("This draft provides a rights-request route without promising a response period different from the period required by applicable law.")}

# Data Requests

Depending on where you live and how ESB Games uses your information, you may have rights to access, correct, delete, restrict, object to processing, receive portable information, withdraw consent, or ask for review of certain automated decisions.

## How to make a request

Use the privacy or data-request route made available by ESB Games, or contact privacy@esbgames.com. Describe what you are asking for and provide enough information to locate the relevant account or records.

## Identity verification

ESB Games may take proportionate steps to verify identity or authority before disclosing or changing personal information. Verification should be no more intrusive than necessary for the risk of the request.

## Children and representatives

A child may have privacy rights independently of a parent or guardian. A parent, guardian or authorised representative may be able to act for another person where applicable law permits it, but ESB Games may require evidence of authority and must consider the rights and safety of the person concerned.

## Exceptions

A request may be limited where law permits or requires, for example to protect another person's rights, preserve safeguarding or fraud records, comply with legal obligations, establish or defend legal claims, or avoid disclosing information that would prejudice an investigation.

## Complaints

If you disagree with the handling of a privacy request, contact privacy@esbgames.com. UK users may also complain to the Information Commissioner's Office; users elsewhere may have access to their local supervisory authority.
`,
  },
  {
    slug: "data-retention-policy",
    title: "Data Retention Policy",
    category: "Privacy & security",
    markdown: `${reviewHeader("This public policy sets retention principles. Exact internal periods must be approved in an operational retention schedule before publication.")}

# Data Retention Policy

ESB Games should not keep personal information indefinitely merely because storage is inexpensive. Retention depends on the purpose, sensitivity, legal obligations, safety needs and whether a record is still reasonably required.

## Retention principles

Records should have an owner, purpose and review or deletion rule. Retention should be longer only where justified by matters such as account security, fraud prevention, safeguarding, financial records, legal obligations, disputes, intellectual-property claims or enforcement history.

## Typical record groups

Account information may be retained while an account is active and for a limited period afterwards where needed for recovery, safety, fraud or legal purposes. Transaction records may need longer retention for tax, accounting, chargeback and consumer-law reasons. Support and safety records may have different periods depending on case severity and safeguarding needs. Careers records should follow a recruitment-specific schedule.

## Deleted content and backups

Deleting content from an active product does not always remove every backup copy instantly. Backup information should remain protected, should not be restored into ordinary active use without a valid reason, and should age out through the normal backup lifecycle.

## Legal holds

Deletion may be suspended for particular records where they are reasonably required for litigation, regulatory requests, investigations, safeguarding or another legal obligation. A legal hold should be scoped rather than used as a reason to keep unrelated information indefinitely.

## Anonymisation

Information that has been genuinely anonymised so individuals are no longer identifiable may be retained for analytics, security or service improvement without being treated as personal information.

## Decision required before publication

Approve an internal schedule covering at minimum: active/inactive account records, authentication and security logs, support tickets, Trust & Safety evidence, appeals, transaction records, creator/Marketplace records, Family Centre records, careers applications, newsletter records if launched, backups and legal holds.
`,
  },
  {
    slug: "security-policy",
    title: "Security Policy",
    category: "Privacy & security",
    markdown: `${reviewHeader("This is a public security principles statement, not a disclosure of sensitive defensive controls or a certification claim.")}

# Security Policy

ESB Games uses a defence-in-depth approach intended to protect accounts, services and information while the platform develops.

## Access control

Administrative and staff access should follow least-privilege principles, role-based permissions and separate staff authentication where appropriate. Higher-risk staff access should use strong authentication, device approval and auditable activity.

## Data protection

Sensitive records, private support evidence and internal administrative data should not be exposed through public URLs or broad database permissions. Encryption in transit should be used for public services, and production credentials must not be embedded in client-side code.

## Secure development

Changes should be reviewed, tested and deployed through controlled environments. Dependencies, secrets, database permissions and production logs should be monitored for material security issues. Security fixes should be prioritised according to risk.

## Account security

Users should use unique passwords and available multi-factor authentication. ESB Games may revoke sessions, require re-verification or temporarily restrict access where there is credible evidence of compromise.

## Incident response

Security incidents should be contained, investigated and documented. Affected users, regulators or other parties should be notified where required by law or where notification is appropriate to help reduce harm.

## No certification claims

This policy does not claim that ESB Games is certified to a particular standard unless the relevant certification has actually been obtained and remains current.
`,
  },
  {
    slug: "responsible-disclosure-policy",
    title: "Responsible Disclosure Policy",
    category: "Privacy & security",
    markdown: `${reviewHeader("This draft creates a good-faith reporting channel but does not create a paid bug-bounty promise or blanket authorisation for intrusive testing.")}

# Responsible Disclosure Policy

ESB Games welcomes good-faith reports that help us identify and fix security vulnerabilities.

## How to report

Send a clear report to security@esbgames.com with the affected service, steps to reproduce, expected impact and enough technical detail for investigation. Avoid sending unnecessary personal information or live credentials.

## Good-faith research

Researchers should avoid privacy violations, disruption, data destruction, denial-of-service activity, social engineering, physical attacks, automated scanning that materially affects service availability, and accessing more data than needed to demonstrate the issue.

If you encounter another person's data, stop testing that path and report the issue without copying or retaining unnecessary information.

## Disclosure

Give ESB Games a reasonable opportunity to investigate and remediate before public disclosure. ESB Games should communicate in good faith about validation and remediation where doing so does not create additional security risk.

## Rewards

Unless ESB Games separately announces a bug-bounty programme with written eligibility and reward terms, submitting a vulnerability does not create a right to payment.

## Safe-harbour position

A final safe-harbour statement should be reviewed by legal counsel before publication. This draft does not promise immunity from law or third-party claims, but ESB Games intends to distinguish good-faith security research from malicious exploitation when applying its own platform rules.
`,
  },
  {
    slug: "accessibility-statement",
    title: "Accessibility Statement",
    category: "Privacy & security",
    markdown: `${reviewHeader("This statement describes an accessibility direction and feedback route without claiming WCAG conformance that has not been independently verified.")}

# Accessibility Statement

ESB Games aims to make its public websites and products usable by as many people as reasonably possible, including people who use keyboards, screen readers, zoom, alternative input methods or other assistive technologies.

## Current approach

Public interfaces should use semantic structure, keyboard-accessible controls, visible focus states, sufficient text contrast, descriptive labels and responsive layouts. Important information should not depend on colour alone.

## Product development

Accessibility should be considered during design and QA rather than added only after launch. New creator and player features may require additional work for complex 3D, game or user-generated interfaces.

## Conformance

ESB Games should not state that a website or product fully conforms to WCAG or another accessibility standard until that level has been evaluated with appropriate testing. Known limitations should be documented rather than hidden.

## Feedback

Users who encounter an accessibility barrier can contact Support and describe the page, feature, device or assistive technology involved. Accessibility reports should be routed to the team able to investigate the underlying product issue.

## Alternative access

Where reasonably possible, ESB Games should provide an alternative way to access important account, support, legal or transaction information while a reported accessibility issue is being addressed.
`,
  },
];
