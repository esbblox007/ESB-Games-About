import Link from "next/link";
import { ArrowIcon, SearchIcon, ShieldIcon, TicketIcon, UsersIcon } from "@/components/Icons";

// Shared public routing map: self-service guidance, private case handling, Trust & Safety guidance, and family controls.
type Area = "help" | "support" | "trust" | "family";

const areas = [
  {
    id: "help" as const,
    title: "Help Centre",
    eyebrow: "Self-service",
    description: "Guides and answers for common account, payment, creator, family and technical questions.",
    href: "/help",
    icon: <SearchIcon size={19} />,
  },
  {
    id: "support" as const,
    title: "Support",
    eyebrow: "Private case",
    description: "Open a private ticket when an issue needs an authorised ESB Games staff member to investigate or respond.",
    href: "/support#contact-support",
    icon: <TicketIcon size={19} />,
  },
  {
    id: "trust" as const,
    title: "Trust & Safety guidance",
    eyebrow: "Inside Help Centre",
    description: "Safety systems, policies, privacy information, reporting principles and enforcement guidance.",
    href: "/help/trust-safety",
    icon: <ShieldIcon size={19} />,
  },
  {
    id: "family" as const,
    title: "Family Centre",
    eyebrow: "Parents and guardians",
    description: "Linked-account, parental-control and family safety features being developed for ESB Games.",
    href: "/parental-controls",
    icon: <UsersIcon size={19} />,
  },
];

export default function ServicePathways({ current, title = "Choose the right place" }: { current?: Area; title?: string }) {
  return (
    <section className="service-pathways" aria-labelledby={`service-pathways-${current || "all"}`}>
      <div className="service-pathways-heading">
        <span className="eyebrow">ESB Games guidance</span>
        <h2 id={`service-pathways-${current || "all"}`}>{title}</h2>
        <p>Choose the area that matches what you need. Every option opens its own page; Trust &amp; Safety guidance now lives inside Help Centre.</p>
      </div>
      <div className="service-pathways-grid">
        {areas.map((area) => (
          <Link key={area.id} href={area.href} className={`service-pathway-card${current === area.id ? " is-current" : ""}`} aria-current={current === area.id ? "page" : undefined}>
            <span className="service-pathway-icon">{area.icon}</span>
            <span className="service-pathway-copy"><small>{area.eyebrow}</small><strong>{area.title}</strong><span>{area.description}</span></span>
            <ArrowIcon size={16} />
          </Link>
        ))}
      </div>
    </section>
  );
}
