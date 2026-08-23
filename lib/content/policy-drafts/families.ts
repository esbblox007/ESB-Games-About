import type { PolicyRecord } from "../policy-types";
import { reviewHeader } from "../policy-types";

export const familyPolicyDrafts: PolicyRecord[] = [
  {
    slug: "parental-guide",
    title: "Parental Guide",
    category: "Parents & families",
    markdown: `${reviewHeader("This guide is informational rather than a substitute for the Privacy Policy, Terms or feature-specific parental consent flows.")}

# Parental Guide

ESB Games is being built as a connected gaming and creator ecosystem with social, community and user-generated content features. Parents and guardians should understand what parts of the ecosystem a child uses, what communication or spending features are available to that account, and what controls are currently released rather than planned.

## Accounts and age

ESB Games may use date of birth, age band, country and parent or guardian information to provide age-appropriate settings or meet legal requirements. The age at which a young person can consent to data processing, enter a contract or use a particular feature differs by country and feature.

## Communication

Messaging, groups, community spaces and other social features can create both benefits and risks. Where communication controls are available, families should review who can contact the child and how reports or blocks work. Some higher-risk communication features may have additional age or verification requirements.

## Spending

Where purchases become available, families should review purchase approvals, spending limits and account security. ESB Games will not describe a planned spending control as currently available until the feature has actually launched.

## Safety and reports

Use the in-product report tools or Support for harassment, scams, unsafe contact, dangerous content or account-security concerns. Safety and abuse matters may be routed to authorised Trust & Safety staff.

## Privacy

Family linking does not give a parent automatic access to every private communication or safety record. ESB Games must consider the young person's safety and privacy rights, the rights of other people and applicable law.

## Current feature status

Family Centre features should be labelled as available, testing or planned. This guide must be updated before launch if the implementation differs from the descriptions on the Family Centre website.
`,
  },
  {
    slug: "family-centre-guide",
    title: "Family Centre Guide",
    category: "Parents & families",
    markdown: `${reviewHeader("This guide describes the intended linked-account model. Every capability must remain labelled as available, testing or planned until verified in production.")}

# Family Centre Guide

Family Centre is intended to give parents and guardians a clearer way to manage supported settings for linked young-person accounts.

## Linking accounts

The intended flow allows a parent or guardian to receive a secure linking request, sign in or create the appropriate parent account, verify the request where required, and approve the link. ESB Games may require additional checks where necessary to prevent unauthorised linking.

## Controls

Depending on product status and age, Family Centre may include screen-time controls, communication permissions, spending settings, approval requests and activity information. A control is not considered available merely because it appears in a concept image or product roadmap.

## Access and privacy

Linked family accounts should provide only the information needed for the relevant family-control purpose. Parent access does not automatically override a child's rights or expose another person's private information. Safety staff may withhold or limit information where disclosure could create risk or conflict with law.

## Removing a link

The final product must define how links can be removed, what happens when a child reaches an age threshold, and how disputes or unauthorised linking are handled before this guide is published as final.

## Support

Questions or suspected unauthorised linking should use the ESB Games Support route. Sensitive family and safety cases should be handled by staff with the appropriate permissions.
`,
  },
  {
    slug: "screen-time-digital-wellbeing-guide",
    title: "Screen Time & Digital Wellbeing Guide",
    category: "Parents & families",
    markdown: `${reviewHeader("This is general wellbeing guidance and does not make medical claims or promise that every Family Centre control is currently available.")}

# Screen Time & Digital Wellbeing Guide

Healthy use of games depends on the person, their circumstances and the way the service is used. ESB Games aims to support balanced use without presenting one universal time limit as appropriate for everyone.

## Practical habits

Families can consider regular breaks, sleep routines, time for school or work, physical activity, offline relationships and clear expectations around spending and social communication.

## Product controls

Where released, screen-time or bedtime tools can help families apply agreed limits. Planned controls must be clearly labelled until they are available. Product controls should support rather than replace communication between young people and trusted adults.

## Notifications and engagement

ESB Games should avoid designing notifications, rewards or prompts specifically to pressure children into excessive use or spending. Where a feature could materially affect wellbeing, age and design risk should be considered during product review.

## Getting help

If use of games is causing serious distress, conflict or harm, users should consider appropriate offline support from a trusted adult or qualified professional. ESB Games Support can help with account and platform controls but is not a medical service.
`,
  },
  {
    slug: "age-ratings-content-guide",
    title: "Age Ratings & Content Guide",
    category: "Parents & families",
    markdown: `${reviewHeader("The final guide must reflect the rating framework and regional launch model actually adopted by ESB Games; this draft does not invent a certification system.")}

# Age Ratings & Content Guide

ESB Games intends to use age and content information to help users and families understand experiences and to support age-appropriate access.

## Ratings are guidance, not a safety guarantee

A content rating describes expected content and audience suitability. It does not guarantee that every user-generated interaction will be appropriate, and it does not replace moderation, reporting or family settings.

## Content descriptors

Descriptors may cover themes such as violence, fear, language, sexual content, gambling-like mechanics, user interaction, purchases or other material relevant to audience suitability. The final descriptor set will be published once the rating system is approved.

## Creator responsibilities

Creators must answer rating and content questions accurately and update them when an experience materially changes. Deliberately understating content to bypass age or discovery controls may result in enforcement.

## Regional differences

Age-rating requirements and recognised rating bodies vary by country. ESB Games may display different information or apply different access rules by region where required.

## Appeals and corrections

Creators should have a route to request review of a rating or descriptor where they believe it is inaccurate. ESB Games may also re-rate an experience following review, user reports or a material content change.
`,
  },
];
