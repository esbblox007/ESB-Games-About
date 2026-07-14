"use client";

import { useMemo, useState } from "react";
import { BriefcaseIcon, GlobeIcon } from "./Icons";

const jobs = [
  { title: "Senior Backend Engineer", team: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer", team: "Product", location: "Remote", type: "Full-time" },
  { title: "Trust & Safety Specialist", team: "Safety", location: "Remote", type: "Full-time" },
  { title: "Creator Partnerships Manager", team: "Marketing", location: "Remote", type: "Full-time" },
];
const teams = ["All", "Engineering", "Product", "Safety", "Marketing"];

export default function CareersJobs() {
  const [team, setTeam] = useState("All");
  const filtered = useMemo(() => team === "All" ? jobs : jobs.filter((job) => job.team === team), [team]);
  return (
    <>
      <div className="jobs-toolbar">
        <div><strong>{filtered.length} open {filtered.length === 1 ? "role" : "roles"}</strong></div>
        <div className="filter-group" aria-label="Filter jobs by team">{teams.map((item) => <button key={item} className={team === item ? "active" : ""} onClick={() => setTeam(item)}>{item}</button>)}</div>
      </div>
      <div className="jobs-list">
        {filtered.map((job) => (
          <article className="job-card" key={job.title}>
            <div><h3>{job.title}</h3><div className="job-meta"><span><BriefcaseIcon size={15}/>{job.team}</span><span><GlobeIcon size={15}/>{job.location}</span><span>{job.type}</span></div></div>
            <a className="button button-secondary" href={`mailto:careers@esbgames.com?subject=Application — ${encodeURIComponent(job.title)}`}>Apply now</a>
          </article>
        ))}
      </div>
    </>
  );
}
