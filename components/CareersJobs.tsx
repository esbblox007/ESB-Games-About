"use client";

import { useMemo, useState } from "react";
import { BriefcaseIcon, GlobeIcon } from "./Icons";

const jobs = [
  { title: "Chief Technology Officer", team: "Executive Leadership", location: "Remote", type: "Full-time" },
  { title: "Senior Backend Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer", team: "Product", location: "Remote", type: "Full-time" },
  { title: "Trust & Safety Specialist", team: "Trust & Safety", location: "Remote", type: "Full-time" },
  { title: "Creator Partnerships Manager", team: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Community Operations Coordinator", team: "Operations", location: "Remote", type: "Part-time" },
];

const departments = ["All", "Executive Leadership", "Trust & Safety", "Engineering", "Product", "Marketing", "Operations"];
const locations = ["All", "Remote", "United Kingdom", "Europe", "North America"];

export default function CareersJobs() {
  const [department, setDepartment] = useState("All");
  const [location, setLocation] = useState("All");

  const filtered = useMemo(() => jobs.filter((job) => {
    const matchesDepartment = department === "All" || job.team === department;
    const matchesLocation = location === "All" || job.location === location;
    return matchesDepartment && matchesLocation;
  }), [department, location]);

  return (
    <div className="career-job-browser">
      <aside className="career-job-filters">
        <div className="career-filter-panel">
          <strong>DEPARTMENT</strong>
          {departments.map((item) => <button type="button" key={item} className={department === item ? "active" : ""} onClick={() => setDepartment(item)}>{item}</button>)}
        </div>
        <div className="career-filter-panel">
          <strong>LOCATION</strong>
          {locations.map((item) => <button type="button" key={item} className={location === item ? "active" : ""} onClick={() => setLocation(item)}>{item}</button>)}
        </div>
      </aside>

      <div className="career-job-results">
        <div className="career-job-results-head"><span>{filtered.length} {filtered.length === 1 ? "role" : "roles"} open</span></div>
        {filtered.length ? filtered.map((job) => (
          <article className="career-job-card" key={job.title}>
            <span className="career-job-icon"><BriefcaseIcon /></span>
            <div><h3>{job.title}</h3><p><span>{job.team}</span><span><GlobeIcon size={13} /> {job.location}</span><span>{job.type}</span></p></div>
            <a href={`mailto:careers@esbgames.com?subject=Application — ${encodeURIComponent(job.title)}`}>Apply <b>→</b></a>
          </article>
        )) : <div className="career-empty-jobs">No roles match those filters yet.</div>}
      </div>
    </div>
  );
}
