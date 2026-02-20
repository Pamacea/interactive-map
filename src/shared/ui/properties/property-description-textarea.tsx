/**
 * PropertyDescriptionTextarea - Specialized textarea for descriptions
 *
 * Features:
 * - Markdown preview toggle
 * - Markdown toolbar
 * - Auto-resize
 * - Character/word counter
 * - Fullscreen mode
 * - Autosave integration
 * - Optimized for longer content (descriptions, lore, notes)
 */

import * as React from "react";
import { cn } from "@/shared/utils";
import { sanitizeHtml } from "@/shared/lib/sanitize";
import { PropertyTextarea, type PropertyTextareaProps } from "./property-textarea";

export interface PropertyDescriptionTextareaProps extends Omit<PropertyTextareaProps, "size"> {
  maxLength?: number;
  autoResize?: boolean;
  enableMarkdown?: boolean;
  showWordCount?: boolean;
  renderMarkdown?: (content: string) => React.ReactNode;
  autosaveConfig?: PropertyTextareaProps["autosaveConfig"];
}

export function PropertyDescriptionTextarea({
  maxLength = 2000,
  autoResize = true,
  enableMarkdown = true,
  showWordCount = true,
  renderMarkdown,
  autosaveConfig,
  ...props
}: PropertyDescriptionTextareaProps) {
  // Default markdown renderer (simple implementation)
  const defaultRenderMarkdown = React.useCallback((content: string) => {
    if (!content) return <p className="text-text-muted italic">No content</p>;

    // Simple markdown parsing (for basic formatting)
    const lines = content.split("\n");
    return (
      <div className="space-y-2">
        {lines.map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <br key={i} />;

          // Headers
          if (trimmed.startsWith("### ")) {
            return <h3 key={i} className="text-base font-semibold text-accent-gold">{trimmed.slice(4)}</h3>;
          }
          if (trimmed.startsWith("## ")) {
            return <h2 key={i} className="text-lg font-semibold text-accent-gold">{trimmed.slice(3)}</h2>;
          }
          if (trimmed.startsWith("# ")) {
            return <h1 key={i} className="text-xl font-bold text-accent-gold">{trimmed.slice(2)}</h1>;
          }

          // Lists
          if (trimmed.startsWith("- ")) {
            return <li key={i} className="ml-4 list-disc">{trimmed.slice(2)}</li>;
          }
          if (trimmed.match(/^\d+\.\s/)) {
            return <li key={i} className="ml-4 list-decimal">{trimmed.replace(/^\d+\.\s/, "")}</li>;
          }

          // Blockquote
          if (trimmed.startsWith("> ")) {
            return (
              <blockquote key={i} className="border-l-2 border-accent-gold/50 pl-3 italic text-text-muted">
                {trimmed.slice(2)}
              </blockquote>
            );
          }

          // Bold/Italic (simple regex)
          let processed = trimmed
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g, "<em>$1</em>")
            .replace(/`(.+?)`/g, "<code class='bg-background-card px-1 py-0.5 rounded text-xs'>$1</code>");

          // Links - basic sanitization for href
          processed = processed.replace(/\[(.+?)\]\((.+?)\)/g, (match, text, url) => {
            // Basic URL sanitization - only allow http, https
            const sanitizedUrl = url.trim().toLowerCase();
            if (sanitizedUrl.startsWith("http://") || sanitizedUrl.startsWith("https://")) {
              return `<a href='${url}' class='text-accent-gold hover:underline' target='_blank' rel='noopener noreferrer'>${text}</a>`;
            }
            // If not a safe URL, just show the text
            return text;
          });

          return <p key={i} dangerouslySetInnerHTML={{ __html: sanitizeHtml(processed) }} />;
        })}
      </div>
    );
  }, []);

  return (
    <PropertyTextarea
      {...props}
      size="md"
      variant="default"
      maxLength={maxLength}
      autoResize={autoResize}
      minRows={4}
      maxRows={15}
      showCounter
      showWordCount={showWordCount}
      enableMarkdown={enableMarkdown}
      markdownToolbar={enableMarkdown}
      renderMarkdown={renderMarkdown || defaultRenderMarkdown}
      defaultMode="edit"
      autosaveConfig={autosaveConfig}
      allowFullscreen
      showClear
      showCopy
      className={cn(
        "font-sans leading-relaxed",
        props.className
      )}
    />
  );
}

/**
 * PropertyDescriptionField - Internal state version
 */
export interface PropertyDescriptionFieldProps extends Omit<PropertyDescriptionTextareaProps, "value" | "onChange"> {
  initialValue?: string;
  onChangeValue?: (value: string) => void;
}

export function PropertyDescriptionField({
  initialValue = "",
  onChangeValue,
  ...props
}: PropertyDescriptionFieldProps) {
  const [value, setValue] = React.useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onChangeValue?.(e.target.value);
  };

  return (
    <PropertyDescriptionTextarea
      {...props}
      value={value}
      onChange={handleChange}
    />
  );
}
