import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import DownloadPlatformHint from "@/components/DownloadPlatformHint";
import { getDownloadProducts } from "@/lib/content/downloads";

export const metadata: Metadata = {
  title: "Download ESB Games",
  description: "Download the ESB Games Play Platform or ESB Studio when public releases become available.",
  alternates: { canonical: "/download" },
  openGraph: { title: "Download ESB Games", description: "Find official ESB Games Play Platform and ESB Studio downloads.", url: "/download" },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";

export default async function DownloadPage() {
  const result = await getDownloadProducts();
  const softwareSchema = result.products.map((product) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: product.slug === "studio" ? "DeveloperApplication" : "GameApplication",
    operatingSystem: product.releases.map((release) => release.platform).join(", ") || "Availability to be announced",
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP", availability: product.releases.some((release) => release.fileUrl) ? "https://schema.org/InStock" : "https://schema.org/PreOrder" },
    url: `${siteUrl}/download`,
  }));

  return (
    <PageShell>
      <div className="download-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/</g, "\\u003c") }} />
        <section className="download-hero">
          <div className="download-container">
            <span className="page-eyebrow">Official downloads</span>
            <h1>Download <span className="gradient-text">ESB Games.</span></h1>
            <p>Get the ESB Games Play Platform to discover and play experiences, or download ESB Studio to start creating.</p>
            <DownloadPlatformHint />
          </div>
        </section>

        <section className="download-products-section">
          <div className="download-container">
            {result.unavailable && <div className="download-service-warning" role="status"><strong>Download information is temporarily unavailable.</strong><span>Product information is shown below, but release data could not be loaded.</span></div>}
            <div className="download-product-grid">
              {result.products.map((product) => (
                <article className="download-product-card" key={product.id}>
                  <div className={`download-product-icon ${product.icon}`} aria-hidden="true">{product.icon === "play" ? "▶" : "◇"}</div>
                  <div className="download-product-heading"><span>{product.slug === "studio" ? "Create" : "Play"}</span><h2>{product.name}</h2><p>{product.description}</p></div>
                  <div className="download-release-list">
                    {product.releases.length === 0 ? (
                      <div className="download-empty-state">
                        <strong>Not yet available for public download.</strong>
                        <p>No public download is currently available for this product. Release information will be published from the ESB Games Backend.</p>
                        <div><a className="button button-primary" href="https://esbgames.com/login">Join Early Access</a><Link className="button button-secondary" href={product.learnMoreHref}>Learn More</Link></div>
                      </div>
                    ) : product.releases.map((release) => (
                      <section className="download-release" key={release.id}>
                        <div><h3>{release.platform}{release.architecture ? ` · ${release.architecture}` : ""}</h3><span className={`download-release-state state-${release.state.toLowerCase().replaceAll(" ", "-")}`}>{release.state}</span></div>
                        <dl><div><dt>Version</dt><dd>{release.version || "Not provided"}</dd></div><div><dt>Release date</dt><dd>{release.releaseDate ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(release.releaseDate)) : "Not announced"}</dd></div><div><dt>Signing</dt><dd>{release.signed === true ? "Signed" : release.signed === false ? "Not signed" : "Not provided"}</dd></div></dl>
                        {release.minimumRequirements?.length ? <div className="download-requirements"><strong>Minimum requirements</strong><ul>{release.minimumRequirements.map((item) => <li key={item}>{item}</li>)}</ul></div> : <p className="download-muted">System requirements have not been published yet.</p>}
                        <div className="download-release-actions">
                          {release.fileUrl ? <a className="button button-primary" href={release.fileUrl}>Download {release.platform}</a> : <span className="button button-disabled" aria-disabled="true">Not publicly available</span>}
                          {release.releaseNotesUrl && <a className="button button-secondary" href={release.releaseNotesUrl}>Release Notes</a>}
                          <Link className="button button-secondary" href="/support">Installation Help</Link>
                        </div>
                        {(release.checksum || typeof release.signed === "boolean") && <details className="download-verification"><summary>Verification information</summary>{release.checksum && <code>{release.checksum}</code>}<p>{release.signed ? "This release is marked as digitally signed." : "A digital-signature status has not been confirmed."}</p></details>}
                      </section>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
