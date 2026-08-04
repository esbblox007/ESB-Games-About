"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowIcon, BriefcaseIcon, GlobeIcon } from "./Icons";
import { careerDepartments, jobs } from "@/lib/content/careers";

export default function CareersJobs() {
  const [department, setDepartment] = useState("All");
  const [location, setLocation] = useState("All");

  const filtered = useMemo(
    () => jobs.filter((job) => {
      const matchesDepartment = department === "All" || job.departments.includes(department);
      const matchesLocation = location === "All" || job.location === location;
      return matchesDepartment && matchesLocation;
    }),
    [department, location],
  );

  return (
    <div className="career-job-browser career-job-browser-list-only">
      <aside className="career-job-filters">
        <div className="career-filter-panel">
          <strong>DEPARTMENT</strong>
          {careerDepartments.map((item) => (
            <button type="button" key={item} className={department === item ? "active" : ""} onClick={() => setDepartment(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="career-filter-panel">
          <strong>LOCATION</strong>
          {(["All", "Remote"] as const).map((item) => (
            <button type="button" key={item} className={location === item ? "active" : ""} onClick={() => setLocation(item)}>
              {item}
            </button>
          ))}
        </div>
      </aside>

      <div className="career-job-results">
        <div className="career-job-results-head">
          <strong>{filtered.length} {filtered.length === 1 ? "role" : "roles"} open</strong>
          <small>Select a role to view the full description and application form.</small>
        </div>

        {filtered.length ? (
          <div className="career-job-list">
            {filtered.map((job) => (
              <Link className="career-job-card career-job-link" key={job.slug} href={`/careers/${job.slug}`}>
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="career-empty-jobs">No roles match those filters yet.</div>
        )}
      </div>
    </div>
  );
}
