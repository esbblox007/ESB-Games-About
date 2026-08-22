import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import DownloadPlatformHint from "@/components/DownloadPlatformHint";
import { getDownloadProducts } from "@/lib/content/downloads";

export const metadata: Metadata = {
  title: "Downloads",
  description: "ESB Games Player and ESB Studio are currently in development. Public downloads are not available yet.",
  alternates: { canonical: "/download" },
  openGraph: { title: "Downloads | ESB Games", description: "Follow availability for ESB Games Player and ESB Studio as development progresses.", url: "/download" },
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://about.esbgames.com";

export default async function DownloadPage() {
  const result = await getDownloadProducts();
  const softwareSchema = result.products.map((product) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    applicationCategory: product.slug === "studio" ? "DeveloperApplication" : "GameApplication",
    operatingSystem: product.releases.map((release) => release.platform).join(", ") || undefined,
    url: `${siteUrl}/download`,
  }));

  return (
    <PageShell>
      <div className="download-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema).replace(/</g, "\\u003c") }} />
        <section className="download-hero">
          <div className="download-container">
            <span className="page-eyebrow">Official downloads · In development</span>
            <h1>Download <span className="gradient-text">ESB Games.</span></h1>
            <p>ESB Games Player and ESB Studio are currently in development. Public downloads are not available yet.</p>
            <DownloadPlatformHint />
          </div>
        </section>

        <section className="download-products-section">
          <div className="download-container">
            <div className="download-product-grid">
              {result.products.map((product) => (
                <article className="download-product-card" key={product.id}>
                  <div className={`download-product-icon ${product.icon}`} aria-hidden="true">
                    <Image src={product.slug === "studio" ? "/esb-studio-green-logo.png" : "/esb-blue-logo.png"} alt="" width={58} height={58} className="download-product-logo" />
                  </div>
                  <div className="download-product-heading"><span>In development</span><h2>{product.name}</h2><p>{product.description}</p></div>
                  <div className="download-release-list">
                    {product.releases.length === 0 ? (
                      <div className="download-empty-state">
                        <strong>Public download not available yet.</strong>
                        <p>This product is still being prepared for public release. Availability, system requirements and release notes will be published here when they are ready.</p>
                        <div><Link className="button button-primary" href={product.learnMoreHref}>Learn about {product.slug === "studio" ? "ESB Studio" : "ESB Games"}</Link><Link className="button button-secondary" href="/support">Get Support</Link></div>
                      </div>
                    ) : product.releases.map((release) => (
                      <section className="download-release" key={release.id}>
                        <div><h3>{release.platform}{release.architecture ? ` · ${release.architecture}` : ""}</h3><span className={`download-release-state state-${release.state.toLowerCase().replaceAll(" ", "-")}`}>{release.state}</span></div>
                        <dl><div><dt>Version</dt><dd>{release.version || "Not announced"}</dd></div><div><dt>Release date</dt><dd>{release.releaseDate ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(release.releaseDate)) : "Not announced"}</dd></div><div><dt>Signing</dt><dd>{release.signed === true ? "Signed" : "Not announced"}</dd></div></dl>
                        {release.minimumRequirements?.length ? <div className="download-requirements"><strong>Minimum requirements</strong><ul>{release.minimumRequirements.map((item) => <li key={item}>{item}</li>)}</ul></div> : <p className="download-muted">System requirements have not been published yet.</p>}
                        <div className="download-release-actions">
                          {release.fileUrl ? <a className="button button-primary" href={release.fileUrl}>Download {release.platform}</a> : <span className="button button-disabled" aria-disabled="true">In development</span>}
                          {release.releaseNotesUrl && <a className="button button-secondary" href={release.releaseNotesUrl}>Release Notes</a>}
                          <Link className="button button-secondary" href="/support">Installation Help</Link>
                        </div>
                        {(release.checksum || release.signed === true) && <details className="download-verification"><summary>Verification information</summary>{release.checksum && <code>{release.checksum}</code>}<p>{release.signed ? "This release is marked as digitally signed." : "Verification details will be published with the release."}</p></details>}
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
