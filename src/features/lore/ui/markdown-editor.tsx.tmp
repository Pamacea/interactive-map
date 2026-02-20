"use client";

import { memo } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/utils";

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
          // Use the built-in secure preview from @uiw/react-md-editor
          // which properly sanitizes markdown to prevent XSS attacks
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
