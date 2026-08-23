import type { PolicyRecord } from "../policy-types";
import { reviewHeader } from "../policy-types";

export const commercialPolicyDrafts: PolicyRecord[] = [
  {
    slug: "payment-terms",
    title: "Payment Terms",
    category: "Legal",
    markdown: `${reviewHeader("Payments are not treated as fully launched by this draft. Final processor, merchant-of-record and checkout details must be confirmed before publication.")}

# Payment Terms

These terms apply to purchases made directly through an ESB Games checkout that links to them. Third-party stores or payment platforms may apply their own terms in addition to mandatory rights.

## Clear price information

Before a user is charged, checkout should clearly show the item or service, total price and currency, taxes or fees where required, whether the charge repeats, the billing frequency, material restrictions and any relevant cancellation or refund information.

## Payment authorisation

You must use a payment method you are authorised to use. ESB Games or its payment providers may request authentication, refuse a transaction or reverse a transaction where reasonably necessary to prevent fraud, comply with law or correct an error.

## Payment information

Where possible, full payment-card information should be handled by authorised payment providers rather than stored by ESB Games. ESB Games may retain transaction identifiers, amount, currency, entitlement, status, billing country and other records needed for support, fraud prevention, accounting and legal obligations.

## Minors and family controls

Purchases by children or teenagers must comply with applicable law and any parental or family-control requirements. Family controls do not remove statutory rights relating to unauthorised transactions.

## Errors and duplicate charges

If a user is charged incorrectly or receives the wrong entitlement, ESB Games should investigate and correct the issue. Users should not exploit pricing, currency or entitlement errors and may be required to return value incorrectly credited, subject to applicable law.

## Chargebacks and disputes

A chargeback does not automatically prove wrongdoing. ESB Games may investigate disputed transactions, restrict suspicious transaction activity and provide relevant records to payment providers. Account action should be proportionate and should not be used to deter a user from exercising lawful payment rights.

## Taxes

Prices may include or exclude taxes depending on the jurisdiction and checkout display. Creators or organisations receiving payouts remain responsible for their own tax obligations unless law requires ESB Games to withhold or report amounts.

## Consumer rights

These terms do not exclude statutory rights for defective, misdescribed, unauthorised or undelivered digital content or services. Refund and cancellation rights may differ by country, product type and whether digital supply began with the user's express request.

## Decisions required before publication

1. Confirm payment processor(s), merchant-of-record model and supported currencies.
2. Confirm whether ESB Games itself or a third party is the seller for each purchase flow.
3. Confirm the final fraud, family-approval and receipt processes.
`,
  },
  {
    slug: "refund-policy",
    title: "Refund Policy",
    category: "Legal",
    markdown: `${reviewHeader("This draft preserves mandatory consumer remedies and avoids promising one universal refund window before launch checkout flows are final.")}

# Refund Policy

ESB Games wants refund handling to be understandable and consistent while preserving rights users receive under applicable law.

## Statutory rights come first

Nothing in this policy removes a refund, repair, replacement, cancellation, withdrawal or other remedy that cannot lawfully be excluded. Digital-content and service rights differ by jurisdiction and circumstances.

## When a refund may be available

A refund or other remedy may be appropriate where a user was charged without authorisation, charged more than once, did not receive the purchased entitlement, received digital content or a service that materially failed to match what was promised, or has a statutory cooling-off or cancellation right that still applies.

ESB Games may also offer discretionary refunds in additional circumstances, but a discretionary decision in one case does not create a general entitlement for unrelated cases.

## Digital content and immediate supply

Some laws allow a consumer to request immediate access to digital content while acknowledging that a statutory cancellation right may change or end once supply begins. ESB Games must present any required acknowledgement clearly at checkout rather than hiding it in this policy.

## Virtual currency and consumed items

Use or consumption of ESBucks or a virtual item may affect discretionary refund eligibility, but it does not remove mandatory remedies. ESB Games may reverse associated virtual value where a purchase is refunded, reversed or found to be fraudulent, provided the action is lawful and proportionate.

## Subscriptions

Subscription refunds and cancellation rights depend on the billing model and applicable law. Renewal reminders, cooling-off rights, easy cancellation and overpayment refunds will be handled as required when subscriptions launch.

## How to request help

Users should use the official Support route and provide the transaction identifier, approximate date, item and reason for the request. Do not send full card details.

## Timing and method

Where law sets a refund deadline or required payment method, ESB Games will follow it. Otherwise, approved refunds should be processed without unreasonable delay to the original payment method where practical.

## Third-party stores

Purchases made through an app store, console store or other third-party merchant may need to be refunded through that provider's process. This does not reduce rights the user has against the responsible trader under applicable law.
`,
  },
  {
    slug: "subscription-terms",
    title: "Subscription Terms",
    category: "Legal",
    markdown: `${reviewHeader("Subscriptions are not treated as public/live by this draft. These terms must be updated against the checkout implementation and laws in force immediately before launch.")}

# Subscription Terms

These terms will apply to recurring ESB Games plans only when a subscription checkout expressly links to them.

## Before subscribing

Checkout must clearly show the plan, included benefits, price and currency, billing frequency, minimum commitment if any, trial or introductory pricing, the date a paid period begins, automatic-renewal behaviour and how to cancel.

A marketing page is not a substitute for the information required at checkout.

## Renewals

If a plan renews automatically, ESB Games will provide renewal information and reminders where required by law. Users should not be forced to navigate an unreasonable cancellation process merely because sign-up was easy.

## Cancellation

The final product should provide an accessible online cancellation route for subscriptions purchased directly from ESB Games. Cancellation should stop future renewal charges subject to any clearly disclosed minimum term and mandatory law.

Where law requires an end-of-contract acknowledgement, cooling-off notice, refund of overpayment or other confirmation, ESB Games will provide it within the required timeframe.

## Trials and promotional pricing

Before a free or reduced-price period converts to a paid plan, users must be told the amount that will be charged and when. Any reminder obligations applicable to the launch jurisdiction must be implemented in the product, not merely written into policy.

## Benefit changes

ESB Games may improve or change subscription benefits, but material detrimental changes to a paid plan may require notice, cancellation rights, continued access or another remedy depending on the contract and applicable law.

## Failed payments

A failed renewal may result in a grace period, suspension of paid benefits or cancellation. The product should avoid unnecessary repeated charging attempts and should explain any grace period clearly.

## Refunds

The Refund Policy and mandatory consumer law apply. A statement that subscription fees are 'non-refundable' must not be used where a statutory refund or cancellation right may apply.

## Third-party billing

Subscriptions bought through an app store or other merchant may be managed and cancelled through that provider. The responsible seller and cancellation route must be shown before purchase.

## Decisions required before publication

1. Confirm final plan names, prices and billing periods.
2. Confirm whether trials or annual plans will exist at launch.
3. Confirm direct-vs-third-party billing routes.
4. Recheck UK subscription-law commencement and launch-country requirements immediately before enabling recurring billing.
`,
  },
  {
    slug: "esbucks-virtual-currency-policy",
    title: "ESBucks & Virtual Currency Policy",
    category: "Legal",
    markdown: `${reviewHeader("This draft deliberately avoids promising convertibility, payout rates or transfer rights before the ESBucks economy and creator-payout programme are final.")}

# ESBucks & Virtual Currency Policy

ESBucks are intended to be a virtual feature used within the ESB Games ecosystem. The final product design, purchase availability, transfer rules and creator-economy connections must be confirmed before this policy becomes effective.

## Nature of ESBucks

Unless applicable law requires otherwise, ESBucks are a limited licence to access eligible digital features. They are not legal tender, a bank deposit, an investment, electronic money representation or ownership interest in ESB Games.

Users do not have a general right to exchange ESBucks for cash merely because a separate creator payout programme may allow eligible creators to receive real-world payouts under different terms.

## Purchasing ESBucks

If direct purchases launch, checkout must show the amount of ESBucks, real-money price, currency, taxes or fees where required and material restrictions. Promotional or bonus ESBucks should be clearly distinguished where their rules differ.

## Spending and virtual items

ESBucks may be used only for eligible platform features identified by ESB Games. Virtual items and entitlements are licensed for use within the service and do not give the user ownership of ESB Games software or another creator's intellectual property.

## Transfers and trading

Transfers, gifts, Marketplace transactions or group funds may be limited by age, fraud controls, account standing, product rules and regional requirements. Users must not create unauthorised exchanges, sell accounts, launder value, manipulate prices or use ESBucks to facilitate scams.

## Errors, fraud and reversals

ESB Games may correct balances resulting from duplicate credits, technical errors, refunded transactions, unauthorised purchases, fraud or prohibited activity. Corrections should be supported by records and applied proportionately. Mandatory consumer rights remain unaffected.

## Expiry and inactive accounts

The final policy must state whether purchased or promotional ESBucks can expire. ESB Games should not introduce expiry silently after purchase. Any dormancy rule must be disclosed before it applies and reviewed for consumer-law fairness.

## Creator payouts are separate

A creator payout programme, if launched, will have eligibility, identity, tax, fraud, minimum-balance and payment-provider requirements. An ESBucks balance alone does not guarantee payout eligibility or a fixed cash conversion rate.

## Minors

Purchases and transfers involving minors may be subject to parental approvals, spending controls and additional restrictions. Those controls do not remove rights relating to unauthorised purchases.

## Decisions required before publication

1. Confirm whether purchased ESBucks expire.
2. Confirm transfer/gifting rules and whether peer-to-peer transfer will exist.
3. Confirm creator-payout eligibility and whether any public conversion rate will be promised.
4. Confirm refund/reversal handling for Marketplace transactions.
`,
  },
];
