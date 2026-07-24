export type PublicationState =
  | "Draft"
  | "In Review"
  | "Awaiting Approval"
  | "Scheduled"
  | "Published"
  | "Archived"
  | "Unpublished"
  | "Failed";

export interface RichTextSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  href?: string;
}

export type RichText = string | RichTextSpan[];

export type ArticleBlock =
  | { type: "paragraph"; text: RichText; size?: "small" | "normal" | "large"; align?: "left" | "center" | "right"; spacing?: "compact" | "normal" | "roomy" }
  | { type: "heading"; level: 2 | 3 | 4; text: string; id?: string; align?: "left" | "center" | "right" }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "divider" }
  | { type: "image"; src: string; alt: string; caption?: string; width?: "content" | "wide" | "full" }
  | { type: "gallery"; images: Array<{ src: string; alt: string; caption?: string }> }
  | { type: "video"; provider: "youtube" | "vimeo" | "file"; url: string; title: string; caption?: string }
  | { type: "callout"; tone?: "info" | "success" | "warning"; title?: string; text: string }
  | { type: "code"; language?: string; code: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "button"; label: string; href: string; variant?: "primary" | "secondary" };

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  body: ArticleBlock[];
  coverImage?: string;
  coverImageAlt?: string;
  coverVideo?: string;
  author: string;
  category: string;
  tags: string[];
  publicationState: PublicationState;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
  canonicalUrl?: string;
  publishedAt: string;
  updatedAt?: string;
  relatedSlugs: string[];
  locale: string;
  translationGroupId?: string;
  readingTime: number;
  preview?: boolean;
}

export interface NewsListResult {
  articles: NewsArticle[];
  total: number;
  categories: string[];
  configured: boolean;
  unavailable: boolean;
}

export type DownloadReleaseState = "Unavailable" | "Early Access" | "Beta" | "Stable" | "Paused";

export interface DownloadRelease {
  id: string;
  productSlug: string;
  platform: "Windows" | "macOS" | "Linux" | "Web";
  architecture?: string;
  version?: string;
  state: DownloadReleaseState;
  fileUrl?: string;
  releaseDate?: string;
  minimumRequirements?: string[];
  releaseNotesUrl?: string;
  checksum?: string;
  signed?: boolean;
}

export interface DownloadProduct {
  id: string;
  slug: "play-platform" | "studio";
  name: string;
  description: string;
  icon: "play" | "studio";
  learnMoreHref: string;
  releases: DownloadRelease[];
}

export type SearchResultType = "Page" | "News" | "Help" | "Download" | "Careers" | "Legal" | "Support" | "Creator";

export interface SearchDocument {
  id: string;
  type: SearchResultType;
  title: string;
  description: string;
  route: string;
  category: string;
  locale: string;
  keywords: string[];
  synonyms: string[];
  questions: string[];
  content: string;
  priority: number;
}

export interface SearchResult extends SearchDocument {
  score: number;
  matchedText?: string;
}
