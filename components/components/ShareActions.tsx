"use client";

import { useState } from "react";

export default function ShareActions({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="article-share" aria-label="Share this article">
      <span>Share</span>
      <a href={`https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">X</a>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <button type="button" onClick={copy}>{copied ? "Copied" : "Copy link"}</button>
    </div>
  );
}
