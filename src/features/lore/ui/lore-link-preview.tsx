"use client";

import * as React from "react";
import { useLoreEntries } from "@/features/lore/logic/use-lore-query";

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
  // TanStack Query for fetching lore entries
  const { data: loreEntries = [] } = useLoreEntries(worldId);

  const [preview, setPreview] = React.useState<{
    x: number;
    y: number;
    entry: LoreEntryCache | null;
  } | null>(null);

  const handleMouseEnter = React.useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "WIKI-LINK") {
      const entryId = target.getAttribute("data-id");
      const entry = loreEntries.find((e) => e.id === entryId);

      if (entry) {
        const rect = target.getBoundingClientRect();
        setPreview({
          x: rect.left + rect.width / 2,
          y: rect.top - 8,
          entry,
        });
      }
    }
  }, [loreEntries]);

  const handleMouseLeave = React.useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "WIKI-LINK") {
      setPreview(null);
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [handleMouseEnter, handleMouseLeave]);

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
      <div className="bg-obsidian/80 border border-[var(--color-border-subtle)] rounded-sm shadow-xl p-4 max-w-2/3">
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
