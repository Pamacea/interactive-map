"use client";

import { memo, useMemo } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  id?: string;
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  error?: string;
  minHeight?: number;
  showPreview?: boolean;
  className?: string;
}

export const MarkdownEditor = memo(function MarkdownEditor({
  id = "markdown-editor",
  label,
  required,
  value,
  onChange,
  placeholder = "Write your content here... (Markdown supported)",
  disabled = false,
  maxLength = 50000,
  error,
  minHeight = 200,
  showPreview = true,
  className,
}: MarkdownEditorProps) {
  // Custom preview component with project styling
  const Preview = useMemo(() => {
    return function CustomPreview({ source }: { source: string }) {
      if (!source) return <div className="p-4 text-text-muted">Preview will appear here...</div>;

      return (
        <div className="prose prose-invert prose-sm max-w-none p-4">
          <div
            dangerouslySetInnerHTML={{
              __html: source
                .replace(/^### (.*$)/gim, "<h3>$1</h3>")
                .replace(/^## (.*$)/gim, "<h2>$1</h2>")
                .replace(/^# (.*$)/gim, "<h1>$1</h1>")
                .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
                .replace(/\*(.*)\*/gim, "<em>$1</em>")
                .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
                .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2' target='_blank' rel='noopener'>$1</a>")
                .replace(/\n/gim, "<br />"),
            }}
          />
        </div>
      );
    };
  }, []);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <Label htmlFor={id} className="text-text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <div
        className={cn(
          "border border-border-subtle rounded-sm overflow-hidden",
          error && "border-red-500",
          disabled && "opacity-50 pointer-events-none"
        )}
      >
        <MDEditor
          id={id}
          value={value}
          onChange={(val) => {
            const newValue = val || "";
            if (maxLength && newValue.length > maxLength) return;
            onChange(newValue);
          }}
          preview={showPreview ? "live" : "edit"}
          height={minHeight}
          hideToolbar={false}
          visibleDragBar={false}
          textareaProps={{
            placeholder,
            disabled,
          }}
          previewOptions={{
            components: {
              preview: Preview as any,
            },
          }}
          className="!bg-obsidian/60 !text-text-primary"
          data-color-mode="dark"
        />
      </div>

      <div className="flex items-center justify-between">
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex-1" />
        {maxLength && (
          <p className={cn(
            "text-xs",
            value.length > maxLength * 0.9 ? "text-yellow-500" : "text-text-muted"
          )}>
            {value.length} / {maxLength.toLocaleString()} characters
          </p>
        )}
      </div>
    </div>
  );
});
