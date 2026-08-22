import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CareerApplicationForm from "@/components/CareerApplicationForm";
import { ArrowIcon, BriefcaseIcon, GlobeIcon } from "@/components/Icons";
import PageShell from "@/components/PageShell";
import { getLiveJob } from "@/lib/content/careers-live";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { job } = await getLiveJob(slug);
  if (!job) return { title: "Role not found", robots: { index: false, follow: false } };
  const title = `${job.title} | Careers | ESB Games`;
  const url = `/careers/${slug}`;
  return {
    title,
    description: job.summary,
    alternates: { canonical: url },
    openGraph: { title, description: job.summary, url, type: "website" },
    twitter: { card: "summary_large_image", title, description: job.summary },
  };
}

export default async function CareerRolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getLiveJob(slug);
  if (!result.job) notFound();
  const job = result.job;

  return (
    <PageShell>
      <div className="career-role-page">
        <section className="career-role-hero">
          <div className="career-container">
            <div className="career-role-navigation"><Link href="/careers#open-roles" className="career-role-back"><ArrowIcon size={15} /> Back to all roles</Link><span className="eyebrow">Careers at ESB Games · {job.departments[0]}</span></div>
            <h1>{job.title}</h1><p>{job.summary}</p>
            <div className="career-role-meta"><span><GlobeIcon size={15} /> {job.location}</span><span><BriefcaseIcon size={15} /> {job.type}</span><span>Reports to {job.reportsTo}</span>{job.closingDate && <span>Closes {new Date(job.closingDate).toLocaleDateString("en-GB")}</span>}</div>
            <a href="#application" className="button button-primary">Go to application</a>
          </div>
        </section>

        <section className="career-role-content">
          <div className="career-container career-role-layout">
            <article className="career-role-description">
              <section><h2>What you&apos;ll do</h2><ul>{job.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
              <section><h2>What we&apos;re looking for</h2><ul>{job.requirements.map((item) => <li key={item}>{item}</li>)}</ul></section>
              {job.desirable.length > 0 && <section><h2>Helpful experience</h2><ul>{job.desirable.map((item) => <li key={item}>{item}</li>)}</ul></section>}
              {job.eligibility && <section className="career-role-notice"><h2>Eligibility</h2><p>{job.eligibility}</p></section>}
              <section><h2>Working at ESB Games</h2><p>Role location, working arrangements, eligibility, compensation and onboarding details are confirmed through the published role and directly with successful applicants before any commitment is made.</p></section>
            </article>
            <aside className="career-role-summary-card"><span className="career-job-icon"><BriefcaseIcon /></span><h2>Role summary</h2><dl><div><dt>Department</dt><dd>{job.departments.join(" · ")}</dd></div><div><dt>Location</dt><dd>{job.location}</dd></div><div><dt>Type</dt><dd>{job.type}</dd></div><div><dt>Reports to</dt><dd>{job.reportsTo}</dd></div><div><dt>Reference</dt><dd>{job.jobId}</dd></div></dl><a href="#application" className="button button-secondary">View application</a></aside>
          </div>
        </section>
        <div className="career-container"><CareerApplicationForm job={job} /></div>
      </div>
    </PageShell>
  );
}
