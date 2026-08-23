export type PolicyRecord = {
  slug: string;
  title: string;
  category: string;
  markdown: string;
};

export const REVIEW_DRAFT_VERSION = "Phase 2 review draft · 23 August 2026";

export function reviewHeader(summary: string) {
  return `> **Review status:** Not yet in effect. This draft is being reviewed for factual, operational and legal accuracy before publication.\n\n**Draft version:** ${REVIEW_DRAFT_VERSION}\n\n**Proposed effective date:** Not set\n\n${summary}`;
}
