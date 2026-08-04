import Link from "next/link";
import type { ArticleBlock, RichText } from "@/lib/content/types";

const safeExternalProtocols = new Set(["https:", "http:"]);

function safeHref(href: string) {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const url = new URL(href);
    return safeExternalProtocols.has(url.protocol) ? href : null;
  } catch {
    return null;
  }
}

export function ArticleVideoEmbed({ block }: { block: Extract<ArticleBlock, { type: "video" }> }) {
  if (block.provider === "file") {
    const href = safeHref(block.url);
    if (!href) return null;
    return <video controls preload="metadata" aria-label={block.title}><source src={href} /></video>;
  }

  try {
    const url = new URL(block.url);
    let src = "";
    if (block.provider === "youtube" && ["youtube.com", "www.youtube.com", "youtu.be"].includes(url.hostname)) {
      const id = url.hostname === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v") || url.pathname.split("/").filter(Boolean).pop();
      if (id && /^[a-zA-Z0-9_-]{6,20}$/.test(id)) src = `https://www.youtube-nocookie.com/embed/${id}`;
    }
    if (block.provider === "vimeo" && ["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)) {
      const id = url.pathname.split("/").filter(Boolean).pop();
      if (id && /^\d+$/.test(id)) src = `https://player.vimeo.com/video/${id}`;
    }
    if (!src) return null;
    return <iframe src={src} title={block.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
  } catch {
    return null;
  }
}

function ExternalOrInternalLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const safe = safeHref(href);
  if (!safe) return <span className={className}>{children}</span>;
  if (safe.startsWith("/")) return <Link href={safe} className={className}>{children}</Link>;
  return <a href={safe} className={className} target="_blank" rel="noopener noreferrer">{children}</a>;
}

function renderRichText(value: RichText) {
  if (typeof value === "string") return value;
  return value.map((span, index) => {
    let content: React.ReactNode = span.text;
    if (span.bold) content = <strong>{content}</strong>;
    if (span.italic) content = <em>{content}</em>;
    if (span.underline) content = <u>{content}</u>;
    if (span.href) content = <ExternalOrInternalLink href={span.href}>{content}</ExternalOrInternalLink>;
    return <span key={`${span.text}-${index}`}>{content}</span>;
  });
}

export default function ArticleRenderer({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="article-rich-body">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        switch (block.type) {
          case "paragraph": return <p className={`article-text-${block.size || "normal"} article-align-${block.align || "left"} article-spacing-${block.spacing || "normal"}`} key={key}>{renderRichText(block.text)}</p>;
          case "heading": {
            const id = block.id || block.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
            if (block.level === 2) return <h2 className={`article-align-${block.align || "left"}`} id={id} key={key}>{block.text}</h2>;
            if (block.level === 3) return <h3 className={`article-align-${block.align || "left"}`} id={id} key={key}>{block.text}</h3>;
            return <h4 className={`article-align-${block.align || "left"}`} id={id} key={key}>{block.text}</h4>;
          }
          case "list": {
            const items = block.items.map((item, itemIndex) => <li key={`${key}-${itemIndex}`}>{item}</li>);
            return block.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
          }
          case "quote": return <blockquote key={key}><p>{block.text}</p>{block.attribution && <cite>{block.attribution}</cite>}</blockquote>;
          case "divider": return <hr key={key} />;
          case "image": {
            const src = safeHref(block.src);
            return src ? (
              <figure className={`article-media article-media-${block.width || "content"}`} key={key}>
                <img src={src} alt={block.alt} loading="lazy" />
                {block.caption && <figcaption>{block.caption}</figcaption>}
              </figure>
            ) : null;
          }
          case "gallery": return (
            <div className="article-gallery" key={key}>
              {block.images.map((image, imageIndex) => {
                const src = safeHref(image.src);
                return src ? (
                  <figure key={`${key}-${imageIndex}`}>
                    <img src={src} alt={image.alt} loading="lazy" />
                    {image.caption && <figcaption>{image.caption}</figcaption>}
                  </figure>
                ) : null;
              })}
            </div>
          );
          case "video": {
            const embed = <ArticleVideoEmbed block={block} />;
            return <figure className="article-video" key={key}><div>{embed}</div>{block.caption && <figcaption>{block.caption}</figcaption>}</figure>;
          }
          case "callout": return <aside className={`article-callout article-callout-${block.tone || "info"}`} key={key}>{block.title && <strong>{block.title}</strong>}<p>{block.text}</p></aside>;
          case "code": return <figure className="article-code" key={key}>{block.caption && <figcaption>{block.caption}</figcaption>}<pre><code data-language={block.language}>{block.code}</code></pre></figure>;
          case "table": return (
            <figure className="article-table-wrap" key={key}>
              <div className="article-table-scroll"><table><thead><tr>{block.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={`${key}-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${key}-${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table></div>
              {block.caption && <figcaption>{block.caption}</figcaption>}
            </figure>
          );
          case "button": return <p className="article-button-row" key={key}><ExternalOrInternalLink href={block.href} className={`button ${block.variant === "secondary" ? "button-secondary" : "button-primary"}`}>{block.label}</ExternalOrInternalLink></p>;
          default: return null;
        }
      })}
    </div>
  );
}
