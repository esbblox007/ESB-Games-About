import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import CareersJobs from "@/components/CareersJobs";
import { CheckIcon, GlobeIcon, HeartIcon, RocketIcon, SearchIcon, StarIcon, UsersIcon } from "@/components/Icons";
import { getLiveJobs } from "@/lib/content/careers-live";

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore current ESB Games opportunities and the official website application process. Role-specific terms are shown on each published vacancy.",
  alternates: { canonical: "/careers" },
  openGraph: { title: "Careers | ESB Games", description: "Explore current ESB Games opportunities and the official website application process.", url: "/careers", type: "website", images: [{ url: "/career-culture-collaborate.jpg", alt: "Careers at ESB Games" }] },
  twitter: { card: "summary_large_image", title: "Careers | ESB Games", description: "Explore current ESB Games opportunities and the official website application process.", images: ["/career-culture-collaborate.jpg"] },
};

const impactCards = [
  { icon: <StarIcon />, title: "Make a real impact", text: "Work on systems, experiences and tools that shape the platform from its earliest stages." },
  { icon: <UsersIcon />, title: "Work alongside builders", text: "Collaborate across product, safety, engineering, community and creative disciplines." },
  { icon: <RocketIcon />, title: "Build practical experience", text: "Take ownership, learn through real project work and contribute to an early-stage platform." },
  { icon: <CheckIcon />, title: "Clear role expectations", text: "Responsibilities, reporting lines, compensation status and application requirements are explained for each published role." },
] as const;

const peopleBenefits = [
  ["Role-specific terms", "Employment status, compensation, hours, location expectations and any additional arrangements are defined on the individual vacancy or confirmed before an offer is accepted."],
  ["Remote-first collaboration", "Published remote roles are designed around documentation and clear communication across time zones."],
  ["Clear scope", "Responsibilities and reporting lines should be documented so applicants understand what a role actually involves."],
  ["Learning through ownership", "Team members can build skills through practical work, feedback and shared knowledge; no specific training or certification benefit is implied unless a role states one."],
] as const;

const cultureCards = [
  ["Collaborate", "Share ideas openly, ask better questions and build stronger outcomes together.", "/career-culture-collaborate.jpg", "career-culture-one"],
  ["Create", "Experiment with ambitious ideas and turn them into thoughtful, polished experiences.", "/career-culture-create.jpg", "career-culture-two"],
  ["Have fun", "Take the work seriously without losing the joy that makes games worth building.", "/career-culture-have-fun.jpg", "career-culture-three"],
  ["Give back", "Support creators, players and communities through the work we build.", "/career-culture-give-back.jpg", "career-culture-four"],
] as const;

export default async function CareersPage() {
  const live = await getLiveJobs();
  const hasRoles = live.jobs.length > 0;
  return <PageShell>
    <section className="career-hero"><div className="career-container career-hero-grid"><div className="career-hero-copy"><span className="eyebrow">Careers at ESB Games</span><h1>Build the future of <span className="gradient-text">gaming,</span> with us.</h1><p>ESB Games is an early-stage, remote-first project bringing together people who care about creators, players, safety and interactive entertainment. Always read the individual vacancy for the exact role arrangement.</p><div className="career-hero-actions">{hasRoles ? <a href="#open-roles" className="button button-primary"><SearchIcon size={17}/> See open roles</a> : <a href="#open-roles" className="button button-primary"><SearchIcon size={17}/> Recruitment status</a>}<a href="#culture" className="button button-secondary"><HeartIcon size={17}/> Our culture</a></div></div><div className="career-metric-grid"><article><UsersIcon/><strong>Early-stage teams</strong><span>HIGH OWNERSHIP</span></article><article><GlobeIcon/><strong>Remote-first</strong><span>DISTRIBUTED COLLABORATION</span></article><article><HeartIcon/><strong>People-led</strong><span>CLEAR EXPECTATIONS</span></article><article><StarIcon/><strong>Mission-driven</strong><span>CREATOR & PLAYER FOCUS</span></article></div></div></section>
    <section className="career-section career-impact-section"><div className="career-container"><div className="career-impact-grid">{impactCards.map(item => <article key={item.title}><span>{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></div></section>
    <section className="career-section" id="open-roles"><div className="career-container"><header className="career-section-heading career-jobs-title"><div><span className="eyebrow">{hasRoles ? "Open opportunities" : "Recruitment status"}</span><h2>{hasRoles ? <>Find your <span className="gradient-text">seat.</span></> : <>Future <span className="gradient-text">opportunities.</span></>}</h2></div><p>{hasRoles ? "Explore current opportunities. The individual vacancy is the source of truth for department, arrangement, compensation status and requirements." : "There are no published vacancies at the moment. This page will update when recruitment opens."}</p></header><CareersJobs jobs={live.jobs} unavailable={live.unavailable}/></div></section>
    <section className="career-section career-people-section"><div className="career-container"><header className="career-center-heading"><span className="eyebrow">How we work</span><h2>Clarity before <span className="gradient-text">promises.</span></h2><p>ESB Games does not advertise a benefit or compensation arrangement here unless it applies to the specific role.</p></header><div className="career-benefit-grid">{peopleBenefits.map(([title,text]) => <article key={title}><span><CheckIcon size={17}/></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>
    <section className="career-section" id="culture"><div className="career-container"><header className="career-section-heading"><div><span className="eyebrow">Life at ESB Games</span><h2>How we want to <span className="gradient-text">work.</span></h2></div></header><div className="career-culture-grid">{cultureCards.map(([title,text,image,className]) => <article className={className} key={title}><Image src={image} alt="" fill sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 25vw" className="career-culture-image"/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div></section>
    <section className="career-section career-final-section"><div className="career-container"><div className="career-final-cta"><div><h2>{hasRoles ? "Interested in an ESB Games role?" : "Interested in future ESB Games roles?"}</h2><p>{hasRoles ? "Read the full vacancy before applying. Applications are reviewed against the requirements and arrangements published for that role." : "Check this careers page for official openings as the team grows. Applications are only accepted for published roles."}</p></div><a href="#open-roles" className="button button-primary"><SearchIcon size={17}/> {hasRoles ? "See open roles" : "View recruitment status"}</a></div></div></section>
  </PageShell>;
}
