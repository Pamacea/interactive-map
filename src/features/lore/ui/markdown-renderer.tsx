"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { cn } from "@/shared/utils";

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
  const _preprocessContent = (text: string) => {
    let headingCounter = 0;
    return text.replace(/^(#{2,3})\s+(.+)$/gm, (match, hashes, title) => {
      const id = `heading-${headingCounter++}`;
      return `${hashes} {#${id}} ${title}`;
    });
  };

  // Configure sanitization schema to allow our custom elements and attributes
  const sanitizeSchema = {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "strong", "em", "u", "s", "sub", "sup",
      "a", "img",
      "ul", "ol", "li",
      "blockquote",
      "code", "pre",
      "hr",
      "table", "thead", "tbody", "tr", "th", "td",
      "del", "ins",
      "span", "div", // For custom elements
    ],
    allowedAttributes: {
      "*": ["id", "class"],
      a: ["href", "target", "rel", "dataSlug"],
      img: ["src", "alt", "loading", "width", "height"],
      li: ["start"],
      span: ["dataSlug"], // For wiki-link custom element
    },
    allowedStyles: {
      "*": ["color", "backgroundColor", "fontSize", "fontWeight", "fontStyle"],
    },
  };

  return (
    <div className={cn("prose prose-invert prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize(sanitizeSchema)]}
        components={{
          h1: ({ node: _node, ...props }) => (
            <h1 className="text-2xl font-bold font-display text-accent-gold mt-6 mb-4" {...props} />
          ),
          h2: ({ node: _node, ...props }) => (
            <h2
              id={(props.children as string)?.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}
              className="text-xl font-semibold font-display text-text-primary mt-5 mb-3 scroll-mt-24"
              {...props}
            />
          ),
          h3: ({ node: _node, ...props }) => (
            <h3
              id={(props.children as string)?.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}
              className="text-lg font-semibold text-text-primary mt-4 mb-2 scroll-mt-24"
              {...props}
            />
          ),
          p: ({ node: _node, ...props }) => (
            <p className="text-text-primary leading-relaxed my-3" {...props} />
          ),
          strong: ({ node: _node, ...props }) => (
            <strong className="font-semibold text-text-primary" {...props} />
          ),
          em: ({ node: _node, ...props }) => (
            <em className="italic text-text-secondary" {...props} />
          ),
          a: ({ node: _node, href, ...props }) => {
            // Check if this is a wiki-link (custom element)
            const isWikiLink = (_node as any).tagName === "WIKI-LINK";

            if (isWikiLink) {
              const slug = (_node as any).properties?.dataSlug;
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
          ul: ({ node: _node, ...props }) => (
            <ul className="list-disc list-inside my-3 space-y-1 text-text-primary" {...props} />
          ),
          ol: ({ node: _node, ...props }) => (
            <ol className="list-decimal list-inside my-3 space-y-1 text-text-primary" {...props} />
          ),
          li: ({ node: _node, ...props }) => (
            <li className="text-text-primary ml-2" {...props} />
          ),
          blockquote: ({ node: _node, ...props }) => (
            <blockquote
              className="border-l-2 border-accent-gold pl-4 italic text-text-secondary my-4"
              {...props}
            />
          ),
          code: ({ node: _node, inline, ...props }: any) =>
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
          pre: ({ node: _node, ...props }) => (
            <pre className="bg-background-elevated p-3 rounded overflow-x-auto my-3" {...props} />
          ),
          hr: ({ node: _node, ...props }) => (
            <hr className="border-border-subtle my-6" {...props} />
          ),
          img: ({ node: _node, ...props }) => (
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
