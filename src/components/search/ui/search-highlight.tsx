import React from "react";

interface SearchHighlightProps {
  text: string;
  query: string;
  className?: string;
}

/**
 * Highlights search terms in text with a mark element
 * Truncates text to ~200 chars and highlights matched terms
 */
export function SearchHighlight({ text, query, className = "" }: SearchHighlightProps) {
  if (!query || !text) {
    return <span className={className}>{text}</span>;
  }

  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Find first match position
  const matchIndex = textLower.indexOf(queryLower);

  // If no match, return original text (truncated)
  if (matchIndex === -1) {
    const truncated = text.length > 200 ? text.slice(0, 200) + "..." : text;
    return <span className={className}>{truncated}</span>;
  }

  // Calculate context window (50 chars before and after match)
  const contextWindow = 50;
  const startIndex = Math.max(0, matchIndex - contextWindow);
  const endIndex = Math.min(text.length, matchIndex + query.length + contextWindow);

  // Extract context
  const hasEllipsisStart = startIndex > 0;
  const hasEllipsisEnd = endIndex < text.length;
  const context = text.slice(startIndex, endIndex);

  // Highlight the match
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = context.split(regex);

  return (
    <span className={className}>
      {hasEllipsisStart && "..."}
      {parts.map((part, index) => {
        const isMatch = regex.test(part);
        if (isMatch) {
          return (
            <mark
              key={index}
              className="bg-accent-gold/30 text-accent-gold-dark rounded-sm px-0.5"
            >
              {part}
            </mark>
          );
        }
        return <span key={index}>{part}</span>;
      })}
      {hasEllipsisEnd && "..."}
    </span>
  );
}
