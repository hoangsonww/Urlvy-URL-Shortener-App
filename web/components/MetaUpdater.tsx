"use client";

import { useEffect } from "react";

export default function MetaUpdater() {
  useEffect(() => {
    const updateMeta = () => {
      const html = document.documentElement;
      const isDark = html.classList.contains("dark");
      let meta = document.querySelector<HTMLMetaElement>(
        'meta[name="theme-color"]',
      );
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        document.head.appendChild(meta);
      }
      meta.content = isDark ? "#1e1b18" : "#ffffff";
    };

    // initial
    updateMeta();

    // watch for .dark class toggles
    const observer = new MutationObserver(updateMeta);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // watch OS‑level preference
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    mql.addEventListener("change", updateMeta);

    // watch other‑tab storage writes
    const onStorage = (e: StorageEvent) => {
      if (e.key === "urlvy_theme") updateMeta();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      observer.disconnect();
      mql.removeEventListener("change", updateMeta);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return null;
}
