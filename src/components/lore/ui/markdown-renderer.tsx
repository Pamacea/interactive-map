"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  if (!content) {
    return <p className={cn("text-text-muted", className)}>No content</p>;
  }

  return (
    <div className={cn("prose prose-invert prose-sm max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold font-display text-accent-gold mt-6 mb-4" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold font-display text-text-primary mt-5 mb-3" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold text-text-primary mt-4 mb-2" {...props} />
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
          a: ({ node, ...props }) => (
            <a
              className="text-accent-gold hover:text-accent-gold/80 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
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
