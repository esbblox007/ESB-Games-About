import type { PolicyRecord } from "../policy-types";
import { reviewHeader } from "../policy-types";

export const cookiePolicyDraft: PolicyRecord = {
  slug: "cookie-policy",
  title: "Cookie Policy",
  category: "Legal",
  markdown: `${reviewHeader("This draft reflects the current About-site language preference and Google Translate implementation. A final production cookie/storage inventory is still required before publication.")}

# Cookie Policy

Cookies, local storage and similar technologies can store or read information on a device. ESB Games should use them only for a clear purpose and should not describe optional tracking as necessary merely because it is useful.

## Current About-site language storage

The About site stores a language choice only after a user deliberately selects one.

* **esb-language** — local storage used to remember the language the user selected.
* **esb-language-source** — local storage used to record that the saved preference came from a manual user choice.
* **googtrans** — a Google Translate preference cookie used when a user selects a supported non-English language. It can be written for the current host and relevant parent domain so the selected translation can persist across ESB Games pages that use the same translation integration.

The site does **not** load Google Translate solely because a browser reports a non-English locale. The third-party translation script is loaded when a user selects a non-English language or returns with a previously saved non-English choice.

Choosing English removes the Google translation preference cookie where the site can do so.

## Strictly necessary technologies

ESB Games may use storage that is necessary to provide a service the user requested, such as security, authentication, fraud prevention, session management, load balancing, or remembering information needed to complete a form or transaction.

Strictly necessary technologies are not used as a label for unrelated behavioural tracking.

## Preferences

Preference storage may remember choices such as language, accessibility or interface settings. Where applicable law requires consent for a persistent preference technology, the choice will be requested before it is set.

A deliberate request to translate the site is treated separately from hidden analytics or advertising tracking. Google may process technical information when its translation service is loaded, so the final Privacy Policy and vendor register must accurately describe that provider relationship.

## Analytics

Analytics may be used to understand reliability and how services are used. If an analytics technology is not exempt from consent requirements in the user's jurisdiction, it will remain disabled until the user makes an appropriate choice.

This draft does not claim that analytics cookies are currently present when they have not been verified in production.

## Advertising and cross-service tracking

ESB Games does not currently describe advertising or cross-site tracking as necessary to use the About website. If advertising, profiling or cross-service tracking is introduced, this policy, the Privacy Policy and any required consent controls must be updated before that processing begins.

## Third-party features

Optional embedded or third-party functionality, including translation, media or external integrations, may set or read storage under the third party's rules. ESB Games should minimise unnecessary third-party storage and obtain consent where required before loading non-essential technology.

## Managing choices

Where a consent manager is required, users should be able to accept or reject non-essential categories with equivalent ease and change their choice later. Browser controls can also delete or block cookies, although blocking necessary storage may prevent some requested functions from working.

A user can reset the ESB Games language preference by selecting English and can also remove the saved browser storage through browser controls.

## Final inventory required

Before publication, ESB Games must run a production cookie/storage audit covering the About website and any other service to which this policy will apply. The final inventory should record the technology or category, provider, purpose, storage type and duration where required.

The published policy must be updated before adding materially different non-essential analytics, advertising or tracking technologies.
`,
};
