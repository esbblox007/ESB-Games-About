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
      ? block.items.map(String).map((item) => item.trim()).filter(Boolean)
      : typeof block.value === "string" ? block.value.split("\n").map((line) => line.replace(/^[-•]\s*/, "").trim()).filter(Boolean) : [];
    if (key.includes("responsibil") || key.includes("what-youll-do")) output.responsibilities = items;
    if (key.includes("require") || key.includes("looking-for")) output.requirements = items;
    if (key.includes("desirable") || key.includes("helpful")) output.desirable = items;
  }
  return output;
}

function asArray<T>(value: unknown): T[] { return Array.isArray(value) ? value as T[] : []; }
function clean(value: unknown) { return String(value ?? "").trim(); }

function mapRow(row: JobRow): LiveJob {
  const blocks = blockLists(row.content_blocks);
  const slug = clean(row.public_slug);
  return {
    slug,
    jobId: clean(row.job_id),
    title: clean(row.title),
    departments: [clean(row.department ?? row.category)].filter(Boolean),
    location: clean(row.location),
    type: clean(row.employment_type),
    reportsTo: clean(row.reports_to),
    summary: clean(row.short_description),
    responsibilities: blocks.responsibilities ?? [],
    requirements: blocks.requirements ?? [],
    desirable: blocks.desirable ?? [],
    eligibility: clean(row.eligibility) || undefined,
    applicationPrompt: clean(row.application_prompt),
    applicationFormVersionId: clean(row.application_form_version_id),
    applicationFields: asArray<ApplicationField>(row.application_fields).filter((field) => !field.recruiterOnly),
    consents: asArray<CareerConsent>(row.consents),
    closingDate: row.closing_date ? clean(row.closing_date) : undefined,
    featured: Boolean(row.featured),
  };
}

/**
 * Public careers fails closed. Backend status alone is not sufficient to expose a role:
 * the published version must contain enough real information for an applicant to make
 * an informed decision and must have an application form + privacy consent attached.
 */
export function isPublishableJob(job: LiveJob) {
  const marker = `${job.jobId} ${job.slug} ${job.title}`.toLowerCase();
  if (/\b(test|dummy|example|placeholder|sample)\b/.test(marker)) return false;
  if (!job.jobId || !job.slug || !job.title || !job.summary) return false;
  if (!job.departments.length || !job.location || !job.type || !job.reportsTo) return false;
  if (job.responsibilities.length < 2 || job.requirements.length < 2) return false;
  if (!job.applicationFormVersionId || job.applicationFields.length < 2) return false;
  if (!job.consents.some((consent) => consent.required && Boolean(consent.id))) return false;
  return true;
}

export async function getLiveJobs(): Promise<{ jobs: LiveJob[]; configured: boolean; unavailable: boolean }> {
  const configured = Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)
    && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
  );
  if (!configured) return { jobs: [], configured: false, unavailable: false };

  try {
    const rows = await contentSelect<JobRow>("public_careers_jobs", "select=*&order=featured.desc,publish_date.desc", { cache: "no-store" });
    return { jobs: rows.map(mapRow).filter(isPublishableJob), configured: true, unavailable: false };
  } catch {
    return { jobs: [], configured: true, unavailable: true };
  }
}

export async function getLiveJob(slug: string) {
  const result = await getLiveJobs();
  return { job: result.jobs.find((job) => job.slug === slug) ?? null, configured: result.configured, unavailable: result.unavailable };
}
