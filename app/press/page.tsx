import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Press & Media | ESB Games",
  description: "Official ESB Games press and media information, company descriptions, product facts, official links and media contact details.",
  alternates: { canonical: "/press" },
  openGraph: {
    title: "ESB Games Press & Media",
    description: "Official company information and media resources for ESB Games and ESB Studio.",
    url: "/press",
    type: "website",
    images: [{ url: "/hero-discover-platform.png", alt: "ESB Games platform" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ESB Games Press & Media",
    description: "Official company information and media resources for ESB Games and ESB Studio.",
    images: ["/hero-discover-platform.png"],
  },
};

const facts = [
  ["Company", "ESB Games"],
  ["Category", "Gaming and creation platform"],
  ["Platform", "ESB Games Play Platform"],
  ["Creator software", "ESB Studio"],
  ["Development stage", "Pre-launch development"],
  ["Official domain", "esbgames.com"],
] as const;

export default function PressPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "ESB Games Press & Media",
    url: "https://about.esbgames.com/press",
    about: {
      "@type": "Organization",
      name: "ESB Games",
      url: "https://esbgames.com/",
      description: "ESB Games is a connected gaming and creation platform being developed for players, creators, families and communities.",
    },
  };

  return (
    <PageShell>
      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "96px 24px 120px" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section style={{ maxWidth: 820 }}>
          <p className="eyebrow">Official media resources</p>
          <h1>ESB Games press & media.</h1>
          <p style={{ fontSize: "1.15rem", lineHeight: 1.7 }}>A source of record for journalists, creators, partners and anyone writing about ESB Games. Use the descriptions and official links below when referencing the company or its products.</p>
        </section>

        <section style={{ marginTop: 64 }}>
          <h2>About ESB Games</h2>
          <p><strong>Short description:</strong> ESB Games is a connected gaming and creation platform being developed for players, creators, families and communities.</p>
          <p><strong>Extended description:</strong> ESB Games is building an ecosystem that connects game discovery, social communities, creator tools, publishing, safety and family features through one platform. ESB Studio is the creation environment being developed for building, scripting, testing and publishing experiences to ESB Games.</p>
          <p><strong>Important:</strong> ESB Games is its own gaming and creation platform. Historical descriptions of ESB Games as a Roblox development company refer to an earlier direction and do not describe the current platform.</p>
        </section>

        <section style={{ marginTop: 56 }}>
          <h2>Company facts</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {facts.map(([label, value]) => <article key={label} className="card" style={{ padding: 22 }}><small>{label}</small><h3 style={{ marginTop: 8 }}>{value}</h3></article>)}
          </div>
        </section>

        <section style={{ marginTop: 56 }}>
          <h2>Official destinations</h2>
          <p><a href="https://esbgames.com">ESB Games Play Platform</a> · <Link href="/about">About ESB Games</Link> · <Link href="/developer-hub">Creator Hub & ESB Studio</Link> · <Link href="/download">Official downloads</Link> · <Link href="/parental-controls">Family & parental controls</Link> · <a href="https://status.esbgames.com">Service status</a></p>
        </section>

        <section style={{ marginTop: 56 }}>
          <h2>For coverage and attribution</h2>
          <p>When linking to the company, use <a href="https://esbgames.com">esbgames.com</a> as the primary ESB Games destination. For background information, product descriptions and company context, link to this official About site.</p>
          <p>Media and partnership enquiries can be sent to <a href="mailto:contact@esbgames.com">contact@esbgames.com</a>.</p>
        </section>

        <section style={{ marginTop: 56 }}>
          <h2>Latest official updates</h2>
          <p>Product announcements, development updates and company news are published through the <Link href="/news">ESB Games news system</Link>. These posts are the preferred source for current product statements and launch information.</p>
        </section>
      </main>
    </PageShell>
  );
}
