import Link from "next/link";
import { ArrowIcon, SearchIcon, ShieldIcon, TicketIcon, UsersIcon } from "@/components/Icons";

type Area = "help" | "support" | "trust" | "family";

const areas = [
  {
    id: "help" as const,
    title: "Help Centre",
    eyebrow: "Guides & answers",
    description: "Browse step-by-step guidance for common account, payment, creator, family and technical questions.",
    href: "/help/centre",
    icon: <SearchIcon size={19} />,
  },
  {
    id: "support" as const,
    title: "Support",
    eyebrow: "Private case",
    description: "Open a private ticket when an issue needs an authorised ESB Games staff member to investigate or respond.",
    href: "/support",
    icon: <TicketIcon size={19} />,
  },
  {
    id: "trust" as const,
    title: "Trust & Safety",
    eyebrow: "Rules & safety",
    description: "Read safety guidance, platform rules, privacy information and policy resources.",
    href: "/help/trust-safety",
    icon: <ShieldIcon size={19} />,
  },
  {
    id: "family" as const,
    title: "Family Centre",
    eyebrow: "Parents & guardians",
    description: "Learn about linked accounts, parental controls and family features being developed for ESB Games.",
    href: "/parental-controls",
    icon: <UsersIcon size={19} />,
  },
];

export default function ServicePathways({ current, title = "Choose where you need help" }: { current?: Area; title?: string }) {
  return (
    <section className="service-pathways" aria-labelledby={`service-pathways-${current || "all"}`}>
      <div className="service-pathways-heading">
        <span className="eyebrow">ESB Games Help</span>
        <h2 id={`service-pathways-${current || "all"}`}>{title}</h2>
        <p>Pick the area that best matches what you need. Once you open an area, this chooser gets out of the way.</p>
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
