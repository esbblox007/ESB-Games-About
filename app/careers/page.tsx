import type { Metadata } from "next";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import CareersJobs from "@/components/CareersJobs";
import { CheckIcon, GlobeIcon, HeartIcon, RocketIcon, SearchIcon, StarIcon, UsersIcon } from "@/components/Icons";
import { getLiveJobs } from "@/lib/content/careers-live";

export const metadata: Metadata = {
  title: "Careers",
  description: "Explore current ESB Games opportunities and the official website application process.",
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers | ESB Games",
    description: "Explore current ESB Games opportunities and the official website application process.",
    url: "/careers",
    type: "website",
    images: [{ url: "/career-culture-collaborate.jpg", alt: "Careers at ESB Games" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | ESB Games",
    description: "Explore current ESB Games opportunities and the official website application process.",
    images: ["/career-culture-collaborate.jpg"],
  },
};

const impactCards = [
  { icon: <StarIcon />, title: "Make a real impact", text: "Work on systems, experiences and tools that shape the platform from its earliest stages." },
  { icon: <UsersIcon />, title: "Work alongside builders", text: "Collaborate across product, safety, engineering, community and creative disciplines." },
  { icon: <RocketIcon />, title: "Accelerate your growth", text: "Take ownership, learn quickly and build a portfolio of meaningful platform work." },
  { icon: <CheckIcon />, title: "Clear role expectations", text: "Responsibilities, reporting lines and application requirements are explained before you apply." },
] as const;

const peopleBenefits = [
  ["Role-specific arrangements", "Compensation, working expectations and any additional arrangements are confirmed clearly for each successful applicant."],
  ["Remote-first, async-friendly culture", "Work with flexibility, thoughtful documentation and clear communication across time zones."],
  ["Sustainable collaboration", "We value realistic planning, clear priorities and respectful working practices across the team."],
  ["Learning through ownership", "Team members are encouraged to build skills through meaningful work, feedback and shared knowledge."],
  ["Remote-first working", "Roles are designed around remote collaboration, documentation and clear communication across time zones."],
  ["Team connection", "Collaborative sessions and clear communication help a distributed team stay connected."],
] as const;

const cultureCards = [
  ["Collaborate", "Share ideas openly, ask better questions and build stronger outcomes together.", "/career-culture-collaborate.jpg", "career-culture-one"],
  ["Create", "Experiment with ambitious ideas and turn them into thoughtful, polished experiences.", "/career-culture-create.jpg", "career-culture-two"],
  ["Have fun", "Take the work seriously without losing the joy that makes games worth building.", "/career-culture-have-fun.jpg", "career-culture-three"],
  ["Give back", "Support creators, players and communities beyond the products we ship.", "/career-culture-give-back.jpg", "career-culture-four"],
] as const;

export default async function CareersPage() {
  const live = await getLiveJobs();
  const hasRoles = live.jobs.length > 0;

  return (
    <PageShell>
      <section className="career-hero">
        <div className="career-container career-hero-grid">
          <div className="career-hero-copy">
            <span className="eyebrow">Careers at ESB Games</span>
            <h1>Build the future of <span className="gradient-text">gaming,</span> with us.</h1>
            <p>We are a remote-first team bringing together people who care about creators, players, safety and the future of interactive entertainment.</p>
            <div className="career-hero-actions">
              {hasRoles ? <a href="#open-roles" className="button button-primary"><SearchIcon size={17} /> See open roles</a> : <a href="#open-roles" className="button button-primary"><SearchIcon size={17} /> Recruitment status</a>}
              <a href="#culture" className="button button-secondary"><HeartIcon size={17} /> Our culture</a>
            </div>
          </div>
          <div className="career-metric-grid">
            <article><UsersIcon /><strong>Small teams</strong><span>HIGH OWNERSHIP</span></article>
            <article><GlobeIcon /><strong>Remote-first</strong><span>GLOBAL COLLABORATION</span></article>
            <article><HeartIcon /><strong>People-led</strong><span>SUPPORTIVE CULTURE</span></article>
            <article><StarIcon /><strong>Mission-driven</strong><span>CREATOR & PLAYER FOCUS</span></article>
          </div>
        </div>
      </section>

      <section className="career-section career-impact-section">
        <div className="career-container">
          <div className="career-impact-grid">
            {impactCards.map((item) => <article key={item.title}><span>{item.icon}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
          </div>
        </div>
      </section>

      <section className="career-section" id="open-roles">
        <div className="career-container">
          <header className="career-section-heading career-jobs-title">
            <div><span className="eyebrow">{hasRoles ? "Open opportunities" : "Recruitment status"}</span><h2>{hasRoles ? <>Find your <span className="gradient-text">seat.</span></> : <>Future <span className="gradient-text">opportunities.</span></>}</h2></div>
            <p>{hasRoles ? "Choose a department or location to explore current opportunities." : "There are no published vacancies at the moment. This page will update when recruitment opens."}</p>
          </header>
          <CareersJobs jobs={live.jobs} unavailable={live.unavailable} />
        </div>
      </section>

      <section className="career-section career-people-section">
        <div className="career-container">
          <header className="career-center-heading"><span className="eyebrow">How we work</span><h2>We put <span className="gradient-text">people</span> first.</h2><p>Great products come from people who feel trusted, supported and able to do their best work.</p></header>
          <div className="career-benefit-grid">
            {peopleBenefits.map(([title, text]) => <article key={title}><span><CheckIcon size={17} /></span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="career-section" id="culture">
        <div className="career-container">
          <header className="career-section-heading"><div><span className="eyebrow">Life at ESB Games</span><h2>More than just a <span className="gradient-text">team.</span></h2></div></header>
          <div className="career-culture-grid">
            {cultureCards.map(([title, text, image, className]) => (
              <article className={className} key={title}>
                <Image src={image} alt="" fill sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 25vw" className="career-culture-image" />
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="career-section career-final-section">
        <div className="career-container">
          <div className="career-final-cta">
            <div><h2>{hasRoles ? "Your next role starts with ESB Games." : "Interested in future ESB Games roles?"}</h2><p>{hasRoles ? "Explore current opportunities and help build the future of gaming." : "Check this careers page for official openings as the team grows. Applications are only accepted for published roles."}</p></div>
            <a href="#open-roles" className="button button-primary"><SearchIcon size={17} /> {hasRoles ? "See open roles" : "View recruitment status"}</a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
