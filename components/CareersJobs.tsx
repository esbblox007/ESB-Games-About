"use client";

import { useMemo, useState } from "react";
import { ArrowIcon, BriefcaseIcon, GlobeIcon } from "./Icons";

type Job = {
  title: string;
  departments: string[];
  location: "Remote";
  type: "Full-time";
  reportsTo: string;
  summary: string;
  responsibilities: string[];
  applyHint: string;
};

const jobs: Job[] = [
  {
    title: "Chief Financial Officer",
    departments: ["Executive Leadership"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Managing Director / Chief Executive Officer",
    summary: "Lead financial planning, budgeting, forecasting and sustainable growth across ESB Games.",
    responsibilities: ["Own company budgeting and financial planning", "Oversee revenue operations, reporting and controls", "Support monetisation strategy, payroll planning and future investment readiness"],
    applyHint: "Share your background in financial leadership, forecasting and operational finance.",
  },
  {
    title: "Chief Technology Officer",
    departments: ["Executive Leadership", "Engineering"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Chief Executive Officer",
    summary: "Define the technology strategy for the ESB Games ecosystem across platform, tooling, infrastructure and security.",
    responsibilities: ["Lead platform engineering direction and architecture", "Guide infrastructure, performance and security priorities", "Build strong engineering practices and long term technical roadmaps"],
    applyHint: "Tell us about the platforms or products you have scaled and the teams you have led.",
  },
  {
    title: "Chief Legal Officer",
    departments: ["Executive Leadership"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Chief Executive Officer",
    summary: "Oversee legal strategy, company compliance and the governance needed to support safe, global growth.",
    responsibilities: ["Support legal operations, policy review and company governance", "Guide commercial agreements and risk management", "Help shape privacy, safety and regulatory readiness"],
    applyHint: "Highlight your experience with platform law, governance or commercial legal work.",
  },
  {
    title: "Chief Product Officer",
    departments: ["Executive Leadership", "Product"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Managing Director / Chief Executive Officer",
    summary: "Set the product vision across play, create, connect and safety experiences in the ESB Games ecosystem.",
    responsibilities: ["Own product direction and roadmap quality", "Work closely with design, engineering and operations", "Ensure player, creator and family needs stay central to product decisions"],
    applyHint: "Show us how you have led product strategy and shipped meaningful experiences.",
  },
  {
    title: "Director of Trust & Safety",
    departments: ["Trust & Safety"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Managing Director / Chief Executive Officer",
    summary: "Lead moderation, investigations, safety programmes and platform integrity across ESB Games.",
    responsibilities: ["Define safety strategy and escalations", "Own moderation quality, investigations and incident handling", "Work across product and engineering to build safer systems"],
    applyHint: "Please include your experience in moderation, investigations, policy or safety operations.",
  },
  {
    title: "Senior Trust & Safety Manager",
    departments: ["Trust & Safety"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Director of Trust & Safety",
    summary: "Support day to day trust and safety operations, escalations and moderation effectiveness.",
    responsibilities: ["Help manage reviews, investigations and escalations", "Improve moderation workflows and quality controls", "Contribute to enforcement consistency and support readiness"],
    applyHint: "Share examples of moderation leadership, queue management or abuse prevention work.",
  },
  {
    title: "Quality Assurance Specialist",
    departments: ["Engineering"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Chief Technology Officer",
    summary: "Help ensure the ESB Games platform ships with quality, consistency and strong player experiences.",
    responsibilities: ["Test platform features and creator tools", "Document bugs clearly and verify fixes", "Support release readiness and regression testing"],
    applyHint: "Include tools, workflows or products you have tested previously.",
  },
  {
    title: "Policy Developer",
    departments: ["Product"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Chief Product Officer",
    summary: "Develop clear, practical policies that support safety, creators, community standards and responsible product use.",
    responsibilities: ["Draft and improve platform facing policies", "Work with trust and safety, product and legal stakeholders", "Turn policy decisions into clear operational guidance"],
    applyHint: "Tell us about policy writing, guideline development or standards work you have done.",
  },
  {
    title: "Social Media Lead",
    departments: ["Marketing"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Managing Director / Chief Executive Officer",
    summary: "Shape the public voice of ESB Games across launch marketing, community growth and creator outreach.",
    responsibilities: ["Lead content planning and platform strategy", "Coordinate campaigns, updates and community messaging", "Grow awareness through creator and community focused storytelling"],
    applyHint: "Show us campaigns, accounts or communities you have helped grow.",
  },
  {
    title: "Marketing Associate",
    departments: ["Marketing"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Social Media Lead",
    summary: "Support day to day marketing execution across social, community, campaign support and launch communications.",
    responsibilities: ["Help coordinate posts, assets and messaging", "Support creator and community marketing work", "Track campaign tasks and keep launches organised"],
    applyHint: "Include any examples of social, marketing or community work you have contributed to.",
  },
  {
    title: "Senior Operations Manager",
    departments: ["Operations"],
    location: "Remote",
    type: "Full-time",
    reportsTo: "Managing Director / Chief Executive Officer",
    summary: "Build strong internal processes, cross functional coordination and execution discipline across ESB Games.",
    responsibilities: ["Coordinate operational planning across teams", "Improve internal processes and execution quality", "Support launches, internal systems and organisational readiness"],
    applyHint: "Please outline the teams, processes or operations you have previously managed.",
  },
];

const departments = [
  "All",
  "Executive Leadership",
  "Trust & Safety",
  "Engineering",
  "Product",
  "Marketing",
  "Operations",
];

const locations = ["All", "Remote"];

export default function CareersJobs() {
  const [department, setDepartment] = useState("All");
  const [location, setLocation] = useState("All");
  const [selectedTitle, setSelectedTitle] = useState<string | null>(jobs[0]?.title ?? null);

  const filtered = useMemo(
    () => jobs.filter((job) => {
      const matchesDepartment = department === "All" || job.departments.includes(department);
      const matchesLocation = location === "All" || job.location === location;
      return matchesDepartment && matchesLocation;
    }),
    [department, location],
  );

  const selectedJob = filtered.find((job) => job.title === selectedTitle) || filtered[0] || null;

  return (
    <div className="career-job-browser">
      <aside className="career-job-filters">
        <div className="career-filter-panel">
          <strong>DEPARTMENT</strong>
          {departments.map((item) => (
            <button type="button" key={item} className={department === item ? "active" : ""} onClick={() => setDepartment(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="career-filter-panel">
          <strong>LOCATION</strong>
          {locations.map((item) => (
            <button type="button" key={item} className={location === item ? "active" : ""} onClick={() => setLocation(item)}>
              {item}
            </button>
          ))}
        </div>
      </aside>

      <div className="career-job-results">
        <div className="career-job-results-head">
          <span>{filtered.length} {filtered.length === 1 ? "role" : "roles"} open</span>
        </div>

        {filtered.length ? (
          <>
            <div className="career-job-list">
              {filtered.map((job) => {
                const active = selectedJob?.title === job.title;
                return (
                  <button type="button" className={`career-job-card${active ? " active" : ""}`} key={job.title} onClick={() => setSelectedTitle(job.title)}>
                    <span className="career-job-icon"><BriefcaseIcon /></span>
                    <div>
                      <h3>{job.title}</h3>
                      <p>
                        <span>{job.departments.join(" · ")}</span>
                        <span><GlobeIcon size={13} /> {job.location}</span>
                        <span>{job.type}</span>
                      </p>
                    </div>
                    <span className="career-job-open">View role <ArrowIcon size={15} /></span>
                  </button>
                );
              })}
            </div>

            {selectedJob && (
              <article className="career-job-detail">
                <header className="career-job-detail-header">
                  <div>
                    <span className="career-job-kicker">Applying for • {selectedJob.departments[0]}</span>
                    <h3>{selectedJob.title}</h3>
                    <p>{selectedJob.summary}</p>
                  </div>
                  <div className="career-job-meta">
                    <span><GlobeIcon size={14} /> {selectedJob.location}</span>
                    <span>{selectedJob.type}</span>
                    <span>Reports to {selectedJob.reportsTo}</span>
                  </div>
                </header>

                <div className="career-job-detail-grid">
                  <section className="career-job-description">
                    <h4>What you’ll do</h4>
                    <ul>
                      {selectedJob.responsibilities.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                    <p className="career-job-apply-hint">{selectedJob.applyHint}</p>
                  </section>

                  <section className="career-application-panel">
                    <h4>Application</h4>
                    <div className="career-application-grid">
                      <label><span>Full name</span><input type="text" placeholder="Your full name" /></label>
                      <label><span>Email</span><input type="email" placeholder="you@example.com" /></label>
                      <label><span>Current location</span><input type="text" placeholder="City, country" /></label>
                      <label><span>LinkedIn or portfolio</span><input type="url" placeholder="https://" /></label>
                      <label className="full"><span>Why are you a strong fit?</span><textarea placeholder="Tell us a little about your experience and interest in this role." /></label>
                    </div>
                    <div className="career-application-actions">
                      <a className="button button-primary" href={`mailto:careers@esbgames.com?subject=Application for ${encodeURIComponent(selectedJob.title)}`}>Apply Now</a>
                      <p>Applications currently route through careers@esbgames.com. Include your CV, portfolio or any supporting links.</p>
                    </div>
                  </section>
                </div>
              </article>
            )}
          </>
        ) : (
          <div className="career-empty-jobs">No roles match those filters yet.</div>
        )}
      </div>
    </div>
  );
}
