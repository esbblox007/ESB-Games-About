import type { PolicyRecord } from "../policy-types";
import { reviewHeader } from "../policy-types";

export const commercialPolicyDrafts: PolicyRecord[] = [
  {
    slug: "payment-terms",
    title: "Payment Terms",
    category: "Legal",
    markdown: `${reviewHeader("Real-money purchases, ESBucks purchases, subscriptions, Marketplace purchases, gift cards and creator payouts are all intended to be available at public launch. Final payment processor, merchant-of-record, supported-country and regulatory-perimeter details still require confirmation before publication.")}

# Payment Terms

These terms are intended to apply to eligible purchases made directly through an ESB Games checkout that links to them. Third-party stores, retailers or payment platforms may apply their own terms in addition to mandatory rights.

## Launch payment scope

ESB Games currently intends the public launch payment model to include real-money purchases, purchases of ESBucks, subscriptions, Marketplace purchases, ESB Games gift cards and eligible creator payouts. A feature must not be represented as available until its production checkout, fraud controls, support flow and required legal review are ready.

## Clear price information

Before a user is charged, checkout should clearly show the item or service, total price and currency, taxes or fees where required, whether the charge repeats, the billing frequency, material restrictions and any relevant cancellation or refund information.

## Payment authorisation

You must use a payment method you are authorised to use. ESB Games or its payment providers may request authentication, refuse a transaction, place a transaction into review or reverse a transaction where reasonably necessary to prevent fraud, comply with law or correct an error.

## Payment information

Where possible, full payment-card information should be handled by authorised payment providers rather than stored by ESB Games. ESB Games may retain transaction identifiers, amount, currency, entitlement, status, billing country and other records needed for support, fraud prevention, accounting and legal obligations.

## Minors and family controls

Purchases by children or teenagers must comply with applicable law and any parental or family-control requirements. Family controls do not remove statutory rights relating to unauthorised transactions.

## Errors and duplicate charges

If a user is charged incorrectly or receives the wrong entitlement, ESB Games should investigate and correct the issue. Users should not exploit pricing, currency or entitlement errors and may be required to return value incorrectly credited, subject to applicable law.

## Chargebacks and disputes

A chargeback does not automatically prove wrongdoing. ESB Games may investigate disputed transactions, restrict suspicious transaction activity and provide relevant records to payment providers. Account action should be proportionate and should not be used to deter a user from exercising lawful payment rights.

## Taxes

Prices may include or exclude taxes depending on the jurisdiction and checkout display. Creators or organisations receiving payouts remain responsible for their own tax obligations unless law requires ESB Games or a payment provider to withhold or report amounts.

## Consumer rights

These terms do not exclude statutory rights for defective, misdescribed, unauthorised or undelivered digital content or services. Refund and cancellation rights may differ by country, product type and whether digital supply began with the user's express request.

## Decisions required before publication

1. Confirm payment processor(s), merchant-of-record model, supported currencies and launch countries.
2. Confirm whether ESB Games itself or a third party is the seller for each purchase flow.
3. Confirm the final fraud, family-approval, receipt and creator-payout processes.
4. Complete a UK payments/e-money regulatory-perimeter review of the ESBucks, gift-card, Marketplace and peer-to-peer transfer model before those features are enabled.
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

Use or consumption of ESBucks or a virtual item may affect discretionary refund eligibility, but it does not remove mandatory remedies. ESB Games may reverse associated virtual value where a purchase is refunded, reversed or found to be fraudulent, provided the action is lawful, traceable and proportionate.

## Gift cards

ESB Games will not impose an expiry date or dormancy fee on ESB Games gift cards. Refund rights for the original purchase may depend on where and how the card was bought, whether it has been redeemed, and applicable law. A refund or reversal may require associated ESBucks or entitlements to be removed where lawful.

## Subscriptions

Subscription refunds and cancellation rights depend on the billing model and applicable law. Renewal reminders, cooling-off rights, easy cancellation and overpayment refunds will be handled as required when subscriptions launch.

## How to request help

Users should use the official Support route and provide the transaction identifier, approximate date, item and reason for the request. Do not send full card details.

## Timing and method

Where law sets a refund deadline or required payment method, ESB Games will follow it. Otherwise, approved refunds should be processed without unreasonable delay to the original payment method where practical.

## Third-party stores

Purchases made through an app store, console store, retailer or other third-party merchant may need to be refunded through that provider's process. This does not reduce rights the user has against the responsible trader under applicable law.
`,
  },
  {
    slug: "subscription-terms",
    title: "Subscription Terms",
    category: "Legal",
    markdown: `${reviewHeader("Subscriptions are intended to be available at public launch. These terms must still be checked against the final checkout implementation, plan catalogue, billing providers and laws in force immediately before recurring billing is enabled.")}

# Subscription Terms

These terms will apply to recurring ESB Games plans when a subscription checkout expressly links to them.

## Before subscribing

Checkout must clearly show the plan, included benefits, price and currency, billing frequency, minimum commitment if any, trial or introductory pricing, the date a paid period begins, automatic-renewal behaviour and how to cancel.

A marketing page is not a substitute for the information required at checkout.

## Renewals

If a plan renews automatically, ESB Games will provide renewal information and reminders where required by law. Users should not be forced to navigate an unreasonable cancellation process merely because sign-up was easy.

## Cancellation

The product should provide an accessible online cancellation route for subscriptions purchased directly from ESB Games. Cancellation should stop future renewal charges subject to any clearly disclosed minimum term and mandatory law.

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
    slug: "gift-card-terms",
    title: "Gift Card Terms",
    category: "Legal",
    markdown: `${reviewHeader("ESB Games gift cards are intended to be purchasable with real-world money and to have no expiry date. Retail, processor, fraud and jurisdiction-specific terms still require final implementation review.")}

# Gift Card Terms

ESB Games gift cards are intended to let a purchaser obtain prepaid value that can be redeemed into eligible ESB Games value or entitlements.

## No expiry

ESB Games will not impose an expiry date on an ESB Games gift card. ESB Games will also not impose a dormancy fee merely because a valid card has not yet been redeemed.

Once a gift card is redeemed into ESBucks, those ESBucks do not expire.

## Purchase and redemption

The purchase page, packaging or receipt should clearly identify the value, currency, redemption method, regional restrictions if any and where to obtain support. A card may be subject to activation or anti-fraud checks before redemption.

## Protect the code

A gift-card code should be treated like a bearer credential until redeemed. Users should not share the code publicly. ESB Games may be unable to replace value that was voluntarily disclosed and redeemed by another person unless applicable law or the facts require a different result.

## Fraud and stolen cards

ESB Games may delay, block, reverse or investigate redemption where there is evidence of theft, unauthorised payment, chargeback, duplication, tampering or fraud. Any action should be supported by records and preserve mandatory consumer rights.

## Cash redemption

Gift cards and redeemed ESBucks are intended for use within the ESB Games ecosystem and are not generally redeemable for cash merely because an eligible creator payout programme exists. Any cash-redemption right required by applicable law will be honoured.

## Retail partners

Where a gift card is sold by a retailer or third-party merchant, that seller may have separate purchase or refund obligations. ESB Games should clearly identify which party is responsible for the original retail transaction.
`,
  },
  {
    slug: "esbucks-virtual-currency-policy",
    title: "ESBucks & Virtual Currency Policy",
    category: "Legal",
    markdown: `${reviewHeader("ESBucks are intended to launch with purchase, gift-card redemption, earning, Marketplace use and peer-to-peer transfer. ESBucks never expire. The final UK regulatory perimeter, transfer controls and creator-payout separation require specialist review before launch.")}

# ESBucks & Virtual Currency Policy

ESBucks are intended to be transferable virtual platform value used within the ESB Games ecosystem for eligible digital features, Marketplace activity and peer-to-peer transfers.

## Nature of ESBucks

Unless applicable law requires otherwise, ESBucks are a limited platform entitlement for use within ESB Games. ESB Games does not market an ESBucks balance as a bank account, savings product, legal tender or investment.

Users do not have a general right to exchange an ordinary ESBucks balance for cash merely because a separate creator payout programme may allow eligible creators to receive real-world payouts under different terms.

The legal and regulatory classification of the final launch model must be reviewed before purchased stored value and peer-to-peer transfers are enabled.

## How ESBucks are obtained

A user's visible ESBucks balance may include value obtained in three principal ways:

1. **Gift Card** — ESBucks credited from redemption of an ESB Games gift card purchased with real-world money.
2. **Purchased** — ESBucks bought directly through an authorised ESB Games purchase flow.
3. **Earned** — ESBucks awarded or earned through eligible creator, Marketplace, platform, event or reward activity.

These are user-facing economic source categories. Internal technical corrections, refunds and reversals are audit events rather than a new economic source category.

## Immutable transaction lineage

Every ESBucks credit, debit and transfer should create an auditable ledger record. The internal ledger should preserve the source of value, relevant prior transaction references, sender and recipient account references where applicable, amount, time, status and reason or product context.

A peer-to-peer transfer should not erase where the transferred value originated. Where a balance contains more than one source category, the system should preserve the source composition or underlying lots according to a documented accounting rule so investigators can trace the value chain.

## No expiry

ESBucks do not expire, regardless of whether they were obtained from a gift card, purchased directly or earned. ESB Games will not apply a dormancy fee simply because ESBucks remain unused.

If an account is lawfully closed or restricted, that does not convert ESBucks into cash. Any treatment of remaining value must follow applicable law, the reason for closure and the relevant account or enforcement process.

## Purchasing ESBucks

Checkout must show the amount of ESBucks, real-money price, currency, taxes or fees where required and material restrictions before purchase.

## Peer-to-peer transfers

Users are intended to be able to transfer ESBucks directly to other eligible ESB Games users. Small, ordinary and low-risk transfers may complete immediately. Higher-value, unusual or higher-risk transfers may enter a **Pending** state while automated or staff checks are completed.

Transfer review can consider amount, velocity, account age, compromise indicators, unusual recipient patterns, chargeback exposure, fraud reports, sanctions or legal restrictions and other proportionate risk signals. ESB Games does not need to publish one universal fraud threshold that would make controls easier to evade.

A transfer may be delayed, rejected, reversed or frozen where reasonably necessary to investigate fraud, account compromise, unlawful activity, an erroneous transaction or a valid payment reversal. Records should explain the action and preserve available appeal or support routes where appropriate.

## Marketplace and spending

ESBucks may be used only for eligible platform features identified by ESB Games. Virtual items and entitlements are licensed for use within the service and do not give the user ownership of ESB Games software or another creator's intellectual property.

Marketplace purchases and creator proceeds should remain traceable to the underlying transaction. Users must not use coordinated transfers, fake sales, wash trading, account networks or circular transactions to disguise the source of value or manipulate creator earnings.

## Creator payouts are a separate earnings system

A creator payout programme is intended to be available at launch, but payout eligibility must be based on qualifying creator proceeds rather than treating every transferred ESBucks balance as cash-redeemable.

Purchased ESBucks, gift-card-funded ESBucks and ordinary peer-to-peer transfers do not automatically become eligible for real-world withdrawal simply because the recipient is a creator. The creator earnings ledger should separately identify qualifying proceeds from legitimate eligible activity and apply identity, tax, fraud, minimum-balance, holding-period and payment-provider requirements.

## Errors, fraud and reversals

ESB Games may correct balances resulting from duplicate credits, technical errors, refunded transactions, unauthorised purchases, fraud or prohibited activity. Corrections should be supported by immutable records and applied proportionately. Mandatory consumer rights remain unaffected.

## Minors

Purchases and transfers involving minors may be subject to parental approvals, spending controls and additional restrictions. Those controls do not remove rights relating to unauthorised purchases.

## Regulatory review gate

Before public launch, ESB Games should obtain specialist advice on whether the final UK model falls within the Payment Services Regulations, Electronic Money Regulations or an available exclusion such as a limited-network arrangement, including any notification obligations triggered by transaction volume.

## Decisions required before publication

1. Confirm the operational transfer-risk thresholds and who can release a pending transfer.
2. Confirm the exact creator-payout eligibility calculation and whether a public conversion rate will be promised.
3. Confirm Marketplace refund/reversal handling and how reversed source lots propagate through the ledger.
4. Complete and document the UK payments/e-money perimeter review before enabling public purchase and peer-to-peer transfer.
`,
  },
];
