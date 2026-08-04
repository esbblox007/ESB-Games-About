import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section className="page-banner" style={{minHeight:"65vh",display:"grid",placeItems:"center"}}>
        <div className="section-inner"><span className="eyebrow">404 · Lost in the universe</span><h1 className="page-title">This world does not <span className="gradient-text">exist.</span></h1><p>The page may have moved, or the address may be incorrect.</p><div style={{marginTop:28}}><Link href="/" className="button button-primary">Return home</Link></div></div>
      </section>
    </PageShell>
  );
}
