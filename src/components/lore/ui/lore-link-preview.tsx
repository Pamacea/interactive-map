"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface WikiLinkPreviewProps {
  worldId: string;
}

interface LoreEntryCache {
  id: string;
  slug: string;
  title: string;
  category: string;
}

export function LoreLinkPreview({ worldId }: WikiLinkPreviewProps) {
  const [loreEntriesCache, setLoreEntriesCache] = React.useState<LoreEntryCache[]>([]);
  const [preview, setPreview] = React.useState<{
    x: number;
    y: number;
    entry: LoreEntryCache | null;
  } | null>(null);

  const handleMouseEnter = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "WIKI-LINK") {
      const entryId = target.getAttribute("data-id");
      const entry = loreEntriesCache.find((e) => e.id === entryId);

      if (entry) {
        const rect = target.getBoundingClientRect();
        setPreview({
          x: rect.left + rect.width / 2,
          y: rect.top - 8,
          entry,
        });
      }
    }
  };

  const handleMouseLeave = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "WIKI-LINK") {
      setPreview(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);

    // Fetch all lore entries for this world
    fetch(`/api/worlds/${worldId}/lore`)
      .then((res) => res.json())
      .then((data) => {
        setLoreEntriesCache(data);
      })
      .catch(() => {
        // Ignore errors
      });

    return () => {
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [worldId]);

  if (!preview?.entry) {
    return null;
  }

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${preview.x}px`,
        top: `${preview.y}px`,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="bg-[var(--color-background-card)] border border-[var(--color-border-subtle)] rounded-sm shadow-xl p-4 max-w-xs">
        <a
          href={`/world/${worldId}/lore/${preview.entry.slug}`}
          className="block font-medium text-[var(--color-text-primary)] hover:text-[var(--color-accent-gold)] transition-colors"
        >
          {preview.entry.title}
        </a>
        <span className="text-xs text-[var(--color-text-secondary)] uppercase">
          {preview.entry.category}
        </span>
      </div>
    </div>
  );
}
