"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowIcon, BriefcaseIcon, GlobeIcon } from "./Icons";
import type { LiveJob } from "@/lib/content/careers-live";

export default function CareersJobs({ jobs, unavailable = false }: { jobs: LiveJob[]; unavailable?: boolean }) {
  const [department, setDepartment] = useState("All");
  const [location, setLocation] = useState("All");
  const departments = useMemo(() => ["All", ...Array.from(new Set(jobs.flatMap((job) => job.departments)))], [jobs]);
  const locations = useMemo(() => ["All", ...Array.from(new Set(jobs.map((job) => job.location)))], [jobs]);
  const filtered = useMemo(() => jobs.filter((job) => (department === "All" || job.departments.includes(department)) && (location === "All" || job.location === location)), [department, location, jobs]);

  if (unavailable) {
    return (
      <div className="career-job-browser career-job-browser-list-only">
        <div className="career-job-results">
          <div className="career-empty-jobs"><strong>Opportunities are temporarily unavailable.</strong><br />We couldn&apos;t load the current role list. Please check again shortly.</div>
        </div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="career-job-browser career-job-browser-list-only">
        <div className="career-job-results">
          <div className="career-job-results-head"><strong>No roles are open right now</strong><small>This is an intentional empty state, not a filtered result.</small></div>
          <div className="career-empty-jobs">There are currently no published ESB Games vacancies. New opportunities will appear here when recruitment opens.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="career-job-browser career-job-browser-list-only">
      <aside className="career-job-filters">
        <div className="career-filter-panel"><strong>DEPARTMENT</strong>{departments.map((item) => <button type="button" key={item} className={department === item ? "active" : ""} onClick={() => setDepartment(item)}>{item}</button>)}</div>
        <div className="career-filter-panel"><strong>LOCATION</strong>{locations.map((item) => <button type="button" key={item} className={location === item ? "active" : ""} onClick={() => setLocation(item)}>{item}</button>)}</div>
      </aside>
      <div className="career-job-results">
        <div className="career-job-results-head"><strong>{filtered.length} {filtered.length === 1 ? "role" : "roles"} open</strong><small>Select a role to view the full description and application form.</small></div>
        {filtered.length ? (
          <div className="career-job-list">{filtered.map((job) => (
            <Link className="career-job-card career-job-link" key={job.slug} href={`/careers/${job.slug}`}>
              <span className="career-job-icon"><BriefcaseIcon /></span><div><h3>{job.title}</h3><p><span>{job.departments.join(" · ")}</span><span><GlobeIcon size={13} /> {job.location}</span><span>{job.type}</span></p></div><span className="career-job-open">View role <ArrowIcon size={15} /></span>
            </Link>
          ))}</div>
        ) : <div className="career-empty-jobs">No roles match those filters. Try another department or location.</div>}
      </div>
    </div>
  );
}
