"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
  onWikiLinkClick?: (slug: string) => void;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  className,
  onWikiLinkClick,
}: MarkdownRendererProps) {
  if (!content) {
    return <p className={cn("text-text-muted", className)}>No content</p>;
  }

  // Add IDs to headings for TOC
  const preprocessContent = (text: string) => {
    let headingCounter = 0;
    return text.replace(/^(#{2,3})\s+(.+)$/gm, (match, hashes, title) => {
      const id = `heading-${headingCounter++}`;
      return `${hashes} {#${id}} ${title}`;
    });
  };

  return (
    <div className={cn("prose prose-invert prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold font-display text-accent-gold mt-6 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2
              id={(props.children as string)?.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}
              className="text-xl font-semibold font-display text-text-primary mt-5 mb-3 scroll-mt-24"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              id={(props.children as string)?.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}
              className="text-lg font-semibold text-text-primary mt-4 mb-2 scroll-mt-24"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="text-text-primary leading-relaxed my-3" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold text-text-primary" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic text-text-secondary" {...props} />
          ),
          a: ({ node, href, ...props }) => {
            // Check if this is a wiki-link (custom element)
            const isWikiLink = (node as any).tagName === "WIKI-LINK";

            if (isWikiLink) {
              const slug = (node as any).properties?.dataSlug;
              return (
                <span
                  className="text-accent-gold hover:text-accent-gold/80 underline cursor-pointer transition-colors"
                  onClick={() => slug && onWikiLinkClick?.(slug)}
                  {...props}
                />
              );
            }

            return (
              <a
                className="text-accent-gold hover:text-accent-gold/80 underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                href={href}
                {...props}
              />
            );
          },
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside my-3 space-y-1 text-text-primary" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-inside my-3 space-y-1 text-text-primary" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-text-primary ml-2" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-2 border-accent-gold pl-4 italic text-text-secondary my-4"
              {...props}
            />
          ),
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                className="bg-background-elevated px-1.5 py-0.5 rounded text-text-primary text-sm font-mono"
                {...props}
              />
            ) : (
              <code
                className="block bg-background-elevated p-3 rounded text-sm font-mono overflow-x-auto my-3"
                {...props}
              />
            ),
          pre: ({ node, ...props }) => (
            <pre className="bg-background-elevated p-3 rounded overflow-x-auto my-3" {...props} />
          ),
          hr: ({ node, ...props }) => (
            <hr className="border-border-subtle my-6" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img
              className="rounded-sm max-w-full h-auto my-4 border border-border-subtle"
              loading="lazy"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
