"use client";

import { X } from "lucide-react";
import { cn } from "@/shared/utils";

interface LayerDeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LayerDeleteConfirmation({
  onConfirm,
  onCancel,
}: LayerDeleteConfirmationProps) {
  return (
    <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-200">
      <button
        onClick={onConfirm}
        className={cn(
          "px-2 py-1 text-xs font-medium rounded-sm transition-all duration-200",
          "bg-blood text-bone hover:bg-blood/90",
          "border border-blood/70 shadow-sm"
        )}
      >
        Delete
      </button>
      <button
        onClick={onCancel}
        className={cn(
          "p-1 rounded-sm transition-all duration-200",
          "text-text-muted hover:text-text-secondary hover:bg-background-elevated/50",
          "border border-transparent hover:border-border-subtle"
        )}
        title="Cancel"
        aria-label="Cancel delete"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
