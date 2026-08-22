export const ESB_BRAND = {
  name: "ESB Games",
  tagline: "Discover. Belong. Build.",
  taglineSentence: "discover, belong and build",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com",
  platformUrl: "https://esbgames.com",
  familyUrl: "https://family.esbgames.com",
  statusUrl: "https://status.esbgames.com",
} as const;

export const PRODUCT_STATE = {
  available: "Available now",
  development: "In development",
  planned: "Planned",
} as const;

export type ProductState = keyof typeof PRODUCT_STATE;
