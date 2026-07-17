"use client";

import { useMemo, useState } from "react";
import { BriefcaseIcon, GlobeIcon } from "./Icons";

type Job = {
  title: string;
  departments: string[];
  location: "Remote";
  type: "Full-time";
};

const jobs: Job[] = [
  {
    title: "Chief Financial Officer",
    departments: ["Executive Leadership"],
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Chief Technology Officer",
    departments: ["Executive Leadership", "Engineering"],
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Chief Legal Officer",
    departments: ["Executive Leadership"],
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Chief Product Officer",
    departments: ["Executive Leadership", "Product"],
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Director of Trust & Safety",
    departments: ["Trust & Safety"],
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Senior Trust & Safety Manager",
    departments: ["Trust & Safety"],
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Quality Assurance Specialist",
    departments: ["Engineering"],
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Policy Developer",
    departments: ["Product"],
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Social Media Lead",
    departments: ["Marketing"],
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Marketing Associate",
    departments: ["Marketing"],
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Senior Operations Manager",
    departments: ["Operations"],
    location: "Remote",
    type: "Full-time",
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

  const filtered = useMemo(
    () =>
      jobs.filter((job) => {
        const matchesDepartment =
          department === "All" || job.departments.includes(department);
        const matchesLocation = location === "All" || job.location === location;
        return matchesDepartment && matchesLocation;
      }),
    [department, location],
  );

  return (
    <div className="career-job-browser">
      <aside className="career-job-filters">
        <div className="career-filter-panel">
          <strong>DEPARTMENT</strong>
          {departments.map((item) => (
            <button
              type="button"
              key={item}
              className={department === item ? "active" : ""}
              onClick={() => setDepartment(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="career-filter-panel">
          <strong>LOCATION</strong>
          {locations.map((item) => (
            <button
              type="button"
              key={item}
              className={location === item ? "active" : ""}
              onClick={() => setLocation(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>

      <div className="career-job-results">
        <div className="career-job-results-head">
          <span>
            {filtered.length} {filtered.length === 1 ? "role" : "roles"} open
          </span>
        </div>

        {filtered.length ? (
          filtered.map((job) => (
            <article className="career-job-card" key={job.title}>
              <span className="career-job-icon">
                <BriefcaseIcon />
              </span>
              <div>
                <h3>{job.title}</h3>
                <p>
                  <span>{job.departments.join(" · ")}</span>
                  <span>
                    <GlobeIcon size={13} /> {job.location}
                  </span>
                  <span>{job.type}</span>
                </p>
              </div>
              <a
                href={`mailto:careers@esbgames.com?subject=Application — ${encodeURIComponent(job.title)}`}
              >
                Apply <b>→</b>
              </a>
            </article>
          ))
        ) : (
          <div className="career-empty-jobs">
            No roles match those filters yet.
          </div>
        )}
      </div>
    </div>
  );
}
