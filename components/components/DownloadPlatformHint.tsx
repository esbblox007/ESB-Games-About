"use client";

import { useEffect, useState } from "react";

export default function DownloadPlatformHint() {
  const [platform, setPlatform] = useState<string>("");

  useEffect(() => {
    const source = `${navigator.platform} ${navigator.userAgent}`.toLowerCase();
    if (source.includes("win")) setPlatform("Windows");
    else if (source.includes("mac")) setPlatform("macOS");
    else if (source.includes("linux")) setPlatform("Linux");
  }, []);

  return platform ? <p className="download-platform-hint">Detected platform: <strong>{platform}</strong>. Other options remain available below.</p> : null;
}
