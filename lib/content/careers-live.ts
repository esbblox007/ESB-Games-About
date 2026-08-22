import "server-only";
import { contentSelect } from "./supabase";

export type Job = {
  slug: string;
  title: string;
  departments: string[];
  location: string;
  type: string;
  reportsTo: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  desirable: string[];
  eligibility?: string;
  applicationPrompt: string;
};

export type ApplicationField = {
  id?: string;
  key?: string;
  internalKey?: string;
  title?: string;
  label?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  recruiterOnly?: boolean;
};

export type CareerConsent = {
  id: string;
  title: string;
  version?: number;
  content?: unknown;
  required: boolean;
};

export type LiveJob = Job & {
  jobId: string;
  applicationFormVersionId: string;
  applicationFields: ApplicationField[];
  consents: CareerConsent[];
  closingDate?: string;
  featured?: boolean;
};

type JobRow = Record<string, unknown>;

function blockLists(value: unknown) {
  const output: Record<string, string[]> = {};
  if (!Array.isArray(value)) return output;
  for (const raw of value) {
    if (!raw || typeof raw !== "object") continue;
    const block = raw as Record<string, unknown>;
    const key = String(block.key ?? block.type ?? block.title ?? "").toLowerCase();
    const items = Array.isArray(block.items)
      ? block.items.map(String)
      : typeof block.value === "string" ? block.value.split("\n").map((line) => line.replace(/^[-•]\s*/, "").trim()).filter(Boolean) : [];
    if (key.includes("responsibil") || key.includes("what-youll-do")) output.responsibilities = items;
    if (key.includes("require") || key.includes("looking-for")) output.requirements = items;
    if (key.includes("desirable") || key.includes("helpful")) output.desirable = items;
  }
  return output;
}

function asArray<T>(value: unknown): T[] { return Array.isArray(value) ? value as T[] : []; }

function mapRow(row: JobRow): LiveJob {
  const blocks = blockLists(row.content_blocks);
  const slug = String(row.public_slug ?? "").trim();
  return {
    slug,
    jobId: String(row.job_id ?? slug),
    title: String(row.title ?? "Open role"),
    departments: [String(row.department ?? row.category ?? "ESB Games")],
    location: String(row.location ?? "Remote"),
    type: String(row.employment_type ?? "Role-specific"),
    reportsTo: String(row.reports_to ?? "ESB Games leadership"),
    summary: String(row.short_description ?? "Join ESB Games and help build the future of gaming."),
    responsibilities: blocks.responsibilities ?? [],
    requirements: blocks.requirements ?? [],
    desirable: blocks.desirable ?? [],
    eligibility: String(row.eligibility ?? "").trim() || undefined,
    applicationPrompt: String(row.application_prompt ?? "Tell us why you are a strong fit for this role."),
    applicationFormVersionId: String(row.application_form_version_id ?? ""),
    applicationFields: asArray<ApplicationField>(row.application_fields).filter((field) => !field.recruiterOnly),
    consents: asArray<CareerConsent>(row.consents),
    closingDate: row.closing_date ? String(row.closing_date) : undefined,
    featured: Boolean(row.featured),
  };
}

export async function getLiveJobs(): Promise<{ jobs: LiveJob[]; configured: boolean; unavailable: boolean }> {
  const configured = Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
    && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  );
  if (!configured) return { jobs: [], configured: false, unavailable: false };

  try {
    const rows = await contentSelect<JobRow>("public_careers_jobs", "select=*&order=featured.desc,publish_date.desc", { cache: "no-store" });
    return { jobs: rows.map(mapRow).filter((job) => Boolean(job.slug)), configured: true, unavailable: false };
  } catch {
    return { jobs: [], configured: true, unavailable: true };
  }
}

export async function getLiveJob(slug: string) {
  const result = await getLiveJobs();
  return { job: result.jobs.find((job) => job.slug === slug) ?? null, configured: result.configured, unavailable: result.unavailable };
}
