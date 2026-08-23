import type { PolicyRecord } from "./policy-types";
import { reviewHeader } from "./policy-types";
import { corePolicyDrafts } from "./policy-drafts/core";
import { cookiePolicyDraft } from "./policy-drafts/cookie";
import { safetyPolicyDrafts } from "./policy-drafts/safety";
import { familyPolicyDrafts } from "./policy-drafts/families";
import { commercialPolicyDrafts } from "./policy-drafts/commercial";
import { creatorPolicyDrafts } from "./policy-drafts/creators";
import { privacySecurityPolicyDrafts } from "./policy-drafts/privacy-security";

export type { PolicyRecord } from "./policy-types";

const interimSafetyCentreRecord: PolicyRecord = {
  slug: "safety-centre",
  title: "Safety Centre",
  category: "Safety",
  markdown: `${reviewHeader("The practical Safety Centre is /trust/safety. This legacy policy-style route is retained only while the information architecture is being consolidated and should redirect to the canonical Safety Centre in Phase 3.")}

# Safety Centre route consolidation

The practical ESB Games Safety Centre is available at /trust/safety and covers prevention, detection, enforcement, appeals and family safety information.

This legacy route should not become a second competing Safety Centre. It remains in the review dataset only so existing links do not silently disappear before the redirect is implemented.
`,
};

const coreWithoutCookie = corePolicyDrafts.filter((policy) => policy.slug !== "cookie-policy");

export const policyDocuments: PolicyRecord[] = [
  ...coreWithoutCookie,
  cookiePolicyDraft,
  ...commercialPolicyDrafts,
  ...safetyPolicyDrafts,
  interimSafetyCentreRecord,
  ...familyPolicyDrafts,
  ...creatorPolicyDrafts,
  ...privacySecurityPolicyDrafts,
];

export const policyBySlug: Record<string, PolicyRecord> = Object.fromEntries(
  policyDocuments.map((policy) => [policy.slug, policy]),
);
