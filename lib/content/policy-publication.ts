import { policyDocuments } from "./policies-data";

export type PolicyPublicationState = "prelaunch" | "published";

/**
 * Policies fail closed. A document is only rendered/indexed as an effective public
 * policy after its slug is explicitly added to PUBLISHED_POLICY_SLUGS following
 * the ESB Games approval process. Draft source text remains available to the team
 * without being exposed as an effective public agreement.
 */
const PUBLISHED_POLICY_SLUGS = new Set<string>([
  "terms-of-service",
]);

export function getPolicyPublicationState(slug: string): PolicyPublicationState {
  return PUBLISHED_POLICY_SLUGS.has(slug) ? "published" : "prelaunch";
}

export function isPublishedPolicy(slug: string) {
  return getPolicyPublicationState(slug) === "published";
}

export function isKnownPolicySlug(slug: string) {
  return policyDocuments.some((policy) => policy.slug === slug);
}

export const publishedPolicyDocuments = policyDocuments.filter((policy) => isPublishedPolicy(policy.slug));
