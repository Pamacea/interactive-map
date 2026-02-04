"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  content: string;
}

export function LoreTableOfContents({ content }: TableOfContentsProps) {
  const headings = React.useMemo(() => {
    const temp = document.createElement("div");
    temp.innerHTML = content;
    return Array.from(temp.querySelectorAll("h2, h3")).map((h, i) => ({
      id: `heading-${i}`,
      level: h.tagName.toLowerCase(),
      text: h.textContent || "",
    }));
  }, [content]);

  const [activeId, setActiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80px 0px" }
    );

    // Add IDs to headings
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--color-background-card)] border border-[var(--color-border-subtle)] rounded-sm p-4">
      <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
        Table of Contents
      </h3>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(
                "text-sm",
                heading.level === "h3" && "pl-4"
              )}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                className={cn(
                  "text-[var(--color-text-secondary)] hover:text-[var(--color-accent-gold)] transition-colors line-clamp-2",
                  activeId === heading.id && "text-[var(--color-accent-gold)] font-medium"
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
