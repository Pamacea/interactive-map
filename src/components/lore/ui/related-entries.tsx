"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LoreEntry } from "@/types/lore.type";

interface RelatedEntriesProps {
  currentEntry: LoreEntry;
  allEntries: LoreEntry[];
  worldId: string;
}

export function RelatedEntries({
  currentEntry,
  allEntries,
  worldId,
}: RelatedEntriesProps) {
  const related = React.useMemo(() => {
    // Find entries with same category
    const byCategory = allEntries.filter(
      (e) =>
        e.id !== currentEntry.id &&
        e.category === currentEntry.category &&
        e.isVisible
    );

    // Find entries that reference similar keywords in title
    const titleWords = currentEntry.title.toLowerCase().split(/\s+/);
    const byKeywords = allEntries.filter(
      (e) =>
        e.id !== currentEntry.id &&
        e.isVisible &&
        titleWords.some((word) =>
          e.title.toLowerCase().includes(word)
        )
    );

    // Combine and deduplicate
    const combined = new Map<string, LoreEntry>();
    byCategory.forEach((e) => combined.set(e.id, e));
    byKeywords.forEach((e) => combined.set(e.id, e));

    return Array.from(combined.values()).slice(0, 5);
  }, [currentEntry, allEntries]);

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--color-background-card)] border border-[var(--color-border-subtle)] rounded-sm p-4">
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
        Related Entries
      </h3>
      <ul className="space-y-2">
        {related.map((entry) => (
          <li key={entry.id}>
            <Link
              href={`/world/${worldId}/lore/${entry.slug}`}
              className="group"
            >
              <div className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-accent-gold)] transition-colors line-clamp-2">
                {entry.title}
              </div>
              <div className="text-xs text-[var(--color-text-tertiary)]">
                {entry.category}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
