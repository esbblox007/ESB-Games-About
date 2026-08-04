import "server-only";
import { contentBackendConfigured, contentSelect } from "./supabase";
import type { DownloadProduct, DownloadRelease, DownloadReleaseState } from "./types";

interface ReleaseRow {
  id: string | number;
  product_slug: "play-platform" | "studio";
  platform: "Windows" | "macOS" | "Linux" | "Web";
  architecture?: string | null;
  version?: string | null;
  release_state?: DownloadReleaseState | null;
  file_url?: string | null;
  release_date?: string | null;
  minimum_requirements?: string[] | null;
  release_notes_url?: string | null;
  checksum?: string | null;
  signed?: boolean | null;
  available?: boolean | null;
}

function cleanUrl(value: unknown) {
  if (typeof value !== "string") return undefined;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : undefined;
  } catch {
    return undefined;
  }
}

const productDefinitions: Omit<DownloadProduct, "releases">[] = [
  {
    id: "play-platform",
    slug: "play-platform",
    name: "ESB Games Play Platform",
    description: "Discover, install and play ESB Games experiences through the official player platform.",
    icon: "play",
    learnMoreHref: "/",
  },
  {
    id: "studio",
    slug: "studio",
    name: "ESB Studio",
    description: "Build, test and publish experiences with the official ESB Games creation software.",
    icon: "studio",
    learnMoreHref: "/developer-hub",
  },
];

function mapRelease(row: ReleaseRow): DownloadRelease {
  return {
    id: String(row.id),
    productSlug: row.product_slug,
    platform: row.platform,
    architecture: row.architecture || undefined,
    version: row.version || undefined,
    state: row.release_state || "Unavailable",
    fileUrl: row.available ? cleanUrl(row.file_url) : undefined,
    releaseDate: row.release_date || undefined,
    minimumRequirements: Array.isArray(row.minimum_requirements) ? row.minimum_requirements : undefined,
    releaseNotesUrl: cleanUrl(row.release_notes_url),
    checksum: row.checksum || undefined,
    signed: typeof row.signed === "boolean" ? row.signed : undefined,
  };
}

export async function getDownloadProducts(): Promise<{
  products: DownloadProduct[];
  configured: boolean;
  unavailable: boolean;
}> {
  if (!contentBackendConfigured) {
    return {
      products: productDefinitions.map((product) => ({ ...product, releases: [] })),
      configured: false,
      unavailable: false,
    };
  }

  try {
    const rows = await contentSelect<ReleaseRow>(
      "download_releases",
      "select=*&order=product_slug.asc,platform.asc,release_date.desc",
      { revalidate: 300, tags: ["downloads"] },
    );
    return {
      products: productDefinitions.map((product) => ({
        ...product,
        releases: rows.filter((row) => row.product_slug === product.slug).map(mapRelease),
      })),
      configured: true,
      unavailable: false,
    };
  } catch {
    return {
      products: productDefinitions.map((product) => ({ ...product, releases: [] })),
      configured: true,
      unavailable: true,
    };
  }
}
