import type { PolicyRecord } from "../policy-types";
import { reviewHeader } from "../policy-types";

export const creatorPolicyDrafts: PolicyRecord[] = [
  {
    slug: "creator-terms",
    title: "Creator Terms",
    category: "Creators",
    markdown: `${reviewHeader("These draft Creator Terms cover Studio, publishing, collaboration, Marketplace activity and creator payouts. Individual creators and eligible verified groups/organisations are intended to be able to own projects. Final payout, publishing and plugin/API implementation still requires launch review.")}

# Creator Terms

These terms apply to creator and developer features that expressly link to them, including ESB Studio, publishing, creator collaboration, assets, analytics, Marketplace activity and eligible monetisation features.

## Your content and rights

You keep the rights you lawfully hold in original games, code, art, audio, models and other creator content. You are responsible for having the licences or permissions needed for third-party material you import, publish or monetise.

Importing a project from another platform does not transfer or expand third-party rights. You must review licences for code, music, fonts, meshes, images, trademarks and other assets before publishing them on ESB Games.

## Project ownership

A creator project is intended to be ownable by either an eligible individual creator account or an eligible verified group or organisation account.

The recorded project owner controls ownership-level permissions subject to platform rules and any independently binding agreement between collaborators or organisation members. A group or organisation ownership model must not silently convert the personal account of a member into organisation property.

Ownership transfers should require appropriate authorisation, create an auditable record and clearly identify the new owner. Where the owner is a minor or otherwise lacks capacity to enter a required commercial agreement, additional parent, guardian or authorised organisation involvement may be required by law or the applicable payout/publishing terms.

## Licence to operate creator content

By uploading or publishing creator content, you grant ESB Games the limited rights described in the Terms of Service to host, process, display, distribute, moderate, back up and technically adapt the content as needed to operate the service and make it available to the audiences you choose.

Public content may be featured through discovery and reasonable promotional previews. Private projects are not licensed for general advertising merely because they are stored in Studio.

## Collaboration

Project owners and authorised collaborators are responsible for assigning access appropriately. ESB Games may provide roles, permissions, version history and audit tools, but collaborators should not be given more access than necessary.

A collaborator does not automatically obtain ownership of a project merely because they can edit it. Ownership and revenue splits between collaborators should be agreed independently or through platform tools when those tools are available.

## Publishing and review

Publishing may be subject to automated checks, manual review, advisory age/content classification, security checks and Community Standards. ESB Games may hold, restrict or remove an experience where necessary for safety, rights, security or legal compliance.

A content rating is not permission to publish content that is otherwise prohibited, and ESB Games may apply mandatory access controls where law or a specific safety rule requires them.

## Monetisation and Marketplace

Creator monetisation, Marketplace sales and creator payout programmes are intended to be available at public launch, subject to production readiness, eligibility and the separate commercial terms shown to creators.

Draft percentages, internal forecasts and marketing concepts are not binding rates. Before a creator commits to a paid programme, the applicable fee, platform share, taxes, payout conditions and material restrictions should be disclosed.

Creator payouts must be based on qualifying creator proceeds rather than treating every ESBucks balance as cash-redeemable. Purchased, gift-card-funded or peer-to-peer-transferred ESBucks do not automatically become payout-eligible merely because the recipient is a creator.

## Security and technical integrity

Creators must not use Studio, plugins, APIs or published experiences to distribute malware, steal credentials, bypass moderation, create exploit tools, interfere with services or access information without permission.

## Creator analytics

Analytics may include engagement and performance information subject to privacy controls. Creators must not use analytics or developer access to identify users in ways the product does not authorise or to build unauthorised profiles.

## Suspension and appeals

Creator privileges may be restricted for serious or repeated breaches, fraud, rights violations, unsafe content or security abuse. Significant enforcement should provide an appropriate review route where required or reasonably possible. ESB Games does not promise one universal appeal response SLA; applicable legal deadlines take priority.

## Decisions required before publication

1. Confirm public publishing eligibility and the final review model.
2. Confirm the creator payout calculation, platform share and payment-provider flow.
3. Confirm the exact verification and authority rules for groups/organisations that own projects.
4. Confirm any plugin/API-specific licence terms before those systems are public.
`,
  },
  {
    slug: "marketplace-policy",
    title: "Marketplace Policy",
    category: "Creators",
    markdown: `${reviewHeader("The Marketplace is intended to be available at public launch. Listing, payment, moderation, refund, ESBucks lineage and creator-payout flows must be production-ready before this policy becomes operative.")}

# Marketplace Policy

The Marketplace is intended to support eligible virtual items, creator assets and other digital listings at public launch.

## Listing requirements

Sellers must accurately describe what is being offered, use media they are authorised to use, disclose material restrictions and avoid misleading scarcity, pricing, endorsements or performance claims.

Listings must comply with the Community Standards, UGC Guidelines, intellectual-property rules and any category-specific technical requirements.

## Rights

A seller must have the rights needed to list and license an asset. Uploading another person's work, leaked content, copied brands, stolen source files or unlawfully obtained assets is prohibited.

## Pricing and value manipulation

Creators must not manipulate Marketplace rankings, reviews, sales, scarcity, prices or engagement through fake accounts, coordinated transactions, wash trading or deceptive promotions.

## Purchases

The checkout or listing must identify the item, price, currency or ESBucks amount, licence or usage rights where material, and relevant limitations. A buyer should not need to infer essential restrictions from an unrelated document.

Marketplace ESBucks transactions should remain auditable so ESB Games can trace the relevant buyer, seller, amount, source lineage, entitlement and reversal history where needed for support, fraud prevention or legal obligations.

## Moderation

ESB Games may review, restrict or remove listings for safety, rights, fraud, technical or legal reasons. Serious Marketplace enforcement should be auditable and eligible for review where appropriate.

## Refunds and reversals

Refunds, payment reversals and fraudulent transactions may require associated virtual items, ESBucks or seller proceeds to be reversed. Mandatory consumer rights remain unaffected.

## Seller proceeds

A Marketplace sale does not guarantee immediate real-money payout. Creator proceeds may be subject to platform fees, eligibility, fraud review, payout thresholds, tax information, payment-provider requirements and waiting periods disclosed in the applicable creator-payout terms.

Marketplace proceeds that qualify for creator payout should be recorded separately from ordinary purchased, gift-card-funded and peer-to-peer ESBucks so an ordinary transferable balance does not become a general cash-withdrawal facility.

## Final launch requirements

Before this policy is published, ESB Games must approve the seller agreement, buyer licence model, platform fee, refund flow, moderation categories, ESBucks transaction-accounting rules and creator-payout handling.
`,
  },
  {
    slug: "ugc-guidelines",
    title: "UGC Guidelines",
    category: "Creators",
    markdown: `${reviewHeader("These guidelines explain practical content expectations and sit underneath the Community Standards rather than replacing them.")}

# UGC Guidelines

User-generated content includes games, experiences, code, models, plugins, clothing, avatars, images, audio, video, text, reviews, community posts and other material submitted through ESB Games.

## Create what you have the right to use

Use original work, appropriately licensed material or content you otherwise have permission to use. Do not remove attribution or licence notices where a licence requires them.

## Content safety

UGC must comply with the Community Standards. Creators should consider the intended audience, advisory age rating, user interaction and whether an experience introduces foreseeable risks through chat, trading, purchases, external links or user-generated uploads.

An advisory age label does not authorise prohibited content and does not override a mandatory access restriction that ESB Games must apply under law or safety policy.

## Accurate metadata

Titles, descriptions, thumbnails, ratings, tags and promotional materials must not materially mislead users about an experience, item, price, reward, creator identity or official affiliation.

## External links and data collection

Do not direct users to phishing, malware, exploit tools or unsafe off-platform contact. Creator experiences must not collect personal information through hidden forms or external services in ways that bypass ESB Games privacy and safety controls.

## Generative and automated content

Where automated or generative tools are used, the creator remains responsible for rights, safety, accuracy of representations and compliance with platform rules. ESB Games may introduce disclosure requirements for particular categories where needed.

## Moderation

Content may be limited, age-restricted where required, demonetised, removed or otherwise actioned where it breaches applicable rules. Repeated attempts to re-upload prohibited material or bypass moderation may lead to account or creator restrictions.
`,
  },
  {
    slug: "copyright-policy",
    title: "Copyright Policy",
    category: "Creators",
    markdown: `${reviewHeader("The final notice-and-takedown process must be tailored to the legal entities and launch jurisdictions. This draft avoids claiming a US DMCA agent registration that has not been verified.")}

# Copyright Policy

ESB Games respects copyright and expects users to upload only material they are authorised to use.

## Rights reports

A copyright report should identify the protected work, the material complained about, where it appears on ESB Games, the reporter's contact information and a good-faith explanation of why the use is not authorised. ESB Games may request additional information needed to assess a legally valid notice.

## Misrepresentation

Do not knowingly submit false rights reports or use copyright procedures to retaliate against another user. Good-faith mistakes should be distinguished from deliberate abuse.

## Removal and restrictions

Where ESB Games receives a sufficiently supported rights complaint, it may remove or restrict the material, preserve relevant evidence, notify the uploader where appropriate and apply repeat-infringer measures where required by law or policy.

## Counter-notices and disputes

Where applicable law provides a counter-notice or restoration process, ESB Games will explain the required information and consequences. ESB Games cannot decide ownership disputes that require a court or other competent authority.

## Repeat infringement

Accounts or creator privileges may be restricted or terminated for repeated or serious infringement, taking account of valid retractions, counter-notices and the reliability of prior claims.

## Contact

Copyright contact: legal@esbgames.com. The final policy must add any legally required registered agent or service details before publication.
`,
  },
  {
    slug: "trademark-policy",
    title: "Trademark Policy",
    category: "Creators",
    markdown: `${reviewHeader("This draft distinguishes infringement and deceptive affiliation from lawful descriptive or nominative references.")}

# Trademark Policy

Users must not use trademarks, logos, trade dress or names in a way that falsely suggests sponsorship, endorsement, ownership or official affiliation.

## Generally acceptable references

A truthful descriptive reference to a brand, criticism, commentary, comparison, fan discussion or other lawful use is not automatically prohibited merely because it mentions a trademark. Context and applicable law matter.

## Prohibited uses

Do not create fake official accounts, misleading verification-style branding, counterfeit virtual items, deceptive Marketplace listings or other uses likely to confuse users about source or affiliation.

## Reporting

A trademark report should identify the mark, registration details where relevant, the complained-of material and the basis for the claimed confusion or infringement. ESB Games may request evidence of authority to act for the rights holder.

## Enforcement

ESB Games may remove or restrict confusing or infringing uses while preserving legitimate commentary and descriptive uses where appropriate. Complex ownership disputes may need to be resolved by the relevant parties or a competent authority.
`,
  },
  {
    slug: "brand-guidelines",
    title: "Brand Guidelines",
    category: "Creators",
    markdown: `${reviewHeader("This guide governs public presentation of ESB Games branding and should be updated whenever the official asset kit changes.")}

# Brand Guidelines

ESB Games branding may be used only in ways that do not mislead people about ownership, employment, partnership, verification or endorsement.

## Official identity

Use current official logos and names without distorting proportions, recolouring marks in ways that imply a different official variant, or combining the mark with another organisation's logo to imply a partnership that does not exist.

## Community and creator references

Creators may accurately say that an experience is available on ESB Games or was built with ESB Studio where that is true. Do not describe yourself as 'official ESB Games', 'ESB Games staff', 'partnered with ESB Games' or similar unless that status has actually been granted.

## Verification and staff badges

Do not copy ESB Games verification marks, staff badges or safety indicators in a way that could cause users to believe an account, item or message has official status.

## Press and commercial use

Press, sponsorship, merchandise and large-scale commercial uses may require additional permission. Contact legal@esbgames.com where the use could reasonably imply a formal commercial relationship.
`,
  },
];
