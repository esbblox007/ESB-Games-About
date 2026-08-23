# ESB Games Phase 2 — Cross-Policy Red Team

Date: 23 August 2026
Status: Internal review gate

This review tests the Phase 2 policy set against itself and against the current About-site product state. A pass below means the draft has been made internally consistent on that point; it is not a statement of external legal approval.

## Contract and publication

- **PASS — no backdated effective date.** Phase 2 drafts use a review-draft marker and `Proposed effective date: Not set`.
- **PASS — no unpublished-policy incorporation trap.** The Terms say feature-specific documents apply only after they are published or otherwise validly presented to the user.
- **PASS — no privacy-by-contract shortcut.** Privacy notices are not converted into blanket consent by acceptance of the Terms.
- **PASS — mandatory rights preserved.** Consumer, privacy, child-safety, regulator and court rights that cannot lawfully be excluded are expressly preserved.
- **OPEN — contracting entity.** Exact legal entity and service/registered address must be confirmed.
- **OPEN — governing law / courts.** Final wording must be selected after the contracting entity and launch model are confirmed.

## Age, children and families

- **PASS — no universal 13+ legal rule.** Drafts distinguish contract, privacy-consent and feature-specific age requirements.
- **PASS — parental involvement is not unlimited surveillance.** Family linking does not automatically expose private messages, safety evidence or another person's information.
- **PASS — Family Centre feature status remains conditional.** Planned controls are not described as already released in policy.
- **PASS — no fake COPPA/GDPR certification badge language.** The drafts describe safeguards and legal obligations rather than self-awarded compliance certification.
- **OPEN — launch age/content framework.** The actual rating/descriptors and launch-country model must be selected.
- **OPEN — external child-safety escalation process.** Operational ownership and reporting routes need final internal approval.

## Support and Trust & Safety

- **PASS — private ticket model matches product architecture.** Support data is routed by function and access is permission-based; a safety ticket is not described as visible to all support staff.
- **PASS — point-of-collection notice added.** The Support page links a dedicated Support Privacy Notice before the ticket UI.
- **PASS — no blanket consent.** Ticket submission is described as case processing, not consent to unrelated marketing or reuse.
- **PASS — no invented SLA.** Reporting and Appeals drafts avoid fixed response times that operations have not approved.
- **PASS — human review language is risk-based.** Automated detection may assist, but high-impact decisions are not presented as infallible automation.
- **OPEN — appeal windows.** If ESB Games wants fixed public appeal deadlines, operations must approve them by decision type.

## Careers

- **PASS — notice is operationally usable now.** Careers Privacy Notice explains applicant data, purposes, access, transfers, retention criteria, automation and rights.
- **PASS — acknowledgement is not consent fiction.** Version acknowledgement is expressly separated from lawful bases for required recruitment processing.
- **PASS — unnecessary sensitive data discouraged.** Applicants are told not to submit medical, criminal-history, payment-card or unrelated sensitive information unless a later lawful step specifically requires it.
- **OPEN — controller details.** Main Privacy Policy still needs the final legal controller identity and address.
- **OPEN — recruitment retention period.** A system-enforced internal schedule should be approved rather than inventing a public number.

## Privacy and cookies

- **PASS — data categories cover actual ecosystem scope.** Account, security, social/community, creator, transaction, support/safety, family and careers information are included.
- **PASS — lawful basis is purpose-specific.** Contract, legal obligation, legitimate interests, consent and vital interests are not treated as interchangeable.
- **PASS — marketing consent separated.** Optional marketing/analytics/advertising choices do not gate unrelated core service processing.
- **PASS — translation behaviour hardened.** Browser locale alone no longer triggers Google Translate. A non-English third-party translation is loaded only after an explicit saved/manual language choice.
- **PASS — implementation-specific storage documented.** Cookie draft names `esb-language`, `esb-language-source` and `googtrans` and explains when Google Translate is loaded.
- **OPEN — production vendor/subprocessor register.** Providers and roles need internal approval before the main Privacy Policy becomes final.
- **OPEN — international transfer map.** Final safeguards depend on controller/provider locations.
- **OPEN — lawful-basis register.** Operational processing purposes should be mapped internally before publication.
- **OPEN — production cookie/storage scan.** Final inventory must be generated from deployed services before publication.

## Retention and security

- **PASS — retention is not fictional precision.** Public drafts use purpose-based criteria rather than claiming periods the systems do not yet enforce.
- **PASS — backups and legal holds are distinguished from ordinary active retention.**
- **PASS — no security certification claim.** Security Policy describes controls without claiming ISO/SOC/Cyber Essentials or another certification that has not been verified.
- **PASS — responsible disclosure is not an implied bounty.** No payment or safe-harbour promise is made without a separately approved programme.
- **OPEN — internal retention schedule.** Must cover accounts, logs, Support, T&S, appeals, transactions, creators, Family Centre, Careers, backups and legal holds.

## Payments, subscriptions and ESBucks

- **PASS — statutory remedies preserved.** Refund Policy does not use a blanket `non-refundable` rule.
- **PASS — digital-content withdrawal wording is conditional.** Any required immediate-supply acknowledgement must appear at checkout, not be buried in policy.
- **PASS — subscriptions are conditional on launch.** No plan, price, trial or renewal model is invented.
- **PASS — launch-time law recheck required.** Subscription wording explicitly requires a fresh legal/product review immediately before recurring billing is enabled.
- **PASS — ESBucks are separated from creator payouts.** Holding ESBucks does not itself promise cash conversion or payout eligibility.
- **PASS — no invented creator conversion rate or revenue share.**
- **OPEN — seller / merchant-of-record model.**
- **OPEN — payment processor(s) and purchase channels.**
- **OPEN — subscription model and launch countries.**
- **OPEN — ESBucks expiry, gifting/transfers and payout eligibility.**

## Creators, Marketplace and IP

- **PASS — creators keep original rights.** Platform licence is limited to operation, safety, discovery and reasonable promotion of public content.
- **PASS — imported projects do not import licences.** Creator Terms explicitly say cross-platform import does not grant permission for third-party code, assets, audio, marks or other material.
- **PASS — collaboration access is not automatic ownership.**
- **PASS — draft monetisation figures are not promises.**
- **PASS — Marketplace wash trading/manipulation/scams are addressed.**
- **PASS — Copyright Policy does not claim an unverified DMCA-agent registration.**
- **PASS — Trademark Policy distinguishes deceptive affiliation from lawful descriptive/commentary use.**
- **OPEN — project ownership model.** Decide whether verified organisations/groups can legally own projects or only administer projects owned by individuals/entities.
- **OPEN — creator monetisation/Marketplace launch state and commercial terms.**
- **OPEN — plugin/API terms.** Add before those interfaces are public.
- **OPEN — jurisdiction-specific copyright notice process.** Confirm after launch jurisdictions/entity are known.

## Accessibility

- **PASS — accessibility is a commitment to process, not a fake certification.** The draft does not claim verified WCAG conformance.
- **PASS — feedback and alternative-access principles included.**
- **OPEN — conformance statement.** Publish a verified level only after testing supports it.

## Duplicate / information-architecture issues

- **KNOWN PHASE 3 ITEM — Safety Centre.** `/trust/safety` is the intended canonical practical Safety Centre. The legacy `/safety-centre` record is explicitly marked for route consolidation rather than being allowed to evolve into a competing policy page.

## Final Phase 2 blockers

The policy set is internally hardened enough for preview/review, but final publication should remain blocked until these decision groups are resolved:

1. Legal entity, address, governing law and jurisdiction.
2. Privacy controller/DPO-or-representative position, vendor register, transfer map, lawful-basis register and retention schedule.
3. Paid-product model: merchant of record, processors, subscriptions, launch countries, ESBucks expiry/transfers and creator payouts.
4. Creator ownership/publishing/Marketplace/API model.
5. Safety appeal windows, external child-safety escalation ownership and age-rating model.
6. Copyright jurisdiction/agent requirements.

After those decisions, perform qualified legal review of the binding Terms, main Privacy Policy, child-safety framework and consumer payment/subscription documents before moving their slugs into the published-policy allowlist.
